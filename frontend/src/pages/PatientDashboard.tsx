import React, { useState } from 'react';
import { 
  Activity, Calendar, FileText, Pill, CreditCard, 
  MessageSquare, User, Bell, LogOut, Search,
  ArrowUpRight, Heart, Clock, ChevronRight,
  ShieldCheck, Smartphone, Settings, Menu, X
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function PatientDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Health Overview', icon: Activity, path: '/patient', active: true },
    { name: 'Appointments', icon: Calendar, path: '/appointments' },
    { name: 'Medical Records', icon: FileText, path: '/records' },
    { name: 'Prescriptions', icon: Pill, path: '/prescriptions' },
    { name: 'Billing/Payments', icon: CreditCard, path: '/billing' },
    { name: 'AI Symptom Checker', icon: Heart, path: '/ai-checker' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden">
      
      {/* Premium Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-80 bg-white border-r border-slate-100 transform transition-transform duration-500 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0`}>
        <div className="h-full flex flex-col p-8">
           <div className="flex items-center gap-3 mb-16">
              <img src={logo} alt="MediConnect" className="h-10 w-auto" />
              <div className="leading-none">
                 <p className="text-lg font-black text-slate-950 tracking-tighter">MediConnect <span className="text-[#8D153A]">Lanka</span></p>
                 <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Patient Portal</p>
              </div>
           </div>

           <nav className="flex-1 space-y-2">
              {navItems.map((item, idx) => (
                <Link key={idx} to={item.path} className={`nav-link ${item.active ? 'active' : ''}`}>
                   <item.icon size={22} />
                   <span>{item.name}</span>
                </Link>
              ))}
           </nav>

           <div className="pt-8 border-t border-slate-100">
              <button onClick={handleLogout} className="flex items-center gap-4 px-6 py-4 rounded-2xl text-red-500 font-bold hover:bg-red-50 transition-all w-full text-left">
                 <LogOut size={22} /> Logout Session
              </button>
           </div>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto relative">
         
         {/* Top Header */}
         <header className="h-24 bg-white/50 backdrop-blur-md border-b border-slate-100 px-8 flex items-center justify-between sticky top-0 z-30">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 text-slate-500">
               {sidebarOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
            
            <div className="flex-1 max-w-xl mx-8 relative hidden md:block">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
               <input type="text" placeholder="Search records, doctors, or prescriptions..." className="w-full bg-slate-100 border-none rounded-2xl py-3 pl-12 pr-4 text-sm font-medium focus:ring-2 focus:ring-[#8D153A]/20 transition-all" />
            </div>

            <div className="flex items-center gap-6">
               <button className="relative w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-500 hover:text-[#8D153A] transition-colors">
                  <Bell size={22} />
                  <span className="absolute top-3 right-3 w-2 h-2 bg-[#FFBE29] rounded-full border-2 border-white" />
               </button>
               <div className="flex items-center gap-4 pl-6 border-l border-slate-200">
                  <div className="text-right hidden sm:block">
                     <p className="text-sm font-black text-slate-950">{(user as any)?.name || 'Patient User'}</p>
                     <p className="text-[10px] font-bold text-[#8D153A] uppercase tracking-widest">Premium Member</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-[#8D153A] flex items-center justify-center text-white font-black text-xl shadow-lg shadow-[#8D153A]/20">
                     P
                  </div>
               </div>
            </div>
         </header>

         {/* Content Area */}
         <div className="p-8 lg:p-12 max-w-[1600px] mx-auto w-full">
            
            {/* Greeting */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
               <div>
                  <h1 className="text-4xl md:text-5xl font-black text-slate-950 tracking-tighter mb-3 leading-tight">Ayubowan, <span className="text-[#8D153A]">Patient</span></h1>
                  <p className="text-lg text-slate-500 font-bold">Your health network is operational and secure.</p>
               </div>
               <Link to="/ai-checker" className="btn-luminous h-16 !px-8 text-sm">
                  <Heart size={20} className="text-[#FFBE29]" /> Speak with AI
               </Link>
            </div>

            {/* Quick Stats Bento */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
               {[
                 { label: 'Upcoming Appt', value: 'Today at 4:00 PM', icon: Clock, color: 'text-[#8D153A]', bg: 'bg-[#8D153A]/5', trend: 'Dr. Perera' },
                 { label: 'Recent Reports', value: '2 New Files', icon: FileText, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+14% this month' },
                 { label: 'Prescriptions', value: '3 Active', icon: Pill, color: 'text-[#E5AB22]', bg: 'bg-[#FFBE29]/10', trend: '1 Refill due' },
                 { label: 'Platform Status', value: 'Online', icon: ShieldCheck, color: 'text-[#8D153A]', bg: 'bg-[#8D153A]/5', trend: '256-bit Encrypted' }
               ].map((stat, i) => (
                 <div key={i} className="clinical-card p-8">
                    <div className={`w-14 h-14 rounded-2xl ${stat.bg} flex items-center justify-center ${stat.color} mb-6`}>
                       <stat.icon size={28} />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{stat.label}</p>
                    <p className="text-2xl font-black text-slate-950 mb-4">{stat.value}</p>
                    <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                       <span>{stat.trend}</span>
                       <ChevronRight size={16} />
                    </div>
                 </div>
               ))}
            </div>

            {/* Vital Signs / Charts Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               
               {/* Health Monitor Card */}
               <div className="lg:col-span-2 clinical-card p-10 relative overflow-hidden bg-slate-900 text-white group">
                  <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#8D153A]/20 rounded-full blur-[100px] -mr-48 -mt-48 group-hover:bg-[#8D153A]/30 transition-all duration-1000" />
                  
                  <div className="relative z-10">
                     <div className="flex justify-between items-center mb-10">
                        <div>
                           <h3 className="text-3xl font-black tracking-tighter">Live Vital Scan</h3>
                           <p className="text-slate-400 font-bold">Synced from Wearable Network</p>
                        </div>
                        <Activity size={32} className="text-[#FFBE29] animate-pulse" />
                     </div>

                     <div className="flex flex-wrap gap-12">
                        <div className="space-y-2">
                           <p className="text-[10px] font-black uppercase tracking-widest text-[#FFBE29]">Heart Rate</p>
                           <p className="text-5xl font-black">72 <span className="text-lg text-slate-400">BPM</span></p>
                        </div>
                        <div className="w-px h-16 bg-white/10" />
                        <div className="space-y-2">
                           <p className="text-[10px] font-black uppercase tracking-widest text-[#FFBE29]">Blood Oxygen</p>
                           <p className="text-5xl font-black">98 <span className="text-lg text-slate-400">%</span></p>
                        </div>
                        <div className="w-px h-16 bg-white/10" />
                        <div className="space-y-2">
                           <p className="text-[10px] font-black uppercase tracking-widest text-[#FFBE29]">Blood Pressure</p>
                           <p className="text-5xl font-black">120/80</p>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Quick Action Hub */}
               <div className="clinical-card p-10 flex flex-col justify-between">
                  <div>
                     <h3 className="text-2xl font-black tracking-tighter mb-8">Access Points</h3>
                     <div className="space-y-4">
                        <button className="w-full h-16 px-6 rounded-2xl bg-slate-100 flex items-center justify-between group hover:bg-[#8D153A] hover:text-white transition-all">
                           <div className="flex items-center gap-4">
                              <Smartphone size={20} /> <span className="font-bold">Connect Device</span>
                           </div>
                           <ArrowUpRight size={18} className="opacity-40 group-hover:opacity-100" />
                        </button>
                        <button className="w-full h-16 px-6 rounded-2xl bg-slate-100 flex items-center justify-between group hover:bg-[#8D153A] hover:text-white transition-all">
                           <div className="flex items-center gap-4">
                              <MessageSquare size={20} /> <span className="font-bold">Consult Specialist</span>
                           </div>
                           <ArrowUpRight size={18} className="opacity-40 group-hover:opacity-100" />
                        </button>
                     </div>
                  </div>
                  <div className="mt-8 p-6 bg-emerald-50 rounded-3xl border border-emerald-100 flex items-center gap-4">
                     <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                        <ShieldCheck size={28} />
                     </div>
                     <div>
                        <p className="text-sm font-black text-emerald-800 leading-tight">Azure Secure Node</p>
                        <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Verified 256-bit</p>
                     </div>
                  </div>
               </div>

            </div>

         </div>
      </main>
    </div>
  );
}
