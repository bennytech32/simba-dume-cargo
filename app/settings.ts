"use server";

import prisma from '../../lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updateSettings(formData: FormData) {
  const companyName = formData.get('companyName') as string;
  const companyPhone = formData.get('companyPhone') as string;
  const companyTin = formData.get('companyTin') as string;
  const address = formData.get('address') as string;
  const terms = formData.get('terms') as string;

  try {
    // Upsert inamaanisha: Kama hakuna itengeneze, kama ipo i-update
    await prisma.settings.upsert({
      where: { id: 1 },
      update: { companyName, companyPhone, companyTin, address, terms },
      create: { id: 1, companyName, companyPhone, companyTin, address, terms },
    });

    revalidatePath('/dashboard');
    revalidatePath('/settings');
  } catch (error) {
    console.error("Imeshindwa kusave settings:", error);
  }
}