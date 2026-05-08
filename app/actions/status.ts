"use server";

import prisma from '../../lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updateShipmentStatus(formData: FormData) {
  const id = formData.get('id') as string;
  const newStatus = formData.get('status') as string;

  if (!id || !newStatus) return;

  try {
    // Badilisha status kwenye Database
    await prisma.shipment.update({
      where: { id: id },
      data: { status: newStatus },
    });

    // Safisha cache ili ukurasa uonyeshe mabadiliko haraka
    revalidatePath('/dashboard');
  } catch (error) {
    console.error("Imeshindwa kubadili status:", error);
  }
}