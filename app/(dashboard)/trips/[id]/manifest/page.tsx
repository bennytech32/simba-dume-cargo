import React from 'react';
import prisma from '../../../../../lib/prisma';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import PrintBtn from './PrintBtn'; 

export const dynamic = 'force-dynamic';

export default async function ManifestPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const tripId = resolvedParams.id;
  
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    include: {
      shipments: {
        orderBy: { createdAt: 'asc' } 
      }
    }
  });

  if (!trip) {
    notFound();
  }

  const totalShipments = trip.shipments.length;
  const totalWeight = trip.shipments.reduce((sum, item) => sum + (item.weight || 0), 0);

  return (
    <div className="min-h-screen bg-gray-100 py-10 print:bg-white print:py-0">
      
      <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center print:hidden">
        <Link href="/trips" className="flex items-center gap-2 px-4 py-2 bg-white text-gray-600 font-bold rounded-lg hover:bg-gray-50 border border-gray-200 transition-colors shadow-sm">
          <ArrowLeft size={18} /> Rudi Kwenye Safari
        </Link>
        <PrintBtn />
      </div>

      <div className="max-w-4xl mx-auto bg-white p-10 border border-gray-300 shadow-xl print:shadow-none print:border-none print:w-full print:max-w-full print:p-0">
        
        <div className="text-center mb-8 border-b-4 border-black pb-6">
          <h1 className="text-4xl font-black uppercase tracking-widest text-black mb-2">SIMBA DUME CARGO</h1>
          <h2 className="text-xl font-bold uppercase tracking-widest text-gray-700">Manifest ya Safari</h2>
        </div>

        <div className="grid grid-cols-2 gap-8 mb-8 text-black">
          <div className="space-y-3">
            <p className="text-sm font-black text-gray-500 uppercase tracking-wider underline">Taarifa za Safari</p>
            <p className="text-base"><span className="font-bold">Tarehe:</span> {new Date(trip.createdAt).toLocaleDateString('sw-TZ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p className="text-base"><span className="font-bold">Njia:</span> <span className="uppercase font-bold">{trip.originBranchName} ➔ {trip.destinationBranchName}</span></p>
            <p className="text-base"><span className="font-bold">Hali:</span> <span className="uppercase font-bold">{trip.status === 'IN_TRANSIT' ? 'IPO NJIANI' : trip.status === 'ARRIVED' ? 'IMEFIKA' : 'INASUBIRI'}</span></p>
          </div>
          <div className="space-y-3">
            <p className="text-sm font-black text-gray-500 uppercase tracking-wider underline">Taarifa za Gari</p>
            <p className="text-base"><span className="font-bold">Namba ya Gari:</span> <span className="uppercase text-xl font-black border-2 border-black px-3 py-1 ml-2 inline-block">{trip.vehiclePlate}</span></p>
            <p className="text-base"><span className="font-bold">Dereva:</span> <span className="uppercase">{trip.driverName || "Imesajiliwa Kwenye Gari"}</span></p>
          </div>
        </div>

        <div className="flex justify-between items-center bg-gray-100 print:bg-transparent print:border-y-2 print:border-black p-4 rounded-lg mb-6 border border-gray-200">
          <p className="font-black text-lg">Jumla ya Mizigo: <span className="text-2xl">{totalShipments}</span></p>
          {totalWeight > 0 && <p className="font-black text-lg">Jumla ya Uzito: <span className="text-2xl">{totalWeight} Kg</span></p>}
        </div>

        <table className="w-full text-left border-collapse mb-10 text-black">
          <thead>
            <tr className="bg-gray-100 print:bg-transparent border-y-2 border-black text-sm uppercase tracking-wider">
              <th className="p-3 border-r border-black font-black w-10 text-center">#</th>
              <th className="p-3 border-r border-black font-black">Namba ya Mzigo</th>
              <th className="p-3 border-r border-black font-black">Kutoka (Mtumaji)</th>
              <th className="p-3 border-r border-black font-black">Kwenda (Mpokeaji)</th>
              <th className="p-3 border-r border-black font-black">Maelezo</th>
              <th className="p-3 font-black text-center w-24">Sahihi</th>
            </tr>
          </thead>
          <tbody>
            {trip.shipments.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500 font-bold border-b border-black">
                  Hakuna mizigo iliyopakiwa kwenye gari hili.
                </td>
              </tr>
            ) : (
              trip.shipments.map((shipment, index) => (
                <tr key={shipment.id} className="text-sm border-b border-gray-400 print:border-black">
                  <td className="p-3 border-r border-gray-400 print:border-black font-bold text-center">{index + 1}</td>
                  <td className="p-3 border-r border-gray-400 print:border-black font-black text-base">{shipment.trackingNumber}</td>
                  <td className="p-3 border-r border-gray-400 print:border-black">
                    <p className="font-bold uppercase">{shipment.senderName}</p>
                    <p className="text-xs">{shipment.senderPhone}</p>
                  </td>
                  <td className="p-3 border-r border-gray-400 print:border-black">
                    <p className="font-bold uppercase">{shipment.receiverName}</p>
                    <p className="text-xs">{shipment.receiverPhone}</p>
                  </td>
                  <td className="p-3 border-r border-gray-400 print:border-black uppercase text-xs font-bold">
                    {shipment.description}
                  </td>
                  {/* HAPA NDIPO TULIPOREKEBISHA - Tumeingiza comment NDANI ya <td> */}
                  <td className="p-3">{/* Nafasi ya kusaini mzigo ukifika */}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="grid grid-cols-2 gap-20 mt-20 text-center text-black">
          <div>
            <div className="border-b-2 border-black mb-2"></div>
            <p className="font-bold uppercase text-sm">Sahihi ya Ofisi</p>
            <p className="text-xs italic">(Kituo Kinapotoka)</p>
          </div>
          <div>
            <div className="border-b-2 border-black mb-2"></div>
            <p className="font-bold uppercase text-sm">Sahihi ya Dereva</p>
            <p className="text-xs italic">(Amepokea Mizigo Sahihi)</p>
          </div>
        </div>

        <div className="mt-16 text-center text-xs font-bold text-gray-500 print:text-black italic">
          Karatasi hii ni mali ya Simba Dume Cargo. Imechapishwa na Mfumo.
        </div>

      </div>
    </div>
  );
}