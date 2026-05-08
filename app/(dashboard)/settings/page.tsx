import React from 'react';
import { Settings as SettingsIcon, Save, Phone, FileText, MapPin, Building } from 'lucide-react';
import prisma from '../../../lib/prisma';
import { updateSettings } from '../../actions/settings';

export default async function SettingsPage() {
  // Vuta mipangilio ya sasa
  const settings = await prisma.settings.findUnique({ where: { id: 1 } });

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900 flex items-center gap-3">
          <SettingsIcon className="text-red-600" size={28} /> Mipangilio ya Kampuni
        </h1>
        <p className="text-gray-500 font-medium">Badilisha taarifa zinazotokea kwenye risiti na mfumo.</p>
      </div>

      <form action={updateSettings} className="space-y-6">
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                <Building size={16} /> Jina la Kampuni
              </label>
              <input name="companyName" defaultValue={settings?.companyName} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-600 outline-none" />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                <FileText size={16} /> TIN Namba
              </label>
              <input name="companyTin" defaultValue={settings?.companyTin} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-600 outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                <Phone size={16} /> Namba za Simu (Risiti)
              </label>
              <input name="companyPhone" defaultValue={settings?.companyPhone} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-600 outline-none" />
            </div>
            <div>
              <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
                <MapPin size={16} /> Anuani ya Makao Maku
              </label>
              <input name="address" defaultValue={settings?.address} className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-600 outline-none" />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-2">
              Vigezo na Masharti (Kwenye Risiti)
            </label>
            <textarea 
              name="terms" 
              rows={5} 
              defaultValue={settings?.terms}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-600 outline-none font-mono text-sm"
            ></textarea>
            <p className="text-xs text-gray-400 mt-2">Zingatia: Kila mstari utatokea kama nukta kwenye risiti.</p>
          </div>

          <div className="pt-4">
            <button type="submit" className="flex items-center justify-center gap-2 w-full md:w-auto px-8 py-4 bg-red-600 text-white font-black rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-200">
              <Save size={20} /> Hifadhi Mabadiliko
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}