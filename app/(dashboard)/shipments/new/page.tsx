"use client";

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Package, User, MapPin, DollarSign, ArrowLeft, Save, CheckCircle2 } from 'lucide-react';
import { createShipment } from '../../../../app/actions/shipment'; 

export default function NewShipmentPage() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  // 👇🏾 Hii inashikilia ujumbe wa kuonyesha (Success Message)
  const [successMessage, setSuccessMessage] = useState(false);

  const handleAction = async (formData: FormData) => {
    setIsSubmitting(true);
    setSuccessMessage(false);

    try {
      // 1. Tuma taarifa kwenye database
      await createShipment(formData);
      
      // 2. Washa Ujumbe Mzuri wa Kijani
      setSuccessMessage(true);
      
      // 3. Subiri sekunde 2 hivi ili asome ujumbe, kisha mpeleke kwenye orodha ya mizigo
      setTimeout(() => {
        router.push('/dashboard'); // Au '/shipments' kulingana na ulipo ukurasa wako wa orodha
        router.refresh();
      }, 2000);

    } catch (error) {
      console.error(error);
      alert("❌ Imeshindikana! Hakikisha umejaza taarifa zote na vituo ni sahihi.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-10 relative">
      
      {/* 👇🏾 UJUMBE WA MAFANIKIO (SUCCESS TOAST) - Unaonekana tu akisave vizuri */}
      {successMessage && (
        <div className="fixed top-5 right-5 z-50 bg-green-50 border-l-4 border-green-500 p-4 rounded shadow-lg flex items-center gap-3 animate-bounce">
          <CheckCircle2 className="text-green-500" size={24} />
          <div>
            <h3 className="font-bold text-green-800">Imefanikiwa!</h3>
            <p className="text-green-700 text-sm font-medium">Mzigo umepokelewa na kuhifadhiwa kikamilifu.</p>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sajili Mzigo Mpya (Waybill)</h1>
          <p className="text-gray-500 text-sm mt-1">Jaza taarifa kwa usahihi ili kuzalisha namba ya ufuatiliaji.</p>
        </div>
        <Link 
          href="/dashboard" 
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 font-medium transition-colors"
        >
          <ArrowLeft size={18} /> Rudi
        </Link>
      </div>

      <form ref={formRef} action={handleAction} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative">
        
        {/* Kama inasave, weka kimvuli kizuri kufunika fomu asibofye mara mbili */}
        {isSubmitting && !successMessage && (
          <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-40 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
              <p className="text-gray-700 font-bold">Tafadhali subiri, inahifadhi...</p>
            </div>
          </div>
        )}

        {/* SEHEMU YA 1: TAARIFA ZA WATEJA */}
        <div className="p-6 md:p-8 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <User className="text-red-600" size={20} /> Taarifa za Wateja
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4 p-5 bg-gray-50 rounded-xl border border-gray-100">
              <h3 className="font-semibold text-gray-700 border-b border-gray-200 pb-2">Mtumaji (Sender)</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jina Kamili</label>
                <input type="text" name="senderName" required className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-600 outline-none" placeholder="Mfano: Juma Shabani" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Namba ya Simu</label>
                <input type="tel" name="senderPhone" required className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-600 outline-none" placeholder="Mfano: 0712345678" />
              </div>
            </div>

            <div className="space-y-4 p-5 bg-gray-50 rounded-xl border border-gray-100">
              <h3 className="font-semibold text-gray-700 border-b border-gray-200 pb-2">Mpokeaji (Receiver)</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Jina Kamili</label>
                <input type="text" name="receiverName" required className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-600 outline-none" placeholder="Mfano: Asha Ramadhani" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Namba ya Simu</label>
                <input type="tel" name="receiverPhone" required className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-600 outline-none" placeholder="Mfano: 0787654321" />
              </div>
            </div>
          </div>
        </div>

        {/* SEHEMU YA 2: TAARIFA ZA MZIGO NA NJIA (VITUO VIPYA) */}
        <div className="p-6 md:p-8 border-b border-gray-100 bg-gray-50/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <MapPin className="text-red-600" size={20} /> Vituo (Routes)
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kituo Unapotoka (Origin)</label>
                  <select name="originBranchName" required className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-600 outline-none bg-white">
                    <option value="">-- Chagua Kituo --</option>
                    <option value="Dar es Salaam">Dar es Salaam</option>
                    <option value="Mkata">Mkata</option>
                    <option value="Handeni">Handeni</option>
                    <option value="Mabalanga">Mabalanga</option>
                    <option value="Kwinji">Kwinji</option>
                    <option value="Kwediboma">Kwediboma</option>
                    <option value="Kibirashi">Kibirashi</option>
                    <option value="Mafisa">Mafisa</option>
                    <option value="Songe">Songe</option>
                    <option value="Lengatei">Lengatei</option>
                    <option value="Kijungu">Kijungu</option>
                    <option value="Pori namba 01">Pori namba 01</option>
                    <option value="Kibaya kiteto">Kibaya kiteto</option>
                    <option value="Njoro">Njoro</option>
                    <option value="Mrijo">Mrijo</option>
                    <option value="Mkoka">Mkoka</option>
                    <option value="Dosidosi">Dosidosi</option>
                    <option value="Ngusero">Ngusero</option>
                    <option value="Matui">Matui</option>
                    <option value="Gairo">Gairo</option>
                    <option value="Dumila">Dumila</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Kituo Unapoenda (Destination)</label>
                  <select name="destinationBranchName" required className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-600 outline-none bg-white">
                    <option value="">-- Chagua Kituo --</option>
                    <option value="Dar es Salaam">Dar es Salaam</option>
                    <option value="Mkata">Mkata</option>
                    <option value="Handeni">Handeni</option>
                    <option value="Mabalanga">Mabalanga</option>
                    <option value="Kwinji">Kwinji</option>
                    <option value="Kwediboma">Kwediboma</option>
                    <option value="Kibirashi">Kibirashi</option>
                    <option value="Mafisa">Mafisa</option>
                    <option value="Songe">Songe</option>
                    <option value="Lengatei">Lengatei</option>
                    <option value="Kijungu">Kijungu</option>
                    <option value="Pori namba 01">Pori namba 01</option>
                    <option value="Kibaya kiteto">Kibaya kiteto</option>
                    <option value="Njoro">Njoro</option>
                    <option value="Mrijo">Mrijo</option>
                    <option value="Mkoka">Mkoka</option>
                    <option value="Dosidosi">Dosidosi</option>
                    <option value="Ngusero">Ngusero</option>
                    <option value="Matui">Matui</option>
                    <option value="Gairo">Gairo</option>
                    <option value="Dumila">Dumila</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <Package className="text-red-600" size={20} /> Maelezo ya Mzigo
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Aina ya Mzigo / Maelezo</label>
                  <input type="text" name="description" required className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-600 outline-none" placeholder="Mfano: Maboksi 4 ya Dawa" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Uzito (Kg) - Hiari</label>
                    <input type="number" step="0.01" name="weight" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-600 outline-none" placeholder="0.00" />
                  </div>
                  <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Thamani (TZS) - Hiari</label>
                    <input type="number" step="0.01" name="declaredValue" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-600 outline-none" placeholder="0.00" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SEHEMU YA 3: MALIPO */}
        <div className="p-6 md:p-8">
          <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            <DollarSign className="text-red-600" size={20} /> Taarifa za Malipo
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gharama ya Usafiri (TZS)</label>
              <input type="number" name="price" required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-600 outline-none text-lg font-bold text-gray-900" placeholder="0" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hali ya Malipo</label>
              <select name="paymentStatus" required className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-600 outline-none font-medium">
                <option value="PAID">Amelipia Kabisa (Paid)</option>
                <option value="PAY_ON_DELIVERY">Atalipia Akipokea (Pay on Delivery)</option>
                <option value="PENDING">Haijalipiwa Bado</option>
              </select>
            </div>
          </div>
        </div>

        {/* BUTTON YA KUSAVE */}
        <div className="bg-gray-50 p-6 md:p-8 border-t border-gray-200 flex justify-end gap-4">
          <Link href="/dashboard" className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-100 transition-colors">
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
            {isSubmitting ? 'Inahifadhi...' : 'Hifadhi Mzigo'}
          </button>
        </div>
      </form>
    </div>
  );
}