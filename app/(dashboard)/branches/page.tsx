import React from 'react';
import { MapPin, Package, Phone, Map, Users } from 'lucide-react';
import prisma from '../../../lib/prisma';

export const dynamic = 'force-dynamic';

export default async function BranchesPage() {
  // Tunavuta vituo vyote na kuhesabu idadi ya mizigo na wafanyakazi
  const branches = await prisma.branch.findMany({
    orderBy: { name: 'asc' },
    include: {
      _count: {
        select: { 
          sentCargo: true, 
          recvCargo: true, 
          users: true 
        }
      }
    }
  });

  return (
    <div className="space-y-8">
      {/* HEADER YA UKURASA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            <MapPin className="text-red-600" size={28} /> Matawi na Vituo
          </h1>
          <p className="text-gray-500 font-medium mt-1">Angalia takwimu na utendaji wa kila kituo chako.</p>
        </div>
        
        {/* Kwa sasa hatuhitaji kitufe cha 'Add New' kwasababu vituo vinajitengeneza vyenyewe. 
            Tunaweza kuweka kitufe cha 'Print Ripoti' hapa baadaye */}
        <div className="px-6 py-3 bg-red-50 text-red-700 font-bold rounded-xl border border-red-100 shadow-sm flex items-center gap-2">
           Jumla ya Vituo: {branches.length}
        </div>
      </div>

      {/* CARDS ZA VITUO */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {branches.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-gray-100">
            <MapPin size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 font-medium">Hakuna vituo vilivyosajiliwa.</p>
          </div>
        ) : (
          branches.map((branch) => (
            <div key={branch.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              {/* Jina la Kituo */}
              <div className="p-5 border-b border-gray-50 bg-gradient-to-r from-gray-50 to-white flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                  <MapPin size={20} />
                </div>
                <div>
                  <h2 className="font-black text-lg text-gray-900 uppercase tracking-tight">{branch.name}</h2>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Tawi</p>
                </div>
              </div>

              {/* Takwimu za Kituo */}
              <div className="p-5 grid grid-cols-2 gap-4">
                <div className="bg-blue-50/50 p-3 rounded-xl border border-blue-50">
                  <p className="text-[10px] font-bold text-blue-600 uppercase mb-1 flex items-center gap-1">
                    <Package size={12} /> Mizigo Iliyotumwa
                  </p>
                  <p className="text-2xl font-black text-gray-900">{branch._count.sentCargo}</p>
                </div>
                
                <div className="bg-green-50/50 p-3 rounded-xl border border-green-50">
                  <p className="text-[10px] font-bold text-green-600 uppercase mb-1 flex items-center gap-1">
                    <Package size={12} /> Mizigo Iliyopokelewa
                  </p>
                  <p className="text-2xl font-black text-gray-900">{branch._count.recvCargo}</p>
                </div>
              </div>

              {/* Mawasiliano (Ikiwa yapo) */}
              <div className="px-5 pb-5 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Map size={14} className="text-gray-400" /> 
                  {branch.address ? branch.address : <span className="text-gray-400 italic">Anuani haijawekwa</span>}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone size={14} className="text-gray-400" /> 
                  {branch.phone ? branch.phone : <span className="text-gray-400 italic">Simu haijawekwa</span>}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users size={14} className="text-gray-400" /> 
                  <span className="font-bold">{branch._count.users}</span> Wafanyakazi
                </div>
              </div>

            </div>
          ))
        )}
      </div>
    </div>
  );
}