import React from 'react';
import Link from 'next/link';
import { Users, Plus, Shield, MapPin, Mail } from 'lucide-react';
import prisma from '../../../lib/prisma';

export const dynamic = 'force-dynamic';

export default async function UsersPage() {
  // Vuta wafanyakazi wote na taarifa za matawi yao
  const users = await prisma.user.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      branch: true
    }
  });

  return (
    <div className="space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            <Users className="text-red-600" size={28} /> Wafanyakazi
          </h1>
          <p className="text-gray-500 font-medium mt-1">Orodha ya wafanyakazi na wasimamizi wa mfumo.</p>
        </div>
        
        {/* Kitufe cha kuongeza mfanyakazi mpya (Kimewekwa Link) */}
        <Link href="/users/new" className="flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-200">
          <Plus size={20} /> Sajili Mfanyakazi
        </Link>
      </div>

      {/* JEDWALI LA WAFANYAKAZI */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-900">Akaunti za Mfumo</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead className="bg-gray-50 text-gray-400 text-[11px] uppercase tracking-widest font-black">
              <tr>
                <th className="px-6 py-4">Jina Kamili</th>
                <th className="px-6 py-4">Barua Pepe (Email)</th>
                <th className="px-6 py-4">Cheo (Role)</th>
                <th className="px-6 py-4">Tawi / Kituo</th>
                <th className="px-6 py-4 text-right">Tarehe ya Kujiunga</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-gray-500 font-medium">
                    <Users size={40} className="mx-auto text-gray-300 mb-3" />
                    Hakuna wafanyakazi waliosajiliwa kwenye mfumo bado.
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/80 transition-colors">
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-bold text-xs uppercase">
                          {user.name.substring(0, 2)}
                        </div>
                        <span className="font-black text-gray-900 text-sm">{user.name}</span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail size={14} className="text-gray-400" />
                        {user.email}
                      </div>
                    </td>

                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest
                        ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}
                      `}>
                        <Shield size={10} /> {user.role}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                        <MapPin size={14} className="text-red-500" />
                        {user.branch ? user.branch.name : 'Makao Makuu'}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 text-right text-xs font-bold text-gray-500">
                      {new Date(user.createdAt).toLocaleDateString('sw-TZ', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}