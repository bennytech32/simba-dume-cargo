"use client";

import React, { useState } from 'react';
import { Printer, DownloadCloud, Loader2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface PrintBtnProps {
  fileName?: string;
}

export default function PrintBtn({ fileName = "Safari" }: PrintBtnProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownloadPDF = async () => {
    // Tunatafuta lile eneo lenye kitambulisho cha 'manifest-print-area'
    const element = document.getElementById('manifest-print-area');
    if (!element) return;

    try {
      setIsDownloading(true);
      
      // html2canvas inapiga "Screenshot" ya ubora wa juu ya Manifest
      const canvas = await html2canvas(element, {
        scale: 2, // Hii inaongeza ubora (High Quality)
        useCORS: true,
        logging: false
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4'); // Karatasi ya A4
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      
      // Inashusha faili lenye jina la Gari na Tarehe (Mfn: Manifest_T123ABC.pdf)
      pdf.save(`Manifest_${fileName}.pdf`);

    } catch (error) {
      console.error("Kosa wakati wa kuunda PDF:", error);
      alert("Kuna kosa limetokea wakati wa kupakua PDF. Jaribu tena.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex items-center gap-3">
      {/* KITUFE CHA KUPRINT */}
      <button 
        onClick={() => window.print()} 
        className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-all shadow-sm active:scale-95 cursor-pointer"
      >
        <Printer size={18} /> Chapisha
      </button>

      {/* KITUFE KIPYA CHA 1-CLICK PDF DOWNLOAD 🔥 */}
      <button 
        onClick={handleDownloadPDF} 
        disabled={isDownloading}
        className="flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all shadow-md shadow-red-200 active:scale-95 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isDownloading ? <Loader2 size={18} className="animate-spin" /> : <DownloadCloud size={18} />}
        {isDownloading ? 'Inapakua...' : 'Pakua PDF'}
      </button>
    </div>
  );
}