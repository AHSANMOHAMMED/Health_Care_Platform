import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Heart, Calendar, Shield, Video, ArrowRight, Stethoscope, 
  Activity, Zap, Globe, Award, CheckCircle2, Play, 
  Smartphone, Sparkles, Search, Pill, CreditCard, Bell, 
  Microscope, Users, FileText, PhoneCall
} from 'lucide-react';

export default function Landing() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const features = [
    { icon: Video, title: 'Telemedicine Service', route: '/telemedicine', desc: 'Secure 4K video consultations directly managed by our real-time WebRTC backend bridge.', color: 'text-indigo-500', bg: 'bg-indigo-50', gradient: 'from-indigo-500 to-blue-500' },
    { icon: Calendar, title: 'Appointment Engine', route: '/booking', desc: 'High-concurrency booking flow hooking into the dedicated Doctor & Schedule microservices.', color: 'text-emerald-500', bg: 'bg-emerald-50', gradient: 'from-emerald-400 to-teal-500' },
    { icon: Zap, title: 'AI Diagnostics', route: '/ai-checker', desc: 'Gemini-powered neural symptom analysis delivering sub-second health insights.', color: 'text-amber-500', bg: 'bg-amber-50', gradient: 'from-amber-400 to-orange-500' },
    { icon: Shield, title: 'Identity & Auth', route: '/register', desc: 'Enterprise-grade JWT encryption protecting your records across the distributed ecosystem.', color: 'text-rose-500', bg: 'bg-rose-50', gradient: 'from-rose-400 to-red-500' }
  ];

  const microservices = [
    { name: 'Pharmacy Network', icon: Pill, route: '/pharmacy' },
    { name: 'Payment Gateway', icon: CreditCard, route: '/settings' },
    { name: 'Lab Integration', icon: Microscope, route: '/lab-results' },
    { name: 'Push Notifications', icon: Bell, route: '/notifications' },
    { name: 'Prescription Sync', icon: FileText, route: '/prescriptions' },
    { name: '1990 Suwa Seriya API', icon: PhoneCall, route: '/emergency' },
  ];

  return (
    <div className="min-h-screen ambient-bg flex flex-col overflow-hidden selection:bg-indigo-200">
      
      {/* Dynamic 3D Hero Section */}
      <section className="relative pt-24 md:pt-36 pb-32 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto w-full z-10 flex flex-col items-center">
        
        {/* Orbital Background Elements */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-40 transition-transform duration-1000 ease-out" 
          style={{ transform: `translateY(${scrollY * 0.2}px)` }}
        >
          <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-indigo-400/20 rounded-full blur-[100px] animate-blob"></div>
          <div className="absolute top-[20%] right-[10%] w-[600px] h-[600px] bg-emerald-400/20 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
          
          {/* Realistic Medical ECG Overlay */}
          <svg className="absolute top-[40%] text-emerald-500/20 w-full h-[300px]" preserveAspectRatio="none" viewBox="0 0 1000 100">
            <path 
              d="M0,50 L200,50 L230,20 L270,90 L310,10 L350,50 L600,50 L630,20 L670,90 L710,10 L750,50 L1000,50" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              className="animate-ecg"
            />
          </svg>
        </div>

        <Link to="/ai-checker" className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-white/40 border border-white/60 shadow-[0_8px_16px_rgba(0,0,0,0.03)] backdrop-blur-xl mb-10 animate-slide-up hover:bg-white/60 hover:scale-105 transition-all cursor-pointer group">
          <span className="flex h-2.5 w-2.5 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-600"></span>
          </span>
          <span className="text-xs font-black text-indigo-900 uppercase tracking-widest">Live: AI Microservice v2.0 is Online</span>
          <ArrowRight size={14} className="text-indigo-400 group-hover:translate-x-1 group-hover:text-indigo-600 transition-all" />
        </Link>
        
        <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-[5.5rem] font-black text-slate-900 mb-6 tracking-tighter text-center animate-slide-up delay-100 max-w-5xl leading-[1.1] px-4 md:px-0">
          The Future of <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-blue-500 to-emerald-400 drop-shadow-sm pb-2">Sri Lankan Healthcare.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-slate-500 mb-12 max-w-2xl font-medium text-center animate-slide-up delay-200 leading-relaxed">
          Powered by 11 distributed Spring Boot microservices. Experience instant AI triage, native language support, and seamless 1990 Emergency integration.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 animate-slide-up delay-300">
          <Link to="/register" className="h-14 px-8 rounded-full bg-slate-900 text-white font-black text-lg flex items-center justify-center gap-3 hover:bg-indigo-600 hover:shadow-[0_20px_40px_-10px_rgba(79,70,229,0.5)] transition-all duration-300 shadow-lg group hover:-translate-y-1">
            Access Network <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
          </Link>
          <Link to="/ai-checker" className="h-14 px-8 rounded-full bg-white border-2 border-slate-200/60 text-slate-800 font-black text-lg flex items-center justify-center gap-3 hover:border-amber-400 hover:shadow-[0_20px_40px_-10px_rgba(251,191,36,0.3)] hover:bg-amber-50/50 transition-all duration-300 shadow-sm hover:-translate-y-1">
             <Sparkles className="text-amber-500" /> Talk to AI Doctor
          </Link>
        </div>

      </section>

      {/* Floating System Architecture Dashboard */}
      <section className="relative z-20 max-w-[1200px] w-full mx-auto px-4 -mt-10 mb-32 perspective-1000">
        <div 
          className="premium-glass p-2 rounded-[3rem] bg-white/30 border-white/50 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] backdrop-blur-3xl transition-transform duration-1000 ease-out"
          style={{ transform: `rotateX(${Math.max(0, 15 - scrollY * 0.05)}deg) scale(${Math.min(1, 0.95 + scrollY * 0.0002)})` }}
        >
          <div className="bg-slate-950 w-full h-[600px] rounded-[2.5rem] overflow-hidden relative shadow-inner flex flex-col">
            {/* Header */}
            <div className="h-16 bg-white/5 backdrop-blur-md border-b border-white/10 flex items-center justify-between px-6 shrink-0">
               <div className="flex gap-2">
                  <div className="w-3.5 h-3.5 rounded-full bg-red-400/80"></div>
                  <div className="w-3.5 h-3.5 rounded-full bg-amber-400/80"></div>
                  <div className="w-3.5 h-3.5 rounded-full bg-emerald-400/80"></div>
               </div>
               <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-emerald-400">
                  <span className="relative flex h-2 w-2"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span></span>
                  AKS Cluster Connected
               </div>
            </div>

            {/* Content: Network Topology Map */}
            <div className="flex-1 p-8 grid grid-cols-12 gap-6 overflow-hidden relative bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03)_0%,transparent_100%)]">
              
              {/* Traffic Node Main */}
              <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
                 <div className="flex-1 bg-white/[0.03] border border-white/10 rounded-3xl p-8 relative overflow-hidden group hover:bg-white/[0.05] transition-colors">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-3xl rounded-full"></div>
                    <div className="relative z-10 flex justify-between items-start">
                       <div>
                          <div className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">API Gateway Entrypoint</div>
                          <h3 className="text-3xl font-black text-white tracking-tight">System Traffic Routing</h3>
                          <div className="mt-8 space-y-4">
                             {[
                               {name: 'api-gateway', status: 'Routing'},
                               {name: 'auth-service', status: 'Verifying JWT'},
                               {name: 'service-registry', status: 'Heartbeat OK'}
                             ].map((s,i) => (
                               <div key={i} className="flex items-center justify-between bg-black/40 p-3 rounded-2xl border border-white/5">
                                 <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400"><Activity size={14}/></div>
                                    <span className="text-white/80 font-bold">{s.name}</span>
                                 </div>
                                 <span className="text-xs text-emerald-400 font-bold">{s.status}</span>
                               </div>
                             ))}
                          </div>
                       </div>
                       <Activity className="text-white/5 w-32 h-32 absolute right-[-20px] bottom-[-20px] group-hover:scale-110 transition-transform duration-700" />
                    </div>
                 </div>
              </div>

              {/* Live Metric Cards */}
              <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
                 <div className="h-48 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-3xl p-6 relative overflow-hidden shadow-xl">
                    <div className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-1">Live Database Sync</div>
                    <div className="text-5xl font-black text-white my-4">2.4ms</div>
                    <div className="text-white/80 text-sm font-bold">Azure PostgreSQL Cluster</div>
                    <Globe className="absolute -bottom-4 -right-4 w-32 h-32 text-black/10" />
                 </div>
                 <div className="flex-1 bg-white/[0.03] border border-white/10 rounded-3xl p-6 flex flex-col justify-end">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-auto"><Users size={20}/></div>
                    <div className="text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">Active Medical Nodes</div>
                    <div className="text-2xl font-black text-white">All 14 Services Up</div>
                 </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Core Microservices Bento Grid */}
      <section className="py-24 relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
           <p className="text-indigo-600 font-black uppercase tracking-widest text-sm mb-4">The Ecosystem Engine</p>
           <h2 className="text-5xl md:text-6xl font-black text-slate-900 tracking-tighter">Explore Our Microservices.</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <Link key={i} to={feature.route} className={`premium-glass p-8 hover:-translate-y-2 transition-all duration-500 group relative overflow-hidden ${i === 0 || i === 3 ? 'lg:col-span-2' : ''}`}>
              <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-700 rounded-full blur-3xl -mr-20 -mt-20`}></div>
              
              <div className={`w-16 h-16 rounded-[1.5rem] ${feature.bg} flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-sm border border-white`}>
                <feature.icon className={`w-8 h-8 ${feature.color}`} />
              </div>
              <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">{feature.title}</h3>
              <p className="text-slate-500 font-medium leading-relaxed mb-6">{feature.desc}</p>
              
              <div className="flex items-center gap-2 text-slate-900 font-black opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                 Access Module <ArrowRight size={18} className={`${feature.color}`} />
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Additional Sub-Services Scroller */}
      <section className="py-20 border-y border-slate-200/40 bg-white/40 backdrop-blur-md overflow-hidden flex whitespace-nowrap">
         <div className="animate-spin-slow" style={{ animation: 'marquee 40s linear infinite' }}>
            <style>{`@keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }`}</style>
            <div className="flex gap-8 px-4 items-center">
               {[...microservices, ...microservices, ...microservices].map((srv, idx) => (
                  <Link key={idx} to={srv.route} className="flex items-center gap-4 bg-white/80 px-8 py-5 rounded-full shadow-sm hover:shadow-lg border border-slate-100 hover:border-indigo-200 transition-all cursor-pointer group">
                     <span className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all"><srv.icon size={18}/></span>
                     <span className="font-black text-xl text-slate-800 tracking-tight">{srv.name} API</span>
                  </Link>
               ))}
            </div>
         </div>
      </section>

      {/* Elite Doctors Section */}
      <section className="py-32 relative z-10">
         <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                <div>
                   <h2 className="text-4xl md:text-6xl font-black text-slate-950 mb-4 tracking-tight">Our Elite Specialists</h2>
                   <p className="text-xl text-slate-500 font-medium">Access the finest minds via the Doctor Microservice API.</p>
                </div>
                <Link to="/booking" className="px-10 py-5 bg-slate-900 text-white rounded-3xl font-black hover:bg-indigo-600 transition-all text-xl shadow-xl hover:-translate-y-1">Live Directory</Link>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
               {[ 
                 { name: 'Dr. Sarah Jenkins', specialty: 'Neurology • Mayo Clinic', img: 'https://api.dicebear.com/7.x/notionists/svg?seed=Sarah' },
                 { name: 'Dr. Michael Chen', specialty: 'Cardiology • Harvard Med', img: 'https://api.dicebear.com/7.x/notionists/svg?seed=Michael' },
                 { name: 'Dr. Emily Watson', specialty: 'Pediatrics • Johns Hopkins', img: 'https://api.dicebear.com/7.x/notionists/svg?seed=Emily' }
               ].map((doc, i) => (
                 <div key={i} className="premium-glass p-8 group hover:border-indigo-300 transition-all cursor-pointer bg-white">
                    <div className="w-24 h-24 rounded-[2rem] bg-indigo-50 mb-6 overflow-hidden relative border-4 border-slate-50 shadow-inner">
                       <img src={doc.img} alt={doc.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-2">{doc.name}</h3>
                    <p className="text-slate-500 text-lg font-bold mb-6 flex items-center gap-2"><Stethoscope size={18} className="text-indigo-400" /> {doc.specialty}</p>
                    <div className="flex gap-2">
                       <div className="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl text-xs font-black uppercase tracking-widest border border-emerald-100">Top Rated</div>
                       <div className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-xl text-xs font-black uppercase tracking-widest border border-indigo-100">Telemedicine</div>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* CTA Section - Ultra Premium */}
      <section className="py-24 relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 w-full mb-20">
         <div className="relative overflow-hidden rounded-[3rem] bg-slate-950 text-white p-12 md:p-32 text-center shadow-[0_50px_100px_-30px_rgba(79,70,229,0.3)] border border-white/10 group">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/40 via-transparent to-emerald-600/40 group-hover:scale-105 transition-transform duration-1000"></div>
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.15)_0%,transparent_60%)] pointer-events-none"></div>
            
            <div className="relative z-10 flex flex-col items-center">
               <div className="w-24 h-24 bg-white/10 backdrop-blur-xl rounded-[2.5rem] flex items-center justify-center mb-10 border border-white/20 hover:scale-110 transition-transform cursor-pointer">
                  <Heart className="h-12 w-12 text-emerald-400 animate-pulse" />
               </div>
               <h2 className="text-5xl md:text-8xl font-black mb-8 tracking-tighter max-w-4xl leading-[0.9]">
                 Begin Your Journey to <span className="text-indigo-400 block mt-2">Perfect Health.</span>
               </h2>
               <p className="text-xl md:text-3xl text-slate-400 mb-16 max-w-2xl font-medium leading-relaxed">
                 Join the decentralized medical platform powered by secure, real-time microservices.
               </p>
               <div className="flex flex-col sm:flex-row gap-6">
                  <Link to="/register" className="h-20 px-12 bg-white text-slate-950 text-2xl rounded-full font-black shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-4 hover:bg-slate-50">
                    Create Identity <ArrowRight size={28} />
                  </Link>
               </div>
            </div>
         </div>
      </section>

      <footer className="py-12 border-t border-slate-200/60 bg-white/60 backdrop-blur text-center relative z-10">
         <p className="text-slate-400 font-black mb-1 uppercase tracking-widest text-[11px]">System Status: All Services Operational</p>
         <p className="text-slate-500 font-bold text-lg">© 2026 MediConnect Distributed Platform. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
