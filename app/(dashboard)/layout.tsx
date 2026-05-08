"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Package, Truck, Users, Settings, LogOut, Menu, X, MapPin
} from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashibodi', icon: <LayoutDashboard size={20} />, path: '/dashboard' },
    { name: 'Mizigo Mpya', icon: <Package size={20} />, path: '/shipments/new' },
    { name: 'Safari', icon: <Truck size={20} />, path: '/trips' },
    { name: 'Vituo / Matawi', icon: <MapPin size={20} />, path: '/branches' },
    // LINK YA WAFANYAKAZI IMEWEKWA HAPA IWE HAI
    { name: 'Wafanyakazi', icon: <Users size={20} />, path: '/users' },
    { name: 'Mipangilio', icon: <Settings size={20} />, path: '/settings' },
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden text-gray-900">
      
      {/* SIDEBAR */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#0f0f0f] text-white transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0 flex flex-col flex-shrink-0
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* LOGO AREA */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-gray-800 bg-[#0a0a0a]">
          <Truck className="text-red-600 h-8 w-8" />
          <span className="font-black text-lg tracking-tighter uppercase italic">Simba Dume</span>
        </div>

        {/* MENU ITEMS */}
        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
          {menuItems.map((item) => {
            const isActive = pathname.startsWith(item.path) && item.path !== '#';
            return (
              <Link 
                key={item.name} 
                href={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                  ? 'bg-red-600 text-white shadow-lg shadow-red-900/20' 
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}
              >
                {item.icon}
                <span className="ml-3 font-semibold">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* LOGOUT AREA */}
        <div className="p-4 border-t border-gray-800 bg-[#0a0a0a]">
          <button className="flex items-center text-gray-400 hover:text-red-500 transition-colors w-full px-4 py-3 rounded-lg hover:bg-gray-800">
            <LogOut size={20} />
            <span className="ml-3 font-semibold">Ondoka</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* TOP NAVBAR */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 flex-shrink-0 shadow-sm">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-gray-100 md:hidden"
          >
            <Menu size={24} />
          </button>
          
          <div className="flex items-center gap-4 ml-auto">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-gray-900 leading-none">Admin Mkuu</p>
              <p className="text-[10px] text-gray-500 uppercase mt-1 tracking-widest font-bold">HQ - Dar es Salaam</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center text-white font-bold shadow-md">
              SD
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* OVERLAY FOR MOBILE */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}