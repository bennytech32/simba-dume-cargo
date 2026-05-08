import React from 'react';
import Link from 'next/link';
import { Users, ArrowLeft, Save, Shield, MapPin, Mail, Lock, User as UserIcon } from 'lucide-react';
import prisma from '../../../../lib/prisma';
import { createUser } from '../../../../app/actions/user';

export const dynamic = 'force-dynamic';

export default async function NewUserPage() {
  // Tunavuta vituo vyote ili tuweze kumpampangia mfanyakazi mpya
  const branches = await prisma.branch.findMany({
    orderBy: { name: 'asc' }
  });

  return (
    <div className="max-w-3xl mx-auto pb-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <Users className="text-red-600" size={28} /> Sajili Mfanyakazi
          </h1>
          <p className="text-gray-500 font-medium mt-1">Unda akaunti mpya ya mtumiaji wa mfumo.</p>
        </div>
        <Link href="/users" className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 font-medium transition-colors shadow-sm">
          <ArrowLeft size={18} /> Rudi
        </Link>
      </div>

      <form action={createUser} className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
        
        {/* Taarifa Binafsi */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
              <UserIcon size={16} /> Jina Kamili
            </label>
            <input type="text" name="name" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-600 outline-none" placeholder="Mfano: Ali Hassan" />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
              <Mail size={16} /> Barua Pepe (Email)
            </label>
            <input type="email" name="email" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-600 outline-none" placeholder="ali@simbadume.co.tz" />
          </div>
        </div>

        {/* Nenosiri na Cheo */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
              <Lock size={16} /> Nenosiri (Password)
            </label>
            <input type="password" name="password" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-600 outline-none" placeholder="Weka nenosiri thabiti" />
          </div>
          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
              <Shield size={16} /> Cheo (Role)
            </label>
            <select name="role" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-600 outline-none bg-white">
              <option value="CLERK">Karani (Clerk)</option>
              <option value="ADMIN">Msimamizi (Admin)</option>
            </select>
          </div>
        </div>

        {/* Kituo / Tawi */}
        <div>
          <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
            <MapPin size={16} /> Kituo Anachofanyia Kazi
          </label>
          <select name="branchId" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-600 outline-none bg-white">
            <option value="">-- Makao Makuu --</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>{branch.name}</option>
            ))}
          </select>
          <p className="text-xs text-gray-400 mt-2">Kama hajapangiwa tawi, muache kwenye Makao Makuu.</p>
        </div>

        {/* Kitufe cha Kusave */}
        <div className="pt-4 border-t border-gray-100">
          <button type="submit" className="flex items-center justify-center gap-2 w-full px-8 py-4 bg-red-600 text-white font-black rounded-xl hover:bg-red-700 transition-all shadow-xl shadow-red-600/30 text-lg">
            <Save size={24} /> Sajili Mfanyakazi
          </button>
        </div>

      </form>
    </div>
  );
}