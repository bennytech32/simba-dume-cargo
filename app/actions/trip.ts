"use server";

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

  const originBranch = await prisma.branch.findFirst({ where: { name: originBranchName } });
  const destBranch = await prisma.branch.findFirst({ where: { name: destinationBranchName } });

  if (!originBranch || !destBranch) {
    throw new Error("Kituo hakijapatikana. Tafadhali hakikisha vituo vimesajiliwa vizuri.");
  }

  const tripNumber = `TRP-${Math.floor(100000 + Math.random() * 900000)}`;

  const newTrip = await prisma.trip.create({
    data: {
      tripNumber,
      vehiclePlate,
      driverName,
      originBranchName: originBranch.name,
      destinationBranchName: destBranch.name,
      status: 'IN_TRANSIT',
      // 🔥 HAPA NDIO TUMETIBU TATIZO LA PRISMA 🔥
      originBranch: { connect: { id: originBranch.id } },
      destBranch: { connect: { id: destBranch.id } },
      shipments: {
        connect: shipmentIds.map((id) => ({ id }))
      }
    }
  });

  await prisma.vehicle.update({
    where: { plateNumber: vehiclePlate },
    data: { status: 'IN_TRANSIT' } 
  });

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
      originBranchName: originBranch.name,
      destinationBranchName: destBranch.name,
      status,
      // 🔥 HAPA PIA TUMETIBU TATIZO LA PRISMA 🔥
      originBranch: { connect: { id: originBranch.id } },
      destBranch: { connect: { id: destBranch.id } },
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
// 3. KUFUTA SAFARI (DELETE TRIP)
// ============================================================================
export async function deleteTrip(formData: FormData) {
  const tripId = formData.get('id') as string;

  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    include: { shipments: true }
  });

  if (trip) {
    await prisma.vehicle.update({
      where: { plateNumber: trip.vehiclePlate },
      data: { status: 'AVAILABLE' }
    });

    const shipmentIds = trip.shipments.map(s => s.id);
    if (shipmentIds.length > 0) {
      await prisma.shipment.updateMany({
        where: { id: { in: shipmentIds } },
        data: { status: 'PENDING' }
      });
    }

    await prisma.trip.delete({
      where: { id: tripId }
    });
  }

  revalidatePath('/trips');
}