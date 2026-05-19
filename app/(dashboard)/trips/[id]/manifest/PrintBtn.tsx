"use client";

import React from 'react';
import { Printer } from 'lucide-react';

export default function PrintBtn() {
  return (
    <button 
      onClick={() => window.print()} 
      className="flex items-center gap-2 px-6 py-2 bg-gray-900 text-white font-bold rounded-lg hover:bg-gray-800 transition-colors shadow-sm"
    >
      <Printer size={18} /> Print Manifest
    </button>
  );
}