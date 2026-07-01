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
    const element = document.getElementById('manifest-print-area');
    if (!element) return;

    try {
      setIsDownloading(true);
      
      const canvas = await html2canvas(element, {
        scale: 2, 
        useCORS: true,
        logging: false,
        // HII NDIO SIRI: Inalazimisha picha ipigwe kama kioo cha Computer (1024px) hata ukiwa kwenye Simu! 🔥
        onclone: (clonedDoc) => {
          const el = clonedDoc.getElementById('manifest-print-area');
          if (el) {
            el.style.width = '1024px';
            el.style.maxWidth = '1024px';
            el.style.margin = '0 auto';
            el.style.padding = '40px'; // Inaongeza hewa isibane ukingoni
          }
        }
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4'); // Karatasi ya A4
      
      const pdfWidth = pdf.internal.pageSize.getWidth(); // Upana wa A4 (210mm)
      const pageHeight = pdf.internal.pageSize.getHeight(); // Urefu wa A4 (297mm)
      
      // Tunatafuta urefu wa picha yote ukilinganishwa na upana wa karatasi
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      let heightLeft = pdfHeight;
      let position = 0;

      // WEKA UKURASA WA KWANZA
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;

      // KAMA JEDWALI NI REFU SANA, TUNAONGEZA KURASA MPYA AUTOMATICALLY (PAGE 2, PAGE 3...) 🔥
      while (heightLeft > 0) {
        position = position - pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;
      }
      
      // Inashusha faili lenye jina la Gari
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

      {/* KITUFE CHA 1-CLICK PDF DOWNLOAD */}
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