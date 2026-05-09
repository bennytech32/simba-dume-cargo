"use client";

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Car, ArrowLeft, Save, CheckCircle2, Truck, User, Settings2 } from 'lucide-react';
// Hakikisha njia hii inaelekea kwenye lile faili letu jipya la action
import { createVehicle } from '../../../../app/actions/vehicle'; 

export default function NewVehiclePage() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  const handleAction = async (formData: FormData) => {
    setIsSubmitting(true);
    setSuccessMessage(false);

    try {
      await createVehicle(formData);
      
      // Washa Ujumbe wa Kijani
      setSuccessMessage(true);
      
      // Subiri sekunde 2 kisha mrudishe kwenye orodha ya magari
      setTimeout(() => {
        router.push('/vehicles'); 
        router.refresh();
      }, 2000);

    } catch (error) {
      console.error(error);
      alert("❌ Imeshindikana! Hakikisha namba ya gari (Plate Number) haijasajiliwa tayari.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto pb-10 relative">
      
      {/* UJUMBE WA MAFANIKIO */}
      {successMessage && (
        <div className="fixed top-5 right-5 z-50 bg-green-50 border-l-4 border-green-500 p-4 rounded shadow-lg flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="text-green-500" size={24} />
          <div>
            <h3 className="font-bold text-green-800">Imefanikiwa!</h3>
            <p className="text-green-700 text-sm font-medium">Gari limesajiliwa kikamilifu kwenye mfumo.</p>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Car className="text-red-600" size={28} /> Sajili Gari Jipya
          </h1>
          <p className="text-gray-500 text-sm mt-1">Ingiza taarifa za gari ili kuliweka kwenye mfumo.</p>
        </div>
        <Link 
          href="/vehicles" 
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 font-medium transition-colors"
        >
          <ArrowLeft size={18} /> Rudi
        </Link>
      </div>

      <form ref={formRef} action={handleAction} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative">
        
        {/* LOADING SHADOW */}
        {isSubmitting && !successMessage && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-40 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
              <p className="text-gray-700 font-bold">Inasajili Gari...</p>
            </div>
          </div>
        )}

        <div className="p-6 md:p-8 space-y-6">
          
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
            <Truck className="text-red-600" size={20} /> Taarifa za Gari
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Namba ya Gari (Plate Number) *</label>
              <input 
                type="text" 
                name="plateNumber" 
                required 
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-600 outline-none uppercase font-black text-gray-900" 
                placeholder="Mfano: T 123 ABC" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">Aina / Model ya Gari</label>
              <input 
                type="text" 
                name="type" 
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-600 outline-none" 
                placeholder="Mfano: Scania R450, Fuso..." 
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <Settings2 size={16} className="text-gray-400" /> Uwezo (Capacity)
              </label>
              <input 
                type="text" 
                name="capacity" 
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-600 outline-none" 
                placeholder="Mfano: Tani 30" 
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                <User size={16} className="text-gray-400" /> Dereva wa Sasa
              </label>
              <input 
                type="text" 
                name="currentDriver" 
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-600 outline-none" 
                placeholder="Mfano: Juma Shabani" 
              />
            </div>
          </div>
        </div>

        {/* BUTTON YA KUSAVE */}
        <div className="bg-gray-50 p-6 md:p-8 border-t border-gray-200 flex justify-end gap-4">
          <Link href="/vehicles" className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition-colors">
            Ghairi
          </Link>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className={`flex items-center gap-2 px-8 py-3 text-white font-bold rounded-xl transition-all shadow-lg ${
              isSubmitting 
                ? 'bg-red-400 cursor-not-allowed shadow-none' 
                : 'bg-red-600 hover:bg-red-700 shadow-red-600/30'
            }`}
          >
            <Save size={20} /> 
            {isSubmitting ? 'Inasajili...' : 'Hifadhi Gari'}
          </button>
        </div>
      </form>
    </div>
  );
}