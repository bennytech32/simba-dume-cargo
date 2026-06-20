import React from 'react';
import prisma from '../../../../../lib/prisma';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import PrintBtn from './PrintBtn'; 

// Tunazuia cache ili Manifest isomeke upya kila wakati
export const revalidate = 0; 

export default async function ManifestPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const tripId = resolvedParams.id;
  
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

  let actualDriverName = trip.driverName;
  if (actualDriverName === "Kutoka Kwenye Gari" || !actualDriverName) {
    const vehicle = await prisma.vehicle.findUnique({ where: { plateNumber: trip.vehiclePlate } });
    actualDriverName = vehicle?.driverName || "Dereva Haijajulikana";
  }

  // MAHSABU YA JUMLA (CALCULATIONS)
  const totalShipmentsCount = trip.shipments.length;
  const totalWeight = trip.shipments.reduce((sum, item) => sum + Number(item.weight || 0), 0);
  const totalPrice = trip.shipments.reduce((sum, item) => sum + Number(item.price || 0), 0);

  // ==========================================
  // ALGORITHM YA KU-GROUP NA KUSORT KIALFABETI 🔥
  // ==========================================
  const groupedMap = new Map();

  trip.shipments.forEach(shipment => {
    // Tunatumia Jina la mpokeaji na Simu kama kitambulisho cha Ku-group
    const key = `${shipment.receiverName.trim().toUpperCase()}_${shipment.receiverPhone.trim()}`;

    if (!groupedMap.has(key)) {
      groupedMap.set(key, {
        id: shipment.id, // Tunatumia ID ya mzigo wa kwanza kama Key ya React
        receiverName: shipment.receiverName,
        receiverPhone: shipment.receiverPhone,
        destBranchName: shipment.destBranch?.name || "N/A",
        trackingNumbers: [shipment.trackingNumber],
        descriptions: [shipment.description],
        totalPrice: Number(shipment.price || 0),
        statuses: [shipment.paymentStatus],
        count: 1
      });
    } else {
      const group = groupedMap.get(key);
      group.trackingNumbers.push(shipment.trackingNumber);
      group.descriptions.push(shipment.description);
      group.totalPrice += Number(shipment.price || 0);
      group.statuses.push(shipment.paymentStatus);
      group.count += 1;
    }
  });

  // Tugeuze Map iwe Array kisha tupange kwa Kialfabeti (A - Z)
  const groupedShipments = Array.from(groupedMap.values()).sort((a, b) => 
    a.receiverName.localeCompare(b.receiverName)
  );

  // Function ndogo ya kujua Status ya Malipo (Hasa kama mtu ana mzigo umelipiwa na ambao haujalipiwa)
  const getFinalPaymentStatus = (statuses: string[]) => {
    const allPaid = statuses.every(s => s === 'PAID');
    const allPending = statuses.every(s => s === 'PENDING');
    const allPOD = statuses.every(s => s === 'PAY_ON_DELIVERY');

    if (allPaid) return { text: 'PAID', color: 'text-emerald-600 print:text-black' };
    if (allPending) return { text: 'NOT PAID', color: 'text-red-600 print:text-black' };
    if (allPOD) return { text: 'PAY ON DELIVERY', color: 'text-amber-600 print:text-black' };
    
    // Kama kalipia baadhi na kudaiwa baadhi
    return { text: 'MIXED (KUNA DENI)', color: 'text-red-600 print:text-black font-black underline' };
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 print:bg-white print:py-0 px-4 md:px-0">
      
      {/* VITUFE VYA JUU */}
      <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center print:hidden">
        <Link href="/trips" className="flex items-center gap-2 px-4 py-2 bg-white text-gray-600 font-bold rounded-lg hover:bg-gray-50 border border-gray-200 transition-colors shadow-sm">
          <ArrowLeft size={18} /> Rudi Kwenye Safari
        </Link>
        <PrintBtn fileName={`${trip.vehiclePlate.replace(/\s+/g, '')}`} />
      </div>

      {/* KARATASI YA MANIFEST */}
      <div id="manifest-print-area" className="max-w-4xl mx-auto bg-white p-10 border border-gray-300 shadow-xl print:shadow-none print:border-none print:w-full print:max-w-full print:p-0">
        
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
            <p className="text-base flex items-end gap-2 mt-2">
              <span className="font-bold">Dereva:</span> 
              <span className="inline-block border-b-2 border-black border-dashed w-56"></span>
            </p>
          </div>
        </div>

        {/* MUHTASARI */}
        <div className="flex justify-between items-center bg-gray-100 print:bg-transparent print:border-y-2 print:border-black p-4 rounded-lg mb-6 border border-gray-200">
          <p className="font-black text-lg">Mizigo Yote: <span className="text-2xl">{totalShipmentsCount}</span></p>
          {totalWeight > 0 && <p className="font-black text-lg">Uzito: <span className="text-2xl">{totalWeight} Kg</span></p>}
          <p className="font-black text-lg text-black">
            Jumla ya Gharama: <span className="text-2xl ml-2">TZS {totalPrice.toLocaleString()}</span>
          </p>
        </div>

        {/* JEDWALI LA ORODHA YA MIZIGO (ILIYOPANGWA KIALFABETI NA KUGROUPIWA) */}
        <table className="w-full text-left border-collapse mb-10 text-black">
          <thead>
            <tr className="bg-gray-100 print:bg-transparent border-y-2 border-black text-[11px] uppercase tracking-wider">
              <th className="p-2 border-r border-black font-black w-8 text-center">#</th>
              <th className="p-2 border-r border-black font-black">Namba (Tracking)</th>
              <th className="p-2 border-r border-black font-black">Mpokeaji</th>
              <th className="p-2 border-r border-black font-black">Unakoenda</th>
              <th className="p-2 border-r border-black font-black">Aina / Maelezo</th>
              <th className="p-2 border-r border-black font-black text-right">Gharama</th>
              <th className="p-2 border-r border-black font-black text-center">Malipo</th>
              <th className="p-2 font-black text-center w-16">Amepokea</th>
            </tr>
          </thead>
          <tbody>
            {groupedShipments.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center text-gray-500 font-bold border-b border-black">
                  Hakuna mizigo iliyopakiwa kwenye gari hili.
                </td>
              </tr>
            ) : (
              groupedShipments.map((group, index) => {
                const finalStatus = getFinalPaymentStatus(group.statuses);

                return (
                  <tr key={group.id} className="text-xs border-b border-gray-400 print:border-black">
                    <td className="p-2 border-r border-gray-400 print:border-black font-bold text-center">{index + 1}</td>
                    
                    {/* NAMBA ZA MIZIGO YOTE YA HUYU MTU */}
                    <td className="p-2 border-r border-gray-400 print:border-black font-black text-[10px] leading-relaxed">
                      {group.trackingNumbers.join(', ')}
                    </td>
                    
                    {/* MPOKEAJI PAMOJA NA IDADI YA MIZIGO YAKE KAMA NI ZAIDI YA MMOJA 🔥 */}
                    <td className="p-2 border-r border-gray-400 print:border-black">
                      <p className="font-bold uppercase text-[13px]">
                        {group.receiverName} 
                        {group.count > 1 && (
                          <span className="ml-1 text-[9px] bg-black text-white px-1.5 py-0.5 rounded-full print:border print:border-black print:bg-transparent print:text-black">
                            ({group.count})
                          </span>
                        )}
                      </p>
                      <p className="text-[10px]">{group.receiverPhone}</p>
                    </td>
                    
                    <td className="p-2 border-r border-gray-400 print:border-black uppercase font-bold">
                      {group.destBranchName}
                    </td>
                    
                    {/* MAELEZO YOTE YAMEUNGANISHWA */}
                    <td className="p-2 border-r border-gray-400 print:border-black uppercase text-[10px]">
                      {group.descriptions.join(' + ')}
                    </td>
                    
                    {/* GHARAMA YA JUMLA YA MIZIGO YAKE */}
                    <td className="p-2 border-r border-gray-400 print:border-black text-right font-black text-sm">
                      {group.totalPrice.toLocaleString()}
                    </td>

                    {/* HALI YA MALIPO YANAYOELEWEKA (PAID / NOT PAID / MIXED) */}
                    <td className={`p-2 border-r border-gray-400 print:border-black text-center ${finalStatus.color}`}>
                      <span className="font-black text-[10px] uppercase tracking-wider">
                        {finalStatus.text}
                      </span>
                    </td>
                    
                    {/* Boksi la Kutiki ✓ */}
                    <td className="p-2 text-center align-middle">
                      <div className="w-5 h-5 border-2 border-black mx-auto print:border-black"></div>
                    </td>
                  </tr>
                );
              })
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