"use server";

// Tumerekebisha Njia (Path) ya kuvuta Prisma 🔥
import prisma from '../../lib/prisma'; 
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// ============================================================================
// 1. KUTENGENEZA SAFARI MPYA (CREATE TRIP)
// ============================================================================
export async function createTrip(formData: FormData) {
  const vehiclePlate = formData.get('vehiclePlate') as string;
  const driverName = formData.get('driverName') as string;
  const originBranchName = formData.get('originBranchName') as string;
  const destinationBranchName = formData.get('destinationBranchName') as string;
  const shipmentIds = formData.getAll('shipmentIds') as string[];

  // Tafuta vituo ili kupata ID zake
  const originBranch = await prisma.branch.findFirst({ where: { name: originBranchName } });
  const destBranch = await prisma.branch.findFirst({ where: { name: destinationBranchName } });

  if (!originBranch || !destBranch) {
    throw new Error("Kituo hakijapatikana. Tafadhali hakikisha vituo vimesajiliwa vizuri.");
  }

  // Tengeneza Namba ya Safari (Mfano: TRP-162834)
  const tripNumber = `TRP-${Math.floor(100000 + Math.random() * 900000)}`;

  // Unda Safari (Trip)
  const newTrip = await prisma.trip.create({
    data: {
      tripNumber,
      vehiclePlate,
      driverName,
      originBranchId: originBranch.id,
      destBranchId: destBranch.id,
      originBranchName: originBranch.name,
      destinationBranchName: destBranch.name,
      status: 'IN_TRANSIT',
      shipments: {
        connect: shipmentIds.map((id) => ({ id }))
      }
    }
  });

  // Badilisha Hali ya Gari kuwa Lipo Njiani (IN_TRANSIT)
  await prisma.vehicle.update({
    where: { plateNumber: vehiclePlate },
    data: { status: 'IN_TRANSIT' } 
  });

  // Badilisha Hali ya Mizigo yote iliyopakiwa kuwa 'IPO NJIANI'
  if (shipmentIds.length > 0) {
    await prisma.shipment.updateMany({
      where: { id: { in: shipmentIds } },
      data: { status: 'IN_TRANSIT' }
    });
  }

  revalidatePath('/trips');
  redirect(`/trips/${newTrip.id}/manifest`);
}


// ============================================================================
// 2. KUHARIRI SAFARI (UPDATE TRIP & ADD/REMOVE SHIPMENTS)
// ============================================================================
export async function updateTrip(formData: FormData) {
  const tripId = formData.get('id') as string;
  const vehiclePlate = formData.get('vehiclePlate') as string;
  const driverName = formData.get('driverName') as string;
  const originBranchName = formData.get('originBranchName') as string;
  const destinationBranchName = formData.get('destinationBranchName') as string;
  const status = formData.get('status') as string; 
  const shipmentIds = formData.getAll('shipmentIds') as string[]; 

  const originBranch = await prisma.branch.findFirst({ where: { name: originBranchName } });
  const destBranch = await prisma.branch.findFirst({ where: { name: destinationBranchName } });

  if (!originBranch || !destBranch) {
    throw new Error("Kituo hakijapatikana.");
  }

  await prisma.trip.update({
    where: { id: tripId },
    data: {
      vehiclePlate,
      driverName,
      originBranchId: originBranch.id,
      destBranchId: destBranch.id,
      originBranchName: originBranch.name,
      destinationBranchName: destBranch.name,
      status,
      shipments: {
        set: shipmentIds.map((id) => ({ id })) 
      }
    }
  });

  const updatedTrip = await prisma.trip.findUnique({
    where: { id: tripId },
    include: { shipments: true }
  });

  const currentShipmentIds = updatedTrip?.shipments.map(s => s.id) || [];

  if (status === 'ARRIVED') {
    await prisma.vehicle.update({
      where: { plateNumber: vehiclePlate },
      data: { status: 'AVAILABLE' }
    });

    if (currentShipmentIds.length > 0) {
      await prisma.shipment.updateMany({
        where: { id: { in: currentShipmentIds } },
        data: { status: 'ARRIVED' }
      });
    }
  } 
  else if (status === 'IN_TRANSIT') {
    await prisma.vehicle.update({
      where: { plateNumber: vehiclePlate },
      data: { status: 'IN_TRANSIT' }
    });

    if (currentShipmentIds.length > 0) {
      await prisma.shipment.updateMany({
        where: { id: { in: currentShipmentIds } },
        data: { status: 'IN_TRANSIT' }
      });
    }
  }

  // Rudisha mzigo uliotolewa garini stoo
  await prisma.shipment.updateMany({
    where: { 
      tripId: null, 
      status: 'IN_TRANSIT' 
    },
    data: { status: 'PENDING' } 
  });

  revalidatePath('/trips');
  redirect(`/trips/${tripId}/manifest`); 
}

// ============================================================================
// 3. KUFUTA SAFARI (DELETE TRIP) 🔥 - Hii ndio iliyokuwa inatafutwa na Vercel!
// ============================================================================
export async function deleteTrip(formData: FormData) {
  const tripId = formData.get('id') as string;

  // Vuta safari ili tujue gari na mizigo yake
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    include: { shipments: true }
  });

  if (trip) {
    // 1. Achia gari liwe huru (AVAILABLE)
    await prisma.vehicle.update({
      where: { plateNumber: trip.vehiclePlate },
      data: { status: 'AVAILABLE' }
    });

    // 2. Rudisha mizigo yote stoo (PENDING)
    const shipmentIds = trip.shipments.map(s => s.id);
    if (shipmentIds.length > 0) {
      await prisma.shipment.updateMany({
        where: { id: { in: shipmentIds } },
        data: { status: 'PENDING' }
      });
    }

    // 3. Futa safari yenyewe
    await prisma.trip.delete({
      where: { id: tripId }
    });
  }

  revalidatePath('/trips');
}