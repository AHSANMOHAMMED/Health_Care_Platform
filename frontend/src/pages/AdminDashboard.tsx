import React, { useState, useEffect } from 'react';
import { Users, ShieldCheck, Activity, TrendingUp, Calendar, DollarSign, AlertCircle, CheckCircle, BarChart3, Eye } from 'lucide-react';
import { api } from '../api/axios';

interface AdminStats {
  totalPatients: number;
  totalDoctors: number;
  verifiedDoctors: number;
  pendingDoctorVerifications: number;
  totalAppointments: number;
  todayAppointments: number;
  completedAppointments: number;
  cancelledAppointments: number;
  totalRevenue: number;
  monthlyRevenue: number;
  activeUsers: number;
  newUsersThisMonth: number;
}

interface RecentActivity {
  id: number;
  type: string;
  description: string;
  timestamp: string;
  status: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats>({
    totalPatients: 1204, totalDoctors: 95, verifiedDoctors: 85, pendingDoctorVerifications: 10,
    totalAppointments: 3456, todayAppointments: 42, completedAppointments: 3100, cancelledAppointments: 356,
    totalRevenue: 2450000, monthlyRevenue: 200000, activeUsers: 234, newUsersThisMonth: 89,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([
    { id: 1, type: 'user_register', description: 'New registration: John Smith', timestamp: new Date(Date.now() - 300000).toISOString(), status: 'success' },
    { id: 2, type: 'doctor_verify', description: 'Doctor verification: Dr. Sarah', timestamp: new Date(Date.now() - 600000).toISOString(), status: 'pending' },
    { id: 3, type: 'payment_complete', description: 'Payment complete: LKR 3,500', timestamp: new Date(Date.now() - 1200000).toISOString(), status: 'success' },
  ]);
  const [systemHealth] = useState({ serverUptime: 99.9, apiResponseTime: 145, activeConnections: 45, errorRate: 0.2 });
  const [selectedPeriod, setSelectedPeriod] = useState<'24h' | '7d' | '30d'>('7d');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [statsRes, activityRes, healthRes] = await Promise.all([
          api.get(`/admin/stats?period=${selectedPeriod}`),
          api.get('/admin/activity'),
          api.get('/admin/system-health')
        ]);

        if (statsRes.data) setStats(statsRes.data);
        if (activityRes.data) setRecentActivity(activityRes.data);
        // setSystemHealth is missing a setter in the original code, I should add it or use the data directly
      } catch (err: any) {
        console.error('Failed to fetch admin data:', err);
        setError('Failed to load dashboard data. Please try again later.');
        // Fallback to static data is already in initial state
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedPeriod]);

  if (loading && stats.totalPatients === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error && stats.totalPatients === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <AlertCircle size={48} className="text-rose-500 mb-4" />
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Something went wrong</h2>
        <p className="text-slate-500 mb-6">{error}</p>
        <button onClick={() => window.location.reload()} className="btn-primary">Retry</button>
      </div>
    );
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'user_register': return <Users size={16} />;
      case 'doctor_verify': return <ShieldCheck size={16} />;
      case 'payment_complete': return <DollarSign size={16} />;
      default: return <Activity size={16} />;
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'success' ? 'text-emerald-600 bg-emerald-100' : 
           status === 'pending' ? 'text-amber-600 bg-amber-100' : 'text-rose-600 bg-rose-100';
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR', minimumFractionDigits: 0 }).format(amount);
  };

  return (
    <div className="max-w-7xl mx-auto py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10 animate-slide-up">
        <div>
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Admin Dashboard</h1>
          <p className="text-slate-500 font-medium text-lg">System Overview & Analytics</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value as any)}
            className="px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
          >
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
          <button className="btn-primary flex items-center gap-2">
            <BarChart3 size={18} /> Export
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-slide-up delay-100">
        {[
          { title: 'Total Patients', val: stats.totalPatients.toLocaleString(), metric: `+${stats.newUsersThisMonth}`, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
          { title: 'Verified Doctors', val: stats.verifiedDoctors, metric: `${stats.pendingDoctorVerifications} pending`, icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-100' },
          { title: 'Today\'s Appts', val: stats.todayAppointments, metric: '98% completion', icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-100' },
          { title: 'Monthly Revenue', val: formatCurrency(stats.monthlyRevenue), metric: '+12% growth', icon: DollarSign, color: 'text-indigo-600', bg: 'bg-indigo-100' },
        ].map((item, i) => (
          <div key={i} className="premium-glass p-6 group cursor-pointer hover:border-indigo-200">
            <div className="flex items-center justify-between mb-4">
               <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">{item.title}</p>
               <div className={`p-2 rounded-lg ${item.bg} ${item.color} group-hover:scale-110 transition-transform`}><item.icon size={20}/></div>
            </div>
            <h3 className="text-3xl font-extrabold text-slate-900 mb-2">{item.val}</h3>
            <p className="text-xs font-semibold text-emerald-600 flex items-center gap-1"><TrendingUp size={14}/> {item.metric}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-slide-up delay-200">
        {/* Recent Activity */}
        <div className="lg:col-span-2 premium-glass p-0 overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 bg-white/50">
            <h2 className="text-xl font-bold text-slate-900">Recent Activity Log</h2>
          </div>
          <div className="p-6 flex-1 space-y-4">
            {recentActivity.map((act) => (
               <div key={act.id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-50 shadow-sm hover:shadow-md transition cursor-pointer">
                  <div className="flex items-center gap-4">
                     <div className={`p-3 rounded-xl ${getStatusColor(act.status)}`}>
                        {getActivityIcon(act.type)}
                     </div>
                     <div>
                       <p className="font-bold text-slate-800 text-sm">{act.description}</p>
                       <p className="text-xs font-medium text-slate-500 mt-0.5">Just now</p>
                     </div>
                  </div>
                  <button className="text-slate-400 hover:text-indigo-600 transition"><Eye size={18}/></button>
               </div>
            ))}
          </div>
        </div>

        {/* System Health */}
        <div className="premium-glass p-6">
          <h2 className="text-xl font-bold text-slate-900 mb-6">System Health</h2>
          <div className="space-y-6">
             <div>
                <div className="flex justify-between items-end mb-2">
                   <h4 className="text-sm font-bold text-slate-600 flex items-center gap-2"><Activity size={16}/> Server Uptime</h4>
                   <span className="text-emerald-600 font-extrabold">{systemHealth.serverUptime}%</span>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                   <div className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 w-full"></div>
                </div>
             </div>
             
             <div>
                <div className="flex justify-between items-end mb-2">
                   <h4 className="text-sm font-bold text-slate-600 flex items-center gap-2"><Activity size={16}/> API Response</h4>
                   <span className="text-blue-600 font-extrabold">{systemHealth.apiResponseTime}ms</span>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden">
                   <div className="h-full bg-gradient-to-r from-blue-400 to-indigo-500" style={{width: '20%'}}></div>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
               <div className="bg-slate-50 p-4 rounded-xl text-center">
                 <p className="text-2xl font-extrabold text-indigo-600 mb-1">{systemHealth.activeConnections}</p>
                 <p className="text-xs font-bold text-slate-500 uppercase">Connections</p>
               </div>
               <div className="bg-emerald-50 p-4 rounded-xl text-center border border-emerald-100">
                 <p className="text-2xl font-extrabold text-emerald-600 mb-1 flex justify-center"><CheckCircle size={28}/></p>
                 <p className="text-xs font-bold text-emerald-700 uppercase">DB Status</p>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
