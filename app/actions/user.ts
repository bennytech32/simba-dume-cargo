"use server";

import prisma from '../../lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function createUser(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string; // Kwa usalama zaidi, baadaye tuta-hash (kuficha) nenosiri hili
  const role = formData.get('role') as string;
  const branchId = formData.get('branchId') as string;

  try {
    await prisma.user.create({
      data: {
        name,
        email,
        password,
        role,
        // Kama hajapewa tawi, anakuwa wa Makao Makuu (null)
        branchId: branchId ? branchId : null,
      }
    });

    revalidatePath('/users');
  } catch (error) {
    console.error("Kosa kwenye kusajili mfanyakazi:", error);
    // Hii mara nyingi inatokea kama Email imeshatumika
    throw new Error("Imeshindwa kusajili mfanyakazi. Huenda Email hii imeshatumika.");
  }

  // Turudishe kwenye orodha ya wafanyakazi
  redirect('/users');
}