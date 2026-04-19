import React, { useState, useEffect } from 'react';
import { 
  Users, Calendar, FileText, Activity, 
  MessageSquare, Settings, Bell, LogOut, Search,
  ChevronRight, ArrowUpRight, ShieldCheck, 
  Clock, CheckCircle2, UserCheck, Menu, X,
  PlusCircle, Stethoscope, Briefcase, Zap
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function DoctorDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Patient Overview', icon: Users, path: '/doctor', active: true },
    { name: 'Apointments', icon: Calendar, path: '/doctor/appointments' },
    { name: 'Daily Schedule', icon: Clock, path: '/doctor/schedule' },
    { name: 'Medical Reports', icon: FileText, path: '/doctor/reports' },
    { name: 'Consultations', icon: MessageSquare, path: '/doctor/chats' },
    { name: 'Analytics', icon: Activity, path: '/doctor/analytics' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden">
      
      {/* Premium Sidebar (Doctor Variant) */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-80 bg-white border-r border-slate-100 transform transition-transform duration-500 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0`}>
        <div className="h-full flex flex-col p-8">
           <div className="flex items-center gap-3 mb-16 px-2">
              <img src={logo} alt="MediConnect" className="h-10 w-auto" />
              <div className="leading-none">
                 <p className="text-lg font-black text-slate-950 tracking-tighter">MediConnect <span className="text-[#8D153A]">Lanka</span></p>
                 <p className="text-[9px] font-bold text-[#E5AB22] uppercase tracking-widest mt-1">Medical Specialist</p>
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
                 <LogOut size={22} /> Logout Portal
              </button>
           </div>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto relative bg-[#F9FAFB]">
         
         {/* Top Header */}
         <header className="h-24 bg-white/50 backdrop-blur-md border-b border-slate-100 px-8 flex items-center justify-between sticky top-0 z-30">
            <div className="flex items-center gap-6">
                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 text-slate-500">
                   {sidebarOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
                <div className="hidden lg:flex items-center gap-3 bg-slate-100 px-4 py-2 rounded-xl text-slate-500">
                   <Clock size={16} /> <span className="text-xs font-black uppercase tracking-widest">{new Date().toLocaleDateString('en-LK', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                </div>
            </div>
            
            <div className="flex items-center gap-6">
               <button className="relative w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-500 hover:text-[#8D153A] transition-colors">
                  <Bell size={22} />
                  <span className="absolute top-3 right-3 w-2 h-2 bg-[#FFBE29] rounded-full border-2 border-white" />
               </button>
               <div className="flex items-center gap-4 pl-6 border-l border-slate-200">
                  <div className="text-right hidden sm:block">
                     <p className="text-sm font-black text-slate-950">{(user as any)?.name || 'Dr. Perera'}</p>
                     <p className="text-[10px] font-bold text-[#E5AB22] uppercase tracking-widest">Consultant Specialist</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-[#E5AB22] flex items-center justify-center text-white font-black text-xl shadow-lg shadow-[#FFBE29]/20">
                     D
                  </div>
               </div>
            </div>
         </header>

         {/* Content Area */}
         <div className="p-8 lg:p-12 max-w-[1600px] mx-auto w-full">
            
            {/* Greeting */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
               <div>
                  <h1 className="text-4xl md:text-5xl font-black text-slate-950 tracking-tighter mb-3">Welcome, <span className="text-[#8D153A]">Doctor.</span></h1>
                  <p className="text-lg text-slate-500 font-bold">You have 8 patients scheduled for follow-up today.</p>
               </div>
               <button className="btn-gold h-16 !px-8 text-sm">
                  <PlusCircle size={20} /> New Consultation
               </button>
            </div>

            {/* Service-Level Stats Bento */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
               {[
                 { label: 'Total Patients', value: '1,248', icon: Users, color: 'text-[#8D153A]', bg: 'bg-[#8D153A]/5', trend: '+12% this week' },
                 { label: 'Avg Feedback', value: '4.9/5.0', icon: Star, color: 'text-[#FFBE29]', bg: 'bg-[#FFBE29]/10', trend: 'Based on 500+ reviews' },
                 { label: 'Consult Hours', value: '240h', icon: Clock, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: 'Peak efficiency' },
                 { label: 'System Load', value: 'Stable', icon: ShieldCheck, color: 'text-blue-600', bg: 'bg-blue-50', trend: 'Azure Node Online' }
               ].map((stat, i) => (
                 <div key={i} className="clinical-card p-8">
                    <div className={`w-14 h-14 rounded-2xl ${stat.bg} flex items-center justify-center ${stat.color} mb-6`}>
                       <stat.icon size={28} />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{stat.label}</p>
                    <p className="text-3xl font-black text-slate-950 mb-2">{stat.value}</p>
                    <div className="text-xs font-bold text-slate-500">
                       {stat.trend}
                    </div>
                 </div>
               ))}
            </div>

            {/* Schedule & Analytics Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               
               {/* Today's Schedule Card */}
               <div className="lg:col-span-2 clinical-card p-10">
                  <div className="flex justify-between items-center mb-10">
                     <h3 className="text-2xl font-black tracking-tighter">Live Schedule Queue</h3>
                     <div className="flex gap-2">
                        <button className="px-4 py-2 bg-slate-100 rounded-xl text-xs font-bold hover:bg-slate-200 transition-all">Export</button>
                        <button className="px-4 py-2 bg-[#8D153A] rounded-xl text-xs font-bold text-white hover:opacity-90 transition-all">Manage</button>
                     </div>
                  </div>

                  <div className="space-y-4">
                     {[ 
                       { name: 'Aruni Wijesinghe', time: '10:30 AM', type: 'Video Consult', status: 'In Waiting', accent: 'text-emerald-600', bg: 'bg-emerald-50' },
                       { name: 'Kasun Perera', time: '11:15 AM', type: 'Physical Follow-up', status: 'Confirmed', accent: 'text-[#8D153A]', bg: 'bg-[#8D153A]/5' },
                       { name: 'Imara Jaffar', time: '02:00 PM', type: 'New Patient', status: 'Confirmed', accent: 'text-[#8D153A]', bg: 'bg-[#8D153A]/5' }
                     ].map((apt, i) => (
                       <div key={i} className="group p-6 rounded-[2rem] border border-slate-100 hover:border-[#FFBE29]/40 hover:shadow-lg transition-all flex items-center justify-between">
                          <div className="flex items-center gap-6">
                             <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center font-black text-slate-950">{apt.name[0]}</div>
                             <div>
                                <p className="font-black text-slate-950 text-lg">{apt.name}</p>
                                <p className="text-sm font-bold text-slate-500 flex items-center gap-2"><Clock size={14}/> {apt.time} • <Stethoscope size={14}/> {apt.type}</p>
                             </div>
                          </div>
                          <div className={`px-5 py-2 rounded-full ${apt.bg} ${apt.accent} font-black text-[10px] uppercase tracking-widest`}>
                             {apt.status}
                          </div>
                       </div>
                     ))}
                  </div>
               </div>

               {/* Medical Intelligence Hub */}
               <div className="clinical-card p-10 bg-slate-900 border-none text-white relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-80 h-80 bg-[#FFBE29]/10 rounded-full blur-[80px] -mr-32 -mt-32 group-hover:bg-[#FFBE29]/20 transition-all duration-1000" />
                  
                  <div className="relative z-10 flex flex-col h-full justify-between">
                     <div>
                        <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-[#FFBE29] mb-8">
                           <Zap size={28} />
                        </div>
                        <h3 className="text-3xl font-black tracking-tighter mb-4 leading-tight">Patient Risk <br/> Analytics.</h3>
                        <p className="text-slate-400 font-bold leading-relaxed mb-10">AI engine identifying early risk patterns across your patient demographic.</p>
                     </div>

                     <div className="space-y-6">
                        <div className="flex items-center justify-between text-sm">
                           <span className="font-bold">Chronic Sync Rate</span>
                           <span className="text-[#FFBE29] font-black">94%</span>
                        </div>
                        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                           <div className="h-full bg-[#FFBE29] rounded-full" style={{ width: '94%' }} />
                        </div>
                        <button className="w-full h-16 rounded-2xl bg-white text-slate-900 font-black flex items-center justify-center gap-3 hover:bg-[#FFBE29] transition-all">
                           Open Intelligence <ArrowUpRight size={20} />
                        </button>
                     </div>
                  </div>
               </div>

            </div>

         </div>
      </main>
    </div>
  );
}
