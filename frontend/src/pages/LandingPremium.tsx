import { Link } from 'react-router-dom';
import { 
  Heart, 
  Calendar, 
  Shield, 
  Video, 
  ArrowRight, 
  Stethoscope, 
  Activity, 
  Zap,
  Globe,
  Award,
  CheckCircle2,
  Play,
  Smartphone,
  Sparkles,
  Search
} from 'lucide-react';

export default function Landing() {
  const features = [
    { icon: Video, title: 'Smart Telemedicine', desc: 'Secure 4K video consultations with world-class specialists.', color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { icon: Calendar, title: 'Instant Booking', desc: 'Schedule appointments in seconds with real-time availability.', color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { icon: Zap, title: 'AI Diagnostics', desc: 'Gemini-powered symptom analysis for immediate health insights.', color: 'text-amber-500', bg: 'bg-amber-50' },
    { icon: Shield, title: 'Data Sovereignty', desc: 'Enterprise-grade encryption protecting your most sensitive records.', color: 'text-blue-500', bg: 'bg-blue-50' }
  ];

  return (
    <div className="min-h-screen ambient-bg flex flex-col overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 md:pt-32 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full z-10 flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/5 border border-slate-900/10 shadow-sm backdrop-blur-md mb-8 animate-slide-up hover:bg-slate-900/10 transition-colors cursor-pointer group">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
          </span>
          <span className="text-xs font-black text-slate-800 uppercase tracking-widest">New: AI Health Analysis v2.0</span>
          <ArrowRight size={14} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black text-slate-950 mb-8 tracking-tighter text-center animate-slide-up delay-100 max-w-5xl leading-[0.95]">
          Healthcare, <br/>
          <span className="gradient-text drop-shadow-sm">Redefined for You.</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-2xl font-medium text-center animate-slide-up delay-200 leading-relaxed">
          The all-in-one premium medical ecosystem. Connect with elite doctors, manage biological data, and experience AI-driven wellness.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-5 animate-slide-up delay-300">
          <Link to="/register" className="btn-gradient text-xl px-10 py-5 shadow-2xl shadow-indigo-500/40 font-black tracking-tight group">
            Get Started <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link to="/ai-checker" className="px-10 py-5 bg-white border-2 border-slate-200 text-slate-800 rounded-3xl font-black text-xl hover:border-indigo-600 hover:text-indigo-600 transition-all shadow-xl shadow-slate-200/50 flex items-center gap-3">
             <Sparkles className="text-amber-500" /> AI Symptoms
          </Link>
        </div>

        {/* Floating Abstract UI Elements */}
        <div className="mt-24 w-full max-w-6xl relative animate-slide-up delay-400">
           <div className="absolute -top-12 -left-12 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl animate-blob"></div>
           <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-blob animation-delay-2000"></div>
           
           <div className="premium-glass p-3 md:p-6 rounded-[3.5rem] transform perspective-1000 rotate-x-6 hover:rotate-x-0 transition-all duration-1000 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] bg-white/40 backdrop-blur-2xl border-white/60">
              <div className="bg-slate-950 w-full h-[400px] md:h-[600px] rounded-[2.5rem] overflow-hidden relative border border-slate-800">
                 {/* Mock UI Header */}
                 <div className="absolute top-0 w-full h-16 bg-slate-900/50 backdrop-blur border-b border-white/5 flex items-center justify-between px-8 z-10">
                    <div className="flex gap-2">
                       <div className="w-3 h-3 rounded-full bg-red-500/20"></div><div className="w-3 h-3 rounded-full bg-amber-500/20"></div><div className="w-3 h-3 rounded-full bg-emerald-500/20"></div>
                    </div>
                    <div className="bg-white/5 px-4 py-1.5 rounded-full border border-white/5 flex items-center gap-3">
                       <Search size={14} className="text-slate-500" />
                       <div className="w-32 h-2 bg-white/10 rounded-full"></div>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-indigo-600"></div>
                 </div>

                 {/* Mock UI Content */}
                 <div className="p-8 pt-24 grid grid-cols-12 gap-6 h-full relative overflow-hidden">
                    <div className="col-span-8 space-y-6">
                       <div className="h-48 bg-gradient-to-br from-indigo-600 to-indigo-800 rounded-3xl p-8 flex justify-between items-center shadow-lg group cursor-pointer hover:scale-[1.02] transition-transform">
                          <div className="space-y-4">
                             <div className="h-4 bg-white/20 rounded w-48"></div>
                             <div className="h-8 bg-white rounded w-64"></div>
                             <div className="h-3 bg-white/20 rounded w-24"></div>
                          </div>
                          <Activity className="h-20 w-20 text-white/10" />
                       </div>
                       <div className="grid grid-cols-2 gap-6">
                          <div className="h-48 bg-slate-900 border border-white/5 rounded-3xl p-6 flex flex-col justify-end">
                             <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 mb-auto flex items-center justify-center"><Heart className="text-emerald-500" /></div>
                             <div className="h-2 bg-white/5 rounded w-16 mb-2"></div>
                             <div className="h-4 bg-white rounded w-32"></div>
                          </div>
                          <div className="h-48 bg-slate-900 border border-white/5 rounded-3xl p-6 flex flex-col justify-end">
                             <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 mb-auto flex items-center justify-center"><Video className="text-indigo-500" /></div>
                             <div className="h-2 bg-white/5 rounded w-16 mb-2"></div>
                             <div className="h-4 bg-white rounded w-32"></div>
                          </div>
                       </div>
                    </div>
                    <div className="col-span-4 space-y-6">
                       <div className="h-full bg-slate-900 border border-white/5 rounded-3xl p-6 relative">
                          <div className="h-4 bg-white/10 rounded w-24 mb-6"></div>
                          <div className="space-y-4">
                             {[1,2,3,4,5].map(i => (
                               <div key={i} className="flex gap-4">
                                  <div className="w-8 h-8 rounded-full bg-white/5"></div>
                                  <div className="flex-1 space-y-1">
                                     <div className="h-2 bg-white/10 rounded w-full"></div>
                                     <div className="h-1.5 bg-white/5 rounded w-2/3"></div>
                                  </div>
                               </div>
                             ))}
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
           
           {/* Floating Floating Stat Cards */}
           <div className="hidden lg:block absolute -right-20 top-1/4 animate-float-slow">
              <div className="premium-glass p-6 bg-white/90 backdrop-blur-xl border-white shadow-2xl rounded-[2.5rem] flex items-center gap-4">
                 <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600"><CheckCircle2 size={24}/></div>
                 <div>
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Active Doctors</p>
                    <p className="text-2xl font-black text-slate-900 tracking-tight">1,204+</p>
                 </div>
              </div>
           </div>

           <div className="hidden lg:block absolute -left-20 bottom-1/4 animate-float">
              <div className="premium-glass p-6 bg-slate-900/90 backdrop-blur-xl border-slate-800 shadow-2xl rounded-[2.5rem] flex items-center gap-4 text-white">
                 <div className="w-12 h-12 bg-indigo-500 rounded-2xl flex items-center justify-center text-white"><ArrowRight size={24}/></div>
                 <div>
                    <p className="text-[10px] font-black uppercase text-indigo-400 tracking-widest">Joined Today</p>
                    <p className="text-2xl font-black tracking-tight">412 New</p>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* Trust & Credentials Section */}
      <section className="py-24 relative z-10 bg-slate-950 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(79,70,229,0.1),transparent_50%)]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-16">
              <p className="text-indigo-400 font-black uppercase tracking-widest text-xs mb-4">Certified & Compliant</p>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight">Trusted by Government & Institutions</h2>
           </div>
           
           <div className="flex flex-wrap justify-center gap-12 md:gap-20 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
              <div className="flex items-center gap-3"><Globe size={32} /> <span className="text-2xl font-black tracking-tighter">WHO</span></div>
              <div className="flex items-center gap-3"><Award size={32} /> <span className="text-2xl font-black tracking-tighter">SL-HEALTH</span></div>
              <div className="flex items-center gap-3"><Shield size={32} /> <span className="text-2xl font-black tracking-tighter">HIPAA</span></div>
              <div className="flex items-center gap-3"><Smartphone size={32} /> <span className="text-2xl font-black tracking-tighter">NCMC</span></div>
           </div>
        </div>
      </section>

      {/* Bento Grid Features - Premium Styled */}
      <section className="py-40 relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-8 items-center mb-24">
           <div className="lg:col-span-6">
              <h2 className="text-5xl md:text-7xl font-black text-slate-950 mb-8 tracking-tighter leading-[0.95]">Experience <br/>The Premium Difference.</h2>
              <p className="text-xl text-slate-600 font-medium leading-relaxed">We've combined Silicon Valley technology with top-tier Sri Lankan healthcare to create an ecosystem that finally works for you.</p>
           </div>
           <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <div className="premium-glass p-8 bg-indigo-600 text-white border-none transform -rotate-2 hover:rotate-0 transition-transform cursor-pointer">
                 <h4 className="text-3xl font-black mb-2">99%</h4>
                 <p className="font-bold opacity-80">Patient Satisfaction</p>
              </div>
              <div className="premium-glass p-8 bg-white border-2 border-indigo-50 transform rotate-2 hover:rotate-0 transition-transform cursor-pointer">
                 <h4 className="text-3xl font-black text-indigo-600 mb-2">5min</h4>
                 <p className="font-bold text-slate-600 opacity-80">Avg. Wait Time</p>
              </div>
           </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <div key={i} className={`premium-glass p-10 hover:-translate-y-4 transition-all duration-500 group cursor-pointer ${i === 0 ? 'lg:col-span-2' : ''} ${i === 3 ? 'lg:col-span-2' : ''}`}>
              <div className={`w-16 h-16 rounded-[1.5rem] ${feature.bg} flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
                <feature.icon className={`w-8 h-8 ${feature.color}`} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-4 tracking-tight">{feature.title}</h3>
              <p className="text-slate-500 text-lg font-medium leading-relaxed">{feature.desc}</p>
              <div className="mt-8 flex items-center gap-2 text-indigo-600 font-black text-sm opacity-0 group-hover:opacity-100 translate-x-[-10px] group-hover:translate-x-0 transition-all">
                 Learn More <ArrowRight size={16} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Doctors Section */}
      <section className="py-32 relative z-10 bg-white/60 border-y border-slate-200/50 backdrop-blur-xl">
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                <div>
                   <h2 className="text-4xl md:text-5xl font-black text-slate-950 mb-4 tracking-tight">Our Elite Specialists</h2>
                   <p className="text-xl text-slate-500 font-medium">Access the finest minds in medicine, available on-demand.</p>
                </div>
                <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-slate-800 transition-all text-lg shadow-xl">Browse Directory</button>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
               {[ 
                 { name: 'Dr. Sarah Jenkins', specialty: 'Neurology • Mayo Clinic', img: 'https://api.dicebear.com/7.x/notionists/svg?seed=Sarah' },
                 { name: 'Dr. Michael Chen', specialty: 'Cardiology • Harvard Med', img: 'https://api.dicebear.com/7.x/notionists/svg?seed=Michael' },
                 { name: 'Dr. Emily Watson', specialty: 'Pediatrics • Johns Hopkins', img: 'https://api.dicebear.com/7.x/notionists/svg?seed=Emily' }
               ].map((doc, i) => (
                 <div key={i} className="premium-glass p-8 group hover:border-indigo-200 transition-all cursor-pointer">
                    <div className="w-24 h-24 rounded-[2rem] bg-indigo-50 mb-6 overflow-hidden relative border-2 border-white shadow-inner">
                       <img src={doc.img} alt={doc.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-1">{doc.name}</h3>
                    <p className="text-slate-500 font-bold mb-6 flex items-center gap-2"><Stethoscope size={16} className="text-indigo-400" /> {doc.specialty}</p>
                    <div className="flex gap-2">
                       <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-black uppercase tracking-widest border border-emerald-100">Top Rated</div>
                       <div className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-black uppercase tracking-widest border border-indigo-100">Telemedicine</div>
                    </div>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* CTA Section - Ultra Premium */}
      <section className="py-40 relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
         <div className="relative overflow-hidden rounded-[4rem] bg-slate-950 text-white p-12 md:p-32 text-center shadow-[0_50px_100px_-30px_rgba(79,70,229,0.3)] border border-white/5">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/40 via-transparent to-emerald-600/40"></div>
            <div className="absolute -top-48 -left-48 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-[120px] animate-blob"></div>
            <div className="absolute -bottom-48 -right-48 w-[600px] h-[600px] bg-emerald-500/20 rounded-full blur-[120px] animate-blob animation-delay-2000"></div>
            
            <div className="relative z-10 flex flex-col items-center">
               <div className="w-24 h-24 bg-white/10 backdrop-blur-xl rounded-[2.5rem] flex items-center justify-center mb-12 border border-white/20 animate-pulse">
                  <Heart className="h-12 w-12 text-emerald-400" />
               </div>
               <h2 className="text-6xl md:text-8xl font-black mb-8 tracking-tighter max-w-4xl leading-[0.9]">
                 Begin Your Journey to <br/>
                 <span className="text-indigo-400">Perfect Health.</span>
               </h2>
               <p className="text-xl md:text-2xl text-slate-400 mb-16 max-w-2xl font-medium leading-relaxed">
                 Join 50,000+ residents who already trust MedCare for their family's health and well-being.
               </p>
               <div className="flex flex-col sm:flex-row gap-6">
                  <Link to="/register" className="px-12 py-6 bg-white text-slate-950 rounded-3xl font-black text-2xl shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3">
                    Create Account <ArrowRight size={24} />
                  </Link>
                  <button className="px-12 py-6 bg-white/5 backdrop-blur-xl border border-white/10 text-white rounded-3xl font-black text-2xl hover:bg-white/10 transition-all flex items-center gap-4 group">
                     <Play fill="currentColor" size={24} className="text-indigo-400" /> Watch Demo
                  </button>
               </div>
            </div>
         </div>
      </section>

      {/* Footer Basic */}
      <footer className="py-20 relative z-10 text-center">
         <p className="text-slate-400 font-bold mb-2 uppercase tracking-widest text-[10px]">Release v2.0.4 Platinum</p>
         <p className="text-slate-400 font-bold">© 2024 MedCare Lanka Healthcare Systems. All Rights Reserved.</p>
         <div className="flex justify-center gap-8 mt-6 text-sm font-black text-slate-600 uppercase tracking-widest">
            <a href="#" className="hover:text-indigo-600">Privacy</a>
            <a href="#" className="hover:text-indigo-600">Terms</a>
            <a href="#" className="hover:text-indigo-600">API</a>
            <a href="#" className="hover:text-indigo-600">Support</a>
         </div>
      </footer>
    </div>
  );
}
