"use server";

// Hakikisha njia hii ya prisma ipo sahihi kulingana na mradi wako
import prisma from '../../lib/prisma'; 
import { revalidatePath } from 'next/cache';

export async function createVehicle(formData: FormData) {
  const plateNumber = formData.get('plateNumber') as string;
  const type = formData.get('type') as string;
  const capacity = formData.get('capacity') as string;
  const currentDriver = formData.get('currentDriver') as string;

  if (!plateNumber) {
    throw new Error("Namba ya gari ni lazima.");
  }

  // Ingiza gari kwenye Database
  await prisma.vehicle.create({
    data: {
      plateNumber: plateNumber.toUpperCase(), // Tunahakikisha namba inakuwa Herufi Kubwa
      type,
      capacity,
      currentDriver,
      status: 'AVAILABLE' // Gari jipya linaanza likiwa huru (Imepaki)
    }
  });

  // Sasisha ukurasa wa magari ili gari jipya lionekane papo hapo
  revalidatePath('/vehicles');
}