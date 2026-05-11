import React from 'react';
import { Package, User, MapPin, DollarSign, Truck, ArrowRight, Save } from 'lucide-react';
import prisma from '../../../../lib/prisma'; // Hakikisha njia (path) ipo sawa
import { createShipment } from '../../../../app/actions/shipment'; // Hakikisha njia ipo sawa

export const dynamic = 'force-dynamic';

export default async function NewShipmentPage() {
  // 1. Vuta matawi yote kutoka kwenye Database ili yajae kwenye Dropdown
  const branches = await prisma.branch.findMany({
    orderBy: { name: 'asc' }
  });

  return (
    <div className="max-w-5xl mx-auto pb-10">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
          <Package className="text-red-600" size={28} /> Sajili Mzigo Mpya
        </h1>
        <p className="text-gray-500 font-medium mt-1">
          Jaza taarifa za mtumaji, mpokeaji na kituo mzigo unapokwenda.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* FOMU INAANZA HAPA: Tunatumia Action yetu moja kwa moja */}
        <form action={createShipment} className="p-8">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            
            {/* --- UPANDE WA KUSHOTO: TAARIFA ZA WATU --- */}
            <div className="space-y-8">
              {/* Mtumaji */}
              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <User size={16} /> Taarifa za Mtumaji
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Jina Kamili *</label>
                    <input type="text" name="senderName" required className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-600 outline-none" placeholder="Mfano: Juma Shabani" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Namba ya Simu *</label>
                    <input type="text" name="senderPhone" required className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-600 outline-none" placeholder="Mfano: 0712345678" />
                  </div>
                </div>
              </div>

              <div className="h-px bg-gray-100 w-full"></div>

              {/* Mpokeaji */}
              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <User size={16} /> Taarifa za Mpokeaji
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Jina Kamili *</label>
                    <input type="text" name="receiverName" required className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-600 outline-none" placeholder="Mfano: Anna John" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Namba ya Simu *</label>
                    <input type="text" name="receiverPhone" required className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-600 outline-none" placeholder="Mfano: 0787654321" />
                  </div>
                </div>
              </div>
            </div>

            {/* --- UPANDE WA KULIA: TAARIFA ZA MZIGO NA VITUO --- */}
            <div className="space-y-8">
              
              {/* Vituo (Matawi) - HAPA NDIPO TULIPOREKEBISHA THE ERROR 🔥 */}
              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <MapPin size={16} /> Safari ya Mzigo
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Kituo Kinapotoka *</label>
                    {/* Hii name="originBranchId" ndio Database ilikuwa inaililia */}
                    <select name="originBranchId" required className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-600 outline-none bg-white">
                      <option value="">-- Chagua Kituo --</option>
                      {branches.map(branch => (
                        <option key={branch.id} value={branch.id}>{branch.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex justify-center -my-2 relative z-10">
                    <div className="bg-red-50 text-red-600 p-2 rounded-full">
                      <ArrowRight size={20} />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Kituo Kinapoenda *</label>
                    {/* Hii name="destBranchId" ndio muhimu pia */}
                    <select name="destBranchId" required className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-600 outline-none bg-white">
                      <option value="">-- Chagua Kituo --</option>
                      {branches.map(branch => (
                        <option key={branch.id} value={branch.id}>{branch.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="h-px bg-gray-100 w-full"></div>

              {/* Maelezo na Malipo */}
              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <DollarSign size={16} /> Maelezo & Malipo
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Maelezo ya Mzigo *</label>
                    <input type="text" name="description" required className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-600 outline-none" placeholder="Mfano: Maboksi 2 ya nguo" />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Uzito (KG)</label>
                      <input type="number" name="weight" className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-600 outline-none" placeholder="0" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1">Gharama (TSH) *</label>
                      <input type="number" name="price" required className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-600 outline-none" placeholder="10000" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Hali ya Malipo *</label>
                    <select name="paymentStatus" required className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-600 outline-none bg-white">
                      <option value="PENDING">Haijalipiwa (Pending)</option>
                      <option value="PAID">Imelipiwa (Paid)</option>
                      <option value="PAY_ON_DELIVERY">Kulipia Mzigo Ukifika</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Kitufe cha Kusubmit */}
          <div className="mt-10 pt-6 border-t border-gray-100 flex justify-end">
            <button 
              type="submit" 
              className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-black rounded-xl shadow-lg shadow-red-200 transition-all flex items-center gap-2 active:scale-95"
            >
              <Save size={20} />
              Kamilisha Usajili wa Mzigo
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}