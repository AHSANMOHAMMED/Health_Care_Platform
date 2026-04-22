import { useState, useEffect, useCallback } from 'react';
import {
  Activity, Calendar, FileText, Pill, CreditCard,
  Bell, LogOut, Search, Heart, Clock, ChevronRight,
  ShieldCheck, Smartphone, Menu, X, AlertCircle, Loader2,
  RefreshCw, Brain, MapPin, Phone, Zap, Video, TrendingUp,
  Droplets, Thermometer, Wind, CheckCircle, PhoneCall,
  MessageSquare, AlertTriangle, Users, Target
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { appointmentService, prescriptionService, type Appointment, type Prescription } from '../api/services';

// ── Nearby hospitals (offline-capable) ──
const NEAR_HOSPITALS = [
  { name: 'Colombo National Hospital', dist: '2.1 km', phone: '+94112691111' },
  { name: 'Lanka Hospitals', dist: '3.4 km', phone: '+94115530000' },
  { name: 'Asiri Hospital', dist: '4.0 km', phone: '+94114665500' },
];

// ── Vital trend points (last 7 readings) ──
const VITALS_TREND = [72, 75, 71, 68, 74, 72, 70];
const BP_TREND = ['118/78', '122/80', '120/79', '119/77', '121/81', '120/80', '118/79'];

function MiniSparkline({ data, color }: { data: number[]; color: string }) {
  const min = Math.min(...data), max = Math.max(...data);
  const range = max - min || 1;
  const w = 80, h = 32;
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * w},${h - ((v - min) / range) * h}`).join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={(data.length - 1) / (data.length - 1) * w} cy={h - ((data[data.length - 1] - min) / range) * h} r="3.5" fill={color} />
    </svg>
  );
}

export default function PatientDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sosPanelOpen, setSosPanelOpen] = useState(false);
  const { user, userId, logout } = useAuthStore();
  const navigate = useNavigate();

  const [nextAppointment, setNextAppointment] = useState<Appointment | null>(null);
  const [activePrescriptions, setActivePrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);
  const [locating, setLocating] = useState(false);
  const [userLocation, setUserLocation] = useState<string | null>(null);

  const handleLogout = () => { logout(); navigate('/login'); };

  const load = useCallback(async () => {
    setLoading(true);
    const [apptResult, rxResult] = await Promise.all([
      appointmentService.getAll({ patientId: userId ?? undefined, upcoming: true }),
      prescriptionService.getAll({ patientId: userId ?? undefined }),
    ]);
    const upcomingAppts = apptResult.data
      .filter(a => a.status !== 'completed' && a.status !== 'cancelled')
      .sort((a, b) => (a.date ?? '').localeCompare(b.date ?? ''));
    setNextAppointment(upcomingAppts[0] ?? null);
    setActivePrescriptions(rxResult.data.filter(r => r.status === 'active'));
    setUsingFallback(!apptResult.isLive);
    setLoading(false);
  }, [userId]);

  useEffect(() => { load(); }, [load]);

  const getSosLocation = () => {
    setLocating(true);
    navigator.geolocation?.getCurrentPosition(
      pos => {
        setUserLocation(`${pos.coords.latitude.toFixed(4)}, ${pos.coords.longitude.toFixed(4)}`);
        setLocating(false);
        setSosPanelOpen(true);
      },
      () => { setUserLocation('Location unavailable'); setLocating(false); setSosPanelOpen(true); },
      { timeout: 6000 }
    );
  };

  const firstName = (user as any)?.firstName ?? (user as any)?.name?.split(' ')[0] ?? 'Patient';
  const displayName = `${(user as any)?.firstName ?? ''} ${(user as any)?.lastName ?? ''}`.trim() || (user as any)?.name || 'Patient';
  const initials = displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

  const navItems = [
    { name: 'Health Overview', icon: Activity, path: '/patient' },
    { name: 'Appointments', icon: Calendar, path: '/appointments' },
    { name: 'Medical Records', icon: FileText, path: '/records' },
    { name: 'Prescriptions', icon: Pill, path: '/prescriptions' },
    { name: 'AI Symptom Check', icon: Brain, path: '/ai-checker' },
    { name: 'Billing', icon: CreditCard, path: '/billing' },
  ];

  const quickActions = [
    { icon: Calendar, label: 'Book Appointment', sub: 'Find a specialist', to: '/booking', color: 'from-blue-600 to-indigo-700' },
    { icon: Brain, label: 'AI Doctor', sub: 'Symptom analysis', to: '/ai-checker', color: 'from-purple-600 to-pink-600' },
    { icon: Video, label: 'Video Consult', sub: 'Join session', to: '/telemedicine', color: 'from-emerald-600 to-teal-600' },
    { icon: Pill, label: 'Prescriptions', sub: `${activePrescriptions.length} active`, to: '/prescriptions', color: 'from-amber-500 to-orange-600' },
    { icon: FileText, label: 'My Records', sub: 'Lab results & reports', to: '/records', color: 'from-cyan-600 to-sky-600' },
    { icon: MapPin, label: 'Find Hospital', sub: 'GPS-powered', to: '/emergency', color: 'from-red-600 to-rose-700' },
  ];

  // Timeline items from appointments + prescriptions
  const timeline = [
    ...(nextAppointment ? [{ type: 'appointment', title: `Appointment`, sub: `${nextAppointment.time ?? nextAppointment.appointmentTime ?? '—'} · ${nextAppointment.type ?? '—'}`, date: nextAppointment.date ?? 'Upcoming', icon: Calendar, color: 'bg-blue-500/20 text-blue-400' }] : []),
    ...activePrescriptions.slice(0, 2).map(rx => ({ type: 'prescription', title: rx.medicineName ?? 'Prescription', sub: `${rx.dosage ?? '—'} · ${rx.duration ?? '—'}`, date: rx.createdAt ?? 'Active', icon: Pill, color: 'bg-amber-500/20 text-amber-400' })),
    { type: 'note', title: 'Blood pressure normal', sub: '120/80 · Within range', date: 'Today', icon: Heart, color: 'bg-emerald-500/20 text-emerald-400' },
    { type: 'note', title: 'Wearable sync completed', sub: 'Heart rate 72 BPM · SpO2 98%', date: 'Yesterday', icon: Smartphone, color: 'bg-purple-500/20 text-purple-400' },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex overflow-hidden">

      {/* ── SIDEBAR ── */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#0D0D18] border-r border-white/5 transform transition-all duration-500 flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0 lg:flex-shrink-0`}>
        <div className="p-8 flex flex-col h-full">
          <Link to="/" className="flex items-center gap-3 mb-12" onClick={() => setSidebarOpen(false)}>
            <img src={logo} alt="MediConnect" className="h-10 w-auto brightness-0 invert" />
            <div className="leading-none">
              <p className="text-lg font-black text-white tracking-tighter">MediConnect <span className="text-[#FFBE29]">Lanka</span></p>
              <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mt-1">Patient Portal</p>
            </div>
          </Link>

          <nav className="flex-1 space-y-1">
            {navItems.map(item => (
              <Link key={item.name} to={item.path} onClick={() => setSidebarOpen(false)}
                className="flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all text-slate-500 hover:bg-white/5 hover:text-white group">
                <div className="w-10 h-10 rounded-xl bg-white/3 group-hover:bg-[#8D153A]/20 flex items-center justify-center transition-all">
                  <item.icon size={20} className="group-hover:text-[#8D153A] transition-colors" />
                </div>
                <span className="text-sm">{item.name}</span>
              </Link>
            ))}
          </nav>

          {/* SOS Emergency Button */}
          <button onClick={getSosLocation} disabled={locating}
            className="w-full mt-6 py-4 rounded-2xl bg-gradient-to-r from-red-700 to-[#8D153A] text-white font-black flex items-center justify-center gap-3 hover:opacity-90 transition-all shadow-xl shadow-red-900/40 disabled:opacity-60">
            {locating ? <Loader2 size={22} className="animate-spin" /> : <PhoneCall size={22} />}
            {locating ? 'Locating...' : 'SOS Emergency'}
          </button>

          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-2xl text-slate-600 font-bold hover:bg-white/5 hover:text-red-400 transition-all mt-4 w-full text-left text-sm">
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* Sidebar overlay */}
      {sidebarOpen && <div className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">

        {/* ── HEADER ── */}
        <header className="sticky top-0 z-30 bg-[#0A0A0F]/80 backdrop-blur-2xl border-b border-white/5 px-6 py-4 flex items-center gap-4">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 rounded-xl text-white bg-white/5">
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="flex-1 max-w-md relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
            <input type="text" placeholder="Search doctors, records, medications..." className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-sm text-slate-300 placeholder-slate-600 focus:outline-none focus:border-white/20 transition-all" />
          </div>
          <div className="flex items-center gap-3 ml-auto">
            <button className="relative w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-all">
              <Bell size={18} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#FFBE29] rounded-full border-2 border-[#0A0A0F]" />
            </button>
            <Link to="/ai-checker" className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 text-xs font-black hover:bg-indigo-600/30 transition-all">
              <Brain size={14} /> AI Doctor
            </Link>
            <div className="flex items-center gap-3 pl-4 border-l border-white/5">
              <div className="text-right hidden md:block">
                <p className="text-sm font-black text-white">{displayName}</p>
                <p className="text-[9px] font-bold text-[#8D153A] uppercase tracking-widest">Premium Member</p>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#8D153A] to-[#FFBE29] flex items-center justify-center text-white font-black shadow-lg">{initials}</div>
            </div>
          </div>
        </header>

        {/* ── SOS EMERGENCY PANEL ── */}
        {sosPanelOpen && (
          <div className="mx-4 lg:mx-8 mt-4 p-5 rounded-3xl bg-red-950/60 border-2 border-red-500/50 backdrop-blur-xl">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-red-500/20 flex items-center justify-center flex-shrink-0">
                  <AlertTriangle size={26} className="text-red-400 animate-pulse" />
                </div>
                <div>
                  <p className="font-black text-red-300 text-lg">Emergency Mode Active</p>
                  {userLocation && <p className="text-xs text-red-400/70 font-medium">Your GPS: {userLocation}</p>}
                </div>
              </div>
              <button onClick={() => setSosPanelOpen(false)} className="p-2 rounded-xl bg-white/5 text-slate-400 hover:text-white"><X size={18} /></button>
            </div>
            <div className="flex flex-wrap gap-3 mb-4">
              <a href="tel:1990" className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-2xl font-black hover:bg-red-500 transition-all shadow-lg shadow-red-900/50 animate-pulse">
                <PhoneCall size={20} /> Call Suwa Seriya 1990
              </a>
              <a href="tel:011" className="flex items-center gap-2 px-5 py-3 bg-white/10 border border-white/20 text-white rounded-2xl font-bold hover:bg-white/20 transition-all text-sm">
                <Phone size={18} /> Police 119
              </a>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Nearest Hospitals</p>
              {NEAR_HOSPITALS.map((h, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-white/5 border border-white/5">
                  <MapPin size={14} className="text-red-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-white truncate">{h.name}</p>
                    <p className="text-xs text-slate-500">{h.dist}</p>
                  </div>
                  <a href={`tel:${h.phone}`} className="px-3 py-1.5 rounded-xl bg-red-600/80 text-white text-xs font-black hover:bg-red-600 transition-all flex-shrink-0">
                    Call
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── PAGE CONTENT ── */}
        <div className="p-6 lg:p-10 max-w-[1400px] mx-auto w-full">

          {/* Greeting */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-5">
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-[#FFBE29] mb-2">
                {usingFallback && <span className="inline-flex items-center gap-1 text-amber-600 bg-amber-900/20 px-2 py-0.5 rounded-full mr-2 text-[9px]"><AlertCircle size={10} />Cached</span>}
                {new Date().toLocaleDateString('en-LK', { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter leading-tight">
                Ayubowan, <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8D153A] to-[#FFBE29]">{firstName}!</span>
              </h1>
              <p className="text-slate-500 font-medium mt-2">Your health is monitored & secured. Have a great day.</p>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <button onClick={load} className="p-3 rounded-2xl bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
              </button>
              <button onClick={getSosLocation} disabled={locating}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-red-900/40 border border-red-700/30 text-red-400 font-black text-sm hover:bg-red-900/60 transition-all">
                {locating ? <Loader2 size={18} className="animate-spin" /> : <AlertTriangle size={18} />}
                SOS
              </button>
              <Link to="/ai-checker" className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 text-white font-black text-sm hover:bg-indigo-500 transition-all shadow-lg shadow-indigo-900/40">
                <Brain size={18} /> AI Doctor
              </Link>
            </div>
          </div>

          {/* ── STATS ROW ── */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              {[...Array(4)].map((_, i) => <div key={i} className="h-28 rounded-3xl bg-white/3 border border-white/5 animate-pulse" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
              {[
                { icon: Clock, label: 'Next Appointment', value: nextAppointment ? nextAppointment.time ?? 'Today' : 'None', sub: nextAppointment?.date ?? 'Book one now', color: 'from-blue-600 to-indigo-700', to: '/appointments' },
                { icon: Pill, label: 'Active Prescriptions', value: `${activePrescriptions.length}`, sub: activePrescriptions[0]?.medicineName ?? 'All up to date', color: 'from-amber-500 to-orange-600', to: '/prescriptions' },
                { icon: Heart, label: 'Heart Rate', value: '72 BPM', sub: '↓2 from yesterday', color: 'from-red-600 to-rose-700', to: '/patient' },
                { icon: ShieldCheck, label: 'Health Score', value: '94/100', sub: 'Excellent • All vitals normal', color: 'from-emerald-600 to-teal-600', to: '/patient' },
              ].map((s, i) => (
                <Link key={i} to={s.to} className="group p-6 rounded-3xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] hover:border-white/10 transition-all duration-300 cursor-pointer">
                  <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${s.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                    <s.icon size={20} className="text-white" />
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-1">{s.label}</p>
                  <p className="text-2xl font-black text-white tracking-tight">{s.value}</p>
                  <p className="text-xs text-slate-600 font-medium mt-1">{s.sub}</p>
                </Link>
              ))}
            </div>
          )}

          {/* ── MAIN GRID ── */}
          <div className="grid lg:grid-cols-3 gap-6 mb-8">

            {/* Vitals Panel */}
            <div className="lg:col-span-2 p-6 lg:p-8 rounded-3xl bg-slate-900/60 border border-white/5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-72 h-72 bg-[#8D153A]/10 rounded-full blur-[80px] -mr-36 -mt-36" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <p className="font-black text-white text-xl tracking-tight">Live Vital Signs</p>
                    <p className="text-xs text-slate-500 font-medium">Synced from wearable device</p>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-widest">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" /> Live
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
                  {[
                    { icon: Heart, label: 'Heart Rate', value: '72', unit: 'BPM', trend: VITALS_TREND, color: '#EF4444', bg: 'bg-red-500/10' },
                    { icon: Wind, label: 'Blood O₂', value: '98', unit: '%', trend: [97, 98, 97, 99, 98, 98, 98], color: '#3B82F6', bg: 'bg-blue-500/10' },
                    { icon: Thermometer, label: 'Temperature', value: '36.8', unit: '°C', trend: [36.6, 36.8, 36.9, 36.7, 36.8, 36.9, 36.8], color: '#F59E0B', bg: 'bg-amber-500/10' },
                    { icon: Activity, label: 'Blood Pressure', value: '120/80', unit: '', trend: [72, 74, 70, 68, 73, 72, 70], color: '#8B5CF6', bg: 'bg-purple-500/10' },
                    { icon: Droplets, label: 'Blood Sugar', value: '95', unit: 'mg/dL', trend: [90, 95, 92, 98, 94, 95, 93], color: '#10B981', bg: 'bg-emerald-500/10' },
                    { icon: Target, label: 'Steps Today', value: '6,240', unit: '', trend: [5000, 6200, 4800, 7100, 5500, 6240, 6240], color: '#06B6D4', bg: 'bg-cyan-500/10' },
                  ].map(({ icon: Icon, label, value, unit, trend, color, bg }) => (
                    <div key={label} className={`p-4 rounded-2xl ${bg} border border-white/5`}>
                      <div className="flex items-center justify-between mb-2">
                        <Icon size={16} style={{ color }} />
                        <MiniSparkline data={trend} color={color} />
                      </div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">{label}</p>
                      <p className="text-xl font-black text-white">{value}<span className="text-xs text-slate-500 font-bold ml-1">{unit}</span></p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Health Timeline */}
            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5 flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <p className="font-black text-white tracking-tight">Health Timeline</p>
                <TrendingUp size={18} className="text-slate-500" />
              </div>
              <div className="flex-1 space-y-4 relative">
                <div className="absolute left-5 top-0 bottom-0 w-px bg-white/5" />
                {timeline.map((item, i) => (
                  <div key={i} className="flex items-start gap-3 pl-1">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 relative z-10 ${item.color}`}>
                      <item.icon size={16} />
                    </div>
                    <div className="flex-1 min-w-0 pb-4">
                      <p className="font-black text-white text-sm truncate">{item.title}</p>
                      <p className="text-[10px] text-slate-500 font-medium truncate">{item.sub}</p>
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-600 mt-1">{item.date}</p>
                    </div>
                  </div>
                ))}
                {timeline.length === 0 && (
                  <p className="text-center text-slate-600 text-sm font-medium py-8">No events yet</p>
                )}
              </div>
            </div>
          </div>

          {/* ── QUICK ACTIONS GRID ── */}
          <div className="mb-8">
            <p className="font-black text-white text-xl tracking-tight mb-5">Quick Actions</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
              {quickActions.map(({ icon: Icon, label, sub, to, color }) => (
                <Link key={label} to={to}
                  className="group p-5 rounded-3xl bg-white/[0.03] border border-white/5 hover:bg-white/[0.07] hover:border-white/10 transition-all duration-300 text-center cursor-pointer">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon size={22} className="text-white" />
                  </div>
                  <p className="font-black text-white text-sm leading-tight">{label}</p>
                  <p className="text-[10px] text-slate-600 font-medium mt-1">{sub}</p>
                </Link>
              ))}
            </div>
          </div>

          {/* ── UPCOMING APPOINTMENT + PRESCRIPTIONS ── */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Upcoming Appointment */}
            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center justify-between mb-5">
                <p className="font-black text-white tracking-tight">Upcoming Appointment</p>
                <Link to="/appointments" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">View All</Link>
              </div>
              {loading ? (
                <div className="h-24 rounded-2xl bg-white/5 animate-pulse" />
              ) : nextAppointment ? (
                <div className="p-5 rounded-2xl bg-blue-900/20 border border-blue-500/20">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center flex-shrink-0">
                      <Calendar size={22} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-black text-white">{nextAppointment.patientName ?? nextAppointment.type ?? 'Appointment'}</p>
                      <p className="text-sm text-blue-400 font-bold">{nextAppointment.date} · {nextAppointment.time ?? nextAppointment.appointmentTime}</p>
                      <p className="text-xs text-slate-500 mt-1">{nextAppointment.type ?? nextAppointment.consultationType}</p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <Link to="/telemedicine" className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 text-white text-xs font-black hover:bg-blue-500 transition-all">
                      <Video size={14} /> Join Video
                    </Link>
                    <button className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-bold hover:bg-white/10 transition-all">
                      <MapPin size={14} /> Get Directions
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Calendar size={36} className="mx-auto mb-3 text-slate-600 opacity-50" />
                  <p className="text-slate-500 font-bold text-sm">No appointments scheduled</p>
                  <Link to="/booking" className="inline-flex items-center gap-2 mt-3 px-5 py-2.5 rounded-xl bg-[#8D153A] text-white text-xs font-black hover:bg-[#71112D] transition-all">
                    Book Now <ChevronRight size={14} />
                  </Link>
                </div>
              )}
            </div>

            {/* Active Prescriptions */}
            <div className="p-6 rounded-3xl bg-white/[0.02] border border-white/5">
              <div className="flex items-center justify-between mb-5">
                <p className="font-black text-white tracking-tight">Active Prescriptions</p>
                <Link to="/prescriptions" className="text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-white transition-colors">View All</Link>
              </div>
              {loading ? (
                <div className="space-y-3">
                  <div className="h-16 rounded-2xl bg-white/5 animate-pulse" />
                  <div className="h-16 rounded-2xl bg-white/5 animate-pulse" />
                </div>
              ) : activePrescriptions.length > 0 ? (
                <div className="space-y-3">
                  {activePrescriptions.slice(0, 3).map((rx, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-amber-900/10 border border-amber-500/15">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                        <Pill size={18} className="text-amber-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-black text-white text-sm truncate">{rx.medicineName}</p>
                        <p className="text-[10px] text-amber-400 font-bold">{rx.dosage} · {rx.duration}</p>
                      </div>
                      <CheckCircle size={16} className="text-emerald-400 flex-shrink-0" />
                    </div>
                  ))}
                  {activePrescriptions.length > 3 && (
                    <p className="text-center text-[10px] text-slate-500 font-bold pt-1">+{activePrescriptions.length - 3} more prescriptions</p>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Pill size={36} className="mx-auto mb-3 text-slate-600 opacity-50" />
                  <p className="text-slate-500 font-bold text-sm">No active prescriptions</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
