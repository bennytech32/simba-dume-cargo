"use client";

import React from 'react';
import { Printer } from 'lucide-react';

export default function PrintButton() {
  return (
    <button 
      onClick={() => window.print()} 
      className="flex items-center gap-2 px-6 py-3 bg-black text-white font-bold rounded-lg hover:bg-gray-800 transition-colors shadow-lg print:hidden w-full justify-center"
    >
      <Printer size={20} /> Chapisha Risiti
    </button>
  );
}