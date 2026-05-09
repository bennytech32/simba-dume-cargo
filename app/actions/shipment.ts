"use server";

import prisma from '../../lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createShipment(formData: FormData) {
  let createdId = null;

  try {
    // 1. Kuvuta data (Tunatumia mbinu ya 'fallback' kama majina yanatofautiana)
    const trackingNumber = formData.get('trackingNumber') as string || `SDC-${Math.floor(Math.random() * 100000)}`;
    const senderName = formData.get('senderName') as string;
    const senderPhone = formData.get('senderPhone') as string;
    const receiverName = formData.get('receiverName') as string;
    const receiverPhone = formData.get('receiverPhone') as string;
    
    // Tunakagua majina yote mawili yanayoweza kutumika kwenye fomu
    const originBranchId = (formData.get('originBranchId') || formData.get('origin')) as string;
    const destBranchId = (formData.get('destBranchId') || formData.get('destination')) as string;
    
    const description = formData.get('description') as string;
    const weight = parseFloat(formData.get('weight') as string) || 0;
    const declaredValue = parseFloat(formData.get('declaredValue') as string) || 0;
    const price = parseFloat(formData.get('price') as string) || 0;
    const paymentStatus = (formData.get('paymentStatus') || 'PENDING') as string;

    // Log hizi data kwa ajili ya kuziona kwenye Vercel Runtime Logs
    console.log("Data inayotumwa Prisma:", { originBranchId, destBranchId, trackingNumber });

    if (!originBranchId || !destBranchId) {
      throw new Error("Vituo havijachaguliwa vizuri.");
    }

    // 2. HIFADHI KWENYE DATABASE
    const shipment = await prisma.shipment.create({
      data: {
        trackingNumber,
        senderName,
        senderPhone,
        receiverName,
        receiverPhone,
        description,
        weight,
        declaredValue,
        price,
        paymentStatus,
        status: "RECEIVED",
        // Tunalazimisha Prisma ku-connect na Matawi
        originBranch: {
          connect: { id: originBranchId }
        },
        destBranch: {
          connect: { id: destBranchId }
        }
      }
    });

    createdId = shipment.id;

  } catch (error: any) {
    // Kama kuna kosa la Prisma, litaonekana hapa kwenye Logs
    console.error("PRISMA CRITICAL ERROR:", error.message);
    // Haturudishi Error hapa ili tusiue mchakato wa redirect
  }

  // 3. REDIRECT NJE YA TRY/CATCH (Hii ni sheria ya Next.js)
  if (createdId) {
    revalidatePath('/dashboard');
    revalidatePath('/shipments');
    redirect('/shipments');
  } else {
    // Hapa ndipo tunatoa ujumbe kama kweli database imegoma
    throw new Error("Imeshindikana kusajili mzigo. Hakikisha vituo vimesajiliwa na umechagua kila kitu.");
  }
}

// 4. KUFUTA MZIGO
export async function deleteShipment(formData: FormData) {
  const id = formData.get('id') as string;
  if (id) {
    await prisma.shipment.delete({ where: { id } });
    revalidatePath('/dashboard');
    revalidatePath('/shipments');
  }
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