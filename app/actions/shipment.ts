"use server";

import prisma from '../../lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createShipment(formData: FormData) {
  let isSuccess = false;

  try {
    // 1. Kuchukua data kutoka kwenye fomu
    const trackingNumber = formData.get('trackingNumber') as string || `SDC-${Math.floor(Math.random() * 90000) + 10000}`;
    const senderName = formData.get('senderName') as string;
    const senderPhone = formData.get('senderPhone') as string;
    const receiverName = formData.get('receiverName') as string;
    const receiverPhone = formData.get('receiverPhone') as string;
    
    // Tunachukua ID za vituo
    const originBranchId = formData.get('originBranchId') as string;
    const destBranchId = formData.get('destBranchId') as string;
    
    const description = formData.get('description') as string;

    // Convert namba kwa usalama (Kuzuia null kwenye Database)
    const weight = parseFloat(formData.get('weight') as string) || 0;
    const declaredValue = parseFloat(formData.get('declaredValue') as string) || 0;
    const price = parseFloat(formData.get('price') as string) || 0;
    const paymentStatus = (formData.get('paymentStatus') as string) || 'PENDING';

    // Validation ya haraka
    if (!originBranchId || !destBranchId) {
      throw new Error("Tafadhali chagua vituo vyote (Origin & Destination)");
    }

    // 2. Kuingiza kwenye Database (KUTUMIA CONNECT YA PRISMA)
    await prisma.shipment.create({
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
        status: "RECEIVED", // Mzigo unaanza kwa kupokelewa ofisini
        // Hapa ndipo Prisma inataka 'connect' badala ya ID pekee
        originBranch: {
          connect: { id: originBranchId }
        },
        destBranch: {
          connect: { id: destBranchId }
        }
      }
    });

    isSuccess = true;

  } catch (error: any) {
    console.error("PRISMA_CREATE_ERROR:", error.message);
    // Tunatupa error ili fomu ionyeshe ujumbe endapo itafeli
    throw new Error(error.message || "Imeshindikana kusajili mzigo.");
  }

  // 3. REDIRECT INAKUJA DASHBOARD KUZUIA ERROR YA 404
  if (isSuccess) {
    revalidatePath('/dashboard');
    redirect('/dashboard'); 
  }
}

// ==========================================
// HIZI ACTIONS NYINGINE ZA DASHIBODI
// ==========================================

export async function deleteShipment(formData: FormData) {
  const id = formData.get('id') as string;
  if (!id) return;
  await prisma.shipment.delete({ where: { id } });
  revalidatePath('/dashboard');
}

export async function startTodaysTrips() {
  await prisma.shipment.updateMany({
    where: { status: 'RECEIVED' },
    data: { status: 'IN_TRANSIT' }
  });
  revalidatePath('/dashboard');
}

export async function markAllAsArrived() {
  await prisma.shipment.updateMany({
    where: { status: 'IN_TRANSIT' },
    data: { status: 'ARRIVED' }
  });
  revalidatePath('/dashboard');
}