"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Truck, Lock, User, ArrowRight, ShieldCheck, Zap, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  // Hapa utaweka logic yako halisi ya ku-login (Mfano: NextAuth au API yako)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Tunasimulate loading ya sekunde 1.5 kama "Udambwi" wa mfumo kusoma data
    setTimeout(() => {
      // Tunatumia window.location.href kulazimisha ukurasa kubadilika moja kwa moja
      window.location.href = '/dashboard';
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center relative overflow-hidden px-4">
      
      {/* UDAMBWI 1: Mwangaza wa nyuma (Glowing Orbs) unaozunguka */}
      <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-red-600/10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40rem] h-[40rem] bg-orange-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }}></div>

      <div className="w-full max-w-4xl bg-neutral-900/60 backdrop-blur-2xl border border-neutral-800/50 rounded-[2rem] shadow-2xl flex flex-col md:flex-row overflow-hidden z-10">
        
        {/* UPANDE WA KUSHOTO: BRANDING & MAELEZO (Design Safi) */}
        <div className="w-full md:w-5/12 bg-gradient-to-br from-red-600 to-red-900 p-10 text-white flex flex-col justify-between relative overflow-hidden group">
          
          {/* Pattern ya nyuma kwenye upande mwekundu */}
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
          
          <div className="relative z-10">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 border border-white/20 group-hover:scale-110 transition-transform duration-500">
              <Truck size={32} className="text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-black mb-4 leading-tight">
              Simba Dume <br />
              <span className="text-red-200">Cargo</span>
            </h1>
            <p className="text-red-100 font-medium opacity-90 leading-relaxed text-sm">
              Mfumo wa kisasa wa usimamizi wa mizigo, safari, na magari. Kasi, usalama, na uhakika kwa wateja wako.
            </p>
          </div>

          <div className="relative z-10 mt-12 bg-white/10 backdrop-blur-sm border border-white/20 p-4 rounded-xl flex items-start gap-3">
            <ShieldCheck size={24} className="text-red-200 shrink-0" />
            <p className="text-xs font-medium text-red-100">
              Mawasiliano na data zako zinalindwa kwa usalama wa kiwango cha juu (End-to-End Encryption).
            </p>
          </div>
        </div>

        {/* UPANDE WA KULIA: FOMU YA KUINGIA (Login Form) */}
        <div className="w-full md:w-7/12 p-10 md:p-14 flex flex-col justify-center">
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Ingia Kwenye Akaunti</h2>
            <p className="text-neutral-400 text-sm">Weka taarifa zako za siri kuendelea na dashibodi.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            
            {/* Input ya Username */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Jina la Mtumiaji</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-500 group-focus-within:text-red-500 transition-colors">
                  <User size={18} />
                </div>
                <input 
                  type="text" 
                  required
                  className="w-full pl-11 pr-4 py-3.5 bg-neutral-950/50 border border-neutral-800 rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-red-600/50 focus:border-red-600 transition-all"
                  placeholder="admin@simbadume"
                />
              </div>
            </div>

            {/* Input ya Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-neutral-400 uppercase tracking-wider">Nenosiri</label>
                <a href="#" className="text-xs font-medium text-red-500 hover:text-red-400 transition-colors">Umesahau?</a>
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neutral-500 group-focus-within:text-red-500 transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                  type="password" 
                  required
                  className="w-full pl-11 pr-4 py-3.5 bg-neutral-950/50 border border-neutral-800 rounded-xl text-white placeholder-neutral-600 focus:outline-none focus:ring-2 focus:ring-red-600/50 focus:border-red-600 transition-all"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            {/* Kitufe cha Ku-login */}
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full mt-4 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 px-4 rounded-xl transition-all active:scale-[0.98] shadow-lg shadow-red-600/20 disabled:opacity-70 disabled:cursor-not-allowed group"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" /> Inathibitisha...
                </>
              ) : (
                <>
                  Ingia Kwenye Mfumo 
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* UDAMBWI 2: Saini ya Mhandisi (B-Tech Creations) */}
          <div className="mt-12 pt-6 border-t border-neutral-800/50 text-center">
            <p className="text-[11px] text-neutral-500 font-medium flex items-center justify-center gap-1.5 opacity-60 hover:opacity-100 transition-opacity cursor-default">
              <Zap size={12} className="text-yellow-500" />
              System design & engineering by <span className="text-white font-bold tracking-wide">B-tech Creations</span>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}