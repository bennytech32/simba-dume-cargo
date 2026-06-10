import React from 'react';
import Link from 'next/link';
import { Truck, ArrowLeft, Save } from 'lucide-react';

import prisma from '../../../../lib/prisma';
import { createTrip } from '../../../actions/trip'; 
import ShipmentPicker from './ShipmentPicker'; 

// LALIMISHA MFUMO USIKARIRI DATA ZA ZAMANI 🔥
export const revalidate = 0; 

export default async function NewTripPage() {
  // 1. VUTA MIZIGO YOTE AMBAYO HAINA GARI BILA KUJALI STATUS YAKE 🔥
  const shipmentsDb = await prisma.shipment.findMany({
    where: {
      tripId: null // Sharti pekee lililobaki: Mzigo uwe haupo kwenye gari lingine
    },
    include: { originBranch: true, destBranch: true },
    orderBy: { createdAt: 'desc' }
  });

  // 2. KUSAFISHA DATA (KUZUIA ERROR ZA DECIMAL)
  const availableShipments = shipmentsDb.map((shipment) => ({
    ...shipment,
    weight: shipment.weight ? Number(shipment.weight) : 0,
    price: shipment.price ? Number(shipment.price) : 0,
    declaredValue: (shipment as any).declaredValue ? Number((shipment as any).declaredValue) : 0,
    createdAt: shipment.createdAt.toISOString(),
    updatedAt: shipment.updatedAt.toISOString(),
  }));

  const vehicles = await prisma.vehicle.findMany({
    orderBy: { plateNumber: 'asc' }
  });
  
  const branches = await prisma.branch.findMany({
    orderBy: { name: 'asc' }
  });

  return (
    <div className="max-w-5xl mx-auto pb-10 px-4 md:px-0">
      
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <Truck className="text-red-600" size={28} /> Unda Safari Mpya
          </h1>
          <p className="text-gray-500 font-medium mt-1">Sajili gari na upakie mizigo iliyopangwa kitaalam kwa vituo.</p>
        </div>
        <Link href="/trips" className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 font-medium transition-colors shadow-sm">
          <ArrowLeft size={18} /> Rudi
        </Link>
      </div>

      <form action={createTrip} className="space-y-6">
        
        {/* TAARIFA ZA USAFIRI */}
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
            <Truck className="text-red-600" size={20} /> Taarifa za Usafiri (Gari)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">Chagua Gari (Namba na Dereva) *</label>
              <select name="vehiclePlate" required className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-600 outline-none bg-white font-bold text-gray-800">
                <option value="">-- Bofya kuchagua Gari --</option>
                {vehicles.map((v) => (
                  <option key={v.id} value={v.plateNumber}>
                    {v.plateNumber} - Dereva: {v.driverName}
                  </option>
                ))}
              </select>
              <input type="hidden" name="driverName" value="Kutoka Kwenye Gari" />
            </div>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Kituo Linapotoka *</label>
              <select name="originBranchName" required className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-600 outline-none bg-white">
                <option value="">-- Chagua Kituo --</option>
                {branches.map(branch => (
                  <option key={branch.id} value={branch.name}>{branch.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Kituo Linapoenda *</label>
              <select name="destinationBranchName" required className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-600 outline-none bg-white">
                <option value="">-- Chagua Kituo --</option>
                {branches.map(branch => (
                  <option key={branch.id} value={branch.name}>{branch.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* CHOMBO KIPYA CHA KUCHAGUA MIZIGO KILICHOJIPANGA KWA VITUO */}
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm">
          <ShipmentPicker availableShipments={availableShipments} />
        </div>

        {/* KITUFE CHA KUSAVE */}
        <div className="flex justify-end pt-4">
          <button type="submit" className="flex items-center gap-2 px-8 py-4 bg-red-600 text-white font-black rounded-xl hover:bg-red-700 transition-all shadow-xl shadow-red-600/30 w-full md:w-auto justify-center text-lg cursor-pointer">
            <Save size={24} /> Hifadhi na Anzisha Safari
          </button>
        </div>

      </form>
    </div>
  );
}