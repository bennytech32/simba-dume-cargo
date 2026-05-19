"use client"; // Hii inaiambia Next.js kuwa hii ni ya kwenye Browser

import React from 'react';
import { Trash2 } from 'lucide-react';

export default function DeleteTripButton() {
  return (
    <button 
      type="submit" 
      onClick={(e) => {
        if(!confirm("Una uhakika unataka kufuta safari hii? Mizigo iliyomo itarudishwa kuwa 'INASUBIRI'.")) {
          e.preventDefault();
        }
      }} 
      className="p-2 text-red-400 hover:text-white hover:bg-red-600 rounded-lg transition-colors border border-red-100 bg-white"
    >
      <Trash2 size={16} />
    </button>
  );
}