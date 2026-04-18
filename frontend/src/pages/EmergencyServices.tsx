import React, { useState, useEffect } from 'react';
import { 
  AlertCircle, 
  Phone, 
  MapPin, 
  Navigation, 
  Search, 
  Shield, 
  Clock, 
  Heart, 
  Activity,
  ArrowRight,
  Stethoscope,
  Ambulance,
  LifeBuoy
} from 'lucide-react';

interface Hospital {
  id: number;
  name: string;
  distance: string;
  waitTime: string;
  address: string;
  type: 'General' | 'Specialist' | 'Clinc';
  phone: string;
}

export default function EmergencyServices() {
  const [sosActive, setSosActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [hospitals] = useState<Hospital[]>([
    { id: 1, name: "City General Hospital", distance: "1.2 km", waitTime: "15 mins", address: "123 Healthcare Dr, Colombo", type: 'General', phone: "+94 11 123 4567" },
    { id: 2, name: "Lanka Specialist Center", distance: "3.5 km", waitTime: "5 mins", address: "45 Medical Plaza, Kandy", type: 'Specialist', phone: "+94 81 765 4321" },
    { id: 3, name: "QuickCare Clinic", distance: "0.8 km", waitTime: "2 mins", address: "89 Wellness St, Galle", type: 'Clinc', phone: "+94 91 999 8888" }
  ]);

  const handleSOS = () => {
    setLoading(true);
    setTimeout(() => {
      setSosActive(true);
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 animate-slide-up">
      {/* Hero SOS Section */}
      <div className="relative mb-12">
        <div className={`absolute inset-0 bg-red-500/20 blur-[100px] rounded-full transition-opacity duration-1000 ${sosActive ? 'opacity-100 animate-pulse' : 'opacity-30'}`}></div>
        
        <div className="premium-glass p-8 md:p-12 text-center bg-white/40 overflow-hidden relative border-red-100">
          {sosActive ? (
            <div className="animate-in zoom-in duration-500 flex flex-col items-center">
              <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center text-white mb-6 animate-bounce shadow-[0_0_40px_rgba(239,68,68,0.5)]">
                <Shield size={48} />
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight uppercase">Emergency Signal Sent</h1>
              <p className="text-lg text-slate-600 font-medium max-w-lg mx-auto">Help is on the way. We've notified 1204 City General and your emergency contacts. Stay where you are.</p>
              <div className="mt-8 flex gap-4">
                <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all">
                  <Phone size={20} /> Call Dispatch
                </button>
                <button onClick={() => setSosActive(false)} className="px-8 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold hover:bg-slate-50 transition-all">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 text-red-700 font-bold text-xs uppercase tracking-widest mb-6 border border-red-100">
                <AlertCircle size={14} /> Immediate Assistance
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6 tracking-tight">Need Urgent Help?</h1>
              <p className="text-xl text-slate-500 font-medium max-w-xl mx-auto mb-10">Press the button below to alert emergency services and the nearest hospital instantly.</p>
              
              <button 
                onClick={handleSOS}
                disabled={loading}
                className="relative group w-48 h-48 md:w-56 md:h-56 rounded-full bg-red-500 text-white shadow-[0_10px_50px_rgba(239,68,68,0.4)] hover:shadow-[0_20px_70px_rgba(239,68,68,0.6)] transform hover:scale-105 transition-all duration-300 flex items-center justify-center border-8 border-white overflow-hidden active:scale-95"
              >
                {loading ? (
                  <Activity className="animate-spin" size={64} />
                ) : (
                  <div className="text-center">
                    <Phone size={64} className="mx-auto mb-2 group-hover:animate-shake" />
                    <span className="text-2xl font-black tracking-widest uppercase">SOS</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
              </button>
              
              <p className="mt-8 text-sm font-bold text-slate-400 uppercase tracking-widest">Hold for 2 seconds to trigger</p>
            </div>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Nearby Hospitals */}
        <div className="md:col-span-2 space-y-6">
          <div className="flex justify-between items-end mb-2">
            <h2 className="text-2xl font-black text-slate-900 flex items-center gap-3">
              <Navigation className="text-indigo-600" /> Nearby Hospitals
            </h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input type="text" placeholder="Search facilities..." className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
          </div>

          <div className="grid gap-4">
            {hospitals.map(hospital => (
              <div key={hospital.id} className="premium-glass p-6 group hover:border-indigo-200 cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex gap-4">
                  <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center shrink-0 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
                    <Ambulance size={28} />
                  </div>
                  <div>
                    <h3 className="text-xl font-extrabold text-slate-900 leading-tight">{hospital.name}</h3>
                    <div className="flex items-center gap-3 mt-1.5 text-sm font-medium text-slate-500">
                      <span className="flex items-center gap-1"><MapPin size={14}/> {hospital.distance}</span>
                      <span className="flex items-center gap-1 text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg"><Clock size={14}/> {hospital.waitTime} wait</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                  <button className="flex-1 md:flex-none px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2">
                    <Phone size={16} /> Contact
                  </button>
                  <button className="flex-1 md:flex-none px-5 py-2.5 btn-gradient text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2">
                    Navigate <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="premium-glass p-6 bg-slate-900 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl"></div>
            <h3 className="text-lg font-black mb-4 flex items-center gap-2">
               <Heart className="text-red-400" /> Emergency Profile
            </h3>
            <div className="space-y-4 relative z-10">
               <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Blood Type</p>
                  <p className="text-2xl font-black text-white">O Positive (O+)</p>
               </div>
               <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Key Allegies</p>
                  <span className="bg-red-500/20 text-red-200 px-2 py-1 rounded text-xs font-bold mr-2 border border-red-500/30">Penicillin</span>
                  <span className="bg-red-500/20 text-red-200 px-2 py-1 rounded text-xs font-bold border border-red-500/30">Peanuts</span>
               </div>
               <div className="pt-4 border-t border-slate-700">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Primary Contact</p>
                  <p className="font-bold text-white mb-1">Jane Doe (Wife)</p>
                  <p className="text-sm font-medium text-slate-300 text-blue-400">+94 77 123 4567</p>
               </div>
               <button className="w-full mt-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 border border-white/10">
                  Edit Profile <ArrowRight size={16} />
               </button>
            </div>
          </div>

          <div className="premium-glass p-6">
             <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                <LifeBuoy className="text-emerald-500" /> Quick Tips
             </h3>
             <ul className="space-y-3">
                {[ 
                  { icon: Activity, text: "Check pulse and responsiveness regularly." },
                  { icon: Stethoscope, text: "Do not move the victim if neck injury is suspected." },
                  { icon: Shield, text: "Apply direct pressure to heavy bleeding." }
                ].map((tip, i) => (
                  <li key={i} className="flex gap-3 text-sm text-slate-600">
                    <tip.icon size={18} className="text-slate-400 shrink-0" />
                    <span className="font-medium">{tip.text}</span>
                  </li>
                ))}
             </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
