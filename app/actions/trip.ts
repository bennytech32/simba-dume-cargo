"use server";

import prisma from '../../lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// 1. FUNCTION YA KUUNDA SAFARI (NA KUBADILI HALI YA GARI KUWA 'ON_TRIP')
export async function createTrip(formData: FormData) {
  let isSuccess = false;

  try {
    const driverName = formData.get('driverName') as string;
    const vehiclePlate = formData.get('vehiclePlate') as string;
    const originBranchName = formData.get('originBranchName') as string;
    const destinationBranchName = formData.get('destinationBranchName') as string;
    
    const tripNumber = `TRIP-${Math.floor(Math.random() * 90000) + 10000}`;
    const shipmentIds = formData.getAll('shipmentIds') as string[];

    const originBranchDb = await prisma.branch.findFirst({ where: { name: originBranchName } });
    const destBranchDb = await prisma.branch.findFirst({ where: { name: destinationBranchName } });

    if (!originBranchDb || !destBranchDb) {
      throw new Error("Kituo ulichochagua hakijapatikana kwenye Kanzidata.");
    }

    // A) Tengeneza Safari Mpya
    const trip = await prisma.trip.create({
      data: {
        tripNumber,
        driverName,
        vehiclePlate,
        status: 'IN_TRANSIT', 
        originBranch: { connect: { id: originBranchDb.id } },
        destBranch: { connect: { id: destBranchDb.id } }
      }
    });

    // B) Ibadili hali ya Gari hili kuwa LIPO SAFARINI (ON_TRIP) ili lisichaguliwe tena gari likiwa njiani
    await prisma.vehicle.update({
      where: { plateNumber: vehiclePlate },
      data: { status: 'ON_TRIP' } // au 'IN_TRANSIT' kutegemea na Enum yako ya Vehicle Status
    });

    // C) Pakia mizigo kwenye safari
    if (shipmentIds.length > 0) {
      await prisma.shipment.updateMany({
        where: { id: { in: shipmentIds } },
        data: { 
          tripId: trip.id,
          status: 'IN_TRANSIT'
        }
      });
    }

    isSuccess = true;

  } catch (error: any) {
    console.error("PRISMA_ERROR:", error.message);
    throw new Error(`KOSA LA DATABASE: ${error.message}`);
  }

  if (isSuccess) {
    revalidatePath('/trips');
    revalidatePath('/vehicles');
    revalidatePath('/dashboard');
    redirect('/trips');
  }
}

// 2. FUNCTION YA KUHARIRI SAFARI (EDIT TRIP ACTION) 🔥
export async function updateTrip(formData: FormData) {
  let isSuccess = false;
  const tripId = formData.get('id') as string;

  try {
    const vehiclePlate = formData.get('vehiclePlate') as string;
    const driverName = formData.get('driverName') as string;
    const originBranchName = formData.get('originBranchName') as string;
    const destinationBranchName = formData.get('destinationBranchName') as string;
    const status = formData.get('status') as string; // IN_TRANSIT, ARRIVED, nk.

    const originBranchDb = await prisma.branch.findFirst({ where: { name: originBranchName } });
    const destBranchDb = await prisma.branch.findFirst({ where: { name: destinationBranchName } });

    if (!originBranchDb || !destBranchDb) {
      throw new Error("Kituo hakijapatikana.");
    }

    // Vuta safari ya zamani ili tujue gari lililokuwepo mwanzo
    const oldTrip = await prisma.trip.findUnique({ where: { id: tripId } });

    // Kama gari limebadilishwa, lirudishe lile la zamani kuwa AVAILABLE
    if (oldTrip && oldTrip.vehiclePlate !== vehiclePlate) {
      await prisma.vehicle.update({
        where: { plateNumber: oldTrip.vehiclePlate },
        data: { status: 'AVAILABLE' }
      });
    }

    // A) Sasisha Taarifa za Safari
    await prisma.trip.update({
      where: { id: tripId },
      data: {
        vehiclePlate,
        driverName,
        status: status as any,
        originBranch: { connect: { id: originBranchDb.id } },
        destBranch: { connect: { id: destBranchDb.id } }
      }
    });

    // B) Kama safari imeisha (ARRIVED), gari lirudi kuwa AVAILABLE. Kama bado ipo njiani, liwe ON_TRIP
    await prisma.vehicle.update({
      where: { plateNumber: vehiclePlate },
      data: { status: status === 'ARRIVED' ? 'AVAILABLE' : 'ON_TRIP' }
    });

    // C) Kama safari imefika (ARRIVED), badili na hali ya mizigo yote ya safari hii kuwa ARRIVED au DELIVERED
    if (status === 'ARRIVED') {
      await prisma.shipment.updateMany({
        where: { tripId: tripId },
        data: { status: 'ARRIVED' }
      });
    }

    isSuccess = true;
  } catch (error: any) {
    console.error("Kosa la kuhariri safari:", error.message);
    throw new Error(`KOSA LA KUHARIRI: ${error.message}`);
  }

  if (isSuccess) {
    revalidatePath('/trips');
    revalidatePath('/vehicles');
    revalidatePath('/dashboard');
    redirect('/trips');
  }
}

// 3. FUNCTION YA KUFUTA SAFARI (NA KURUDISHA GARI KUWA 'AVAILABLE')
export async function deleteTrip(formData: FormData) {
  const id = formData.get('id') as string;
  if (!id) return;

  try {
    const trip = await prisma.trip.findUnique({ where: { id } });

    // A) Rudisha Gari kuwa AVAILABLE
    if (trip) {
      await prisma.vehicle.update({
        where: { plateNumber: trip.vehiclePlate },
        data: { status: 'AVAILABLE' }
      });
    }

    // B) Okoa mizigo irudi ofisini
    await prisma.shipment.updateMany({
      where: { tripId: id },
      data: { 
        tripId: null,
        status: 'RECEIVED' 
      }
    });

    // C) Futa safari
    await prisma.trip.delete({ where: { id } });

  } catch (error) {
    console.error("Kosa wakati wa kufuta safari:", error);
  }

  revalidatePath('/trips');
  revalidatePath('/vehicles');
  revalidatePath('/dashboard');
}