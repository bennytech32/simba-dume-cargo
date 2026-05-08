import React from 'react';
import Link from 'next/link';
import { Package, Truck, DollarSign, Plus, ArrowRight } from 'lucide-react';
import prisma from '../../../lib/prisma';
import StatusSelect from './StatusSelect'; 

export const dynamic = 'force-dynamic';

export default async function DashboardHome() {
  // 1. VUTA TAKWIMU KUTOKA KANZIDATA
  const totalShipments = await prisma.shipment.count();
  const inTransitCount = await prisma.shipment.count({ where: { status: 'IN_TRANSIT' } });
  const revenueAggregation = await prisma.shipment.aggregate({ _sum: { price: true } });
  const totalRevenue = revenueAggregation._sum.price ? Number(revenueAggregation._sum.price) : 0;

  // 2. VUTA MIZIGO 10 YA HIVI KARIBUNI
  const recentShipments = await prisma.shipment.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' },
    include: { originBranch: true, destBranch: true }
  });

  return (
    <div className="space-y-8">
      {/* TOP HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Dashibodi ya Usimamizi</h1>
          <p className="text-gray-500 font-medium">Hali ya mizigo na mapato kwa siku ya leo.</p>
        </div>
        <Link href="/shipments/new" className="flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all hover:scale-105 shadow-lg shadow-red-200">
          <Plus size={20} /> Sajili Mzigo
        </Link>
      </div>
      
      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard icon={<Package size={24} />} label="Mizigo Jumla" value={totalShipments} color="blue" />
        <StatCard icon={<Truck size={24} />} label="Ipo Njiani" value={inTransitCount} color="amber" />
        <StatCard icon={<DollarSign size={24} />} label="Mapato (TZS)" value={totalRevenue.toLocaleString()} color="emerald" />
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-900">Mizigo Inayosafirishwa</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead className="bg-gray-50 text-gray-400 text-[11px] uppercase tracking-widest font-black">
              <tr>
                <th className="px-6 py-4">Namba (Tracking)</th>
                <th className="px-6 py-4">Mtumaji / Mpokeaji</th>
                <th className="px-6 py-4">Njia (Route)</th>
                <th className="px-6 py-4">Gharama</th>
                <th className="px-6 py-4 text-center">Hali (Status)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentShipments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500 font-medium">
                    Hakuna mizigo iliyosajiliwa bado.
                  </td>
                </tr>
              ) : (
                recentShipments.map((shipment) => (
                  <tr key={shipment.id} className="hover:bg-gray-50/80 transition-colors">
                    
                    {/* HAPA NDIPO TUMEWEKA LINK YA KUFUNGUA RISITI */}
                    <td className="px-6 py-4 font-black text-gray-900 text-sm">
                      <Link 
                        href={`/receipt/${shipment.id}`} 
                        target="_blank" 
                        className="hover:text-red-600 hover:underline flex items-center gap-2"
                        title="Chapisha Risiti"
                      >
                        📄 {shipment.trackingNumber}
                      </Link>
                    </td>
                    
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-800">{shipment.senderName}</p>
                      <p className="text-xs text-gray-500">➔ {shipment.receiverName}</p>
                    </td>
                    <td className="px-6 py-4 text-xs font-bold text-gray-600">
                      {shipment.originBranch.name} <ArrowRight size={12} className="inline mx-1 text-red-500" /> {shipment.destBranch.name}
                    </td>
                    <td className="px-6 py-4 font-black text-gray-900 text-sm">TZS {Number(shipment.price).toLocaleString()}</td>
                    
                    <td className="px-6 py-4 text-center">
                      <StatusSelect id={shipment.id} currentStatus={shipment.status} />
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

// Reusable Stat Card Component
function StatCard({ icon, label, value, color }: any) {
  const colors: any = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100'
  };
  return (
    <div className={`p-6 rounded-2xl border shadow-sm flex items-center gap-5 bg-white transition-transform hover:-translate-y-1`}>
      <div className={`p-4 rounded-xl ${colors[color]}`}>{icon}</div>
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{label}</p>
        <p className="text-2xl font-black text-gray-900 mt-1">{value}</p>
      </div>
    </div>
  );
}