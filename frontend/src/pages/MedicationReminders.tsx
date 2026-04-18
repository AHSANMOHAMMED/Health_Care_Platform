import React, { useState } from 'react';
import { 
  Bell, 
  Plus, 
  Trash2, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Moon, 
  Sun, 
  Sunrise, 
  MoreVertical,
  Activity,
  Heart,
  Pill,
  History,
  ShieldCheck
} from 'lucide-react';

interface Medication {
  id: string;
  name: string;
  type: 'Pill' | 'Capsule' | 'Liquid' | 'Injection';
  dosage: string;
  time: string[];
  remaining: number;
  total: number;
  color: string;
  status: 'scheduled' | 'taken' | 'missed';
}

export default function MedicationReminders() {
  const [medications, setMedications] = useState<Medication[]>([
    { id: '1', name: 'Amoxicillin', type: 'Capsule', dosage: '500mg', time: ['08:00', '14:00', '20:00'], remaining: 12, total: 30, color: 'bg-indigo-500', status: 'scheduled' },
    { id: '2', name: 'Lisinopril', type: 'Pill', dosage: '10mg', time: ['09:00'], remaining: 5, total: 30, color: 'bg-emerald-500', status: 'taken' },
    { id: '3', name: 'Metformin', type: 'Pill', dosage: '850mg', time: ['08:00', '20:00'], remaining: 45, total: 60, color: 'bg-amber-500', status: 'missed' }
  ]);

  const [filter, setFilter] = useState<'all' | 'morning' | 'afternoon' | 'evening'>('all');

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 animate-slide-up">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight flex items-center gap-3">
             <Bell className="text-indigo-600 animate-swing" /> Medication Tracker
          </h1>
          <p className="text-lg text-slate-500 font-medium mt-1">Never miss a dose. Manage your daily medication schedule.</p>
        </div>
        <button className="btn-gradient px-8 py-4 shadow-indigo-500/20 text-lg font-bold flex items-center gap-2">
           <Plus size={22} /> Add New Medication
        </button>
      </div>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Daily Schedule Navigation */}
        <div className="lg:col-span-1 space-y-4">
           <div className="premium-glass p-6 sticky top-24">
              <h3 className="text-xl font-bold font-black text-slate-900 mb-6">Daily Slots</h3>
              <div className="space-y-3">
                 {[ 
                   { id: 'all', label: 'All Day', icon: Activity, count: 6 },
                   { id: 'morning', label: 'Morning', icon: Sunrise, count: 2 },
                   { id: 'afternoon', label: 'Afternoon', icon: Sun, count: 1 },
                   { id: 'evening', label: 'Evening', icon: Moon, count: 3 }
                 ].map(slot => (
                   <button 
                     key={slot.id}
                     onClick={() => setFilter(slot.id as any)}
                     className={`w-full flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 ${filter === slot.id ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-white border-slate-100 text-slate-600 hover:border-indigo-200 hover:bg-indigo-50/30'}`}>
                      <div className="flex items-center gap-3">
                         <slot.icon size={20} className={filter === slot.id ? 'text-indigo-200' : 'text-slate-400'} />
                         <span className="font-bold">{slot.label}</span>
                      </div>
                      <span className={`px-2 py-0.5 rounded-lg text-xs font-black ${filter === slot.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'}`}>
                         {slot.count}
                      </span>
                   </button>
                 ))}
              </div>

              <div className="mt-10 pt-10 border-t border-slate-100 space-y-6">
                 <div className="flex justify-between items-end border-b border-slate-100 pb-4">
                    <p className="text-sm font-black uppercase tracking-widest text-slate-400">Streak</p>
                    <p className="text-3xl font-black text-emerald-600">12 Days</p>
                 </div>
                 <div className="flex justify-between items-end border-b border-slate-100 pb-4">
                    <p className="text-sm font-black uppercase tracking-widest text-slate-400">Total Taken</p>
                    <p className="text-3xl font-black text-slate-900">142</p>
                 </div>
              </div>
           </div>
        </div>

        {/* Main Medication List */}
        <div className="lg:col-span-3 space-y-6">
           {medications.map(med => (
             <div key={med.id} className="premium-glass p-8 group hover:border-indigo-200 transition-all cursor-pointer relative overflow-hidden">
                <div className={`absolute top-0 left-0 w-2 h-full ${med.color}`}></div>
                
                <div className="flex flex-col md:flex-row justify-between gap-6">
                   <div className="flex gap-6">
                      <div className={`w-20 h-20 rounded-[2rem] ${med.color} flex items-center justify-center text-white shadow-lg shadow-black/5 shrink-0 group-hover:scale-105 transition-transform duration-500`}>
                         <Pill size={40} />
                      </div>
                      <div>
                         <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-3xl font-black text-slate-900 tracking-tight">{med.name}</h3>
                            <span className="px-3 py-1 bg-slate-100 text-slate-500 rounded-full text-xs font-black uppercase tracking-widest border border-slate-200">{med.type}</span>
                         </div>
                         <div className="flex flex-wrap gap-4 items-center">
                            <span className="flex items-center gap-2 text-slate-500 font-bold"><Clock size={16}/> {med.time.join(', ')}</span>
                            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                            <span className="flex items-center gap-2 text-slate-500 font-bold"><Heart size={16}/> {med.dosage}</span>
                            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                            <span className={`flex items-center gap-2 font-black uppercase text-xs tracking-widest ${med.remaining < 10 ? 'text-red-500' : 'text-emerald-600'}`}>
                               {med.remaining < 10 ? <AlertCircle size={14}/> : <CheckCircle2 size={14}/>} 
                               {med.remaining} Left
                            </span>
                         </div>
                      </div>
                   </div>

                   <div className="flex md:flex-col justify-between items-end gap-3 min-w-[140px]">
                      {med.status === 'taken' ? (
                        <div className="flex flex-col items-end gap-1">
                           <div className="flex items-center gap-2 text-emerald-600 font-black">
                              <CheckCircle2 size={24} /> <span>ALREADY TAKEN</span>
                           </div>
                           <p className="text-xs font-medium text-slate-400">At 09:12 AM Today</p>
                        </div>
                      ) : (
                        <button className="flex-1 md:w-full py-4 bg-slate-900 text-white rounded-2xl font-black hover:bg-indigo-600 transition-all shadow-xl active:scale-95 group/btn">
                           TAKE DOSE <span className="group-hover:translate-x-1 inline-block transition-transform">→</span>
                        </button>
                      )}
                      
                      <div className="flex gap-2">
                         <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 hover:text-slate-600 transition-all">
                            <Plus size={18} />
                         </button>
                         <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 hover:text-red-500 transition-all">
                            <Trash2 size={18} />
                         </button>
                         <button className="p-3 bg-slate-50 text-slate-400 rounded-xl hover:bg-slate-100 transition-all">
                            <MoreVertical size={18} />
                         </button>
                      </div>
                   </div>
                </div>

                {/* Progress Bar for Refill */}
                <div className="mt-8 pt-8 border-t border-slate-100 flex items-center gap-6">
                   <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full ${med.color} shadow-[0_0_10px_rgba(0,0,0,0.1)] transition-all duration-1000`} 
                        style={{ width: `${(med.remaining / med.total) * 100}%` }}></div>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-1">Stock Level</p>
                      <p className="text-sm font-black text-slate-900">{med.remaining}/{med.total} UNITS</p>
                   </div>
                </div>
             </div>
           ))}

           {/* Empty State Mock */}
           <div className="py-20 flex flex-col items-center justify-center text-center opacity-30 group cursor-pointer hover:opacity-50 transition-opacity">
              <div className="w-16 h-16 border-4 border-dashed border-slate-400 rounded-full flex items-center justify-center mb-6">
                 <Plus size={32} />
              </div>
              <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Add More Meds</h4>
              <p className="text-slate-500 font-medium">Keep your health journey organized.</p>
           </div>
        </div>
      </div>

      {/* Analytics Summary */}
      <div className="mt-20 grid md:grid-cols-3 gap-8">
         <div className="premium-glass p-8 bg-slate-900 text-white flex flex-col items-center text-center">
            <History size={40} className="text-indigo-400 mb-4" />
            <h3 className="text-xl font-black mb-2">History Log</h3>
            <p className="text-slate-400 text-sm font-medium mb-6">Export your adherence history as a CSV or PDF for your next visit.</p>
            <button className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold text-sm transition-all border border-white/10">Download History</button>
         </div>
         
         <div className="md:col-span-2 premium-glass p-8 bg-white border-2 border-indigo-50 flex items-center gap-10">
            <div className="relative shrink-0">
               <div className="w-32 h-32 rounded-full border-8 border-indigo-100 flex items-center justify-center">
                  <div className="text-center">
                     <p className="text-3xl font-black text-indigo-600">92%</p>
                     <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Adherence</p>
                  </div>
               </div>
               <svg className="absolute top-0 left-0 w-32 h-32 -rotate-90">
                  <circle className="text-indigo-500" strokeWidth="8" strokeDasharray="314" strokeDashoffset="25" strokeLinecap="round" stroke="currentColor" fill="transparent" r="50" cx="64" cy="64"/>
               </svg>
            </div>
            <div>
               <h3 className="text-2xl font-black text-slate-900 mb-2">Excellent Progress!</h3>
               <p className="text-slate-500 font-medium leading-relaxed">You've missed only 2 doses this month. Consistent medication is key to effective treatment. Keep it up!</p>
               <div className="mt-6 flex items-center gap-2 text-indigo-600 font-black text-sm">
                  <ShieldCheck size={20} /> DOCTOR VERIFIED ADHERENCE
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
