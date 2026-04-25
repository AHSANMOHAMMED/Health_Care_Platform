import React, { useState } from 'react';
import { 
  Eye, 
  Type, 
  Settings, 
  Smartphone, 
  CheckCircle2, 
  ChevronRight, 
  ShieldCheck, 
  Sun, 
  Moon, 
  Languages, 
  Volume2, 
  Accessibility,
  ArrowRight,
  User,
  Bell,
  Lock
} from 'lucide-react';

export default function AccessibilitySettings() {
  const [activeTab, setActiveTab] = useState<'profile' | 'accessibility' | 'security' | 'notifications'>('accessibility');

  const settingsOptions = [
    { id: 'profile', icon: User, label: 'Profile Settings' },
    { id: 'accessibility', icon: Accessibility, label: 'Interface' },
    { id: 'security', icon: Lock, label: 'Privacy & Security' },
    { id: 'notifications', icon: Bell, label: 'Notifications' },
  ];

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 animate-slide-up">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
           <Settings className="text-indigo-600 animate-spin-slow" /> Preferences
        </h1>
        <p className="text-lg text-slate-500 font-medium mt-1">Customize your health platform experience and security.</p>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 border-r border-slate-100 pr-8">
           <div className="space-y-2">
              {settingsOptions.map(opt => (
                 <button 
                   key={opt.id}
                   onClick={() => setActiveTab(opt.id as any)}
                   className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all duration-300 font-bold ${activeTab === opt.id ? 'bg-slate-900 text-slate-900 shadow-xl' : 'text-slate-500 hover:bg-slate-50'}`}>
                    <div className="flex items-center gap-3">
                       <opt.icon size={20} />
                       <span>{opt.label}</span>
                    </div>
                    {activeTab === opt.id && <ChevronRight size={18} />}
                 </button>
              ))}
           </div>

           <div className="mt-12 premium-glass p-6 bg-indigo-50 border-indigo-100 flex items-center gap-4">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shrink-0 shadow-sm">
                 <ShieldCheck size={24} />
              </div>
              <p className="text-xs text-indigo-900 font-bold leading-relaxed tracking-tight">Sync settings across all your registered devices.</p>
           </div>
        </div>

        {/* Main Settings Panel */}
        <div className="lg:col-span-3 space-y-12">
           
           {activeTab === 'accessibility' && (
             <div className="animate-in fade-in slide-in-from-right-4 duration-500">
                <section className="mb-12">
                   <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3"><Eye className="text-indigo-600" /> Visual Accessibility</h2>
                   <div className="grid md:grid-cols-2 gap-6">
                      <div className="premium-glass p-8 flex justify-between items-center group cursor-pointer hover:border-indigo-200">
                         <div>
                            <p className="text-lg font-black text-slate-900">High Contrast Mode</p>
                            <p className="text-sm text-slate-500 font-medium">Improves visibility for visual impairments.</p>
                         </div>
                         <button className="w-14 h-8 bg-slate-200 rounded-full relative p-1 transition-colors hover:bg-indigo-300">
                            <div className="w-6 h-6 bg-white rounded-full shadow-sm"></div>
                         </button>
                      </div>
                      <div className="premium-glass p-8 flex flex-col gap-6 group hover:border-indigo-200">
                         <div className="flex justify-between items-center">
                            <p className="text-lg font-black text-slate-900">Text Size</p>
                            <span className="text-xs font-black bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full border border-indigo-100">Medium (Default)</span>
                         </div>
                         <div className="flex items-center gap-4">
                            <span className="text-sm font-bold text-slate-600">A</span>
                            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden relative">
                               <div className="absolute top-0 left-0 w-1/2 h-full bg-indigo-600"></div>
                            </div>
                            <span className="text-2xl font-bold text-slate-600">A</span>
                         </div>
                      </div>
                   </div>
                </section>

                <section className="mb-12">
                   <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3"><Sun className="text-amber-500" /> Theme & Appearance</h2>
                   <div className="grid md:grid-cols-3 gap-6">
                      {[ 
                        { id: 'light', label: 'Light', icon: Sun, color: 'text-amber-500 bg-amber-50 border-amber-100' },
                        { id: 'dark', label: 'Cinematic Dark', icon: Moon, color: 'text-slate-800 bg-slate-900 border-slate-700' },
                        { id: 'system', label: 'Match System', icon: Smartphone, color: 'text-indigo-600 bg-indigo-50 border-indigo-100' }
                      ].map((theme, i) => (
                        <button key={i} className={`p-8 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-4 relative overflow-hidden group ${i === 2 ? 'ring-4 ring-indigo-500/20 border-indigo-500' : 'border-slate-100 hover:border-indigo-200'}`}>
                           <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${theme.color} shadow-sm group-hover:scale-110 transition-transform`}>
                              <theme.icon size={28} />
                           </div>
                           <span className="font-extrabold text-slate-900">{theme.label}</span>
                           {i === 2 && <CheckCircle2 className="absolute top-4 right-4 text-indigo-600" size={20} />}
                        </button>
                      ))}
                   </div>
                </section>

                <section>
                   <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3"><Languages className="text-emerald-500" /> Language & Voice</h2>
                   <div className="premium-glass p-8 space-y-8">
                      <div className="flex justify-between items-center group cursor-pointer">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                               <Languages size={24} />
                            </div>
                            <div>
                               <p className="text-lg font-black text-slate-900">Primary Language</p>
                               <p className="text-sm font-bold text-slate-600">Select your preferred system language.</p>
                            </div>
                         </div>
                         <button className="flex items-center gap-2 font-bold text-slate-600">English (US) <ChevronRight size={18} /></button>
                      </div>
                      <div className="flex justify-between items-center group cursor-pointer border-t border-slate-50 pt-8">
                         <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all">
                               <Volume2 size={24} />
                            </div>
                            <div>
                               <p className="text-lg font-black text-slate-900">Audio Feedback</p>
                               <p className="text-sm font-bold text-slate-600">Read out system instructions and alerts.</p>
                            </div>
                         </div>
                         <button className="w-14 h-8 bg-slate-900 rounded-full relative p-1 transition-colors">
                            <div className="w-6 h-6 bg-white rounded-full shadow-sm translate-x-6"></div>
                         </button>
                      </div>
                   </div>
                </section>
             </div>
           )}

           {activeTab === 'profile' && (
             <div className="flex flex-col items-center justify-center text-center py-20 opacity-30 animate-in fade-in duration-500">
                <User size={64} className="mb-6" />
                <h3 className="text-2xl font-black uppercase tracking-tighter">Profile Expansion</h3>
                <p className="text-slate-500 font-medium">Advanced profile management coming soon.</p>
             </div>
           )}

           <div className="pt-20 border-t border-slate-100 flex justify-end gap-4">
              <button className="px-8 py-4 text-slate-500 font-bold hover:text-slate-700 transition-all">Reset to Default</button>
              <button className="btn-primary px-10 py-4 font-black shadow-slate-900/20 text-lg flex items-center gap-2">
                 Save Preferences <ArrowRight size={20} />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
