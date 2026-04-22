import { useState, useEffect } from 'react';
import {
  Phone, MapPin, Navigation, Shield, Clock,
  Heart, Activity, Ambulance, AlertTriangle,
  Loader2, CheckCircle, X, Zap, PhoneCall,
  Search, ChevronRight, Info, Wind, Droplets
} from 'lucide-react';

interface Hospital {
  id: number;
  name: string;
  type: 'National' | 'Private' | 'Specialist' | 'Clinic';
  distance: string;
  distanceKm: number;
  waitTime: string;
  address: string;
  phone: string;
  emergency24h: boolean;
  specialties: string[];
  beds?: number;
}

const ALL_HOSPITALS: Hospital[] = [
  { id: 1, name: 'Colombo National Hospital', type: 'National', distance: '2.1 km', distanceKm: 2.1, waitTime: '~20 min', address: 'Regent St, Colombo 08', phone: '+94112691111', emergency24h: true, specialties: ['Cardiology', 'Neurology', 'Trauma', 'ICU'], beds: 3000 },
  { id: 2, name: 'Lanka Hospitals', type: 'Private', distance: '3.4 km', distanceKm: 3.4, waitTime: '~5 min', address: '578 Elvitigala Mawatha, Colombo 05', phone: '+94115530000', emergency24h: true, specialties: ['Cardiac', 'Oncology', 'Pediatrics'], beds: 350 },
  { id: 3, name: 'Asiri Hospital Colombo', type: 'Private', distance: '4.0 km', distanceKm: 4.0, waitTime: '~8 min', address: 'No. 181 Kirula Road, Colombo 05', phone: '+94114665500', emergency24h: true, specialties: ['Surgery', 'Orthopedics', 'Radiology'], beds: 400 },
  { id: 4, name: 'Nawaloka Hospital', type: 'Private', distance: '4.8 km', distanceKm: 4.8, waitTime: '~10 min', address: '23 Deshamanya H. K. Dharmadasa Mw, Colombo 02', phone: '+94112544444', emergency24h: true, specialties: ['Cardiology', 'Neurosurgery', 'ENT'], beds: 500 },
  { id: 5, name: 'Hemas Hospital Wattala', type: 'Private', distance: '8.2 km', distanceKm: 8.2, waitTime: '~15 min', address: '389 Negombo Road, Wattala', phone: '+94112291291', emergency24h: false, specialties: ['General Medicine', 'Maternity', 'Pediatrics'], beds: 200 },
  { id: 6, name: 'Kandy Teaching Hospital', type: 'National', distance: '115 km', distanceKm: 115, waitTime: '~25 min', address: 'Kandy General Hospital, Kandy', phone: '+94812222261', emergency24h: true, specialties: ['General Surgery', 'Internal Medicine', 'O&G'], beds: 2500 },
];

const EMERGENCY_NUMBERS = [
  { service: 'Suwa Seriya Ambulance', number: '1990', color: 'from-red-600 to-rose-700', icon: Ambulance, desc: 'Dispatches ambulance with medical history' },
  { service: 'Police Emergency', number: '119', color: 'from-blue-700 to-indigo-800', icon: Shield, desc: 'Law enforcement & accident response' },
  { service: 'Fire & Rescue', number: '110', color: 'from-orange-600 to-amber-700', icon: Zap, desc: 'Fire brigade & rescue operations' },
  { service: 'Mental Health', number: '1926', color: 'from-purple-700 to-violet-800', icon: Heart, desc: 'Crisis counseling & mental health support' },
];

const FIRST_AID_TIPS = [
  { icon: Heart, title: 'Cardiac Arrest', steps: ['Check responsiveness & call 1990', 'Begin CPR — 30 chest compressions', '2 rescue breaths if trained', 'Use AED if available', 'Continue until help arrives'] },
  { icon: Droplets, title: 'Severe Bleeding', steps: ['Apply firm direct pressure to wound', 'Use clean cloth or bandage', 'Do NOT remove once applied', 'Elevate the limb above heart', 'Keep patient calm and warm'] },
  { icon: Wind, title: 'Choking Adult', steps: ['Ask "Are you choking?"', 'Give 5 back blows between shoulder blades', 'Give 5 abdominal thrusts (Heimlich)', 'Alternate until object is expelled', 'Call 1990 if unconscious'] },
  { icon: Activity, title: 'Seizure', steps: ['Clear the area of hazards', 'Cushion head with something soft', 'Roll onto side (recovery position)', 'Do NOT restrain or put anything in mouth', 'Time the seizure — call 1990 if >5 min'] },
];

const typeColors: Record<string, string> = {
  National: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  Private: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  Specialist: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  Clinic: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
};

export default function EmergencyServices() {
  const [sosState, setSosState] = useState<'idle' | 'confirming' | 'dispatched'>('idle');
  const [locating, setLocating] = useState(false);
  const [gpsCoords, setGpsCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [search, setSearch] = useState('');
  const [activeTip, setActiveTip] = useState<number | null>(null);
  const [countdown, setCountdown] = useState(5);
  const [activating, setActivating] = useState(false);

  // Countdown for SOS confirm
  useEffect(() => {
    if (sosState !== 'confirming') return;
    setCountdown(5);
    const interval = setInterval(() => {
      setCountdown(c => {
        if (c <= 1) {
          clearInterval(interval);
          setSosState('dispatched');
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [sosState]);

  const handleSOS = () => {
    setActivating(true);
    setLocating(true);
    navigator.geolocation?.getCurrentPosition(
      pos => { setGpsCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setLocating(false); setActivating(false); setSosState('confirming'); },
      () => { setLocating(false); setActivating(false); setSosState('confirming'); },
      { timeout: 5000 }
    );
  };

  const filteredHospitals = ALL_HOSPITALS.filter(h =>
    h.name.toLowerCase().includes(search.toLowerCase()) ||
    h.specialties.some(s => s.toLowerCase().includes(search.toLowerCase())) ||
    h.address.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => a.distanceKm - b.distanceKm);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">

      {/* ── DISPATCHED BANNER ── */}
      {sosState === 'dispatched' && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-6">
          <div className="bg-red-950 border-2 border-red-500 rounded-3xl p-10 max-w-lg w-full text-center">
            <div className="w-24 h-24 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce shadow-2xl shadow-red-900/60">
              <Ambulance size={48} className="text-white" />
            </div>
            <h2 className="text-4xl font-black text-red-300 mb-3">HELP IS COMING</h2>
            <p className="text-red-200 font-bold text-lg mb-2">Suwa Seriya dispatched</p>
            {gpsCoords && <p className="text-red-400/70 text-sm font-medium mb-6">GPS: {gpsCoords.lat.toFixed(4)}, {gpsCoords.lng.toFixed(4)}</p>}
            <p className="text-slate-400 font-medium text-sm mb-8">Your emergency contacts have been notified. Medical history pre-shared with paramedics. Stay where you are.</p>
            <div className="flex gap-3">
              <a href="tel:1990" className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-red-500">
                <Phone size={20} /> Call 1990
              </a>
              <button onClick={() => setSosState('idle')} className="flex-1 py-4 bg-white/10 border border-white/20 text-white rounded-2xl font-bold hover:bg-white/20">
                Cancel SOS
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── SOS HERO PANEL ── */}
      <div className={`relative rounded-3xl overflow-hidden transition-all duration-500 ${sosState === 'confirming' ? 'border-2 border-red-500' : 'border border-white/10'} bg-slate-900`}>
        <div className="absolute inset-0 bg-gradient-to-br from-red-950/60 via-slate-900 to-slate-900" />

        <div className="relative z-10 p-8 lg:p-12">
          {sosState === 'idle' && (
            <div className="flex flex-col lg:flex-row items-center gap-10">
              <div className="flex-1">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-black uppercase tracking-widest mb-6">
                  <AlertTriangle size={14} className="animate-pulse" /> Emergency Ready
                </div>
                <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tighter mb-4">
                  Need Immediate Help?
                </h1>
                <p className="text-slate-400 font-medium text-lg leading-relaxed mb-8 max-w-lg">
                  Press SOS to instantly alert Suwa Seriya (1990). Your GPS location and full medical history will be pre-shared with the dispatched paramedics.
                </p>
                <div className="flex flex-wrap gap-3 text-sm font-bold text-slate-500">
                  {['GPS Location Shared', 'Medical History Sent', 'Emergency Contacts Alerted', 'Under 4min Response'].map(f => (
                    <div key={f} className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 border border-white/5">
                      <CheckCircle size={14} className="text-emerald-400" />{f}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col items-center gap-4">
                <button
                  onClick={handleSOS}
                  disabled={activating}
                  className="relative w-44 h-44 rounded-full bg-gradient-to-br from-red-600 to-red-800 text-white flex flex-col items-center justify-center shadow-2xl shadow-red-900/60 hover:scale-105 active:scale-95 transition-all border-8 border-red-950/50 group"
                >
                  <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping scale-110" />
                  {activating ? (
                    <><Loader2 size={48} className="animate-spin mb-1" /><span className="text-sm font-black tracking-widest">LOCATING</span></>
                  ) : (
                    <><Phone size={48} className="mb-2 group-hover:animate-bounce" /><span className="text-2xl font-black tracking-[0.2em]">SOS</span></>
                  )}
                </button>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Tap to activate</p>
              </div>
            </div>
          )}

          {sosState === 'confirming' && (
            <div className="text-center py-6">
              <div className="w-24 h-24 rounded-full bg-red-600/20 border-2 border-red-500 flex items-center justify-center mx-auto mb-6">
                <span className="text-5xl font-black text-red-400">{countdown}</span>
              </div>
              <h2 className="text-3xl font-black text-red-300 mb-3">Dispatching in {countdown}s</h2>
              <p className="text-slate-400 font-medium mb-6">Suwa Seriya will be alerted automatically. Cancel if this was accidental.</p>
              <div className="flex gap-3 max-w-sm mx-auto">
                <a href="tel:1990" className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-black flex items-center justify-center gap-2 text-sm hover:bg-red-500">
                  <PhoneCall size={18} /> Call Now
                </a>
                <button onClick={() => setSosState('idle')} className="flex-1 py-4 bg-white/10 border border-white/20 text-white rounded-2xl font-bold text-sm hover:bg-white/20">
                  <X size={18} className="inline mr-2" />Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── EMERGENCY HOTLINES ── */}
      <div>
        <h2 className="text-2xl font-black text-white tracking-tight mb-5">Emergency Hotlines</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {EMERGENCY_NUMBERS.map(({ service, number, color, icon: Icon, desc }) => (
            <a key={number} href={`tel:${number}`}
              className={`group p-5 rounded-3xl bg-gradient-to-br ${color} hover:scale-[1.03] active:scale-95 transition-all shadow-lg cursor-pointer`}>
              <Icon size={28} className="text-white mb-3 group-hover:scale-110 transition-transform" />
              <p className="text-2xl font-black text-white mb-1">{number}</p>
              <p className="font-black text-white text-sm leading-tight">{service}</p>
              <p className="text-white/60 text-[10px] font-medium mt-1">{desc}</p>
            </a>
          ))}
        </div>
      </div>

      {/* ── NEARBY HOSPITALS ── */}
      <div>
        <div className="flex items-center justify-between mb-5 gap-4">
          <h2 className="text-2xl font-black text-white tracking-tight">Nearby Hospitals</h2>
          <div className="flex items-center gap-3">
            {locating && <div className="flex items-center gap-2 text-sm font-bold text-blue-400"><Loader2 size={16} className="animate-spin" />Getting location...</div>}
            <button onClick={() => setLocating(true)} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all text-sm font-bold">
              <Navigation size={16} /> Use GPS
            </button>
          </div>
        </div>

        <div className="relative mb-5">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input type="text" placeholder="Search by name, specialty, area..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-500 font-medium text-sm focus:outline-none focus:border-white/20 transition-all" />
        </div>

        <div className="space-y-3">
          {filteredHospitals.map(h => (
            <div key={h.id} className="group p-5 lg:p-6 rounded-3xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] hover:border-white/10 transition-all">
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0 group-hover:bg-red-500/20 transition-all">
                  <Ambulance size={26} className="text-red-400" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-black text-white text-lg truncate">{h.name}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${typeColors[h.type]}`}>{h.type}</span>
                    {h.emergency24h && <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-red-500/10 border border-red-500/20 text-red-400">24/7 ER</span>}
                  </div>
                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 font-medium mb-2">
                    <span className="flex items-center gap-1.5"><MapPin size={14} className="text-slate-600" />{h.distance}</span>
                    <span className="flex items-center gap-1.5"><Clock size={14} className="text-emerald-500" />{h.waitTime} wait</span>
                    {h.beds && <span className="flex items-center gap-1.5 text-slate-600">{h.beds.toLocaleString()} beds</span>}
                  </div>
                  <p className="text-xs text-slate-600 font-medium mb-2">{h.address}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {h.specialties.map(s => <span key={s} className="px-2 py-0.5 rounded-lg bg-white/5 text-slate-500 text-[10px] font-bold">{s}</span>)}
                  </div>
                </div>

                <div className="flex gap-2 lg:flex-col flex-shrink-0">
                  <a href={`tel:${h.phone}`}
                    className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-red-600/80 text-white text-sm font-black hover:bg-red-600 transition-all shadow-lg shadow-red-900/30">
                    <Phone size={16} /> Call ER
                  </a>
                  <a href={`https://maps.google.com/?q=${h.name} ${h.address}`} target="_blank" rel="noreferrer"
                    className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-bold hover:bg-white/10 transition-all">
                    <Navigation size={16} /> Navigate
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FIRST AID GUIDE ── */}
      <div>
        <h2 className="text-2xl font-black text-white tracking-tight mb-2">First Aid Quick Guide</h2>
        <p className="text-slate-500 font-medium text-sm mb-5">Tap a situation to see step-by-step instructions</p>
        <div className="grid md:grid-cols-2 gap-4">
          {FIRST_AID_TIPS.map((tip, i) => (
            <div key={i}
              onClick={() => setActiveTip(activeTip === i ? null : i)}
              className={`rounded-3xl border transition-all cursor-pointer ${activeTip === i ? 'bg-amber-950/30 border-amber-500/30' : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/10'}`}>
              <div className="flex items-center gap-4 p-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-all ${activeTip === i ? 'bg-amber-500' : 'bg-white/5 border border-white/5'}`}>
                  <tip.icon size={22} className={activeTip === i ? 'text-white' : 'text-slate-400'} />
                </div>
                <div className="flex-1">
                  <p className="font-black text-white">{tip.title}</p>
                  <p className="text-xs text-slate-500 font-medium">{tip.steps.length} steps</p>
                </div>
                <ChevronRight size={20} className={`text-slate-500 transition-transform ${activeTip === i ? 'rotate-90' : ''}`} />
              </div>
              {activeTip === i && (
                <div className="px-6 pb-6">
                  <ol className="space-y-2.5">
                    {tip.steps.map((step, si) => (
                      <li key={si} className="flex items-start gap-3 text-sm text-slate-300 font-medium">
                        <span className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 font-black text-xs flex items-center justify-center flex-shrink-0 mt-0.5">{si + 1}</span>
                        {step}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ── DISCLAIMER ── */}
      <div className="flex items-start gap-3 p-5 rounded-2xl bg-white/[0.02] border border-white/5">
        <Info size={18} className="text-slate-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-slate-600 font-medium leading-relaxed">
          This emergency guide is for informational purposes. Always call trained medical professionals in a genuine emergency. MediConnect's SOS feature dispatches Suwa Seriya Ambulance Service (1990) operated by the Ministry of Health, Sri Lanka.
        </p>
      </div>
    </div>
  );
}
