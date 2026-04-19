import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import {
  Heart, Calendar, Shield, Video, ArrowRight, Stethoscope,
  Activity, Zap, Globe, Award, CheckCircle2, Play,
  Smartphone, Sparkles, Search, Pill, CreditCard, Bell,
  Microscope, Users, FileText, PhoneCall, MapPin, Anchor
} from 'lucide-react';
import heroImage from '../assets/lanka-hero.png';

export default function Landing() {
  const [scrollY, setScrollY] = useState(0);
  const role = useAuthStore(state => state.role);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (role === 'PATIENT') return <Navigate to="/patient" replace />;
  if (role === 'DOCTOR') return <Navigate to="/doctor" replace />;
  if (role === 'ADMIN') return <Navigate to="/admin" replace />;

  const features = [
    { 
      icon: Video, 
      title: 'Consult Experts', 
      route: '/telemedicine', 
      desc: 'Seamless video consultations with top specialists from the National Hospital and private centers island-wide.', 
      color: 'text-[#8D153A]', 
      bg: 'bg-[#8D153A]/5', 
      gradient: 'from-[#8D153A] to-[#C9204A]' 
    },
    { 
      icon: PhoneCall, 
      title: '1990 Suwa Seriya', 
      route: '/emergency', 
      desc: 'Native integration with the 1990 emergency response network for instant life-saving dispatch.', 
      color: 'text-emerald-600', 
      bg: 'bg-emerald-50', 
      gradient: 'from-emerald-400 to-teal-600' 
    },
    { 
      icon: Zap, 
      title: 'AI Health Triage', 
      route: '/ai-checker', 
      desc: 'Multilingual AI engine trained on local medical datasets for instant symptom checking in Sinhala, Tamil, or English.', 
      color: 'text-[#FFBE29]', 
      bg: 'bg-[#FFBE29]/5', 
      gradient: 'from-[#FFBE29] to-[#E5AB22]' 
    },
    { 
      icon: Shield, 
      title: 'Secure Health ID', 
      route: '/register', 
      desc: 'Protecting Sri Lankan patient records with distributed JWT security across our microservices nodes.', 
      color: 'text-rose-500', 
      bg: 'bg-rose-50', 
      gradient: 'from-rose-400 to-red-500' 
    }
  ];

  const microservices = [
    { name: 'National Pharmacy', icon: Pill, route: '/pharmacy' },
    { name: 'Lanka Pay Sync', icon: CreditCard, route: '/settings' },
    { name: 'Island Lab Network', icon: Microscope, route: '/lab-results' },
    { name: 'Regional Alerts', icon: Bell, route: '/notifications' },
    { name: 'MoH Data Sync', icon: FileText, route: '/prescriptions' },
    { name: 'Emergency 1990', icon: PhoneCall, route: '/emergency' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col overflow-hidden selection:bg-[#8D153A]/20">
      
      {/* Premium Hero Section */}
      <section className="relative pt-24 md:pt-36 pb-40 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto w-full z-10 flex flex-col items-center">
        
        {/* Abstract Cultural Patterns (Dumbara-inspired SVG) */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] flex items-center justify-center overflow-hidden">
           <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
             <path d="M0,0 L10,10 L0,20 L10,30 L0,40 L10,50 L0,60 L10,70 L0,80 L10,90 L0,100" stroke="#8D153A" fill="none" strokeWidth="0.5" />
             <path d="M100,0 L90,10 L100,20 L90,30 L100,40 L90,50 L100,60 L90,70 L100,80 L90,90 L100,100" stroke="#8D153A" fill="none" strokeWidth="0.5" />
           </svg>
        </div>

        {/* Local Welcome Badge */}
        <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white border border-[#FFBE29]/40 shadow-xl backdrop-blur-xl mb-12 animate-slide-up hover:bg-[#FFBE29]/5 transition-all cursor-pointer group">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600"></span>
          </span>
          <span className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] flex gap-3">
             <span>ආයුබෝවන්</span> 
             <span className="text-[#8D153A]">•</span> 
             <span>வணக்கம்</span>
             <span className="text-[#8D153A]">•</span> 
             <span>Welcome</span>
          </span>
        </div>
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[6rem] font-black text-slate-900 mb-8 tracking-tighter text-center animate-slide-up delay-100 max-w-6xl leading-[0.95]">
          Modernizing a <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8D153A] via-[#C9204A] to-[#FFBE29] drop-shadow-sm pb-4 inline-block">Healthy Nation.</span>
        </h1>
        
        <p className="text-lg md:text-2xl text-slate-500 mb-14 max-w-3xl font-medium text-center animate-slide-up delay-200 leading-relaxed">
          The first distributed medical ecosystem built for Sri Lanka. <span className="text-slate-900 border-b-2 border-[#FFBE29]/40">14 Microservices.</span> Instant 1990 Emergency response. Multilingual AI diagnostics.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-5 animate-slide-up delay-300">
          <Link to="/register" className="h-16 px-10 rounded-full bg-[#8D153A] text-white font-black text-xl flex items-center justify-center gap-4 hover:bg-[#71112D] hover:shadow-[0_25px_50px_-12px_rgba(141,21,58,0.4)] transition-all duration-300 group hover:-translate-y-1">
            Access The Network <ArrowRight size={22} className="group-hover:translate-x-2 transition-transform" />
          </Link>
          <Link to="/ai-checker" className="h-16 px-10 rounded-full bg-white border-2 border-[#FFBE29]/30 text-slate-900 font-black text-xl flex items-center justify-center gap-4 hover:border-[#FFBE29] hover:bg-[#FFBE29]/5 transition-all duration-300 shadow-sm hover:-translate-y-1">
             <Sparkles className="text-[#FFBE29]" /> Speak with AI
          </Link>
        </div>

      </section>

      {/* Hero Visual Showcase */}
      <section className="relative z-20 max-w-[1300px] w-full mx-auto px-4 -mt-20 mb-40">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#8D153A] to-[#FFBE29] rounded-[3.5rem] blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
          <div className="relative bg-white p-3 rounded-[3.2rem] shadow-2xl overflow-hidden shadow-[#8D153A]/10">
            <div className="relative aspect-[16/9] w-full bg-slate-100 rounded-[2.5rem] overflow-hidden">
               <img 
                 src={heroImage} 
                 alt="Future of Sri Lankan Healthcare" 
                 className="w-full h-full object-cover transform scale-105 group-hover:scale-100 transition-transform duration-[2000ms]"
               />
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
               
               {/* Overlay Badge */}
               <div className="absolute bottom-10 left-10 flex items-center gap-4 text-white p-6 glass rounded-3xl border border-white/20 backdrop-blur-xl max-w-sm">
                  <div className="w-14 h-14 bg-[#FFBE29] rounded-2xl flex items-center justify-center text-slate-900 shadow-lg">
                     <Activity size={28} />
                  </div>
                  <div>
                     <p className="text-[10px] font-black uppercase tracking-widest text-white/60 mb-0.5">National Deployment</p>
                     <p className="text-xl font-black">Connecting 25 Districts</p>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section className="py-24 relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 bg-white/50 backdrop-blur-md">
        <div className="text-center mb-24">
           <p className="text-[#8D153A] font-black uppercase tracking-[0.3em] text-sm mb-6">Localized Architecture</p>
           <h2 className="text-5xl md:text-7xl font-black text-slate-950 tracking-tighter">Island-Wide Healthcare Cloud.</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, i) => (
            <Link key={i} to={feature.route} className={`premium-glass p-10 hover:-translate-y-2 transition-all duration-500 group relative border-0 shadow-xl shadow-slate-200/40 hover:shadow-2xl overflow-hidden bg-white/80 ${i === 0 || i === 3 ? 'lg:col-span-2' : ''}`}>
              <div className={`absolute top-0 right-0 w-80 h-80 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-700 rounded-full blur-3xl -mr-28 -mt-28`}></div>
              
              <div className={`w-20 h-20 rounded-[1.8rem] ${feature.bg} flex items-center justify-center mb-10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-sm border border-white`}>
                <feature.icon className={`w-10 h-10 ${feature.color}`} />
              </div>
              <h3 className="text-4xl font-black text-slate-950 mb-4 tracking-tight leading-[1.1]">{feature.title}</h3>
              <p className="text-slate-500 text-lg font-medium leading-relaxed mb-8">{feature.desc}</p>
              
              <div className={`flex items-center gap-3 font-black text-slate-950 text-lg opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300`}>
                 Learn More <ArrowRight size={22} className={`${feature.color}`} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Emergency API Loop */}
      <section className="py-24 border-y border-slate-200/40 bg-white overflow-hidden flex whitespace-nowrap overflow-x-hidden">
         <div className="flex animate-marquee-slower items-center">
            {[...microservices, ...microservices].map((srv, idx) => (
               <div key={idx} className="flex items-center gap-5 bg-white px-12 py-6 rounded-full shadow-lg border border-slate-100 mx-5 scale-90 hover:scale-100 transition-all">
                  <span className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-[#8D153A] shadow-inner"><srv.icon size={22}/></span>
                  <span className="font-black text-2xl text-slate-900 tracking-tight">{srv.name} <span className="text-[#FFBE29]">API</span></span>
               </div>
            ))}
         </div>
         <style>{`
           @keyframes marquee-slower {
             0% { transform: translateX(0); }
             100% { transform: translateX(-50%); }
           }
           .animate-marquee-slower {
             animation: marquee-slower 45s linear infinite;
           }
         `}</style>
      </section>

      {/* Elite Doctors Section */}
      <section className="py-40 relative z-10">
         <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-6">
                <div>
                   <h2 className="text-5xl md:text-7xl font-black text-slate-950 mb-6 tracking-tight leading-[0.9]">Finest Medical<br/> <span className="text-[#8D153A]">Network.</span></h2>
                   <p className="text-2xl text-slate-500 font-medium max-w-xl italic">Bridging the gap between the National Hospital and the entire island.</p>
                </div>
                <Link to="/booking" className="px-12 h-20 bg-slate-950 text-white rounded-[2rem] font-black hover:bg-[#8D153A] transition-all text-2xl shadow-2xl flex items-center justify-center">Live Directory</Link>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
               {[ 
                 { name: 'Dr. Aruna Perera', specialty: 'Consultant Neurologist • NHSL', img: 'https://api.dicebear.com/7.x/notionists/svg?seed=Aruna' },
                 { name: 'Dr. Thanuja Silva', specialty: 'Cardiology • Kandy General', img: 'https://api.dicebear.com/7.x/notionists/svg?seed=Thanuja' },
                 { name: 'Dr. Kumara Alwis', specialty: 'Pediatric Surgeon • LRC', img: 'https://api.dicebear.com/7.x/notionists/svg?seed=Kumara' }
               ].map((doc, i) => (
                 <div key={i} className="premium-glass p-10 group hover:border-[#8D153A]/40 transition-all cursor-pointer bg-white shadow-2xl shadow-slate-200/50 rounded-[3rem]">
                    <div className="w-28 h-28 rounded-[2.5rem] bg-slate-100 mb-8 overflow-hidden relative border-4 border-white shadow-xl">
                       <img src={doc.img} alt={doc.name} className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700" />
                    </div>
                    <h3 className="text-4xl font-black text-slate-950 tracking-tight mb-3">{doc.name}</h3>
                    <p className="text-slate-500 text-xl font-bold mb-8 flex items-center gap-3"><Stethoscope size={24} className="text-[#8D153A]" /> {doc.specialty}</p>
                    <div className="flex flex-wrap gap-3">
                       <div className="px-5 py-2 bg-emerald-100 text-emerald-700 rounded-2xl text-[10px] font-black uppercase tracking-widest">SLMC Certified</div>
                       <div className="px-5 py-2 bg-[#8D153A]/10 text-[#8D153A] rounded-2xl text-[10px] font-black uppercase tracking-widest">Video Consultation</div>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* CTA Section - Heritage Redefined */}
      <section className="py-32 relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 w-full mb-24">
         <div className="relative overflow-hidden rounded-[4.5rem] bg-slate-950 text-white p-12 md:p-32 text-center shadow-2xl shadow-[#8D153A]/20 border border-white/5 group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#8D153A]/40 via-transparent to-[#FFBE29]/20 group-hover:scale-105 transition-transform duration-1000"></div>
            
            <div className="relative z-10 flex flex-col items-center">
               <div className="w-28 h-28 bg-white/5 backdrop-blur-2xl rounded-[3rem] flex items-center justify-center mb-12 border border-white/10 hover:rotate-12 transition-transform cursor-pointer">
                  <Heart className="h-14 w-14 text-[#FFBE29] animate-pulse" />
               </div>
               <h2 className="text-5xl md:text-[7rem] font-black mb-10 tracking-tighter max-w-5xl leading-[0.85]">
                 Healthy People. <span className="text-[#FFBE29] block md:inline mt-4">Happy Nation.</span>
               </h2>
               <p className="text-xl md:text-3xl text-slate-400 mb-16 max-w-3xl font-medium leading-relaxed">
                 Join the national medical platform powered by secure, real-time microservices nodes.
               </p>
               <div className="flex flex-col sm:flex-row gap-8">
                  <Link to="/register" className="h-24 px-16 bg-[#8D153A] text-white text-3xl rounded-full font-black shadow-[0_20px_50px_rgba(141,21,58,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-6">
                    Create Health ID <ArrowRight size={36} />
                  </Link>
               </div>
            </div>
         </div>
      </section>

      <footer className="py-16 border-t border-slate-200 bg-white text-center relative z-10">
         <div className="flex items-center justify-center gap-3 mb-4 opacity-50 grayscale hover:grayscale-0 transition-all cursor-pointer">
             <Anchor className="text-navy-900" size={16} />
             <span className="font-black text-xs uppercase tracking-[0.5em]">Lanka Secure Cloud</span>
         </div>
         <p className="text-slate-400 font-bold mb-1 uppercase tracking-widest text-[10px]">System Status: National Grid Online</p>
         <p className="text-slate-900 font-black text-xl mb-2">MediConnect <span className="text-[#8D153A]">Lanka</span></p>
         <p className="text-slate-500 font-medium">© 2026 Distributed Medical Ecosystem. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
