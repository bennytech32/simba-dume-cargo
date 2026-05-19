import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Truck, ArrowLeft, Save } from 'lucide-react';
import prisma from '../../../../../lib/prisma';
import { updateTrip } from '../../../../actions/trip';

export const dynamic = 'force-dynamic';

export default async function EditTripPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const tripId = resolvedParams.id;

  // Vuta taarifa za hii safari
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    include: { originBranch: true, destBranch: true }
  });

  if (!trip) {
    notFound();
  }

  // Vuta magari yote (yale yaliyo Available pamoja na hili la sasa hivi)
  const vehicles = await prisma.vehicle.findMany({
    where: {
      OR: [
        { status: 'AVAILABLE' },
        { plateNumber: trip.vehiclePlate }
      ]
    },
    orderBy: { plateNumber: 'asc' }
  });

  const branches = await prisma.branch.findMany({
    orderBy: { name: 'asc' }
  });

  return (
    <div className="max-w-3xl mx-auto pb-10 px-4 md:px-0">
      
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <Truck className="text-red-600" size={28} /> Hariri Safari: {trip.tripNumber}
          </h1>
          <p className="text-gray-500 font-medium mt-1">Badilisha gari, dereva, vituo au hali ya safari hii.</p>
        </div>
        <Link href="/trips" className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 font-medium shadow-sm">
          <ArrowLeft size={18} /> Rudi
        </Link>
      </div>

      <form action={updateTrip} className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
        {/* ID YA SIRI */}
        <input type="hidden" name="id" value={trip.id} />

        {/* CHAGUA GARI */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Gari Litakalosafiri *</label>
          <select 
            name="vehiclePlate" 
            defaultValue={trip.vehiclePlate}
            required 
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-600 outline-none bg-white font-bold"
          >
            {vehicles.map((v) => (
              <option key={v.id} value={v.plateNumber}>
                {v.plateNumber} - Dereva: {v.driverName}
              </option>
            ))}
          </select>
          {/* Sahihi ya dereva wa sasa hivi */}
          <input type="hidden" name="driverName" value={trip.driverName || "Kutoka Kwenye Gari"} />
        </div>

        {/* VITUO */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Kituo Linapotoka *</label>
            <select 
              name="originBranchName" 
              defaultValue={trip.originBranch?.name || ""}
              required 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-600 outline-none bg-white"
            >
              {branches.map(b => (
                <option key={b.id} value={b.name}>{b.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Kituo Linapoenda *</label>
            <select 
              name="destinationBranchName" 
              defaultValue={trip.destBranch?.name || ""}
              required 
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-600 outline-none bg-white"
            >
              {branches.map(b => (
                <option key={b.id} value={b.name}>{b.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* HALI YA SAFARI (STATUS) */}
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Hali ya Safari (Status) *</label>
          <select 
            name="status" 
            defaultValue={trip.status}
            required 
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-600 outline-none bg-white font-bold text-red-600 uppercase"
          >
            <option value="IN_TRANSIT">IPO NJIANI (IN TRANSIT)</option>
            <option value="ARRIVED">IMEFIKA KITUONI (ARRIVED)</option>
          </select>
          <p className="text-xs text-gray-400 mt-1 italic">Ukichagua 'IMEFIKA KITUONI', Gari litarudi kuwa huru na mizigo yote ya safari hii itabadilika kuwa imefika.</p>
        </div>

        {/* KITUFE CHA KUSAVE */}
        <div className="flex justify-end pt-4 border-t border-gray-100">
          <button 
            type="submit" 
            className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white font-black rounded-xl hover:bg-red-700 transition-all shadow-md shadow-red-600/20 cursor-pointer"
          >
            <Save size={18} /> Hifadhi Marekebisho
          </button>
        </div>

      </form>
    </div>
  );
}