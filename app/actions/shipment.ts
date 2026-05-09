"use server";

// Hakikisha njia hii ipo sahihi kulingana na muundo wa mradi wako
import prisma from '../../lib/prisma'; 
import { revalidatePath } from 'next/cache';

// ==========================================
// 1. KUSAJILI MZIGO MPYA (CREATE)
// ==========================================
export async function createShipment(formData: FormData) {
  // Chukua data kutoka kwenye fomu
  const senderName = formData.get('senderName') as string;
  const senderPhone = formData.get('senderPhone') as string;
  const receiverName = formData.get('receiverName') as string;
  const receiverPhone = formData.get('receiverPhone') as string;
  const originBranchName = formData.get('originBranchName') as string;
  const destinationBranchName = formData.get('destinationBranchName') as string;
  const description = formData.get('description') as string;
  const weight = formData.get('weight') ? parseFloat(formData.get('weight') as string) : null;
  const declaredValue = formData.get('declaredValue') ? parseFloat(formData.get('declaredValue') as string) : null;
  const price = parseFloat(formData.get('price') as string);
  const paymentStatus = formData.get('paymentStatus') as string;

  // Tengeneza Namba ya Kipekee ya Kufuatilia Mzigo (Tracking Number)
  const trackingNumber = `SDC-${Date.now().toString().slice(-5)}-${Math.floor(Math.random() * 100)}`;

  // Tafuta vituo kwenye database (Ili kuunganisha ID zake)
  const originBranch = await prisma.branch.findFirst({ where: { name: originBranchName } });
  const destBranch = await prisma.branch.findFirst({ where: { name: destinationBranchName } });

  if (!originBranch || !destBranch) {
    throw new Error("Kituo ulichochagua hakijasajiliwa kwenye mfumo.");
  }

  // Ingiza Mzigo Kwenye Database
  await prisma.shipment.create({
    data: {
      trackingNumber,
      senderName,
      senderPhone,
      receiverName,
      receiverPhone,
      originBranchId: originBranch.id,
      destBranchId: destBranch.id,
      description,
      weight,
      declaredValue,
      price,
      paymentStatus,
      status: 'RECEIVED', // Mzigo unaanza na hali ya kupokelewa ofisini
    }
  });

  // Refresh kurasa ili mzigo mpya uonekane papo hapo
  revalidatePath('/shipments');
  revalidatePath('/dashboard');
}


// ==========================================
// 2. KUFUTA MZIGO MMOJA (DELETE)
// ==========================================
export async function deleteShipment(formData: FormData) {
  const id = formData.get('id') as string;
  
  if (id) {
    await prisma.shipment.delete({ 
      where: { id } 
    });
    
    revalidatePath('/shipments');
    revalidatePath('/dashboard');
  }
}


// ==========================================
// 3. VITENDO VYA MKUPUO: ANZISHA SAFARI ZOTE
// ==========================================
export async function startTodaysTrips() {
  await prisma.shipment.updateMany({
    where: { status: 'RECEIVED' }, // Inachukua mizigo yote iliyopokelewa
    data: { status: 'IN_TRANSIT' } // Inaiweka yote kuwa njiani (Safarini)
  });
  
  revalidatePath('/shipments');
  revalidatePath('/dashboard');
}


// ==========================================
// 4. VITENDO VYA MKUPUO: WEKA YOTE IMEFIKA
// ==========================================
export async function markAllAsArrived() {
  await prisma.shipment.updateMany({
    where: { status: 'IN_TRANSIT' }, // Inachukua mizigo yote iliyokuwa njiani
    data: { status: 'ARRIVED' }      // Inaiweka yote kuwa imefika
  });
  
  revalidatePath('/shipments');
  revalidatePath('/dashboard');
}


// ==========================================
// 5. KUBADILISHA HALI YA MZIGO MMOJA MMOJA (Kutoka kwenye StatusSelect)
// ==========================================
export async function updateShipmentStatus(id: string, newStatus: string) {
  if (id && newStatus) {
    await prisma.shipment.update({
      where: { id },
      data: { status: newStatus }
    });
    
    revalidatePath('/shipments');
    revalidatePath('/dashboard');
  }
}