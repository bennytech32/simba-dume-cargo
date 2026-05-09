"use server";

import prisma from '../../lib/prisma';
import { revalidatePath } from 'next/cache';

// 1. KUSAJILI TAWI JIPYA
export async function createBranch(formData: FormData) {
  const name = formData.get('name') as string;
  const location = formData.get('location') as string;

  if (!name) throw new Error("Jina la tawi ni lazima.");

  await prisma.branch.create({
    data: { name, location }
  });

  revalidatePath('/branches');
  revalidatePath('/shipments/new'); // Ili dropdown ya mzigo mpya isome vituo vipya
}

// 2. KUFUTA TAWI
export async function deleteBranch(formData: FormData) {
  const id = formData.get('id') as string;
  if (id) {
    await prisma.branch.delete({ where: { id } });
    revalidatePath('/branches');
  }
}