"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  Truck, 
  Car, 
  MapPin, 
  Users, 
  Settings,
  LogOut,
  Menu, // MPYA KWA AJILI YA SIMU
  X     // MPYA KWA AJILI YA SIMU
} from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter(); 
  
  // STATE MPYA YA KUDHIBITI MENU KWENYE SIMU
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Nimeziweka Link (paths) ziendane sawa sawa na majina ya folders zako kwenye VS Code
  const menuItems = [
    { name: 'Dashibodi', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Mizigo Mpya', path: '/shipments/new', icon: Package },
    { name: 'Safari', path: '/trips', icon: Truck },
    { name: 'Magari', path: '/vehicles', icon: Car },
    { name: 'Vituo / Matawi', path: '/branches', icon: MapPin },
    { name: 'Wafanyakazi', path: '/users', icon: Users },
    { name: 'Mipangilio', path: '/settings', icon: Settings },
  ];

  // Function maalum ya kufanya Logout
  const handleLogout = () => {
    // Hapa unaweza kuongeza logic ya kufuta token kama unatumia local storage
    // localStorage.removeItem('token');
    
    // Inakupeleka kwenye ukurasa wa login
    router.push('/login');
    // Inafanya refresh kusafisha kumbukumbu yoyote ya nyuma
    router.refresh(); 
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      
      {/* KIOO CHA GIZA (BACKDROP) KWA AJILI YA SIMU LAKATI MENU IPO WAZI */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR - DARK THEME YAKO SAFI (Imeongezewa Responsive Classes) */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#0a0a0a] border-r border-neutral-800/50 flex flex-col text-gray-300 transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        
        {/* Nembo na Jina: Simba Dume Cargo */}
        <div className="h-20 flex items-center justify-between gap-3 px-6 border-b border-neutral-800/50 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-600/10 rounded-xl flex items-center justify-center">
              <Truck size={24} className="text-red-600" />
            </div>
            <h1 className="text-lg font-black text-white tracking-wide leading-tight">
              Simba Dume <br/>
              <span className="text-red-500 text-xs tracking-widest uppercase">Cargo</span>
            </h1>
          </div>
          {/* Kitufe cha Kufunga Menu kwenye simu (X) */}
          <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setIsSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        {/* Menyu ya Navigation */}
        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto custom-scrollbar">
          <p className="px-4 text-[11px] font-bold text-neutral-500 uppercase tracking-widest mb-4">Menyu Kuu</p>
          
          {menuItems.map((item) => {
            const isActive = pathname === item.path || pathname.startsWith(`${item.path}/`);
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.path}
                onClick={() => setIsSidebarOpen(false)} // Inafunga menu ukichagua kurasa (Simu)
                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-red-600 text-white font-bold shadow-lg shadow-red-600/20'
                    : 'hover:bg-neutral-800/60 hover:text-white font-medium text-neutral-400'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-white' : 'text-neutral-500'} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Kitufe cha Ondoka */}
        <div className="p-4 border-t border-neutral-800/50 shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-4 py-3.5 text-neutral-500 font-medium rounded-xl hover:bg-red-500/10 hover:text-red-500 transition-colors group"
          >
            <LogOut size={20} className="group-hover:rotate-12 transition-transform duration-300" />
            <span>Ondoka Kwenye Mfumo</span>
          </button>
        </div>
      </aside>

      {/* ENEO LA KAZI (MAIN CONTENT) */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-gray-50 text-gray-900">
        
        {/* HEADER YA SIMU (INAONEKANA KWENYE SIMU TU KWA AJILI YA HAMBURGER MENU) */}
        <header className="md:hidden flex items-center justify-between p-4 bg-white border-b border-gray-200 shadow-sm shrink-0 z-30">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-red-600/10 rounded-lg flex items-center justify-center">
              <Truck size={18} className="text-red-600" />
            </div>
            <span className="font-black text-gray-900 tracking-wide">SIMBA DUME</span>
          </div>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Menu size={24} />
          </button>
        </header>

        {/* WATOTO (CHILDREN - DASHBOARD YAKO YENYEWE) */}
        <div className="flex-1 overflow-y-auto p-4 md:p-10">
          {children}
        </div>
      </main>

    </div>
  );
}