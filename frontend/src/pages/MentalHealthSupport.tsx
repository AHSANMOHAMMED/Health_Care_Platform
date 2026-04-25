import React, { useState } from 'react';
import { 
  Heart, 
  Wind, 
  Moon, 
  Sun, 
  Calendar, 
  MessageCircle, 
  PhoneCall, 
  ShieldCheck, 
  Play, 
  Sparkles, 
  Brain,
  Quote,
  ArrowRight,
  TrendingUp,
  History
} from 'lucide-react';

export default function MentalHealthSupport() {
  const [mood, setMood] = useState<number | null>(null);

  const meditations = [
    { title: 'Morning Mindfulness', duration: '10 min', category: 'Focus', color: 'bg-amber-50 text-amber-600', icon: Sun },
    { title: 'Anxiety Relief', duration: '15 min', category: 'Calm', color: 'bg-indigo-50 text-indigo-600', icon: Wind },
    { title: 'Deep Sleep', duration: '20 min', category: 'Sleep', color: 'bg-slate-900 text-slate-700', icon: Moon }
  ];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 animate-slide-up">
      {/* Hero Section */}
      <div className="relative mb-16">
        <div className="absolute inset-0 bg-indigo-500/10 blur-[120px] rounded-full"></div>
        <div className="premium-glass p-8 md:p-16 flex flex-col md:flex-row items-center gap-12 bg-white/40 overflow-hidden relative">
           <div className="flex-1 space-y-6 relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 font-black text-xs uppercase tracking-widest border border-indigo-100">
                <Sparkles size={14} /> Mindful Discovery
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.1]">
                Your Inner Peace <br/> 
                <span className="gradient-text">Starts Here.</span>
              </h1>
              <p className="text-xl text-slate-600 font-medium max-w-xl">
                Access guided meditations, talk to professional counselors, and track your emotional well-being—all in one safe, private space.
              </p>
              <div className="flex gap-4 pt-4">
                 <button className="btn-gradient px-8 py-4 text-lg font-bold flex items-center gap-2">
                    Connect with Therapist <ArrowRight size={20} />
                 </button>
                 <button className="px-8 py-4 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold hover:bg-slate-50 transition-all">
                    Guided Sessions
                 </button>
              </div>
           </div>
           
           <div className="w-full md:w-1/3 relative group">
              <div className="absolute inset-0 bg-indigo-200 rounded-[3rem] rotate-6 group-hover:rotate-3 transition-transform"></div>
              <div className="relative bg-white p-8 rounded-[3rem] shadow-xl border border-slate-100 flex flex-col items-center text-center">
                 <Brain size={80} className="text-indigo-600 mb-6 animate-pulse" />
                 <h3 className="text-xl font-black text-slate-900 mb-2">Daily Mood Check</h3>
                 <p className="text-sm text-slate-500 font-medium mb-6">How are you feeling today?</p>
                 <div className="flex gap-3 justify-center mb-6">
                    {[ '😔', '😐', '😊', '🤩' ].map((emoji, i) => (
                       <button 
                         key={i} 
                         onClick={() => setMood(i)}
                         className={`text-2xl w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${mood === i ? 'bg-indigo-600 scale-110 shadow-lg shadow-indigo-200' : 'bg-slate-50 hover:bg-slate-100'}`}>
                          {emoji}
                       </button>
                    ))}
                 </div>
                 <button className="text-xs font-black uppercase text-indigo-600 tracking-widest hover:underline">View History</button>
              </div>
           </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Meditation Gallery */}
        <div className="lg:col-span-2 space-y-8">
           <div className="flex justify-between items-end">
              <h2 className="text-3xl font-black text-slate-900 flex items-center gap-3">
                 <Wind size={28} className="text-indigo-500" /> Meditation Gallery
              </h2>
              <button className="text-indigo-600 font-bold hover:underline">View All</button>
           </div>
           
           <div className="grid md:grid-cols-3 gap-6">
              {meditations.map((med, i) => (
                <div key={i} className="premium-glass group hover:-translate-y-2 transition-all cursor-pointer overflow-hidden pb-6">
                   <div className={`h-40 ${med.color} flex items-center justify-center relative`}>
                      <med.icon size={48} className="group-hover:scale-110 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                         <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-slate-900 shadow-xl">
                            <Play fill="currentColor" size={24} />
                         </div>
                      </div>
                   </div>
                   <div className="px-6 pt-6">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-1 block">{med.category} • {med.duration}</span>
                      <h3 className="text-lg font-black text-slate-900 leading-tight">{med.title}</h3>
                   </div>
                </div>
              ))}
           </div>

           {/* Emergency Support Bar */}
           <div className="premium-glass p-8 bg-red-600 text-slate-900 border-none flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl"></div>
              <div className="flex gap-6 items-center">
                 <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center shrink-0 border border-white/20 shadow-xl">
                    <PhoneCall size={32} />
                 </div>
                 <div>
                    <h3 className="text-2xl font-black tracking-tight">Need Support Now?</h3>
                    <p className="text-red-100 font-medium">Professional crisis counselors are available 24/7 if you're in distress.</p>
                 </div>
              </div>
              <button className="px-8 py-4 bg-white text-red-600 rounded-2xl font-extrabold text-lg shadow-2xl hover:scale-105 active:scale-95 transition-all">
                 Call Hotline: 1926
              </button>
           </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
           <div className="premium-glass p-8 bg-slate-900 text-slate-900">
              <Quote className="text-slate-700 h-10 w-10 mb-4" />
              <p className="text-xl font-bold font-serif leading-relaxed italic text-slate-800">
                "What lies behind us and what lies before us are tiny matters compared to what lies within us."
              </p>
              <p className="mt-4 text-sm font-black uppercase tracking-widest text-indigo-400">— Ralph Waldo Emerson</p>
           </div>

           <div className="premium-glass p-8">
              <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                 <TrendingUp className="text-emerald-500" /> My Well-being
              </h3>
              <div className="space-y-6">
                 {[ 
                   { label: 'Weekly Progress', val: '84%', sub: 'Based on check-ins', color: 'bg-indigo-500' },
                   { label: 'Mindful Minutes', val: '120m', sub: 'Goal: 150m this week', color: 'bg-emerald-500' }
                 ].map((stat, i) => (
                   <div key={i}>
                      <div className="flex justify-between items-end mb-2">
                         <p className="text-sm font-bold text-slate-700">{stat.label}</p>
                         <p className="text-lg font-black text-slate-900">{stat.val}</p>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                         <div className={`h-full ${stat.color}`} style={{ width: stat.val }}></div>
                      </div>
                      <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-1.5">{stat.sub}</p>
                   </div>
                 ))}
              </div>
              <button className="w-full mt-10 py-3 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold rounded-xl text-sm transition-all border border-slate-200 flex items-center justify-center gap-2">
                 <History size={16} /> Extended Insights
              </button>
           </div>

           <div className="premium-glass p-8 border-2 border-indigo-50 flex flex-col items-center text-center">
              <ShieldCheck className="text-indigo-600 mb-4" size={40} />
              <h3 className="text-lg font-black text-slate-900 mb-2">Complete Privacy</h3>
              <p className="text-sm font-medium text-slate-500 leading-relaxed">Your emotional tracking data is encrypted and never shared—even with your primary doctor—without your consent.</p>
           </div>
        </div>
      </div>
    </div>
  );
}
