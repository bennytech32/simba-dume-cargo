import React from 'react';
import prisma from '../../../lib/prisma';
import { notFound } from 'next/navigation';
import PrintButton from './PrintButton';

export default async function ReceiptPage({ params }: { params: Promise<{ id: string }> }) {
  // 1. Soma Params
  const resolvedParams = await params;
  const shipmentId = resolvedParams.id;

  // 2. Vuta Mzigo
  const shipment = await prisma.shipment.findUnique({
    where: { id: shipmentId },
    include: { originBranch: true, destBranch: true }
  });

  if (!shipment) {
    notFound();
  }

  // 3. Vuta Mipangilio kutoka Database
  const dbSettings = await prisma.settings.findUnique({ where: { id: 1 } });

  // 4. Panga data zitumike kwenye risiti (Kama Kanzidata ipo tupu, itatumia hizi Backup)
  const companyName = dbSettings?.companyName || "Simba Dume Cargo";
  const companyPhone = dbSettings?.companyPhone || "0700 000 000";
  const companyTin = dbSettings?.companyTin || "000-000-000";
  const termsString = dbSettings?.terms || "1. Risiti ni muhimu sana.\n2. Mzigo siku 7 utatozwa faini ya hifadhi.";
  
  // Tunavunja ile mistari ya masharti iwe orodha ili ijipange vizuri
  const termsList = termsString.split('\n');

  return (
    <div className="min-h-screen bg-gray-100 py-10 print:bg-white print:py-0 flex flex-col items-center">
      
      {/* SEHEMU YA KUBONYEZA PRINT */}
      <div className="mb-6 w-[320px] print:hidden">
        <PrintButton />
        <p className="text-center text-sm text-gray-500 mt-2">
          Bonyeza kitufe hapo juu kuchapisha
        </p>
      </div>

      {/* RISITI YENYEWE */}
      <div className="bg-white p-4 w-[320px] text-black font-mono text-sm border border-gray-300 shadow-xl print:shadow-none print:border-none print:w-full print:max-w-[80mm] print:m-0 print:p-0">
        
        {/* HEADER & MAWASILIANO */}
        <div className="text-center mb-4">
          <h1 className="font-black text-xl uppercase tracking-widest">{companyName}</h1>
          <p className="font-bold text-[10px]">CARGO & LOGISTICS</p>
          <p className="text-[10px] mt-1">TIN: {companyTin}</p>
          <p className="text-[10px]">Simu: {companyPhone}</p>
          <p className="text-xs mt-1 font-bold">Tawi la: {shipment.originBranch.name}</p>
          <p className="text-[10px]">Tarehe: {new Date(shipment.createdAt).toLocaleString('sw-TZ')}</p>
        </div>
        
        <div className="border-t-2 border-dashed border-gray-400 my-2"></div>
        
        {/* TRACKING NUMBER */}
        <div className="text-center mb-2">
          <p className="text-[10px] uppercase">Namba ya Mzigo</p>
          <p className="font-black text-xl tracking-widest">{shipment.trackingNumber}</p>
        </div>

        <div className="border-t-2 border-dashed border-gray-400 my-2"></div>

        {/* WATEJA */}
        <div className="mb-2 space-y-2">
          <div>
            <p className="font-bold text-[10px] uppercase">Kutoka (Mtumaji):</p>
            <p className="text-xs font-bold">{shipment.senderName}</p>
            <p className="text-xs">{shipment.senderPhone}</p>
          </div>
          <div>
            <p className="font-bold text-[10px] uppercase">Kwenda (Mpokeaji):</p>
            <p className="text-xs font-bold">{shipment.receiverName}</p>
            <p className="text-xs">{shipment.receiverPhone}</p>
          </div>
        </div>

        <div className="border-t-2 border-dashed border-gray-400 my-2"></div>

        {/* NJIA NA MAELEZO YA MZIGO */}
        <div className="mb-2 text-xs space-y-1">
          <div className="flex justify-between">
            <span>Njia:</span>
            <span className="font-bold">{shipment.originBranch.name} ➔ {shipment.destBranch.name}</span>
          </div>
          <div className="flex justify-between">
            <span>Mzigo:</span>
            <span className="font-bold text-right">{shipment.description}</span>
          </div>
          {shipment.weight && (
            <div className="flex justify-between">
              <span>Uzito:</span>
              <span className="font-bold">{shipment.weight} Kg</span>
            </div>
          )}
        </div>

        <div className="border-t-2 border-black my-2"></div>

        {/* MALIPO */}
        <div className="mb-2 space-y-1">
          <div className="flex justify-between font-black text-sm">
            <span>JUMLA:</span>
            <span>TZS {Number(shipment.price).toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-[10px] font-bold mt-1">
            <span>HALI:</span>
            <span className="px-1 bg-black text-white uppercase">
              {shipment.paymentStatus === 'PAID' ? 'IMELIPIWA' : 
               shipment.paymentStatus === 'PAY_ON_DELIVERY' ? 'KULIPIA AKIPOKEA' : 'HAIJALIPIWA'}
            </span>
          </div>
        </div>

        <div className="border-t-2 border-black my-2"></div>

        {/* VIGEZO NA MASHARTI */}
        <div className="mt-3 text-[9px] leading-tight text-gray-800 text-justify space-y-1">
          <p className="font-bold text-center uppercase mb-1 underline">Vigezo na Masharti</p>
          {termsList.map((term, index) => (
            <p key={index}>{term}</p>
          ))}
        </div>

        {/* FOOTER */}
        <div className="text-center mt-6 mb-4 text-[10px] space-y-1">
          <p className="font-bold uppercase">Asante kwa kutuchagua!</p>
          <p>Mizigo yako ipo salama mikononi mwetu.</p>
          <div className="pt-4 text-gray-400 italic">*** {companyName} ***</div>
        </div>

      </div>
    </div>
  );
}