"use client";

import React, { useState } from 'react';
import { Truck, Lock, Mail, ArrowRight, AlertCircle } from 'lucide-react';
import { loginUser } from '../actions/auth';

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await loginUser(formData);

    // Ikiwa kuna error (kama password mbaya), itaonyesha hapa
    if (result?.error) {
      setError(result.error);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Styling */}
      <div className="absolute top-[-20%] left-[-10%] w-96 h-96 bg-red-600/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-96 h-96 bg-black/5 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-2xl border border-gray-100 relative z-10">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-4">
            <Truck size={32} />
          </div>
          <h1 className="text-2xl font-black text-gray-900 uppercase tracking-widest">Simba Dume</h1>
          <p className="text-sm font-bold text-gray-500 mt-1">Ingia kwenye Mfumo (Staff Only)</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3 text-sm font-bold">
            <AlertCircle size={20} className="flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Barua Pepe (Email)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <Mail size={20} />
              </div>
              <input 
                type="email" 
                name="email"
                required
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-600 outline-none font-medium"
                placeholder="mfanyakazi@simbadume.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">Nenosiri (Password)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                <Lock size={20} />
              </div>
              <input 
                type="password" 
                name="password"
                required
                className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-600 outline-none font-medium"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-xl transition-all shadow-lg shadow-red-200 flex items-center justify-center gap-2 mt-4 disabled:bg-red-400"
          >
            {isLoading ? 'Inahakiki...' : 'Ingia Ofisini'}
            {!isLoading && <ArrowRight size={20} />}
          </button>
        </form>
        
        <div className="mt-8 text-center">
          <p className="text-xs font-bold text-gray-400">Kama umesahau nenosiri, wasiliana na Admin</p>
        </div>
      </div>
    </div>
  );
}