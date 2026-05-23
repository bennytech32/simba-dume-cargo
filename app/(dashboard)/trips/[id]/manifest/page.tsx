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
  
  // Vuta safari husika pamoja na mizigo yake 
  const trip = await prisma.trip.findUnique({
    where: { id: tripId },
    include: {
      originBranch: true,
      destBranch: true,
      shipments: {
        orderBy: { createdAt: 'asc' },
        include: { destBranch: true } 
      }
    }
  });

  if (!trip) {
    notFound();
  }

  // MAHSABU (CALCULATIONS) 🔥
  const totalShipments = trip.shipments.length;
  const totalWeight = trip.shipments.reduce((sum, item) => sum + Number(item.weight || 0), 0);
  const totalPrice = trip.shipments.reduce((sum, item) => sum + Number(item.price || 0), 0);

  return (
    <div className="min-h-screen bg-gray-100 py-10 print:bg-white print:py-0">
      
      {/* VITUFE VYA JUU (Havitaonekana kwenye karatasi ukiprint) */}
      <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center print:hidden">
        <Link href="/trips" className="flex items-center gap-2 px-4 py-2 bg-white text-gray-600 font-bold rounded-lg hover:bg-gray-50 border border-gray-200 transition-colors shadow-sm">
          <ArrowLeft size={18} /> Rudi Kwenye Safari
        </Link>
        <PrintBtn />
      </div>

      {/* KARATASI YA MANIFEST (Hii ndiyo itakayoprintiwa) */}
      <div className="max-w-4xl mx-auto bg-white p-10 border border-gray-300 shadow-xl print:shadow-none print:border-none print:w-full print:max-w-full print:p-0">
        
        {/* Kichwa cha Manifest */}
        <div className="text-center mb-8 border-b-4 border-black pb-6">
          <h1 className="text-4xl font-black uppercase tracking-widest text-black mb-2">SIMBA DUME CARGO</h1>
          <h2 className="text-xl font-bold uppercase tracking-widest text-gray-700">Manifest ya Safari</h2>
        </div>

        {/* Taarifa za Safari na Gari */}
        <div className="grid grid-cols-2 gap-8 mb-6 text-black">
          <div className="space-y-3">
            <p className="text-sm font-black text-gray-500 uppercase tracking-wider underline">Taarifa za Safari</p>
            <p className="text-base"><span className="font-bold">Tarehe:</span> {new Date(trip.createdAt).toLocaleDateString('sw-TZ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            <p className="text-base"><span className="font-bold">Njia:</span> <span className="uppercase font-bold">{trip.originBranch?.name || trip.originBranchName} ➔ {trip.destBranch?.name || trip.destinationBranchName}</span></p>
            <p className="text-base"><span className="font-bold">Hali:</span> <span className="uppercase font-bold">{trip.status === 'IN_TRANSIT' ? 'IPO NJIANI' : trip.status === 'ARRIVED' ? 'IMEFIKA' : 'INASUBIRI'}</span></p>
          </div>
          <div className="space-y-3">
            <p className="text-sm font-black text-gray-500 uppercase tracking-wider underline">Taarifa za Gari</p>
            <p className="text-base"><span className="font-bold">Namba ya Gari:</span> <span className="uppercase text-xl font-black border-2 border-black px-3 py-1 ml-2 inline-block">{trip.vehiclePlate}</span></p>
            
            {/* TUMEWEKA NAFASI WAZI YA KUJAZA KWA PENI 🔥 */}
            <p className="text-base flex items-end gap-2 mt-2">
              <span className="font-bold">Dereva:</span> 
              <span className="inline-block border-b-2 border-black border-dashed w-56"></span>
            </p>
          </div>
        </div>

        {/* MUHTASARI */}
        <div className="flex justify-between items-center bg-gray-100 print:bg-transparent print:border-y-2 print:border-black p-4 rounded-lg mb-6 border border-gray-200">
          <p className="font-black text-lg">Mizigo: <span className="text-2xl">{totalShipments}</span></p>
          {totalWeight > 0 && <p className="font-black text-lg">Uzito: <span className="text-2xl">{totalWeight} Kg</span></p>}
          <p className="font-black text-lg text-black">
            Jumla ya Gharama: <span className="text-2xl ml-2">TZS {totalPrice.toLocaleString()}</span>
          </p>
        </div>

        {/* JEDWALI LA ORODHA YA MIZIGO */}
        <table className="w-full text-left border-collapse mb-10 text-black">
          <thead>
            <tr className="bg-gray-100 print:bg-transparent border-y-2 border-black text-[11px] uppercase tracking-wider">
              <th className="p-2 border-r border-black font-black w-8 text-center">#</th>
              <th className="p-2 border-r border-black font-black">Namba</th>
              <th className="p-2 border-r border-black font-black">Mtumaji</th>
              <th className="p-2 border-r border-black font-black">Mpokeaji</th>
              <th className="p-2 border-r border-black font-black">Unakoenda</th>
              <th className="p-2 border-r border-black font-black">Aina / Maelezo</th>
              <th className="p-2 border-r border-black font-black text-right">Gharama (TZS)</th>
              <th className="p-2 font-black text-center w-16">Amepokea</th>
            </tr>
          </thead>
          <tbody>
            {trip.shipments.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-gray-500 font-bold border-b border-black">
                  Hakuna mizigo iliyopakiwa kwenye gari hili.
                </td>
              </tr>
            ) : (
              trip.shipments.map((shipment, index) => (
                <tr key={shipment.id} className="text-xs border-b border-gray-400 print:border-black">
                  <td className="p-2 border-r border-gray-400 print:border-black font-bold text-center">{index + 1}</td>
                  <td className="p-2 border-r border-gray-400 print:border-black font-black text-sm">{shipment.trackingNumber}</td>
                  
                  {/* Mtumaji na Namba Yake */}
                  <td className="p-2 border-r border-gray-400 print:border-black">
                    <p className="font-bold uppercase">{shipment.senderName}</p>
                    <p className="text-[10px]">{shipment.senderPhone}</p>
                  </td>

                  {/* Mpokeaji na Namba Yake */}
                  <td className="p-2 border-r border-gray-400 print:border-black">
                    <p className="font-bold uppercase">{shipment.receiverName}</p>
                    <p className="text-[10px]">{shipment.receiverPhone}</p>
                  </td>
                  
                  {/* Kituo Unakoenda Mzigo */}
                  <td className="p-2 border-r border-gray-400 print:border-black uppercase font-bold">
                    {shipment.destBranch?.name || "N/A"}
                  </td>
                  
                  {/* Aina / Maelezo */}
                  <td className="p-2 border-r border-gray-400 print:border-black uppercase font-bold">
                    {shipment.description}
                  </td>
                  
                  {/* Gharama Iliyochajiwa */}
                  <td className="p-2 border-r border-gray-400 print:border-black text-right font-black text-sm">
                    {Number(shipment.price || 0).toLocaleString()}
                  </td>
                  
                  {/* Boksi la Kutiki ✓ (Amepokea) */}
                  <td className="p-2 text-center align-middle">
                    <div className="w-5 h-5 border-2 border-black mx-auto print:border-black"></div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Sehemu ya Kusainiwa na Ofisi/Dereva */}
        <div className="grid grid-cols-2 gap-20 mt-20 text-center text-black">
          <div>
            <div className="border-b-2 border-black mb-2"></div>
            <p className="font-bold uppercase text-sm">Sahihi ya Ofisi</p>
            <p className="text-xs italic">(Kituo Kinapotoka)</p>
          </div>
          <div>
            <div className="border-b-2 border-black mb-2"></div>
            <p className="font-bold uppercase text-sm">Sahihi ya Dereva / Ulinzi</p>
            <p className="text-xs italic">(Amepokea Mizigo Sahihi)</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-[10px] font-bold text-gray-500 print:text-black italic">
          Karatasi hii ni mali ya Simba Dume Cargo. Imechapishwa na Mfumo kwenye Tarehe: {new Date().toLocaleString('sw-TZ')}
        </div>

      </div>
    </div>
  );
}