import React from 'react';
import Link from 'next/link';
import { Truck, Plus, FileText, Trash2, ArrowRight, Calendar, Users, Edit2 } from 'lucide-react';
import prisma from '../../../lib/prisma';
import { deleteTrip } from '../../actions/trip';
import DeleteTripButton from './DeleteTripButton'; 

export const dynamic = 'force-dynamic';

export default async function TripsPage() {
  // Vuta safari zote zikiambatana na mizigo yake PAMOJA na matawi yake (Relations)
  const trips = await prisma.trip.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      shipments: true,
      originBranch: true, // Hakikisha tunavuta data za kituo kinapotoka
      destBranch: true,   // Hakikisha tunavuta data za kituo kinapoenda
    }
  });

  return (
    <div className="max-w-7xl mx-auto pb-10 px-4 md:px-0">
      
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <Truck className="text-red-600" size={28} /> Orodha ya Safari
          </h1>
          <p className="text-gray-500 font-medium mt-1">Simamia safari za magari, badili hali ya gari kuwa njiani, na tazama manifest.</p>
        </div>
        <Link href="/trips/new" className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors shadow-lg shadow-red-200 cursor-pointer">
          <Plus size={20} /> Unda Safari Mpya
        </Link>
      </div>

      {/* TABLE YA SAFARI */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left min-w-[1050px]">
            <thead className="bg-gray-900 text-white text-[11px] uppercase tracking-widest font-bold">
              <tr>
                <th className="px-6 py-5 whitespace-nowrap">Tarehe</th>
                <th className="px-6 py-5 whitespace-nowrap">Njia (Route)</th>
                <th className="px-6 py-5 whitespace-nowrap">Gari & Dereva</th>
                <th className="px-6 py-5 whitespace-nowrap text-center">Mizigo</th>
                <th className="px-6 py-5 whitespace-nowrap text-center">Hali (Status)</th>
                <th className="px-6 py-5 whitespace-nowrap text-right">Vitendo</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {trips.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-16 text-center">
                    <Truck size={48} className="mx-auto text-gray-300 mb-4" />
                    <p className="text-gray-500 font-medium text-lg">Hakuna safari yoyote iliyosajiliwa kwa sasa.</p>
                  </td>
                </tr>
              ) : (
                trips.map((trip) => (
                  <tr key={trip.id} className="hover:bg-red-50/30 transition-colors">
                    
                    {/* TAREHE */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-gray-600 font-bold text-sm">
                        <Calendar size={16} className="text-gray-400" />
                        {new Date(trip.createdAt).toLocaleDateString('sw-TZ', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </td>
                    
                    {/* NJIA (TUMEREKEBISHA KUSOMA KUTOKA KWENYE MAHUSIANO YA BRANCH) */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2 font-bold text-gray-800 text-sm uppercase">
                        {trip.originBranch?.name || "Ofisini"} 
                        <ArrowRight size={14} className="text-red-500" /> 
                        {trip.destBranch?.name || "Kituoni"}
                      </div>
                    </td>

                    {/* GARI NA DEREVA */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <p className="font-black text-gray-900 text-sm uppercase tracking-wider">{trip.vehiclePlate}</p>
                      <p className="text-xs text-gray-500 font-medium flex items-center gap-1 mt-1">
                        <Users size={12} /> {trip.driverName || 'Dereva wa Gari'}
                      </p>
                    </td>

                    {/* IDADI YA MIZIGO */}
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className="bg-gray-100 text-gray-800 font-black px-3 py-1 rounded-lg text-sm">
                        {trip.shipments.length}
                      </span>
                    </td>
                    
                    {/* HALI YA SAFARI (STATUS) */}
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <span className={`text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-wider ${
                        trip.status === 'ARRIVED' ? 'bg-emerald-100 text-emerald-700' :
                        trip.status === 'IN_TRANSIT' ? 'bg-amber-100 text-amber-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {trip.status === 'ARRIVED' ? 'IMEFIKA' : trip.status === 'IN_TRANSIT' ? 'IPO NJIANI' : 'INASUBIRI'}
                      </span>
                    </td>
                    
                    {/* VITENDO (MANIFEST, HARIRI, NA DELETE) */}
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        
                        {/* KITUFE CHA MANIFEST */}
                        <Link href={`/trips/${trip.id}/manifest`} className="px-3 py-2 bg-gray-100 text-gray-700 hover:text-white hover:bg-gray-900 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-bold shadow-sm cursor-pointer">
                          <FileText size={15} /> Manifest
                        </Link>

                        {/* KITUFE KIPYA CHA HARIRI (EDIT) 🔥 */}
                        <Link href={`/trips/${trip.id}/edit`} className="px-3 py-2 bg-white text-blue-600 hover:text-white hover:bg-blue-600 border border-blue-200 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-bold shadow-sm cursor-pointer">
                          <Edit2 size={15} /> Hariri
                        </Link>

                        {/* FOMU YA KUFUTA SAFARI (Kitufe kipo salama kama Client Component) */}
                        <form action={deleteTrip}>
                          <input type="hidden" name="id" value={trip.id} />
                          <DeleteTripButton /> 
                        </form>

                      </div>
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