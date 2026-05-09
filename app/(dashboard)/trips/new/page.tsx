import React from 'react';
import Link from 'next/link';
import { Truck, MapPin, ArrowLeft, Save, User, Route } from 'lucide-react';

// ✅ HAPA NDIPO TULIPOREKEBISHA NJIA ZISUMBUE VERCEL
import prisma from '../../../../lib/prisma';
import { createTrip } from '../../../../app/actions/trip';

export const dynamic = 'force-dynamic';

export default async function NewTripPage() {
  // 1. Vuta magari yote yaliyo HURU (AVAILABLE) kutoka kwenye Database
  const vehicles = await prisma.vehicle.findMany({
    where: { status: 'AVAILABLE' },
    orderBy: { createdAt: 'desc' }
  });

  // 2. Vuta matawi (Branches/Vituo) vyote kwa ajili ya kuchagua Njia
  const branches = await prisma.branch.findMany({
    orderBy: { name: 'asc' }
  });

  return (
    <div className="max-w-4xl mx-auto pb-10">
      
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <Route className="text-red-600" size={28} /> Anzisha Safari Mpya
          </h1>
          <p className="text-gray-500 font-medium mt-1">Pangia gari na dereva tayari kwa kuanza safari.</p>
        </div>
        <Link 
          href="/trips" 
          className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50 font-bold transition-all shadow-sm hover:shadow"
        >
          <ArrowLeft size={18} /> Rudi
        </Link>
      </div>

      {/* FOMU KUU (Server Action inatumika hapa) */}
      <form action={createTrip} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        
        {/* SEHEMU YA 1: GARI NA DEREVA */}
        <div className="p-6 md:p-8 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Truck className="text-red-600" size={20} /> Taarifa za Gari & Dereva
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Chagua Gari (Ambalo liko Huru) *</label>
              <select name="vehicleId" required className="w-full px-4 py-3.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-600 outline-none font-bold text-gray-800 bg-gray-50 hover:bg-white transition-colors">
                <option value="">-- Chagua Gari --</option>
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.plateNumber} - {v.type || 'Gari'} ({v.capacity || 'Uwezo haujajazwa'})
                  </option>
                ))}
              </select>
              {/* Onyo kama hakuna gari lililo huru */}
              {vehicles.length === 0 && (
                <p className="text-xs text-red-500 mt-2 font-bold flex items-center gap-1">
                  ⚠️ Hakuna gari lipo huru kwa sasa. Magari yote yapo Safarini au Matengenezo.
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Jina la Dereva *</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="text" 
                  name="driverName" 
                  required 
                  className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-600 outline-none font-medium placeholder-gray-400" 
                  placeholder="Mfano: Juma Shabani" 
                />
              </div>
            </div>
          </div>
        </div>

        {/* SEHEMU YA 2: NJIA (ROUTE) */}
        <div className="p-6 md:p-8 border-b border-gray-100 bg-gray-50/50">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <MapPin className="text-red-600" size={20} /> Njia ya Safari (Route)
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Kituo Kinapotoka (Origin) *</label>
              <select name="originBranchId" required className="w-full px-4 py-3.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-600 outline-none font-bold text-gray-800 bg-white">
                <option value="">-- Chagua Kituo --</option>
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Kituo Kinapoenda (Destination) *</label>
              <select name="destinationBranchId" required className="w-full px-4 py-3.5 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-600 outline-none font-bold text-gray-800 bg-white">
                <option value="">-- Chagua Kituo --</option>
                {branches.map((b) => (
                  <option key={b.id} value={b.id}>{b.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* VITUFE VYA KUSAVE */}
        <div className="bg-white p-6 md:p-8 flex items-center justify-end gap-4">
          <Link 
            href="/trips" 
            className="px-6 py-3 bg-gray-100 text-gray-700 font-bold rounded-xl hover:bg-gray-200 transition-colors"
          >
            Ghairi
          </Link>
          <button 
            type="submit" 
            className="flex items-center gap-2 px-8 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-600/30"
          >
            <Save size={20} /> Hifadhi & Anzisha Safari
          </button>
        </div>
        
      </form>
    </div>
  );
}