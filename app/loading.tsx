"use client";

import React from 'react';
import { Truck } from 'lucide-react';

export default function Loading() {
  return (
    <div className="fixed inset-0 bg-gray-50/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center animate-fade-in">
      <div className="flex flex-col items-center space-y-4 p-8 rounded-3xl bg-white shadow-2xl border border-gray-100 max-w-xs w-full text-center">
        
        {/* AREA YA LORI LINALOTEMBEA */}
        <div className="relative w-full flex justify-center py-4 overflow-hidden">
          {/* Mstari wa barabara unaorudi nyuma */}
          <div className="absolute bottom-3 left-0 right-0 h-0.5 bg-dashed border-t border-dashed border-gray-300 animate-[pulse_1s_infinite]"></div>
          
          {/* Alama ya Lori linalocheza na kusogea mbele kidogo */}
          <div className="animate-[bounce_1s_infinite] text-red-600">
            <Truck size={48} className="animate-[pulse_0.5s_infinite]" />
          </div>
        </div>

        {/* MAANDISHI CHINI YA LORI */}
        <div>
          <h3 className="text-lg font-black text-gray-900 uppercase tracking-widest animate-pulse">
            Simba Dume
          </h3>
          <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mt-1">
            Inapakia Mfumo...
          </p>
        </div>

        {/* KISTARI CHA AKIBA CHA KUZUNGUKA */}
        <div className="w-12 h-1 w-full bg-gray-100 rounded-full overflow-hidden relative">
          <div className="absolute top-0 bottom-0 left-0 bg-red-600 rounded-full w-1/3 animate-[translateX_1.5s_infinite_linear]"></div>
        </div>

      </div>
    </div>
  );
}