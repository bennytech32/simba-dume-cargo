"use client";

import React, { useState } from 'react';
import { Printer, DownloadCloud, Loader2, Share2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface PrintBtnProps {
  fileName?: string;
}

export default function PrintBtn({ fileName = "Safari" }: PrintBtnProps) {
  const [isProcessing, setIsProcessing] = useState(false);

  // FUNCTION KUU YA KUTENGENEZA PDF YENYE UKUBWA MDOGO (CHINI YA MB 1) 🔥
  const generatePDF = async () => {
    const element = document.getElementById('manifest-print-area');
    if (!element) return null;

    // Scale imeshushwa mpaka 1.5 ili kuokoa MB, bado inasomeka HD
    const canvas = await html2canvas(element, {
      scale: 1.5, 
      useCORS: true,
      logging: false,
      onclone: (clonedDoc) => {
        const el = clonedDoc.getElementById('manifest-print-area');
        if (el) {
          el.style.width = '1024px';
          el.style.maxWidth = '1024px';
          el.style.margin = '0 auto';
          el.style.padding = '40px';
        }
      }
    });

    // SIRI KUBWA: Tunatumia JPEG yenye ubora wa 80% badala ya PNG 🔥
    const imgData = canvas.toDataURL('image/jpeg', 0.8);
    const pdf = new jsPDF('p', 'mm', 'a4'); 
    
    const pdfWidth = pdf.internal.pageSize.getWidth(); 
    const pageHeight = pdf.internal.pageSize.getHeight(); 
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    let heightLeft = pdfHeight;
    let position = 0;

    // Tunaweka picha kama JPEG kwa kutumia 'FAST' compression
    pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight, undefined, 'FAST');
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = position - pageHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, pdfHeight, undefined, 'FAST');
      heightLeft -= pageHeight;
    }

    return pdf;
  };

  // 1. KUDOWNLOAD KAAWIDA
  const handleDownloadPDF = async () => {
    try {
      setIsProcessing(true);
      const pdf = await generatePDF();
      if (pdf) {
        pdf.save(`Manifest_${fileName}.pdf`);
      }
    } catch (error) {
      console.error("Kosa:", error);
      alert("Kuna kosa limetokea. Jaribu tena.");
    } finally {
      setIsProcessing(false);
    }
  };

  // 2. KUSHARE MOJA KWA MOJA WHATSAPP/TELEGRAM (WEB SHARE API) 🔥
  const handleSharePDF = async () => {
    try {
      setIsProcessing(true);
      const pdf = await generatePDF();
      if (!pdf) return;

      // Geuza PDF iwe Faili (Blob)
      const pdfBlob = pdf.output('blob');
      const file = new File([pdfBlob], `Manifest_${fileName}.pdf`, { type: 'application/pdf' });

      // Angalia kama Simu/Kifaa kinaruhusu kushare mafaili
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `Manifest - ${fileName}`,
          text: `Tafadhali pokea Manifest ya Safari: ${fileName}`,
        });
      } else {
        // Kama anatumia Kompyuta ambayo haina Share, inadownload badala yake
        pdf.save(`Manifest_${fileName}.pdf`);
      }
    } catch (error) {
      console.error("Kosa wakati wa kushare:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex items-center gap-2 md:gap-3 flex-wrap justify-end">
      {/* KITUFE CHA KUPRINT */}
      <button 
        onClick={() => window.print()} 
        className="flex items-center gap-2 px-4 md:px-5 py-2.5 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-all shadow-sm active:scale-95 cursor-pointer text-sm md:text-base"
      >
        <Printer size={18} /> <span className="hidden md:inline">Chapisha</span>
      </button>

      {/* KITUFE CHA KUSHARE (MUHIMU SANA KWA SIMU) 🔥 */}
      <button 
        onClick={handleSharePDF} 
        disabled={isProcessing}
        className="flex items-center gap-2 px-4 md:px-5 py-2.5 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-all shadow-md shadow-green-200 active:scale-95 cursor-pointer disabled:opacity-70 text-sm md:text-base"
      >
        {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <Share2 size={18} />}
        Share
      </button>

      {/* KITUFE CHA KUDOWNLOAD */}
      <button 
        onClick={handleDownloadPDF} 
        disabled={isProcessing}
        className="flex items-center gap-2 px-4 md:px-5 py-2.5 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all shadow-md shadow-red-200 active:scale-95 cursor-pointer disabled:opacity-70 text-sm md:text-base"
      >
        {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <DownloadCloud size={18} />}
        <span className="hidden md:inline">Pakua PDF</span>
      </button>
    </div>
  );
}