import React from 'react';
import Link from 'next/link';
import { Package, Truck, DollarSign, Plus, ArrowRight, Search, Navigation, CheckCircle2, Trash2 } from 'lucide-react';
import prisma from '../../../lib/prisma';
import StatusSelect from './StatusSelect'; 
import { deleteShipment, startTodaysTrips, markAllAsArrived } from '../../../app/actions/shipment';
import DashboardChart from './DashboardChart'; 

export const dynamic = 'force-dynamic';

export default async function DashboardHome({ searchParams }: { searchParams: { q?: string } }) {
  // MFUMO WA KUTAFUTA (SEARCH)
  const searchQuery = searchParams?.q || '';
  
  // VUTA TAKWIMU KUTOKA KANZIDATA
  const totalShipments = await prisma.shipment.count();
  const inTransitCount = await prisma.shipment.count({ where: { status: 'IN_TRANSIT' } });
  const arrivedCount = await prisma.shipment.count({ where: { status: 'ARRIVED' } });
  
  const revenueAggregation = await prisma.shipment.aggregate({ _sum: { price: true } });
  const totalRevenue = revenueAggregation._sum.price ? Number(revenueAggregation._sum.price) : 0;

  // VUTA MIZIGO
  const recentShipments = await prisma.shipment.findMany({
    where: searchQuery ? {
      OR: [
        { trackingNumber: { contains: searchQuery, mode: 'insensitive' } },
        { senderName: { contains: searchQuery, mode: 'insensitive' } },
        { receiverName: { contains: searchQuery, mode: 'insensitive' } },
      ]
    } : undefined,
    take: searchQuery ? 50 : 10, 
    orderBy: { createdAt: 'desc' },
    include: { originBranch: true, destBranch: true }
  });

  const chartData = [
    { name: 'JumaTatu', mapato: 400000, mizigo: 24 },
    { name: 'JumaNne', mapato: 300000, mizigo: 18 },
    { name: 'JumaTano', mapato: 550000, mizigo: 35 },
    { name: 'Alhamisi', mapato: 200000, mizigo: 12 },
    { name: 'Ijumaa', mapato: 600000, mizigo: 40 },
    { name: 'JumaMosi', mapato: 800000, mizigo: 55 },
    { name: 'JumaPili', mapato: 100000, mizigo: 5 },
  ];

  return (
    <div className="space-y-8 pb-10">
      
      {/* TOP HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Dashibodi Kuu</h1>
          <p className="text-gray-500 font-medium">Usimamizi wa mapato, mizigo na usafiri.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/shipments/new" className="flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-200">
            <Plus size={20} /> Sajili Mzigo
          </Link>
        </div>
      </div>
      
      {/* STATS CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<Package size={24} />} label="Mizigo Jumla" value={totalShipments} color="blue" />
        <StatCard icon={<Truck size={24} />} label="Ipo Njiani" value={inTransitCount} color="amber" />
        <StatCard icon={<CheckCircle2 size={24} />} label="Imefika" value={arrivedCount} color="emerald" />
        <StatCard icon={<DollarSign size={24} />} label="Mapato (TZS)" value={totalRevenue.toLocaleString()} color="red" />
      </div>

      {/* CHATI YA PREMIUM NA BULK ACTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-6">Mwenendo wa Mapato (Wiki Hii)</h2>
          <div className="h-72 w-full">
            <DashboardChart data={chartData} />
          </div>
        </div>

        <div className="bg-[#0a0a0a] p-6 rounded-2xl border border-neutral-800 shadow-xl text-white flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-black mb-2 text-white">Vitendo vya Haraka</h2>
            <p className="text-gray-400 text-sm mb-8">Badilisha hali ya mizigo kwa mkupuo mmoja ili kuokoa muda.</p>
            
            <div className="space-y-4">
              {/* TUMEONDOA ONCLICK HAPA */}
              <form action={startTodaysTrips}>
                <button type="submit" className="w-full flex items-center justify-between p-4 bg-blue-600/20 border border-blue-500/30 rounded-xl hover:bg-blue-600 transition-colors text-blue-100 hover:text-white group">
                  <span className="font-bold flex items-center gap-3">
                    <Navigation size={20} className="text-blue-400 group-hover:text-white" /> 
                    Anzisha Safari (Yote)
                  </span>
                  <ArrowRight size={16} />
                </button>
              </form>

              {/* TUMEONDOA ONCLICK HAPA */}
              <form action={markAllAsArrived}>
                <button type="submit" className="w-full flex items-center justify-between p-4 bg-emerald-600/20 border border-emerald-500/30 rounded-xl hover:bg-emerald-600 transition-colors text-emerald-100 hover:text-white group">
                  <span className="font-bold flex items-center gap-3">
                    <CheckCircle2 size={20} className="text-emerald-400 group-hover:text-white" /> 
                    Weka Imefika (Yote)
                  </span>
                  <ArrowRight size={16} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* TABLE SECTION NA SEARCH BAR */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <h2 className="text-lg font-bold text-gray-900">Mizigo Yote</h2>
          
          <form className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              name="q"
              defaultValue={searchQuery}
              placeholder="Tafuta Namba, Mtumaji au Mpokeaji..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          </form>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[800px]">
            <thead className="bg-gray-50 text-gray-400 text-[11px] uppercase tracking-widest font-black">
              <tr>
                <th className="px-6 py-4">Namba (Tracking)</th>
                <th className="px-6 py-4">Mtumaji / Mpokeaji</th>
                <th className="px-6 py-4">Njia (Route)</th>
                <th className="px-6 py-4 text-center">Hali (Status)</th>
                <th className="px-6 py-4 text-right">Vitendo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentShipments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-10 text-center text-gray-500 font-medium">
                    {searchQuery ? 'Hakuna mzigo uliopatikana kwa utafutaji huo.' : 'Hakuna mizigo iliyosajiliwa bado.'}
                  </td>
                </tr>
              ) : (
                recentShipments.map((shipment) => (
                  <tr key={shipment.id} className="hover:bg-gray-50/80 transition-colors">
                    
                    <td className="px-6 py-4 font-black text-gray-900 text-sm">
                      <Link href={`/receipt/${shipment.id}`} target="_blank" className="hover:text-red-600 hover:underline flex items-center gap-2">
                        📄 {shipment.trackingNumber}
                      </Link>
                      <p className="text-xs text-gray-500 font-normal mt-1">TZS {Number(shipment.price).toLocaleString()}</p>
                    </td>
                    
                    <td className="px-6 py-4">
                      <p className="text-sm font-bold text-gray-800">{shipment.senderName}</p>
                      <p className="text-xs text-gray-500">➔ {shipment.receiverName}</p>
                    </td>
                    
                    <td className="px-6 py-4 text-xs font-bold text-gray-600">
                      {shipment.originBranch.name} <ArrowRight size={12} className="inline mx-1 text-red-500" /> {shipment.destBranch.name}
                    </td>
                    
                    <td className="px-6 py-4 text-center">
                      <StatusSelect id={shipment.id} currentStatus={shipment.status} />
                    </td>
                    
                    <td className="px-6 py-4 text-right">
                      {/* TUMEONDOA ONCLICK HAPA */}
                      <form action={deleteShipment} className="inline-block">
                        <input type="hidden" name="id" value={shipment.id} />
                        <button 
                          type="submit" 
                          className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </form>
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

function StatCard({ icon, label, value, color }: any) {
  const colors: any = {
    blue: 'bg-blue-50 text-blue-600 border-blue-100',
    amber: 'bg-amber-50 text-amber-600 border-amber-100',
    emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    red: 'bg-red-50 text-red-600 border-red-100'
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