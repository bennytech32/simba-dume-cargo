"use server";

import prisma from '../lib/prisma';
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
      originBranchName: originBranch.name, // Fallback kwa ajili ya usalama wa UI
      destinationBranchName: destBranch.name,
      status: 'IN_TRANSIT', // Gari likianza safari linasoma lipo njiani
      shipments: {
        connect: shipmentIds.map((id) => ({ id })) // Inaunganisha mizigo yote iliyotikiwa
      }
    }
  });

  // Badilisha Hali ya Gari kuwa Lipo Njiani (IN_TRANSIT) ili lisipangiwe safari nyingine
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
  redirect(`/trips/${newTrip.id}/manifest`); // Impeleke moja kwa moja kwenye Manifest akaprint! 🔥
}


// ============================================================================
// 2. KUHARIRI SAFARI (UPDATE TRIP & ADD/REMOVE SHIPMENTS) 🔥
// ============================================================================
export async function updateTrip(formData: FormData) {
  const tripId = formData.get('id') as string;
  const vehiclePlate = formData.get('vehiclePlate') as string;
  const driverName = formData.get('driverName') as string;
  const originBranchName = formData.get('originBranchName') as string;
  const destinationBranchName = formData.get('destinationBranchName') as string;
  const status = formData.get('status') as string; // 'IN_TRANSIT' au 'ARRIVED'
  const shipmentIds = formData.getAll('shipmentIds') as string[]; // Mizigo yote iliyotikiwa sasa hivi

  // Tafuta vituo
  const originBranch = await prisma.branch.findFirst({ where: { name: originBranchName } });
  const destBranch = await prisma.branch.findFirst({ where: { name: destinationBranchName } });

  if (!originBranch || !destBranch) {
    throw new Error("Kituo hakijapatikana.");
  }

  // UPDATE SAFARI NA MIZIGO YAKE KWA MPIGO
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
        // HII "SET" INAONDOA MIZIGO ULIYO-UNTICK NA KUUNGANISHA MIZIGO MIPYA ULIYOTIKI 🔥
        set: shipmentIds.map((id) => ({ id })) 
      }
    }
  });

  // Tunatafuta mizigo yote inayoihusu hii safari (baada ya update) ili tuibadilishe status
  const updatedTrip = await prisma.trip.findUnique({
    where: { id: tripId },
    include: { shipments: true }
  });

  const currentShipmentIds = updatedTrip?.shipments.map(s => s.id) || [];

  // LOGIC YA STATUS YA GARI NA MIZIGO:
  // ========================================

  // KAMA SAFARI IMEFIKA (ARRIVED)
  if (status === 'ARRIVED') {
    // 1. Gari linarudi kuwa AVAILABLE kwa safari nyingine
    await prisma.vehicle.update({
      where: { plateNumber: vehiclePlate },
      data: { status: 'AVAILABLE' }
    });

    // 2. Mizigo yote iliyopo kwenye hili gari inakuwa 'IMEFIKA'
    if (currentShipmentIds.length > 0) {
      await prisma.shipment.updateMany({
        where: { id: { in: currentShipmentIds } },
        data: { status: 'ARRIVED' }
      });
    }
  } 
  // KAMA SAFARI BADO IPO NJIANI
  else if (status === 'IN_TRANSIT') {
    // Hakikisha gari liko IN_TRANSIT
    await prisma.vehicle.update({
      where: { plateNumber: vehiclePlate },
      data: { status: 'IN_TRANSIT' }
    });

    // Hakikisha mizigo yote iko IN_TRANSIT
    if (currentShipmentIds.length > 0) {
      await prisma.shipment.updateMany({
        where: { id: { in: currentShipmentIds } },
        data: { status: 'IN_TRANSIT' }
      });
    }
  }

  // =======================================================
  // USALAMA WA MIZIGO ILIYOONDOLEWA KWENYE GARI (UN-TICKED)
  // Kama mzigo umetolewa kwenye gari, tunaurudisha stoo (PENDING)
  // =======================================================
  await prisma.shipment.updateMany({
    where: { 
      tripId: null, // Mzigo ambao hauna gari tena baada ya ile "set" hapo juu
      status: 'IN_TRANSIT' // Ikiwa ilikuwa njiani lakini ikatolewa kimakosa
    },
    data: { status: 'PENDING' } // Irudi stoo ofisini ipangiwe gari lingine
  });

  revalidatePath('/trips');
  // Tunamrudisha kwenye Manifest moja kwa moja aone updates zake! 🔥
  redirect(`/trips/${tripId}/manifest`); 
}