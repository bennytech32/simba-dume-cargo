"use server";

import prisma from '../../lib/prisma';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function loginUser(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: "Tafadhali jaza email na nenosiri." };
  }

  // Tafuta mfanyakazi kwenye Kanzidata
  const user = await prisma.user.findUnique({
    where: { email: email }
  });

  // Hapa tunalinganisha password. 
  // (Kwenye mifumo mikubwa zaidi, password inapaswa kuwa 'Hashed' kwa bcrypt)
  if (!user || user.password !== password) {
    return { error: "Email au Nenosiri sio sahihi." };
  }

  // Weka muhuri (Cookie) wa kumtambua huyu mtu (Inadumu kwa masaa 24)
  const cookieStore = await cookies();
  cookieStore.set('simbadume_session', user.id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24, // Masaa 24
    path: '/',
  });

  // Mpeleke kwenye Dashboard
  redirect('/dashboard');
}

export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.delete('simbadume_session');
  redirect('/login');
}