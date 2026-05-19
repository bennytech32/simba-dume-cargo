import React from 'react';
import prisma from '../../lib/prisma';
import { Package, MapPin, Truck, CheckCircle, Search, ArrowRight, Home } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

// Hii inasoma ile link inayotoka kwenye QR Code (Mfano: ?code=SDC-12345)
export default async function TrackPage({ searchParams }: { searchParams: Promise<{ code?: string }> }) {
  const resolvedParams = await searchParams;
  const code = resolvedParams.code;

  let shipment = null;

  // Kama kuna namba ya mzigo (code), tafuta kwenye database
  if (code) {
    shipment = await prisma.shipment.findFirst({
      where: { trackingNumber: code },
      include: { originBranch: true, destBranch: true }
    });
  }

  // Hatua za Mzigo
  const getStatusColor = (currentStatus: string, stepStatus: string) => {
    const statuses = ['RECEIVED', 'IN_TRANSIT', 'ARRIVED'];
    const currentIndex = statuses.indexOf(currentStatus);
    const stepIndex = statuses.indexOf(stepStatus);
    
    if (stepIndex < currentIndex) return 'bg-green-500 text-white border-green-500'; // Imeshapita
    if (stepIndex === currentIndex) return 'bg-red-600 text-white border-red-600 animate-pulse'; // Ipo hapa
    return 'bg-gray-100 text-gray-400 border-gray-200'; // Bado haijafika
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4">
      
      {/* Kichwa cha Ukurasa */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black text-gray-900 tracking-widest uppercase">Simba Dume Cargo</h1>
        <p className="text-gray-500 mt-2 font-medium">Ufuatiliaji wa Mzigo (Tracking)</p>
      </div>

      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden p-8">
        
        {/* Kama hakuna code kwenye link, onyesha fomu ya kutafuta */}
        {!code && (
          <div className="text-center py-10">
            <Search size={48} className="mx-auto text-gray-300 mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">Tafuta Mzigo Wako</h2>
            <p className="text-gray-500 mb-6">Ingiza namba yako ya mzigo hapa chini kuona ulipofikia.</p>
            <form className="flex gap-2 max-w-md mx-auto">
              <input 
                type="text" 
                name="code" 
                placeholder="Mfano: SDC-12345" 
                required 
                className="flex-1 px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-600 outline-none uppercase"
              />
              <button type="submit" className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl font-bold transition-all">
                Tafuta
              </button>
            </form>
          </div>
        )}

        {/* Kama code ipo lakini mzigo haujapatikana */}
        {code && !shipment && (
          <div className="text-center py-10">
            <Package size={48} className="mx-auto text-red-300 mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">Mzigo Haujapatikana!</h2>
            <p className="text-gray-500 mb-6">Hakuna mzigo wenye namba <span className="font-bold text-red-600">{code}</span> kwenye mfumo wetu. Tafadhali hakikisha namba ipo sahihi.</p>
            <Link href="/track" className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-bold transition-all">
              <Search size={18} /> Tafuta Mwingine
            </Link>
          </div>
        )}

        {/* Kama Mzigo Umepatikana */}
        {code && shipment && (
          <div>
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 pb-6 border-b border-gray-100">
              <div>
                <p className="text-sm text-gray-500 uppercase font-bold tracking-wider">Namba ya Mzigo</p>
                <h2 className="text-3xl font-black text-gray-900 tracking-widest">{shipment.trackingNumber}</h2>
              </div>
              <div className="bg-red-50 text-red-600 px-4 py-2 rounded-lg font-black uppercase text-sm border border-red-100">
                {shipment.status === 'RECEIVED' ? 'Umepokelewa' : shipment.status === 'IN_TRANSIT' ? 'Upo Njiani' : 'Umefika Kituoni'}
              </div>
            </div>

            {/* Hatua za Kusafiri (Timeline) */}
            <div className="relative flex justify-between items-center mb-12 mt-8 px-2 md:px-8">
              {/* Mstari wa nyuma */}
              <div className="absolute left-[10%] right-[10%] top-1/2 h-1 bg-gray-200 -z-10 -translate-y-1/2 rounded-full"></div>
              
              {/* Hatua ya 1 */}
              <div className="flex flex-col items-center gap-2 bg-white px-2">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 ${getStatusColor(shipment.status, 'RECEIVED')}`}>
                  <Package size={20} />
                </div>
                <p className="text-[10px] md:text-xs font-bold uppercase text-gray-600">Kituoni</p>
              </div>

              {/* Hatua ya 2 */}
              <div className="flex flex-col items-center gap-2 bg-white px-2">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 ${getStatusColor(shipment.status, 'IN_TRANSIT')}`}>
                  <Truck size={20} />
                </div>
                <p className="text-[10px] md:text-xs font-bold uppercase text-gray-600">Njiani</p>
              </div>

              {/* Hatua ya 3 */}
              <div className="flex flex-col items-center gap-2 bg-white px-2">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 ${getStatusColor(shipment.status, 'ARRIVED')}`}>
                  <CheckCircle size={20} />
                </div>
                <p className="text-[10px] md:text-xs font-bold uppercase text-gray-600">Umefika</p>
              </div>
            </div>

            {/* Taarifa za Ziada */}
            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 space-y-4">
              <div className="flex items-center gap-3">
                <MapPin className="text-gray-400" size={20} />
                <div className="flex-1 flex justify-between items-center text-sm font-bold uppercase">
                  <span>{shipment.originBranch.name}</span>
                  <ArrowRight className="text-red-300" size={16} />
                  <span>{shipment.destBranch.name}</span>
                </div>
              </div>
              <div className="h-px bg-gray-200 w-full"></div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Mpokeaji:</span>
                <span className="font-bold uppercase text-gray-900">{shipment.receiverName}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500 font-medium">Maelezo:</span>
                <span className="font-bold uppercase text-gray-900">{shipment.description}</span>
              </div>
            </div>

          </div>
        )}
      </div>
      
      {/* Kitufe cha Kurudi Mwanzo */}
      <Link href="/" className="mt-8 flex items-center gap-2 text-gray-500 hover:text-red-600 font-bold transition-colors">
        <Home size={18} /> Rudi Mwanzo
      </Link>
    </div>
  );
}