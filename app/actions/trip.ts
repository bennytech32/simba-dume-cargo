"use server";

import prisma from '../../lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createTrip(formData: FormData) {
  const driverName = formData.get('driverName') as string;
  const vehiclePlate = formData.get('vehiclePlate') as string;
  const originBranchName = formData.get('originBranchName') as string;
  const destinationBranchName = formData.get('destinationBranchName') as string;
  
  // Hii inachukua ID zote za mizigo uliyoi-tick
  const shipmentIds = formData.getAll('shipmentIds') as string[];

  const tripNumber = `TRP-${Math.floor(1000 + Math.random() * 9000)}`;

  try {
    // 1. Tafuta au Tengeneza Vituo
    let originBranch = await prisma.branch.findFirst({ where: { name: originBranchName } });
    if (!originBranch) originBranch = await prisma.branch.create({ data: { name: originBranchName } });

    let destBranch = await prisma.branch.findFirst({ where: { name: destinationBranchName } });
    if (!destBranch) destBranch = await prisma.branch.create({ data: { name: destinationBranchName } });

    // 2. Tengeneza Safari (Gari)
    const trip = await prisma.trip.create({
      data: {
        tripNumber,
        driverName,
        vehiclePlate,
        status: 'IN_TRANSIT', // Safari inaanza moja kwa moja
        originBranchId: originBranch.id,
        destinationBranchId: destBranch.id,
      }
    });

    // 3. Pakia Mizigo kwenye Gari (Badili status ya mizigo iwe 'IN_TRANSIT')
    if (shipmentIds.length > 0) {
      await prisma.shipment.updateMany({
        where: { id: { in: shipmentIds } },
        data: {
          tripId: trip.id,
          status: 'IN_TRANSIT'
        }
      });
    }

    revalidatePath('/dashboard');
    revalidatePath('/trips');
  } catch (error) {
    console.error("Kosa kwenye kusave safari:", error);
    throw new Error("Imeshindwa kusave safari.");
  }

  // Turudishe kwenye orodha ya safari
  redirect('/trips');
}