"use server";

import prisma from '../../lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

// 1. KUSAJILI MZIGO MPYA (The Fix)
export async function createShipment(formData: FormData) {
  try {
    const trackingNumber = formData.get('trackingNumber') as string || `SDC-${Math.floor(Math.random() * 100000)}-${Math.floor(Math.random() * 100)}`;
    const senderName = formData.get('senderName') as string;
    const senderPhone = formData.get('senderPhone') as string;
    const receiverName = formData.get('receiverName') as string;
    const receiverPhone = formData.get('receiverPhone') as string;
    const originBranchId = formData.get('originBranchId') as string;
    const destBranchId = formData.get('destBranchId') as string;
    const description = formData.get('description') as string;
    const weight = formData.get('weight') as string;
    const declaredValue = formData.get('declaredValue') as string;
    const price = formData.get('price') as string;
    const paymentStatus = formData.get('paymentStatus') as string || 'PENDING';

    if (!originBranchId || !destBranchId) throw new Error("Vituo ni lazima.");

    await prisma.shipment.create({
      data: {
        trackingNumber,
        senderName,
        senderPhone,
        receiverName,
        receiverPhone,
        description,
        weight: Number(weight),
        declaredValue: Number(declaredValue),
        price: Number(price),
        paymentStatus,
        status: "RECEIVED",
        originBranch: { connect: { id: originBranchId } },
        destBranch: { connect: { id: destBranchId } }
      }
    });
  } catch (error) {
    console.error(error);
    throw new Error("Imeshindikana kusajili mzigo.");
  }
  revalidatePath('/dashboard');
  revalidatePath('/shipments');
  redirect('/shipments');
}

// 2. KUFUTA MZIGO (Missing in previous version)
export async function deleteShipment(formData: FormData) {
  const id = formData.get('id') as string;
  if (!id) return;
  
  await prisma.shipment.delete({ where: { id } });
  
  revalidatePath('/dashboard');
  revalidatePath('/shipments');
}

// 3. KUANZISHA SAFARI ZA LEO (Missing in previous version)
export async function startTodaysTrips() {
  // Mfano wa kubadili mizigo yote ya 'RECEIVED' kwenda 'IN_TRANSIT'
  await prisma.shipment.updateMany({
    where: { status: 'RECEIVED' },
    data: { status: 'IN_TRANSIT' }
  });
  
  revalidatePath('/dashboard');
}

// 4. KUWEKA MIZIGO YOTE KAMA IMEFIKA (Missing in previous version)
export async function markAllAsArrived() {
  await prisma.shipment.updateMany({
    where: { status: 'IN_TRANSIT' },
    data: { status: 'ARRIVED' }
  });
  
  revalidatePath('/dashboard');
}