"use server";

import prisma from '../../lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createShipment(formData: FormData) {
  // 1. Kusanya data zote
  const senderName = formData.get('senderName') as string;
  const senderPhone = formData.get('senderPhone') as string;
  const receiverName = formData.get('receiverName') as string;
  const receiverPhone = formData.get('receiverPhone') as string;
  
  // Hapa tunapokea MAJINA ya vituo badala ya ID
  const originBranchName = formData.get('originBranchName') as string;
  const destinationBranchName = formData.get('destinationBranchName') as string;
  
  const description = formData.get('description') as string;
  const weight = parseFloat(formData.get('weight') as string) || null;
  const declaredValue = parseFloat(formData.get('declaredValue') as string) || null;
  const price = parseFloat(formData.get('price') as string);
  const paymentStatus = formData.get('paymentStatus') as string;

  const trackingNumber = `SDC-${Math.floor(100000 + Math.random() * 900000)}`;

  try {
    // 2. TAFUTA AU TENGENEZA KITUO CHA KUANZIA (Origin)
    let originBranch = await prisma.branch.findFirst({ where: { name: originBranchName } });
    if (!originBranch) {
      originBranch = await prisma.branch.create({ data: { name: originBranchName } });
    }

    // 3. TAFUTA AU TENGENEZA KITUO CHA KWENDA (Destination)
    let destBranch = await prisma.branch.findFirst({ where: { name: destinationBranchName } });
    if (!destBranch) {
      destBranch = await prisma.branch.create({ data: { name: destinationBranchName } });
    }

    // 4. SAVE MZIGO SASA
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
        originBranchId: originBranch.id, // Inatumia ID iliyopatikana hapo juu
        destinationBranchId: destBranch.id,
        status: "RECEIVED",
      },
    });

    revalidatePath('/dashboard');
    
  } catch (error) {
    console.error("Kosa wakati wa kusave mzigo:", error);
    throw new Error("Imeshindwa kusave mzigo.");
  }

  // 5. Rudisha mtumiaji kwenye Dashboard
  redirect('/dashboard');
}