import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import {
  Heart, Calendar, Shield, Video, ArrowRight, Stethoscope,
  Activity, Zap, Globe, Award, CheckCircle2, Play,
  Smartphone, Sparkles, Search, Pill, CreditCard, Bell,
  Microscope, Users, FileText, PhoneCall, MapPin, Anchor,
  ChevronLeft, ChevronRight, Star, Clock, ShieldCheck
} from 'lucide-react';

import logo from '../assets/logo.png';
import hero1 from '../assets/hero-1.png';
import hero2 from '../assets/hero-2.png';
import hero3 from '../assets/hero-3.png';

export default function LandingPremium() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [scrollY, setScrollY] = useState(0);
  const role = useAuthStore(state => state.role);

  const heroSlides = [
    {
      image: hero1,
      title: "Colombo's Elite Medical Hub",
      subtitle: "Experience clinical excellence with world-class specialists in the heart of Sri Lanka.",
      badge: "Clinical Excellence"
    },
    {
      image: hero2,
      title: "Instant 1990 Emergency Hub",
      subtitle: "The fastest response network integrated directly into your Health ID.",
      badge: "Life Saving Response"
    },
    {
      image: hero3,
      title: "Holistic Hill Country Wellness",
      subtitle: "Recover in serene, ultra-modern facilities set in the lush green tea hills.",
      badge: "Luxury Care"
    }
  ];

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearInterval(timer);
    };
  }, []);

  if (role === 'PATIENT') return <Navigate to="/patient" replace />;
  if (role === 'DOCTOR') return <Navigate to="/doctor" replace />;
  if (role === 'ADMIN') return <Navigate to="/admin" replace />;

  return (
    <div className="min-h-screen bg-white flex flex-col overflow-hidden selection:bg-[#8D153A]/10">
      
      {/* Premium Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrollY > 50 ? 'bg-white/80 backdrop-blur-2xl py-4 shadow-lg' : 'bg-transparent py-8'}`}>
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 flex justify-between items-center">
           <Link to="/" className="flex items-center gap-4 group">
              <img src={logo} alt="MediConnect Lanka" className="h-14 w-auto drop-shadow-sm group-hover:scale-105 transition-transform duration-500" />
              <div className="hidden sm:block">
                 <p className="text-xl font-black tracking-tighter text-slate-900 leading-none">MediConnect <span className="text-[#8D153A]">Lanka</span></p>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em] mt-1">Luxury Healthcare</p>
              </div>
           </Link>

           <div className="flex items-center gap-6">
              <Link to="/login" className="text-slate-600 font-bold hover:text-[#8D153A] transition-colors px-4 py-2">Sign In</Link>
              <Link to="/register" className="btn-luminous h-12 !py-0 !px-8 text-sm">Join The Network</Link>
           </div>
        </div>
      </nav>

      {/* World-Class Hero Carousel */}
      <section className="relative h-[95vh] min-h-[700px] w-full bg-slate-900 overflow-hidden">
        {heroSlides.map((slide, idx) => (
          <div 
            key={idx} 
            className={`absolute inset-0 transition-all duration-[1500ms] ease-in-out transform ${idx === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-110 pointer-events-none'}`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />
            <img src={slide.image} alt={slide.title} className="w-full h-full object-cover animate-float-slow" />
            
            <div className="absolute inset-0 z-20 flex items-center px-6 lg:px-24">
               <div className="max-w-4xl pt-20">
                  <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-[#FFBE29] text-slate-900 font-black text-[10px] uppercase tracking-[0.2em] mb-8 animate-slide-up shadow-xl shadow-[#FFBE29]/20">
                    <Sparkles size={14} /> {slide.badge}
                  </div>
                  <h1 className="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter leading-[0.9] animate-slide-up delay-100">
                    {slide.title.split(' ').map((word, i) => (
                      <span key={i} className={i === slide.title.split(' ').length - 1 ? 'text-[#FFBE29]' : ''}>{word} </span>
                    ))}
                  </h1>
                  <p className="text-xl md:text-3xl text-slate-200/80 mb-12 max-w-2xl font-medium leading-relaxed animate-slide-up delay-200">
                    {slide.subtitle}
                  </p>
                  <div className="flex flex-wrap gap-6 animate-slide-up delay-300">
                     <Link to="/register" className="btn-luminous h-20 !px-12 text-xl">Get Started Now <ArrowRight size={24} /></Link>
                     <button className="h-20 px-10 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white font-bold text-xl hover:bg-white/20 transition-all flex items-center gap-4">
                        <Play fill="white" size={24} /> Virtual Tour
                     </button>
                  </div>
               </div>
            </div>
          </div>
        ))}

        {/* Carousel Controls */}
        <div className="absolute bottom-12 right-12 z-30 flex items-center gap-4">
           <button onClick={() => setCurrentSlide(prev => (prev - 1 + heroSlides.length) % heroSlides.length)} className="w-16 h-16 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-slate-900 transition-all backdrop-blur-md">
              <ChevronLeft size={32} />
           </button>
           <button onClick={() => setCurrentSlide(prev => (prev + 1) % heroSlides.length)} className="w-16 h-16 rounded-full bg-[#8D153A] flex items-center justify-center text-white hover:bg-[#71112D] transition-all shadow-xl">
              <ChevronRight size={32} />
           </button>
        </div>

        {/* Carousel Progress Indicators */}
        <div className="absolute bottom-12 left-12 z-30 flex gap-3">
           {heroSlides.map((_, idx) => (
             <div 
               key={idx} 
               onClick={() => setCurrentSlide(idx)}
               className={`h-1.5 transition-all duration-500 rounded-full cursor-pointer ${idx === currentSlide ? 'w-16 bg-[#FFBE29]' : 'w-4 bg-white/30'}`} 
             />
           ))}
        </div>
      </section>

      {/* Trust & Heritage Bar */}
      <section className="relative z-40 -mt-16 mx-auto px-6 lg:px-12 max-w-[1400px] w-full">
         <div className="bg-white rounded-[3rem] p-10 shadow-2xl flex flex-wrap justify-between items-center gap-8 border border-slate-100">
            <div className="flex items-center gap-5">
               <div className="w-16 h-16 rounded-2xl bg-[#8D153A]/5 flex items-center justify-center text-[#8D153A]">
                  <Anchor size={32} />
               </div>
               <div>
                  <p className="text-2xl font-black text-slate-950">National Trust</p>
                  <p className="font-bold text-slate-500">25 Districts Connected</p>
               </div>
            </div>
            <div className="h-12 w-px bg-slate-200 hidden lg:block" />
            <div className="flex items-center gap-5">
               <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                  <ShieldCheck size={32} />
               </div>
               <div>
                  <p className="text-2xl font-black text-slate-950">SLMC Certified</p>
                  <p className="font-bold text-slate-500">Ministry Standards</p>
               </div>
            </div>
            <div className="h-12 w-px bg-slate-200 hidden lg:block" />
            <div className="flex items-center gap-5">
               <div className="w-16 h-16 rounded-2xl bg-[#FFBE29]/10 flex items-center justify-center text-[#E5AB22]">
                  <Zap size={32} />
               </div>
               <div>
                  <p className="text-2xl font-black text-slate-950">1990 Ready</p>
                  <p className="font-bold text-slate-500">Instant Dispatch</p>
               </div>
            </div>
         </div>
      </section>

      {/* Professional Features Grid */}
      <section className="py-40 px-6 lg:px-12 max-w-[1400px] mx-auto w-full">
         <div className="flex flex-col lg:flex-row justify-between items-end mb-24 gap-8">
            <div className="max-w-3xl">
               <div className="text-[#8D153A] font-black uppercase tracking-[0.4em] text-sm mb-6">Innovative Ecosystem</div>
               <h2 className="text-5xl md:text-7xl font-black text-slate-950 tracking-tighter leading-[0.9]">Modern Healthcare,<br/> Tailored for <span className="text-[#8D153A]">Lanka.</span></h2>
            </div>
            <p className="text-2xl text-slate-500 font-medium max-w-sm italic">Bridging traditional care with cloud-native distributed architecture.</p>
         </div>

         <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Video, title: 'Elite Virtual Care', desc: 'Face-to-face consultations with the nation\'s top consultants from anywhere.' },
              { icon: Microscope, title: 'National Lab Sync', desc: 'Secure digital access to results from Lanka Hospitals, Asiri, and more.' },
              { icon: PhoneCall, title: '1990 Suwa Seriya', desc: 'Real-time GPS dispatch and medical history pre-sharing for emergencies.' }
            ].map((f, i) => (
              <div key={i} className="clinical-card p-12 group hover:-translate-y-3">
                 <div className="w-20 h-20 rounded-[1.8rem] bg-slate-50 flex items-center justify-center text-[#8D153A] mb-10 group-hover:bg-[#8D153A] group-hover:text-white transition-all duration-500 shadow-inner">
                    <f.icon size={36} />
                 </div>
                 <h3 className="text-3xl font-black text-slate-950 mb-6">{f.title}</h3>
                 <p className="text-lg text-slate-500 font-medium leading-relaxed mb-8">{f.desc}</p>
                 <Link to="/register" className="flex items-center gap-3 text-[#8D153A] font-black text-lg hover:gap-5 transition-all">Explore <ArrowRight size={24} /></Link>
              </div>
            ))}
         </div>
      </section>

      {/* World-Class CTA Section */}
      <section className="py-32 px-6 lg:px-12 max-w-[1400px] mx-auto w-full mb-24">
         <div className="relative rounded-[4rem] bg-[#8D153A] overflow-hidden p-12 lg:p-32 group">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
            <div className="absolute inset-0 bg-gradient-to-br from-[#8D153A] via-[#71112D] to-[#FFBE29]/20" />
            
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
               <div className="text-center lg:text-left max-w-2xl">
                  <h2 className="text-5xl md:text-[6rem] font-black text-white leading-[0.85] mb-8 tracking-tighter">Your Health ID<br/> Awaits.</h2>
                  <p className="text-2xl text-white/70 font-medium leading-relaxed">Join the most advanced healthcare network in South Asia. Secure, fast, and culturally brilliant.</p>
               </div>
               <Link to="/register" className="h-28 px-16 bg-white text-[#8D153A] text-4xl rounded-full font-black shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-6">
                  Join Now <ArrowRight size={40} />
               </Link>
            </div>
         </div>
      </section>

      {/* Minimal Luxury Footer */}
      <footer className="py-20 bg-white border-t border-slate-100 text-center">
         <img src={logo} alt="MediConnect" className="h-12 w-auto mx-auto mb-10 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all cursor-pointer" />
         <p className="text-slate-400 font-bold mb-1 uppercase tracking-widest text-[10px]">Cloud Infrastructure: Azure Southeast Asia</p>
         <p className="text-slate-900 font-black text-xl mb-2">MediConnect <span className="text-[#8D153A]">Lanka</span></p>
         <p className="text-slate-500 font-medium">© 2026 The Premium National Medical Network.</p>
      </footer>

      <style>{`
        @keyframes float-slow {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        .animate-float-slow {
          animation: float-slow 20s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
