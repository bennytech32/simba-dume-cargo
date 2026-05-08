"use client";

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Truck, Search, MapPin, Phone, Clock, ArrowRight, ShieldCheck, Zap, Globe, Package, ClipboardList, QrCode, CheckCircle, Menu, X, AlertCircle } from 'lucide-react';
import { trackShipment } from '../actions/track'; // Njia imesahihishwa hapa (../)

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // State variables kwa ajili ya matokeo ya Tracking
  const [isLoading, setIsLoading] = useState(false);
  const [trackResult, setTrackResult] = useState<any>(null);
  const [trackError, setTrackError] = useState<string | null>(null);

  // Setup ya Parallax Effect
  const parallaxRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: parallaxRef,
    offset: ["start end", "end start"]
  });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  // Function ya kufanya Tracking
  const handleTracking = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setTrackError(null);
    setTrackResult(null);

    const formData = new FormData(e.currentTarget);
    const result = await trackShipment(formData);

    if (result.error) {
      setTrackError(result.error);
    } else if (result.success) {
      setTrackResult(result.data);
    }
    
    setIsLoading(false);
  };

  const hatuaZaKutuma = [
    {
      icon: <Package className="h-8 w-8 text-white" />,
      title: "1. Andaa Mzigo Wako",
      desc: "Funga mzigo wako vizuri na uhakikishe una taarifa sahihi za mpokeaji."
    },
    {
      icon: <ClipboardList className="h-8 w-8 text-white" />,
      title: "2. Fika Ofisini",
      desc: "Lete mzigo katika ofisi zetu au vituo vyetu vilivyo karibu nawe."
    },
    {
      icon: <QrCode className="h-8 w-8 text-white" />,
      title: "3. Pata Tracking Namba",
      desc: "Baada ya malipo au makubaliano, utapewa risiti yenye namba ya ufuatiliaji."
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-white" />,
      title: "4. Mzigo Unafika Salama",
      desc: "Fuatilia mzigo wako hapa mtandaoni mpaka utakapomfikia mlengwa salama."
    }
  ];

  const njiaZetu = [
    {
      icon: <Globe className="h-10 w-10 sm:h-12 sm:w-12 text-red-600 mb-4" />,
      title: "Dar ➔ Mikoa Yote (TZ)",
      desc: "Mtandao wetu umepanuka! Tunasafirisha mizigo kwenda mikoa yote 31 ya Tanzania kwa usalama na uhakika."
    },
    {
      icon: <MapPin className="h-10 w-10 sm:h-12 sm:w-12 text-red-600 mb-4" />,
      title: "Dar ➔ Kiteto",
      desc: "Usafirishaji wa moja kwa moja kupitia Mrijo na maeneo ya jirani kila wiki."
    },
    {
      icon: <MapPin className="h-10 w-10 sm:h-12 sm:w-12 text-red-600 mb-4" />,
      title: "Dar ➔ Kilindi",
      desc: "Tunafika Kilindi kwa wakati, tukiwa na malori madhubuti yanayohimili njia zote."
    },
    {
      icon: <MapPin className="h-10 w-10 sm:h-12 sm:w-12 text-red-600 mb-4" />,
      title: "Dar ➔ Songe",
      desc: "Njia ya K/Boma na Kibrashi hadi Songe. Mzigo wako upo mikono salama."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans overflow-x-hidden w-full max-w-[100vw]">
      
      {/* 1. NAVBAR - Animated & Responsive */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/90 backdrop-blur-md shadow-sm sticky top-0 z-50 w-full"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center gap-2 z-50">
            <Truck className="h-7 w-7 sm:h-8 sm:w-8 text-red-600 flex-shrink-0" />
            <span className="text-xl sm:text-2xl font-black text-black uppercase tracking-wider">
              Simba Dume <span className="text-red-600">Cargo</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-8 font-semibold text-gray-700">
            <Link href="/" className="hover:text-red-600 transition-colors">Mwanzo</Link>
            <Link href="#huduma" className="hover:text-red-600 transition-colors">Jinsi ya Kutuma</Link>
            <Link href="#njia" className="hover:text-red-600 transition-colors">Njia Zetu</Link>
            <Link href="#mawasiliano" className="hover:text-red-600 transition-colors">Mawasiliano</Link>
          </nav>

          {/* Mobile Menu Toggle Button */}
          <button 
            className="md:hidden p-2 text-gray-900 z-50"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-t border-gray-100 px-4 pt-2 pb-6 space-y-4 shadow-xl absolute w-full z-40"
            >
              <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 font-semibold text-gray-700 hover:text-red-600 hover:bg-gray-50 rounded-lg">Mwanzo</Link>
              <Link href="#huduma" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 font-semibold text-gray-700 hover:text-red-600 hover:bg-gray-50 rounded-lg">Jinsi ya Kutuma</Link>
              <Link href="#njia" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 font-semibold text-gray-700 hover:text-red-600 hover:bg-gray-50 rounded-lg">Njia Zetu</Link>
              <Link href="#mawasiliano" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 font-semibold text-gray-700 hover:text-red-600 hover:bg-gray-50 rounded-lg">Mawasiliano</Link>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* 2. HERO SECTION & TRACKING */}
      <section className="relative bg-black text-white pt-20 sm:pt-24 pb-32 sm:pb-40 flex items-center justify-center min-h-[80vh] w-full overflow-hidden">
        
        {/* PICHA YA LORI - HERO SECTION */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50 z-0"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')" }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-gray-50 z-0"></div>
        
        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-red-600/20 border border-red-500/30 text-red-100 mb-6 backdrop-blur-sm"
          >
            <Zap className="h-3 w-3 sm:h-4 sm:w-4 text-red-500 flex-shrink-0" />
            <span className="text-xs sm:text-sm font-semibold tracking-wide">USAFIRISHAJI BORA TANZANIA</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-7xl font-black mb-4 sm:mb-6 uppercase tracking-tight leading-tight w-full drop-shadow-lg"
          >
            Mizigo Yako, <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700 drop-shadow-none">Wajibu Wetu</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-base sm:text-lg md:text-xl text-gray-200 max-w-2xl mb-10 w-full px-2 drop-shadow-md"
          >
            Tunakufikishia mizigo mikubwa na midogo mikoa yote ya Tanzania kwa haraka, usalama, na gharama nafuu.
          </motion.p>

          {/* BOX YA KUTRACK MZIGO */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="bg-white p-5 sm:p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-4xl border-t-4 border-red-600 mx-4 sm:mx-0 relative"
          >
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 text-left flex items-center gap-3">
              <div className="bg-red-100 p-2 rounded-lg flex-shrink-0">
                <Search className="h-5 w-5 sm:h-6 sm:w-6 text-red-600" />
              </div>
              Fuatilia Mzigo
            </h2>
            
            <form onSubmit={handleTracking} className="flex flex-col md:flex-row gap-3 sm:gap-4 w-full">
              <input 
                type="text" 
                name="trackingNumber"
                placeholder="Namba ya mzigo (Mfano: SDC-10045)" 
                required
                className="flex-1 w-full px-4 sm:px-5 py-3 sm:py-4 rounded-xl border-2 border-gray-100 text-gray-900 focus:outline-none focus:border-red-600 focus:ring-4 focus:ring-red-600/10 font-bold text-base sm:text-lg transition-all uppercase placeholder:normal-case placeholder:font-normal"
              />
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full md:w-auto bg-black hover:bg-red-600 text-white font-bold py-3 sm:py-4 px-6 sm:px-10 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-base sm:text-lg disabled:bg-gray-400 disabled:cursor-not-allowed flex-shrink-0"
              >
                {isLoading ? 'Inatafuta...' : 'Tafuta'} 
                {!isLoading && <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5" />}
              </button>
            </form>

            {/* SEHEMU YA MAJIBU YA TRACKING INATOKEA HAPA */}
            <AnimatePresence>
              {trackError && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: "auto", marginTop: 24 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl flex items-center gap-3 text-left"
                >
                  <AlertCircle className="h-6 w-6 flex-shrink-0" />
                  <p className="font-bold text-sm sm:text-base">{trackError}</p>
                </motion.div>
              )}

              {trackResult && (
                <motion.div 
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: "auto", marginTop: 24 }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  className="overflow-hidden"
                >
                  <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 sm:p-6 text-left">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-200">
                      <div>
                        <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">Namba ya Risiti</p>
                        <p className="text-xl sm:text-2xl font-black text-gray-900 tracking-wider">{trackResult.trackingNumber}</p>
                      </div>
                      <div className="bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm inline-flex flex-col items-start sm:items-end">
                        <span className="text-xs text-gray-500 font-bold uppercase">Hali ya Mzigo</span>
                        <span className={`font-black text-sm sm:text-base uppercase ${trackResult.status === 'DELIVERED' ? 'text-green-600' : 'text-red-600'}`}>
                          {trackResult.status === 'RECEIVED' && '📦 Ofisini'}
                          {trackResult.status === 'IN_TRANSIT' && '🚚 Njiani'}
                          {trackResult.status === 'ARRIVED' && '📍 Kituoni'}
                          {trackResult.status === 'DELIVERED' && '✅ Kimekabidhiwa'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between relative mb-8 px-4 sm:px-8">
                      <div className="absolute left-6 right-6 top-1/2 h-1 bg-gray-200 -z-10 rounded-full"></div>
                      <div className="bg-white border-4 border-gray-200 p-2 sm:p-3 rounded-full text-blue-600"><MapPin className="h-5 w-5 sm:h-6 sm:w-6" /></div>
                      <div className={`bg-white border-4 p-2 sm:p-3 rounded-full transition-colors ${trackResult.status === 'IN_TRANSIT' || trackResult.status === 'ARRIVED' || trackResult.status === 'DELIVERED' ? 'text-amber-500 border-amber-200' : 'text-gray-300 border-gray-200'}`}><Truck className="h-5 w-5 sm:h-6 sm:w-6" /></div>
                      <div className={`bg-white border-4 p-2 sm:p-3 rounded-full transition-colors ${trackResult.status === 'DELIVERED' ? 'text-green-500 border-green-200' : 'text-gray-300 border-gray-200'}`}><CheckCircle className="h-5 w-5 sm:h-6 sm:w-6" /></div>
                    </div>

                    <div className="flex justify-between text-center mb-6">
                      <div className="w-1/3">
                        <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase">Kutoka</p>
                        <p className="font-black text-gray-900 text-sm sm:text-base">{trackResult.originBranch.name}</p>
                      </div>
                      <div className="w-1/3"></div>
                      <div className="w-1/3">
                        <p className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase">Kwenda</p>
                        <p className="font-black text-gray-900 text-sm sm:text-base">{trackResult.destBranch.name}</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-4 rounded-lg border border-gray-100">
                      <div>
                        <p className="text-xs text-gray-500 font-bold">Maelezo ya Mzigo:</p>
                        <p className="text-sm font-bold text-gray-900">{trackResult.description}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-bold">Jina la Mpokeaji:</p>
                        <p className="text-sm font-bold text-gray-900">{trackResult.receiverName}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            {/* MWISHO WA MAJIBU YA TRACKING */}

          </motion.div>
        </div>
      </section>

      {/* 2.5 JINSI YA KUTUMA MZIGO (PARALLAX SCROLLING SECTION) */}
      <section ref={parallaxRef} id="huduma" className="relative py-20 sm:py-32 overflow-hidden bg-black flex items-center justify-center w-full">
        <motion.div 
          style={{ 
            y: backgroundY,
            backgroundImage: "url('https://images.unsplash.com/photo-1519003722824-194d4455a60c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')" 
          }}
          className="absolute inset-0 opacity-40 bg-cover bg-center bg-no-repeat"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 w-full">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">Jinsi ya Kutuma</h2>
            <div className="w-16 sm:w-24 h-1.5 bg-red-600 mx-auto mt-4 sm:mt-6 rounded-full"></div>
            <p className="mt-4 text-gray-300 max-w-2xl mx-auto text-base sm:text-lg">
              Hatua nne rahisi zinazofanya usafirishaji wako uwe mwepesi na wa uhakika.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {hatuaZaKutuma.map((hatua, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur-md p-6 sm:p-8 rounded-2xl border border-white/20 hover:bg-red-600/20 transition-all duration-300 group"
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-red-600 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 transform group-hover:-translate-y-2 transition-transform shadow-lg shadow-red-600/30">
                  {hatua.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">{hatua.title}</h3>
                <p className="text-sm sm:text-base text-gray-300 leading-relaxed">{hatua.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. HUDUMA NA NJIA ZETU */}
      <section id="njia" className="py-20 sm:py-24 bg-gray-50 w-full overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 uppercase tracking-tight">Njia Zetu Kuu</h2>
            <div className="w-16 sm:w-24 h-1.5 bg-red-600 mx-auto mt-4 sm:mt-6 rounded-full"></div>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto text-base sm:text-lg">
              Mtandao wetu mkubwa unahakikisha mzigo wako unafika popote Tanzania kwa wakati.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 w-full">
            {njiaZetu.map((njia, index) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`bg-white p-6 sm:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group ${index === 0 ? 'ring-2 ring-red-600 relative overflow-hidden' : ''}`}
              >
                {index === 0 && (
                  <div className="absolute top-4 -right-8 bg-red-600 text-white text-[10px] sm:text-xs font-bold px-10 py-1 rotate-45 z-10 shadow-sm">
                    MPYA
                  </div>
                )}
                
                <div className="transform group-hover:scale-110 group-hover:-translate-y-1 sm:group-hover:-translate-y-2 transition-all duration-300">
                  {njia.icon}
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-black mb-2 sm:mb-3 pr-4">{njia.title}</h3>
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed">{njia.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. SABABU ZA KUTUCHAGUA */}
      <section className="py-16 sm:py-20 bg-white w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-3 gap-10 sm:gap-12 text-center">
           <motion.div initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }} className="flex flex-col items-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-50 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                <ShieldCheck className="h-8 w-8 sm:h-10 sm:w-10 text-red-600" />
              </div>
              <h4 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">Usalama wa 100%</h4>
              <p className="text-sm sm:text-base text-gray-600">Tunahakikisha mzigo wako unalindwa kuanzia tunapoupokea mpaka unamfikia mteja.</p>
           </motion.div>
           <motion.div initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }} transition={{ delay: 0.2 }} className="flex flex-col items-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-50 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                <Zap className="h-8 w-8 sm:h-10 sm:w-10 text-red-600" />
              </div>
              <h4 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">Kasi ya Ajabu</h4>
              <p className="text-sm sm:text-base text-gray-600">Malori yetu yapo barabarani muda wote kuhakikisha mzigo unafika kwa wakati uliopangwa.</p>
           </motion.div>
           <motion.div initial={{ opacity:0 }} whileInView={{ opacity:1 }} viewport={{ once:true }} transition={{ delay: 0.4 }} className="flex flex-col items-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-red-50 rounded-full flex items-center justify-center mb-4 sm:mb-6">
                <Clock className="h-8 w-8 sm:h-10 sm:w-10 text-red-600" />
              </div>
              <h4 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">Msaada Masaa 24</h4>
              <p className="text-sm sm:text-base text-gray-600">Huduma kwa wateja ipo wazi muda wote. Unaweza kufuatilia mzigo wako wakati wowote.</p>
           </motion.div>
        </div>
      </section>

      {/* 5. FOOTER YA MAWASILIANO */}
      <footer id="mawasiliano" className="bg-[#0a0a0a] text-white py-12 sm:py-16 border-t-[6px] border-red-600 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 sm:gap-12">
          <div>
            <div className="flex items-center gap-2 mb-4 sm:mb-6">
              <Truck className="h-6 w-6 sm:h-8 sm:w-8 text-red-500" />
              <span className="text-xl sm:text-2xl font-black uppercase tracking-wider">Simba Dume</span>
            </div>
            <p className="text-sm sm:text-base text-gray-400 leading-relaxed">
              Suluhisho namba moja la usafirishaji wa mizigo Tanzania. Uaminifu, kasi, na usalama ndiyo nguzo zetu.
            </p>
          </div>
          <div>
            <h4 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">Wasiliana Nasi</h4>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-3 sm:gap-4 text-gray-400 hover:text-red-500 transition-colors">
                <Phone className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="text-base sm:text-lg">+255 746 131 375</span>
              </div>
              <div className="flex items-center gap-3 sm:gap-4 text-gray-400">
                <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-red-500 flex-shrink-0" />
                <span className="text-base sm:text-lg">Dar- K/boma- Kibrashi- Songe</span>
              </div>
              <div className="flex items-center gap-3 sm:gap-4 text-gray-400">
                <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-red-500 flex-shrink-0 opacity-0" />
                <span className="text-base sm:text-lg">Dar - Kiteto - Mrijo</span>
              </div>
            </div>
          </div>
          <div className="sm:col-span-2 lg:col-span-1">
             <h4 className="text-lg sm:text-xl font-bold text-white mb-4 sm:mb-6">Saa za Kazi</h4>
             <div className="bg-white/5 p-4 sm:p-6 rounded-xl border border-white/10">
               <div className="flex items-start gap-3 sm:gap-4 text-gray-300">
                <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-red-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-white text-sm sm:text-base">Jumatatu - Jumamosi</p>
                  <p className="text-sm sm:text-base">02:00 Asubuhi - 12:00 Jioni</p>
                  <p className="text-red-400 text-xs sm:text-sm mt-1 sm:mt-2 font-medium">Jumapili Tumefunga</p>
                </div>
              </div>
             </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 sm:mt-16 pt-6 sm:pt-8 border-t border-white/10 text-center text-gray-500 text-xs sm:text-sm flex justify-center items-center">
          <p>&copy; {new Date().getFullYear()} Simba Dume Cargo. Haki Zote Zimehifadhiwa.</p>
        </div>
      </footer>
    </div>
  );
}