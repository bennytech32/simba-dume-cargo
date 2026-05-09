"use client";

import React from 'react';
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
  LogOut 
} from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter(); // Tumeongeza router hapa kwa ajili ya kitufe cha kuondoka

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
    <div className="flex h-screen overflow-hidden">
      
      {/* SIDEBAR - DARK THEME YAKO SAFI */}
      <aside className="w-64 bg-[#0a0a0a] border-r border-neutral-800/50 flex flex-col text-gray-300">
        
        {/* Nembo na Jina: Simba Dume Cargo */}
        <div className="h-20 flex items-center gap-3 px-6 border-b border-neutral-800/50">
          <div className="w-10 h-10 bg-red-600/10 rounded-xl flex items-center justify-center">
            <Truck size={24} className="text-red-600" />
          </div>
          <h1 className="text-lg font-black text-white tracking-wide leading-tight">
            Simba Dume <br/>
            <span className="text-red-500 text-xs tracking-widest uppercase">Cargo</span>
          </h1>
        </div>

        {/* Menyu ya Navigation */}
        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
          <p className="px-4 text-[11px] font-bold text-neutral-500 uppercase tracking-widest mb-4">Menyu Kuu</p>
          
          {menuItems.map((item) => {
            const isActive = pathname === item.path || pathname.startsWith(`${item.path}/`);
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.path}
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

        {/* Kitufe cha Ondoka (Kimeboreshwa) */}
        <div className="p-4 border-t border-neutral-800/50">
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
      <main className="flex-1 flex flex-col overflow-hidden bg-gray-50 text-gray-900">
        <div className="flex-1 overflow-y-auto p-6 md:p-10">
          {children}
        </div>
      </main>

    </div>
  );
}