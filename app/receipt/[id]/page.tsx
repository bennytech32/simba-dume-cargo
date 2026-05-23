import React from 'react';
import prisma from '../../../lib/prisma';
import { notFound } from 'next/navigation';
import PrintButton from './PrintButton';
import QRCode from 'react-qr-code';

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

  // 4. Panga data zitumike kwenye risiti
  const companyName = dbSettings?.companyName || "SIMBA DUME CARGO";
  const companyPhone = dbSettings?.companyPhone || "0700 000 000";
  const companyTin = dbSettings?.companyTin || "000-000-000";
  const termsString = dbSettings?.terms || "1. Risiti ni muhimu sana.\n2. Mzigo ukikaa siku 7 utatozwa faini ya hifadhi.";
  
  const termsList = termsString.split('\n');

  // 5. Tengeneza Link ya Tracking kwa ajili ya QR Code
  const trackingUrl = `https://simba-dume-cargo.vercel.app/track?code=${shipment.trackingNumber}`;

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
        <div className="text-center mb-3">
          <h1 className="font-black text-2xl tracking-widest leading-none uppercase mb-1">{companyName}</h1>
          <p className="text-[10px] mt-1">TIN: {companyTin}</p>
          <p className="text-[10px]">Simu: {companyPhone}</p>
          <p className="text-[11px] mt-1 font-bold uppercase">Tawi: {shipment.originBranch.name}</p>
          <p className="text-[10px]">Tarehe: {new Date(shipment.createdAt).toLocaleString('sw-TZ')}</p>
        </div>
        
        <div className="border-t border-dashed border-black my-2"></div>
        
        {/* TRACKING NUMBER */}
        <div className="text-center mb-2 mt-2">
          <p className="text-[10px] uppercase mb-1">Namba ya Mzigo</p>
          <p className="font-black text-xl tracking-widest leading-none">{shipment.trackingNumber}</p>
        </div>

        <div className="border-t border-dashed border-black my-2"></div>

        {/* WATEJA */}
        <div className="mb-2 mt-2 space-y-2">
          <div className="mb-2">
            <p className="font-bold text-[10px] uppercase underline mb-1">Kutoka (Mtumaji):</p>
            <p className="text-[12px] font-bold uppercase leading-tight">{shipment.senderName}</p>
            <p className="text-[11px] leading-none mt-1">{shipment.senderPhone}</p>
          </div>
          <div>
            <p className="font-bold text-[10px] uppercase underline mb-1">Kwenda (Mpokeaji):</p>
            <p className="text-[12px] font-bold uppercase leading-tight">{shipment.receiverName}</p>
            <p className="text-[11px] leading-none mt-1">{shipment.receiverPhone}</p>
          </div>
        </div>

        <div className="border-t border-dashed border-black my-2"></div>

        {/* NJIA NA MAELEZO YA MZIGO */}
        <div className="mb-2 mt-2 text-[11px] space-y-1">
          <div className="flex justify-between items-start leading-tight">
            <span>Njia:</span>
            <span className="font-bold text-right uppercase">{shipment.originBranch.name} ➔ {shipment.destBranch.name}</span>
          </div>
          <div className="flex justify-between items-start leading-tight">
            <span>Mzigo:</span>
            <span className="font-bold text-right uppercase">{shipment.description}</span>
          </div>
          {shipment.weight > 0 && (
            <div className="flex justify-between leading-tight">
              <span>Uzito:</span>
              <span className="font-bold">{shipment.weight} Kg</span>
            </div>
          )}
        </div>

        <div className="border-t-[2px] border-black my-2"></div>

        {/* MALIPO (TUMEWEKA KIINGEREZA NA RANGI) 🔥 */}
        <div className="mb-2 mt-2">
          <div className="flex justify-between items-center font-black text-base leading-tight mb-2">
            <span>JUMLA:</span>
            <span>TZS {Number(shipment.price).toLocaleString()}</span>
          </div>
          
          <div className="flex justify-between items-center mt-3 leading-tight">
            <span className="text-[11px] font-bold uppercase">Status:</span>
            <span className={`px-2 py-0.5 rounded font-black text-[13px] uppercase tracking-wider border ${
              shipment.paymentStatus === 'PAID' ? 'bg-emerald-100 text-emerald-700 border-emerald-300 print:bg-transparent print:text-black print:border-black print:border-2' :
              shipment.paymentStatus === 'PENDING' ? 'bg-red-100 text-red-700 border-red-300 print:bg-transparent print:text-black print:border-black print:border-2' :
              'bg-amber-100 text-amber-700 border-amber-300 print:bg-transparent print:text-black print:border-black print:border-2'
            }`}>
              {shipment.paymentStatus === 'PAID' ? 'PAID' : 
               shipment.paymentStatus === 'PENDING' ? 'NOT PAID' : 
               'PAY ON DELIVERY'}
            </span>
          </div>
        </div>

        <div className="border-t-[2px] border-black my-2 mt-3"></div>

        {/* VIGEZO NA MASHARTI */}
        <div className="mt-3 text-[9px] leading-normal text-black text-justify">
          <p className="font-black text-center uppercase mb-2">Vigezo na Masharti</p>
          {termsList.map((term, index) => (
            <p key={index} className="mb-1">{term}</p>
          ))}
        </div>

        {/* FOOTER & QR CODE */}
        <div className="text-center mt-4 mb-2 space-y-2">
          <p className="font-bold uppercase text-[11px] mb-2">Asante kwa kutuchagua!</p>
          
          {/* QR CODE */}
          <div className="my-3 flex flex-col items-center justify-center">
            <p className="text-[9px] uppercase font-bold mb-2">Scan kufuatilia mzigo</p>
            <div className="bg-white p-1 border border-gray-200 print:border-black rounded">
              <QRCode
                value={trackingUrl}
                size={90} 
                level="M" 
              />
            </div>
          </div>
          
          <div className="pt-2 italic font-bold text-[10px]">*** {companyName} ***</div>
        </div>

      </div>
    </div>
  );
}