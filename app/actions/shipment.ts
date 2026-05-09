"use server";

import prisma from '../../lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createShipment(formData: FormData) {
  try {
    // 1. Kusanya data zote kutoka kwenye fomu
    // Kama tracking number haikuzalishwa na fomu, tunaizalisha hapa
    const trackingNumber = formData.get('trackingNumber') as string || `SDC-${Math.floor(Math.random() * 100000)}-${Math.floor(Math.random() * 100)}`;
    const senderName = formData.get('senderName') as string;
    const senderPhone = formData.get('senderPhone') as string;
    const receiverName = formData.get('receiverName') as string;
    const receiverPhone = formData.get('receiverPhone') as string;
    
    // Hizi ndizo ID za vituo zilizokuwa zinaleta ubishi
    const originBranchId = formData.get('originBranchId') as string;
    const destBranchId = formData.get('destBranchId') as string;
    
    const description = formData.get('description') as string;
    const weight = formData.get('weight') as string;
    const declaredValue = formData.get('declaredValue') as string;
    const price = formData.get('price') as string;
    const paymentStatus = formData.get('paymentStatus') as string || 'PENDING';

    // 2. Ulinzi (Validation): Hakikisha vituo vimechaguliwa
    if (!originBranchId || !destBranchId) {
      throw new Error("Tafadhali chagua kituo kinapotoka na kinapoenda mzigo.");
    }

    // 3. HIFADHI KWENYE DATABASE (Na lile rekebisho la 'connect') 🔥
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
        status: "RECEIVED", // Mzigo mpya unaanza na status ya kupokelewa
        
        // SULUHISHO LETU LA KI-MHANDISI LIPO HAPA 👇🏾
        originBranch: {
          connect: { id: originBranchId }
        },
        destBranch: {
          connect: { id: destBranchId }
        }
      }
    });

  } catch (error) {
    console.error("Kosa kwenye kusajili mzigo:", error);
    // Tunatupa Error ili fomu iione na kumjulisha mtumiaji
    throw new Error("Imeshindikana kusajili mzigo. Hakikisha taarifa zote zimejazwa kwa usahihi.");
  }

  // 4. Safisha kumbukumbu za zamani (Cache) ili mzigo mpya uonekane
  revalidatePath('/dashboard');
  revalidatePath('/shipments');
  
  // 5. Mpeleke kwenye ukurasa wa orodha ya mizigo
  redirect('/shipments');
}

// Unaweza kuongeza function nyingine hapa chini (kama za kufuta mzigo au kubadili status) baadaye...