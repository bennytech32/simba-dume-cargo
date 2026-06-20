import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Truck, ArrowLeft, Save } from 'lucide-react';
import prisma from '../../../../../lib/prisma';
import { updateTrip } from '../../../../actions/trip';
import EditShipmentPicker from './EditShipmentPicker'; // Tume-import kile kifaa 🔥

export const dynamic = 'force-dynamic';
export const revalidate = 0; // Zuia Cache!

export default async function EditTripPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const tripId = resolvedParams.id;

  // 1. Vuta Safari na Mizigo YAKE YOTE iliyopo sasa hivi
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    include: { 
      originBranch: true, 
      destBranch: true,
      shipments: { include: { originBranch: true, destBranch: true } }
    }
  });

  if (!trip) {
    notFound();
  }

  // 2. Vuta Mizigo MIPYA yote ambayo haina Gari
  const unassignedShipments = await prisma.shipment.findMany({
    where: { tripId: null },
    include: { originBranch: true, destBranch: true },
    orderBy: { createdAt: 'desc' }
  });

  // 3. Changanya Mizigo ya kwenye Gari na Mizigo Mipya, Kisha Safisha Data
  const allShipmentsDb = [...trip.shipments, ...unassignedShipments];
  const availableShipments = allShipmentsDb.map((shipment) => ({
    ...shipment,
    weight: shipment.weight ? Number(shipment.weight) : 0,
    price: shipment.price ? Number(shipment.price) : 0,
    declaredValue: (shipment as any).declaredValue ? Number((shipment as any).declaredValue) : 0,
    createdAt: shipment.createdAt.toISOString(),
    updatedAt: shipment.updatedAt.toISOString(),
  }));

  // Hizi ni ID za mizigo ambayo tayari ipo kwenye gari ili ianze ikiwa Ticked ✓
  const initialSelectedIds = trip.shipments.map(s => s.id);

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
    <div className="max-w-4xl mx-auto pb-10 px-4 md:px-0">
      
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
            <Truck className="text-red-600" size={28} /> Hariri Safari: {trip.tripNumber}
          </h1>
          <p className="text-gray-500 font-medium mt-1">Ongeza mizigo mipya, badilisha gari au hali ya safari.</p>
        </div>
        <Link href={`/trips/${tripId}/manifest`} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 font-medium shadow-sm">
          <ArrowLeft size={18} /> Rudi Kwenye Manifest
        </Link>
      </div>

      <form action={updateTrip} className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
        <input type="hidden" name="id" value={trip.id} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
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
            <input type="hidden" name="driverName" value={trip.driverName || "Kutoka Kwenye Gari"} />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Kituo Linapotoka *</label>
            <select name="originBranchName" defaultValue={trip.originBranch?.name || ""} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-600 outline-none bg-white">
              {branches.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Kituo Linapoenda *</label>
            <select name="destinationBranchName" defaultValue={trip.destBranch?.name || ""} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-600 outline-none bg-white">
              {branches.map(b => <option key={b.id} value={b.name}>{b.name}</option>)}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-2">Hali ya Safari (Status) *</label>
            <select name="status" defaultValue={trip.status} required className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-600 outline-none bg-white font-bold text-red-600 uppercase">
              <option value="IN_TRANSIT">IPO NJIANI (IN TRANSIT)</option>
              <option value="ARRIVED">IMEFIKA KITUONI (ARRIVED)</option>
            </select>
            <p className="text-xs text-gray-400 mt-1 italic">Ukichagua 'IMEFIKA KITUONI', Gari litarudi kuwa huru na mizigo itabadilika kuwa imefika.</p>
          </div>
        </div>

        {/* ==================================================== */}
        {/* KIFURUSHI CHA KUONGEZA MIZIGO MIPYA KINAINGIA HAPA 🔥 */}
        {/* ==================================================== */}
        <EditShipmentPicker 
          availableShipments={availableShipments} 
          initialSelectedIds={initialSelectedIds} 
        />

        <div className="flex justify-end pt-4 border-t border-gray-100">
          <button type="submit" className="flex items-center gap-2 px-8 py-4 bg-red-600 text-white font-black rounded-xl hover:bg-red-700 transition-all shadow-md shadow-red-600/20 cursor-pointer">
            <Save size={20} /> Hifadhi na Sasisha Safari
          </button>
        </div>

      </form>
    </div>
  );
}