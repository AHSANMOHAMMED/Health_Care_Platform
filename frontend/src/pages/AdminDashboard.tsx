import React, { useState } from 'react';
import { 
  Users, Activity, Shield, Settings, 
  Database, Bell, LogOut, Search,
  ArrowUpRight, Server, Zap, Globe,
  Cpu, FileText, CheckCircle2, AlertCircle,
  Menu, X, Lock, Anchor, Smartphone, CreditCard
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'System Monitor', icon: Activity, path: '/admin', active: true },
    { name: 'User Management', icon: Users, path: '/admin/users' },
    { name: 'Node Registry', icon: Database, path: '/admin/nodes' },
    { name: 'Security Audit', icon: Lock, path: '/admin/security' },
    { name: 'Global Settings', icon: Settings, path: '/admin/settings' },
  ];

  return (
    <div className="min-h-screen bg-white flex overflow-hidden">
      
      {/* Executive Sidebar (Admin Variant) */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-80 bg-slate-950 border-r border-white/5 transform transition-transform duration-500 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0`}>
        <div className="h-full flex flex-col p-8 text-white">
           <div className="flex items-center gap-3 mb-16 px-2">
              <img src={logo} alt="MediConnect" className="h-10 w-auto brightness-0 invert" />
              <div className="leading-none">
                 <p className="text-lg font-black tracking-tighter">MediConnect <span className="text-[#FFBE29]">Lanka</span></p>
                 <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Network Administrator</p>
              </div>
           </div>

           <nav className="flex-1 space-y-2">
              {navItems.map((item, idx) => (
                <Link key={idx} to={item.path} className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all duration-300 ${item.active ? 'bg-[#FFBE29] text-slate-950 shadow-lg shadow-[#FFBE29]/20' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
                   <item.icon size={22} />
                   <span>{item.name}</span>
                </Link>
              ))}
           </nav>

           <div className="pt-8 border-t border-white/5">
              <button onClick={handleLogout} className="flex items-center gap-4 px-6 py-4 rounded-2xl text-red-400 font-bold hover:bg-red-500/10 transition-all w-full text-left">
                 <LogOut size={22} /> Terminate Session
              </button>
           </div>
        </div>
      </aside>

      {/* Main Command Workspace */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto relative bg-[#F9FAFB]">
         
         {/* Top Command Header */}
         <header className="h-24 bg-white border-b border-slate-100 px-8 flex items-center justify-between sticky top-0 z-30">
            <div className="flex items-center gap-6">
                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 text-slate-500">
                   {sidebarOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
                <div className="flex items-center gap-3">
                   <div className="flex -space-x-2">
                      {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200" />)}
                   </div>
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">14 Active Nodes</span>
                </div>
            </div>
            
            <div className="flex items-center gap-6">
               <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Global Grid Online</span>
               </div>
               <div className="flex items-center gap-4 pl-6 border-l border-slate-200">
                  <div className="text-right hidden sm:block">
                     <p className="text-sm font-black text-slate-950">{(user as any)?.name || 'Admin Ahsan'}</p>
                     <p className="text-[10px] font-bold text-[#8D153A] uppercase tracking-widest">Root Authority</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-[#8D153A] flex items-center justify-center text-white font-black text-xl">
                     A
                  </div>
               </div>
            </div>
         </header>

         {/* Content Area */}
         <div className="p-8 lg:p-12 max-w-[1600px] mx-auto w-full">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
               <div>
                  <h1 className="text-4xl md:text-5xl font-black text-slate-950 tracking-tighter mb-3">System <span className="text-[#8D153A]">Intelligence.</span></h1>
                  <p className="text-lg text-slate-500 font-bold italic">Real-time oversight of the national healthcare distributed ledger.</p>
               </div>
               <div className="flex gap-4">
                  <button className="h-16 px-8 rounded-full bg-white border-2 border-slate-200 text-slate-950 font-black text-sm hover:border-[#8D153A] transition-all">Audit Logs</button>
                  <button className="h-16 px-8 rounded-full bg-[#8D153A] text-white font-black text-sm hover:opacity-90 transition-all shadow-xl shadow-[#8D153A]/20 flex items-center gap-2">
                     <Shield size={20} /> Security Scan
                  </button>
               </div>
            </div>

            {/* Global Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
               
               {/* Infrastructure Status */}
               <div className="clinical-card p-10 bg-slate-900 text-white col-span-1 lg:col-span-2 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-96 h-96 bg-[#8D153A]/20 rounded-full blur-[100px] -mr-48 -mt-48" />
                  
                  <div className="relative z-10">
                     <div className="flex justify-between items-start mb-12">
                        <div>
                           <p className="text-[#FFBE29] font-black uppercase tracking-widest text-[10px] mb-2">Cloud Connectivity</p>
                           <h3 className="text-4xl font-black tracking-tighter">Azure Resource Grid</h3>
                        </div>
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                           <Server size={32} />
                        </div>
                     </div>

                     <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
                        <div>
                           <p className="text-slate-500 font-bold text-xs mb-1">CPU Load</p>
                           <p className="text-2xl font-black">14.2%</p>
                        </div>
                        <div>
                           <p className="text-slate-500 font-bold text-xs mb-1">Memory</p>
                           <p className="text-2xl font-black">2.4 GB</p>
                        </div>
                        <div>
                           <p className="text-slate-500 font-bold text-xs mb-1">Endpoints</p>
                           <p className="text-2xl font-black text-[#FFBE29]">Active</p>
                        </div>
                        <div>
                           <p className="text-slate-500 font-bold text-xs mb-1">Latency</p>
                           <p className="text-2xl font-black">42 ms</p>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Rapid Dispatch Counter */}
               <div className="clinical-card p-10 border-none bg-[#FFBE29] text-slate-950 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                     <Zap size={36} />
                     <div className="text-right">
                        <p className="text-[10px] font-black uppercase tracking-widest leading-none">1990 Active</p>
                        <p className="text-2xl font-black">12 Live</p>
                     </div>
                  </div>
                  <div>
                     <h3 className="text-3xl font-black tracking-tighter mb-4">Emergency Network</h3>
                     <p className="text-sm font-bold opacity-70 mb-8">Average dispatch time: 4m 12s across Western Province.</p>
                     <button className="w-full flex items-center justify-between text-slate-950 font-black border-b-2 border-slate-950/20 pb-2 hover:border-slate-950 transition-all">
                        Open Map <ArrowUpRight size={18} />
                     </button>
                  </div>
               </div>

            </div>

            {/* Quick Management Table */}
            <div className="clinical-card overflow-hidden">
               <div className="p-10 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="text-2xl font-black tracking-tighter">Identity Services Audit</h3>
                  <div className="relative">
                     <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                     <input type="text" placeholder="Filter audit trail..." className="bg-slate-100 rounded-xl py-2 pl-12 pr-4 text-sm font-medium w-64 border-none focus:ring-2 focus:ring-[#8D153A]/20" />
                  </div>
               </div>
               
               <div className="overflow-x-auto">
                  <table className="w-full">
                     <thead className="bg-slate-50">
                        <tr>
                           {['Timestamp', 'Endpoint', 'Transaction', 'Status', 'Risk'].map(h => (
                             <th key={h} className="px-10 py-6 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">{h}</th>
                           ))}
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                        {[
                          { time: '10:42:15', endpoint: 'Auth-Service/Login', user: '256-bit JWT Sync', status: 'Succeeded', risk: 'Low', color: 'text-emerald-500' },
                          { time: '10:41:02', endpoint: 'PresC-Service/Sign', user: 'Encrypted Digital Sign', status: 'Succeeded', risk: 'Low', color: 'text-emerald-500' },
                          { time: '10:38:45', endpoint: 'Gateway/Ingress', user: 'External IP Request', status: 'Rate Limited', risk: 'Moderate', color: 'text-[#8D153A]' }
                        ].map((row, i) => (
                          <tr key={i} className="hover:bg-slate-50 transition-all cursor-pointer">
                             <td className="px-10 py-6 text-sm font-black text-slate-950">{row.time}</td>
                             <td className="px-10 py-6 text-sm font-bold text-slate-500">{row.endpoint}</td>
                             <td className="px-10 py-6 text-sm font-bold text-slate-950">{row.user}</td>
                             <td className="px-10 py-6"><span className={`text-xs font-black uppercase tracking-widest ${row.color}`}>{row.status}</span></td>
                             <td className="px-10 py-6 text-sm font-bold text-slate-500">{row.risk}</td>
                          </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>

         </div>
      </main>
    </div>
  );
}
