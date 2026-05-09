import React from 'react';
import Link from 'next/link';
import { Car, Plus, Search, Wrench, CheckCircle, Navigation, Truck } from 'lucide-react';
// 👇🏾 Tumevuta Prisma kutoka kwenye lib
import prisma from '../../../lib/prisma'; 

export const dynamic = 'force-dynamic';

export default async function VehiclesPage() {
  
  // 👇🏾 HAPA TUNAVUTA MAGARI HALISI KUTOKA KWENYE DATABASE YAKO
  const vehicles = await prisma.vehicle.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="max-w-7xl mx-auto pb-10">
      
      {/* HEADER NA BUTTON YA KUONGEZA GARI */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <Car className="text-red-600" size={28} /> Usimamizi wa Magari
          </h1>
          <p className="text-gray-500 font-medium mt-1">Fuatilia hali ya magari yako yote (Safarini, Yaliyopaki, au Matengenezo).</p>
        </div>
        
        {/* Liki inakupeleka kwenye fomu ya kusajili gari */}
        <Link 
          href="/vehicles/new" 
          className="flex items-center gap-2 px-5 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-600/30"
        >
          <Plus size={20} /> Sajili Gari Jipya
        </Link>
      </div>

      {/* VADI ZAKO ZA HARAKA (STATS CARDS) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-600">
            <Truck size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500">Jumla ya Magari</p>
            <h3 className="text-2xl font-black text-gray-900">{vehicles.length}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500">Yaliyopaki (Huru)</p>
            <h3 className="text-2xl font-black text-gray-900">
              {vehicles.filter(v => v.status === 'AVAILABLE').length}
            </h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
            <Navigation size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500">Yaliyo Safarini</p>
            <h3 className="text-2xl font-black text-gray-900">
              {vehicles.filter(v => v.status === 'ON_TRIP').length}
            </h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600">
            <Wrench size={24} />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500">Kwenye Matengenezo</p>
            <h3 className="text-2xl font-black text-gray-900">
              {vehicles.filter(v => v.status === 'MAINTENANCE').length}
            </h3>
          </div>
        </div>
      </div>

      {/* JEDWALI LA MAGARI (VEHICLES TABLE) */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h2 className="font-bold text-gray-800">Orodha ya Magari (Fleet)</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Tafuta namba ya gari..." 
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-600 w-64"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-gray-100 text-sm">
                <th className="p-4 font-bold text-gray-600">Namba (Plate Number)</th>
                <th className="p-4 font-bold text-gray-600">Aina ya Gari</th>
                <th className="p-4 font-bold text-gray-600">Uwezo (Capacity)</th>
                <th className="p-4 font-bold text-gray-600">Dereva wa Sasa</th>
                <th className="p-4 font-bold text-gray-600">Hali (Status)</th>
                <th className="p-4 font-bold text-gray-600 text-right">Vitendo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {vehicles.map((vehicle) => (
                <tr key={vehicle.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-4">
                    <span className="font-black text-gray-900 px-3 py-1 bg-gray-100 rounded-lg border border-gray-200 uppercase tracking-wider">
                      {vehicle.plateNumber}
                    </span>
                  </td>
                  <td className="p-4 font-medium text-gray-700">{vehicle.type || 'Haikujazwa'}</td>
                  <td className="p-4 text-gray-600">{vehicle.capacity || 'Haikujazwa'}</td>
                  <td className="p-4 text-gray-600 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold text-gray-600">
                      {vehicle.currentDriver ? vehicle.currentDriver.charAt(0).toUpperCase() : '?'}
                    </div>
                    {vehicle.currentDriver || 'Hajapangiwa'}
                  </td>
                  <td className="p-4">
                    {/* LOGIC YA RANGI KULINGANA NA HALI YA GARI (KUTOKA DATABASE) */}
                    {vehicle.status === 'AVAILABLE' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">
                        <CheckCircle size={14} /> Huru (Imepaki)
                      </span>
                    )}
                    {vehicle.status === 'ON_TRIP' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                        <Navigation size={14} /> Safarini
                      </span>
                    )}
                    {vehicle.status === 'MAINTENANCE' && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full">
                        <Wrench size={14} /> Gereji
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-red-600 hover:text-red-800 font-bold text-sm px-3 py-1.5 bg-red-50 rounded-lg transition-colors">
                      Hariri
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {vehicles.length === 0 && (
            <div className="p-10 text-center text-gray-500">
              <Car size={48} className="mx-auto mb-3 text-gray-300" />
              <p>Hakuna magari yaliyosajiliwa bado kwenye mfumo.</p>
              <Link 
                href="/vehicles/new"
                className="mt-4 inline-block px-4 py-2 bg-red-50 text-red-600 font-bold rounded-lg border border-red-200"
              >
                Sajili Gari Lako la Kwanza
              </Link>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}