"use client";

import React from 'react';
import { useFormStatus } from 'react-dom';
import { Save } from 'lucide-react';

export default function SubmitShipmentBtn() {
  // Hii inasikiliza kama Form inatuma data au la!
  const { pending } = useFormStatus();

  return (
    <button 
      type="submit" 
      disabled={pending} // INAZUIA KUBONYEZA MARA MBILI 🔥 (Hapa ndo tumeua kujirudia)
      onClick={() => {
        if (!pending) {
          // Inatoa ujumbe baada ya sekunde 1 (Ikisubiri Database imalize)
          setTimeout(() => {
            alert("✅ DONE! Mzigo umepokelewa kikamilifu.");
          }, 1000);
        }
      }}
      className={`flex items-center gap-2 px-8 py-4 font-black rounded-xl transition-all shadow-md w-full md:w-auto justify-center text-lg ${
        pending 
          ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
          : 'bg-red-600 text-white hover:bg-red-700 shadow-red-600/30'
      }`}
    >
      <Save size={24} />
      {pending ? 'Inasajili Mzigo...' : 'Sajili Mzigo Mpya'}
    </button>
  );
}