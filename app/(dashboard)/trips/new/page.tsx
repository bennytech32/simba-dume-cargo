import React from 'react';
import Link from 'next/link';
import { Truck, User, MapPin, ArrowLeft, Save, Package } from 'lucide-react';

// NJIA ZIMEREKEBISHWA KULINGANA NA ENEO HILI (Faili la nje) 👇🏾
import prisma from '../../../lib/prisma';
import { createTrip } from '../../actions/trip'; 

export const dynamic = 'force-dynamic';

export default async function NewTripPage() {
  // Tunavuta mizigo yote ambayo IMEPOKELEWA tu lakini BADO haijapakiwa kwenye gari lolote
  const availableShipments = await prisma.shipment.findMany({
    where: {
      status: 'RECEIVED',
      tripId: null, // Haina safari
    },
    include: { originBranch: true, destBranch: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="max-w-5xl mx-auto pb-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <Truck className="text-red-600" size={28} /> Unda Safari Mpya
          </h1>
          <p className="text-gray-500 font-medium mt-1">Sajili gari na upakie mizigo inayosubiri kusafirishwa.</p>
        </div>
        <Link href="/trips" className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 font-medium transition-colors shadow-sm">
          <ArrowLeft size={18} /> Rudi
        </Link>
      </div>

      <form action={createTrip} className="space-y-6">
        
        {/* TAARIFA ZA GARI NA DEREVA */}
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2 border-b border-gray-100 pb-4">
            <User className="text-red-600" size={20} /> Taarifa za Usafiri
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Jina la Dereva</label>
              <input type="text" name="driverName" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-600 outline-none" placeholder="Mfano: Juma Shabani" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Namba ya Gari (Plate Number)</label>
              <input type="text" name="vehiclePlate" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-600 outline-none uppercase font-bold" placeholder="T 123 ABC" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Kituo Linapotoka</label>
              <select name="originBranchName" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-600 outline-none bg-white">
                <option value="">-- Chagua Kituo --</option>
                <option value="Dar es Salaam">Dar es Salaam</option>
                <option value="Mkata">Mkata</option>
                <option value="Handeni">Handeni</option>
                <option value="Mabalanga">Mabalanga</option>
                <option value="Kwinji">Kwinji</option>
                <option value="Kwediboma">Kwediboma</option>
                <option value="Kibirashi">Kibirashi</option>
                <option value="Mafisa">Mafisa</option>
                <option value="Songe">Songe</option>
                <option value="Lengatei">Lengatei</option>
                <option value="Kijungu">Kijungu</option>
                <option value="Pori namba 01">Pori namba 01</option>
                <option value="Kibaya kiteto">Kibaya kiteto</option>
                <option value="Njoro">Njoro</option>
                <option value="Mrijo">Mrijo</option>
                <option value="Mkoka">Mkoka</option>
                <option value="Dosidosi">Dosidosi</option>
                <option value="Ngusero">Ngusero</option>
                <option value="Matui">Matui</option>
                <option value="Gairo">Gairo</option>
                <option value="Dumila">Dumila</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Kituo Linapoenda</label>
              <select name="destinationBranchName" required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-600 outline-none bg-white">
                <option value="">-- Chagua Kituo --</option>
                <option value="Dar es Salaam">Dar es Salaam</option>
                <option value="Mkata">Mkata</option>
                <option value="Handeni">Handeni</option>
                <option value="Mabalanga">Mabalanga</option>
                <option value="Kwinji">Kwinji</option>
                <option value="Kwediboma">Kwediboma</option>
                <option value="Kibirashi">Kibirashi</option>
                <option value="Mafisa">Mafisa</option>
                <option value="Songe">Songe</option>
                <option value="Lengatei">Lengatei</option>
                <option value="Kijungu">Kijungu</option>
                <option value="Pori namba 01">Pori namba 01</option>
                <option value="Kibaya kiteto">Kibaya kiteto</option>
                <option value="Njoro">Njoro</option>
                <option value="Mrijo">Mrijo</option>
                <option value="Mkoka">Mkoka</option>
                <option value="Dosidosi">Dosidosi</option>
                <option value="Ngusero">Ngusero</option>
                <option value="Matui">Matui</option>
                <option value="Gairo">Gairo</option>
                <option value="Dumila">Dumila</option>
              </select>
            </div>
          </div>
        </div>

        {/* ORDOHA YA MIZIGO INAYOSUBIRI KUPAKIWA */}
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center justify-between border-b border-gray-100 pb-4">
            <span className="flex items-center gap-2"><Package className="text-red-600" size={20} /> Pakia Mizigo</span>
            <span className="text-sm font-medium bg-red-100 text-red-700 px-3 py-1 rounded-full">
              {availableShipments.length} Inasubiri
            </span>
          </h2>
          
          {availableShipments.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
              <Package size={40} className="mx-auto text-gray-300 mb-3" />
              <p className="text-gray-500 font-medium">Hakuna mizigo mipya inayopaswa kusafirishwa kwa sasa.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableShipments.map((shipment) => (
                <label key={shipment.id} className="flex items-start gap-4 p-4 border border-gray-200 rounded-xl hover:border-red-400 hover:bg-red-50/30 cursor-pointer transition-colors has-[:checked]:border-red-600 has-[:checked]:bg-red-50">
                  <div className="mt-1">
                    <input 
                      type="checkbox" 
                      name="shipmentIds" 
                      value={shipment.id} 
                      className="w-5 h-5 accent-red-600 cursor-pointer"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-black text-gray-900 text-sm">{shipment.trackingNumber}</span>
                      <span className="text-[10px] font-bold uppercase bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                        {shipment.originBranch.name} ➔ {shipment.destBranch.name}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600"><span className="font-bold">Kutoka:</span> {shipment.senderName}</p>
                    <p className="text-xs text-gray-600"><span className="font-bold">Mzigo:</span> {shipment.description}</p>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* KITUFE CHA KUSAVE */}
        <div className="flex justify-end pt-4">
          <button type="submit" className="flex items-center gap-2 px-8 py-4 bg-red-600 text-white font-black rounded-xl hover:bg-red-700 transition-all shadow-xl shadow-red-600/30 w-full md:w-auto justify-center text-lg">
            <Save size={24} /> Hifadhi na Anzisha Safari
          </button>
        </div>

      </form>
    </div>
  );
}