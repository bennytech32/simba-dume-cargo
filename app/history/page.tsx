import React from 'react';
import Link from 'next/link';
import { Search, ArrowLeft, Trash2, Database, ArrowRight, Eye, Calendar, Package } from 'lucide-react';
import prisma from '../../lib/prisma';
import StatusSelect from '../(dashboard)/dashboard/StatusSelect'; 
import { deleteShipment } from '../../app/actions/shipment';

export const dynamic = 'force-dynamic';

export default async function HistoryPage({ searchParams }: { searchParams: { q?: string, date?: string } }) {
  const searchQuery = searchParams?.q || '';
  const dateFilter = searchParams?.date || 'all';

  // --- LOGIC YA KUCHUJA TAREHE (DATE FILTER) ---
  let dateCondition: any = undefined;
  const now = new Date();

  if (dateFilter === 'leo') {
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    dateCondition = { gte: startOfToday };
  } else if (dateFilter === 'jana') {
    const startOfYesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);
    const endOfYesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    dateCondition = { gte: startOfYesterday, lt: endOfYesterday };
  } else if (dateFilter === 'wiki') {
    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);
    dateCondition = { gte: startOfWeek };
  } else if (dateFilter === 'mwezi') {
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    dateCondition = { gte: startOfMonth };
  }

  // --- QUERY YA DATABASE YENYE FILTERS ---
  const whereClause: any = {};

  if (searchQuery) {
    whereClause.OR = [
      { trackingNumber: { contains: searchQuery, mode: 'insensitive' } },
      { senderName: { contains: searchQuery, mode: 'insensitive' } },
      { receiverName: { contains: searchQuery, mode: 'insensitive' } },
      { description: { contains: searchQuery, mode: 'insensitive' } },
    ];
  }

  if (dateCondition) {
    whereClause.createdAt = dateCondition;
  }

  // Vuta mizigo yote kulingana na Filter
  const allShipments = await prisma.shipment.findMany({
    where: Object.keys(whereClause).length > 0 ? whereClause : undefined,
    take: 500, // Imelindwa isijaze RAM ya simu
    orderBy: { createdAt: 'desc' },
    include: { originBranch: true, destBranch: true }
  });

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-6">
      
      {/* HEADER YA HISTORIA */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="p-3 bg-gray-50 text-gray-600 rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors">
            <ArrowLeft size={24} />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-2">
              <Database size={24} className="text-red-600"/> Daftari la Mizigo Yote
            </h1>
            <p className="text-gray-500 font-medium text-sm">Tafuta, chuja kwa tarehe, na tazama details zote.</p>
          </div>
        </div>

        {/* FOMU YA SEARCH NA FILTER */}
        <form className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              name="q"
              defaultValue={searchQuery}
              placeholder="Tafuta Namba, Jina..." 
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-600 transition-all"
            />
          </div>
          
          <div className="relative w-full sm:w-48">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <select 
              name="date" 
              defaultValue={dateFilter}
              className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm font-bold text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-600 transition-all appearance-none cursor-pointer"
            >
              <option value="all">Muda Wote (All)</option>
              <option value="leo">Leo Tu</option>
              <option value="jana">Jana</option>
              <option value="wiki">Wiki Hii</option>
              <option value="mwezi">Mwezi Huu</option>
            </select>
          </div>

          <button type="submit" className="px-6 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-colors shadow-md">
            Chuja
          </button>
        </form>
      </div>

      {/* TABLE YA MIZIGO YOTE ILIYO NA DETAILS NYINGI */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[1200px]">
            <thead className="bg-gray-900 text-white text-[11px] uppercase tracking-widest font-bold">
              <tr>
                <th className="px-6 py-5 whitespace-nowrap">Namba & Tarehe</th>
                <th className="px-6 py-5 whitespace-nowrap">Mtumaji & Mpokeaji</th>
                {/* COLUMN MPYA YENYE DETAILS WAZIWAZI */}
                <th className="px-6 py-5 whitespace-nowrap">Maelezo ya Mzigo</th>
                <th className="px-6 py-5 whitespace-nowrap">Njia & Malipo</th>
                <th className="px-6 py-5 whitespace-nowrap text-center">Hali (Status)</th>
                <th className="px-6 py-5 whitespace-nowrap text-right">Vitendo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {allShipments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-16 text-center">
                    <Database size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 font-medium text-lg">Hakuna mzigo uliopatikana.</p>
                  </td>
                </tr>
              ) : (
                allShipments.map((shipment) => {
                  const payStatus = (shipment as any).paymentStatus || 'PAID';
                  const payMethod = (shipment as any).paymentMethod || 'CASH';

                  return (
                    <tr key={shipment.id} className="hover:bg-red-50/30 transition-colors">
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-black text-gray-900 text-sm">{shipment.trackingNumber}</div>
                        <div className="text-[10px] text-gray-500 font-bold mt-1">
                          {new Date(shipment.createdAt).toLocaleDateString('sw-TZ', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute:'2-digit' })}
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="mb-2">
                          <span className="text-[10px] text-gray-400 font-bold uppercase block">Kutoka:</span>
                          <span className="text-sm font-bold text-gray-800">{shipment.senderName}</span> <span className="text-xs text-gray-500">({shipment.senderPhone})</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-400 font-bold uppercase block">Kwenda:</span>
                          <span className="text-sm font-bold text-gray-800">{shipment.receiverName}</span> <span className="text-xs text-gray-500">({shipment.receiverPhone})</span>
                        </div>
                      </td>

                      {/* DATA WAZIWAZI BILA KU-CLICK RISITI */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-start gap-2">
                          <Package size={16} className="text-red-500 mt-0.5" />
                          <div>
                            <p className="text-sm font-bold text-gray-900 w-48 truncate" title={shipment.description || 'Mizigo Kawaida'}>
                              {shipment.description || 'Mizigo Kawaida'}
                            </p>
                            <p className="text-xs text-gray-500 mt-1 font-medium">Thamani: <span className="text-gray-900">TZS {(shipment as any).cargoValue?.toLocaleString() || 0}</span></p>
                          </div>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-xs font-bold text-gray-700 mb-2">
                          {shipment.originBranch.name} <ArrowRight size={12} className="inline mx-1 text-red-500" /> {shipment.destBranch.name}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${payStatus === 'CREDIT' ? 'bg-red-100 text-red-700' : payStatus === 'PAY_ON_DELIVERY' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'}`}>
                            {payStatus}
                          </span>
                          <span className="text-xs font-black text-gray-900">TZS {Number(shipment.price).toLocaleString()}</span>
                        </div>
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        <StatusSelect id={shipment.id} currentStatus={shipment.status} />
                      </td>
                      
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/receipt/${shipment.id}`} target="_blank" className="p-2 bg-gray-100 text-gray-600 hover:text-white hover:bg-gray-900 rounded-lg transition-colors flex items-center gap-2 text-xs font-bold">
                            <Eye size={16} /> Print
                          </Link>

                          <form action={deleteShipment}>
                            <input type="hidden" name="id" value={shipment.id} />
                            <button type="submit" className="p-2 text-red-400 hover:text-white hover:bg-red-600 rounded-lg transition-colors border border-red-100">
                              <Trash2 size={16} />
                            </button>
                          </form>
                        </div>
                      </td>

                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
        
        <div className="p-4 border-t border-gray-100 bg-gray-50 text-center text-xs font-bold text-gray-500">
          Inaonyesha matokeo {allShipments.length}
        </div>
      </div>

    </div>
  );
}