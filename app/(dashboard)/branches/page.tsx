import React from 'react';
import { MapPin, Plus, Trash2, Building2, Navigation } from 'lucide-react';
import prisma from '../../../lib/prisma';
import { createBranch, deleteBranch } from '../../../app/actions/branch';

export const dynamic = 'force-dynamic';

export default async function BranchesPage() {
  // Vuta matawi yote kutoka kwenye Database
  const branches = await prisma.branch.findMany({
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="max-w-6xl mx-auto pb-10">
      
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">
          <MapPin className="text-red-600" size={28} /> Usimamizi wa Matawi & Vituo
        </h1>
        <p className="text-gray-500 font-medium mt-1">Sajili vituo vyako vya kupokelea na kushushia mizigo.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* FOMU YA KUSAJILI TAWI JIPYA */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Plus className="text-red-600" size={20} /> Ongeza Kituo Kipya
            </h2>
            
            <form action={createBranch} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Jina la Kituo (Mfano: Dodoma) *</label>
                <input 
                  type="text" 
                  name="name" 
                  required 
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-600 outline-none font-medium" 
                  placeholder="Ingiza jina..." 
                />
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Eneo/Anwani (Optional)</label>
                <input 
                  type="text" 
                  name="location" 
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-red-600 outline-none" 
                  placeholder="Mfano: Nanenane, Block B" 
                />
              </div>

              <button 
                type="submit" 
                className="w-full py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-200"
              >
                Hifadhi Kituo
              </button>
            </form>
          </div>
        </div>

        {/* ORODHA YA MATAWI YALIYOSAJILIWA */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100 bg-gray-50/50">
              <h2 className="font-bold text-gray-800">Vituo Vilivyosajiliwa ({branches.length})</h2>
            </div>

            <div className="divide-y divide-gray-100">
              {branches.length === 0 ? (
                <div className="p-10 text-center text-gray-500">
                  <Building2 size={48} className="mx-auto mb-3 text-gray-200" />
                  <p>Hakuna kituo kilichosajiliwa bado.</p>
                </div>
              ) : (
                branches.map((branch) => (
                  <div key={branch.id} className="p-5 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
                        <Navigation size={22} />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">{branch.name}</h3>
                        <p className="text-sm text-gray-500">{branch.location || 'Anwani haikujazwa'}</p>
                      </div>
                    </div>

                    <form action={deleteBranch}>
                      <input type="hidden" name="id" value={branch.id} />
                      <button 
                        type="submit" 
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        // Kumbuka: Kwa sababu ni Server Component, hatuwezi kuweka confirm box hapa moja kwa moja bila kutengeneza client component.
                      >
                        <Trash2 size={20} />
                      </button>
                    </form>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}