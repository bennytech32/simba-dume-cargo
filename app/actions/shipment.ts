"use server";

import prisma from '../../lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createShipment(formData: FormData) {
  // 1. Tunatangaza variable nje ya try ili redirect iione baadaye
  let success = false;

  try {
    const trackingNumber = formData.get('trackingNumber') as string || `SDC-${Math.floor(Math.random() * 100000)}-${Math.floor(Math.random() * 100)}`;
    const senderName = formData.get('senderName') as string;
    const senderPhone = formData.get('senderPhone') as string;
    const receiverName = formData.get('receiverName') as string;
    const receiverPhone = formData.get('receiverPhone') as string;
    const originBranchId = formData.get('originBranchId') as string;
    const destBranchId = formData.get('destBranchId') as string;
    const description = formData.get('description') as string;
    
    // Hakikisha namba haziko null (Tunatumia 0 kama ni tupu)
    const weight = Number(formData.get('weight')) || 0;
    const declaredValue = Number(formData.get('declaredValue')) || 0;
    const price = Number(formData.get('price')) || 0;
    const paymentStatus = formData.get('paymentStatus') as string || 'PENDING';

    if (!originBranchId || !destBranchId) {
      throw new Error("Tafadhali chagua vituo.");
    }

    // 2. HIFADHI KWENYE DATABASE
    await prisma.shipment.create({
      data: {
        trackingNumber,
        senderName,
        senderPhone,
        receiverName,
        receiverPhone,
        description,
        weight: weight,
        declaredValue: declaredValue,
        price: price,
        paymentStatus,
        status: "RECEIVED",
        originBranch: { connect: { id: originBranchId } },
        destBranch: { connect: { id: destBranchId } }
      }
    });

    success = true; //database imekubali!

  } catch (error: any) {
    console.error("PRISMA ERROR:", error);
    // Usitupe error hapa ili kuzuia redirect isife, tunarudi hapa chini
  }

  // 3. TUNAFANYA REDIRECT NJE YA TRY/CATCH (Hii ni siri ya Next.js)
  if (success) {
    revalidatePath('/dashboard');
    revalidatePath('/shipments');
    redirect('/shipments');
  } else {
    throw new Error("Imeshindikana kusajili mzigo. Hakikisha vituo vimechaguliwa na taarifa zote zimejazwa.");
  }
}

// 4. KUFUTA MZIGO
export async function deleteShipment(formData: FormData) {
  const id = formData.get('id') as string;
  if (!id) return;
  await prisma.shipment.delete({ where: { id } });
  revalidatePath('/dashboard');
  revalidatePath('/shipments');
}

// 5. SAFARI ZA LEO
export async function startTodaysTrips() {
  await prisma.shipment.updateMany({
    where: { status: 'RECEIVED' },
    data: { status: 'IN_TRANSIT' }
  });
  revalidatePath('/dashboard');
}

// 6. KUWEKA MIZIGO KAMA IMEFIKA
export async function markAllAsArrived() {
  await prisma.shipment.updateMany({
    where: { status: 'IN_TRANSIT' },
    data: { status: 'ARRIVED' }
  });
  revalidatePath('/dashboard');
}