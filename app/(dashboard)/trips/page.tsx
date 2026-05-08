import React from 'react';
import Link from 'next/link';
import { Truck, Plus, ArrowRight, User, Package } from 'lucide-react';
import prisma from '../../../lib/prisma';

export const dynamic = 'force-dynamic';

export default async function TripsPage() {
  // Tunavuta Safari Zote na Kuhesabu Mizigo (Shipments) Kwenye Kila Safari
  const trips = await prisma.trip.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      originBranch: true,
      destBranch: true,
      _count: {
        select: { shipments: true }
      }
    }
  });

  return (
    <div className="space-y-8">
      {/* HEADER YA UKURASA */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
            <Truck className="text-red-600" size={28} /> Orodha ya Safari (Manifests)
          </h1>
          <p className="text-gray-500 font-medium mt-1">Simamia magari yanayosafiri na mizigo iliyopakiwa.</p>
        </div>
        <Link 
          href="/trips/new" 
          className="flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-200"
        >
          <Plus size={20} /> Tengeneza Safari Mpya
        </Link>
      </div>

      {/* JEDWALI LA SAFARI */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-900">Magari Yaliyosajiliwa</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[900px]">
            <thead className="bg-gray-50 text-gray-400 text-[11px] uppercase tracking-widest font-black">
              <tr>
                <th className="px-6 py-4">Namba ya Safari</th>
                <th className="px-6 py-4">Gari & Dereva</th>
                <th className="px-6 py-4">Njia (Route)</th>
                <th className="px-6 py-4 text-center">Idadi ya Mizigo</th>
                <th className="px-6 py-4 text-center">Hali (Status)</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {trips.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-gray-500 font-medium">
                    <Truck size={40} className="mx-auto text-gray-300 mb-3" />
                    Hakuna safari yoyote iliyosajiliwa. <br/> Bonyeza "Tengeneza Safari Mpya" kuanza.
                  </td>
                </tr>
              ) : (
                trips.map((trip) => (
                  <tr key={trip.id} className="hover:bg-gray-50/80 transition-colors">
                    
                    <td className="px-6 py-4 font-black text-gray-900 text-sm">
                      {trip.tripNumber}
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm font-bold text-gray-800">
                        <span className="px-2 py-1 bg-gray-100 rounded border border-gray-200">
                          {trip.vehiclePlate}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                        <User size={12} /> {trip.driverName}
                      </div>
                    </td>

                    <td className="px-6 py-4 text-xs font-bold text-gray-600">
                      {trip.originBranch.name} 
                      <ArrowRight size={12} className="inline mx-2 text-red-500" /> 
                      {trip.destBranch.name}
                    </td>

                    <td className="px-6 py-4 text-center">
                      <div className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-black">
                        <Package size={14} /> {trip._count.shipments}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 text-center">
                      <span className={`text-[10px] font-black uppercase tracking-tighter px-3 py-1.5 rounded-full border
                        ${trip.status === 'SCHEDULED' ? 'bg-gray-100 text-gray-700 border-gray-200' : ''}
                        ${trip.status === 'IN_TRANSIT' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' : ''}
                        ${trip.status === 'COMPLETED' ? 'bg-green-100 text-green-700 border-green-200' : ''}
                      `}>
                        {trip.status === 'SCHEDULED' && 'Ratiba Mpya'}
                        {trip.status === 'IN_TRANSIT' && 'Ipo Njiani'}
                        {trip.status === 'COMPLETED' && 'Imefika'}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <Link 
                        href={`/trips/${trip.id}`} 
                        className="text-xs font-bold text-red-600 hover:text-red-800 hover:underline"
                      >
                        Fungua Manifest &rarr;
                      </Link>
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