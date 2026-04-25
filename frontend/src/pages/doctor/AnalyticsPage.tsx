import { useState, useEffect, useCallback } from 'react';
import {
  TrendingUp, Users, Calendar, Clock, Star,
  Activity, FileText, ChevronRight, AlertCircle,
  Loader2, RefreshCw, DollarSign
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { appointmentService, type DoctorStats } from '../../api/services';
import { useAuthStore } from '../../store/useAuthStore';

export default function AnalyticsPage() {
  const location = useLocation();
  const { userId, user } = useAuthStore();
  const [stats, setStats] = useState<DoctorStats | null>(null);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const [statsResult, apptResult] = await Promise.all([
      appointmentService.getStats(userId ?? 1),
      appointmentService.getAll({ doctorId: userId ?? undefined }),
    ]);
    setStats(statsResult.data);
    setAppointments(apptResult.data);
    setUsingFallback(!statsResult.isLive);
    setLoading(false);
  }, [userId]);

  useEffect(() => { load(); }, [load]);

  const typeBreakdown = appointments.reduce((acc: Record<string, number>, a) => {
    const type = a.type ?? a.consultationType ?? 'Other';
    acc[type] = (acc[type] ?? 0) + 1;
    return acc;
  }, {});

  const statusBreakdown = appointments.reduce((acc: Record<string, number>, a) => {
    const s = a.status ?? 'pending';
    acc[s] = (acc[s] ?? 0) + 1;
    return acc;
  }, {});

  const fmtLKR = (n: number) => `LKR ${n.toLocaleString()}`;

  const navItems = [
    { name: 'Patient Overview', icon: Users, path: '/doctor' },
    { name: 'Appointments', icon: Calendar, path: '/doctor/appointments' },
    { name: 'Daily Schedule', icon: Clock, path: '/doctor/schedule' },
    { name: 'Medical Reports', icon: FileText, path: '/doctor/reports' },
    { name: 'Consultations', icon: ChevronRight, path: '/doctor/chats' },
    { name: 'Analytics', icon: Activity, path: '/doctor/analytics' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-80 bg-white border-r border-slate-100 flex-shrink-0">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-12">
            <img src={logo} alt="MediConnect" className="h-10 w-auto" />
            <div><p className="text-lg font-black text-slate-950 tracking-tighter">MediConnect <span className="text-[#8D153A]">Lanka</span></p><p className="text-[9px] font-bold text-[#E5AB22] uppercase tracking-widest">Medical Specialist</p></div>
          </div>
          <nav className="space-y-2">
            {navItems.map(item => (
              <Link key={item.name} to={item.path} className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${location.pathname === item.path ? 'bg-[#8D153A] text-slate-900 shadow-lg' : 'text-slate-500 hover:bg-[#8D153A]/5 hover:text-[#8D153A]'}`}>
                <item.icon size={22} /><span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-[1400px] mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-black text-slate-950 tracking-tighter mb-1">Analytics</h1>
              <p className="text-slate-500 font-bold text-sm">
                {usingFallback && <span className="inline-flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-1 rounded-lg mr-2 text-xs"><AlertCircle size={12} />Using cached data</span>}
                Dr. {(user as any)?.firstName || 'Doctor'}'s performance overview
              </p>
            </div>
            <button onClick={load} className="p-3 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-[#8D153A] transition-all">
              <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-24 text-slate-600"><Loader2 size={32} className="animate-spin mr-3" />Loading analytics...</div>
          ) : stats ? (
            <>
              {/* Primary KPI Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[
                  { label: 'Total Patients', value: stats.totalPatients.toLocaleString(), icon: Users, color: 'text-[#8D153A]', bg: 'bg-[#8D153A]/5', trend: '+8% this month' },
                  { label: 'Total Appointments', value: stats.totalAppointments.toLocaleString(), icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50', trend: `${stats.thisMonthAppointments} this month` },
                  { label: 'Avg Rating', value: `${stats.avgRating}/5.0`, icon: Star, color: 'text-[#E5AB22]', bg: 'bg-[#FFBE29]/10', trend: 'Based on patient reviews' },
                  { label: 'Total Revenue', value: fmtLKR(stats.totalRevenueLKR), icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: `${fmtLKR(stats.thisMonthRevenueLKR)} this month` },
                ].map((kpi, i) => (
                  <div key={i} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
                    <div className={`w-12 h-12 rounded-2xl ${kpi.bg} flex items-center justify-center ${kpi.color} mb-5`}><kpi.icon size={24} /></div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 mb-2">{kpi.label}</p>
                    <p className="text-2xl font-black text-slate-950 mb-2 leading-none">{kpi.value}</p>
                    <p className="text-xs font-bold text-slate-500">{kpi.trend}</p>
                  </div>
                ))}
              </div>

              {/* Completion Rate */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Appointment Outcome */}
                <div className="bg-white p-8 rounded-2xl border border-slate-100">
                  <h3 className="text-xl font-black text-slate-950 tracking-tighter mb-6">Appointment Outcomes</h3>
                  <div className="space-y-4">
                    {[
                      { label: 'Completed', count: stats.completedAppointments, color: 'bg-emerald-500', textColor: 'text-emerald-700' },
                      { label: 'Cancelled', count: stats.cancelledAppointments, color: 'bg-red-400', textColor: 'text-red-700' },
                      { label: 'Pending', count: stats.totalAppointments - stats.completedAppointments - stats.cancelledAppointments, color: 'bg-amber-400', textColor: 'text-amber-700' },
                    ].map(({ label, count, color, textColor }) => {
                      const pct = stats.totalAppointments > 0 ? Math.round((count / stats.totalAppointments) * 100) : 0;
                      return (
                        <div key={label}>
                          <div className="flex justify-between items-center mb-2">
                            <span className={`text-sm font-black ${textColor}`}>{label}</span>
                            <span className="text-sm font-black text-slate-950">{count.toLocaleString()} <span className="text-slate-600">({pct}%)</span></span>
                          </div>
                          <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                            <div className={`h-full ${color} rounded-full transition-all duration-1000`} style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <div className="mt-6 pt-5 border-t border-slate-100">
                    <div className="flex justify-between">
                      <span className="text-sm font-black text-slate-500">Completion Rate</span>
                      <span className="text-lg font-black text-emerald-600">
                        {stats.totalAppointments > 0 ? Math.round((stats.completedAppointments / stats.totalAppointments) * 100) : 0}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Consultation Type Breakdown (from live data) */}
                <div className="bg-white p-8 rounded-2xl border border-slate-100">
                  <h3 className="text-xl font-black text-slate-950 tracking-tighter mb-6">Consultation Types</h3>
                  {Object.keys(typeBreakdown).length === 0 ? (
                    <p className="text-slate-600 font-bold text-center py-8">No data available</p>
                  ) : (
                    <div className="space-y-4">
                      {Object.entries(typeBreakdown).map(([type, count]) => {
                        const pct = appointments.length > 0 ? Math.round((count / appointments.length) * 100) : 0;
                        const colors = ['bg-[#8D153A]', 'bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-purple-500'];
                        const idx = Object.keys(typeBreakdown).indexOf(type) % colors.length;
                        return (
                          <div key={type}>
                            <div className="flex justify-between items-center mb-2">
                              <span className="text-sm font-black text-slate-700">{type}</span>
                              <span className="text-sm font-black text-slate-950">{count} <span className="text-slate-600">({pct}%)</span></span>
                            </div>
                            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                              <div className={`h-full ${colors[idx]} rounded-full`} style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Revenue Insights */}
              <div className="bg-slate-900 text-slate-900 p-8 rounded-3xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-80 h-80 bg-[#8D153A]/20 rounded-full blur-[100px] -mr-40 -mt-40" />
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-8">
                    <div>
                      <p className="text-[#FFBE29] font-black uppercase tracking-widest text-xs mb-2">Revenue Insights</p>
                      <h3 className="text-3xl font-black tracking-tighter">Financial Overview</h3>
                    </div>
                    <TrendingUp size={32} className="text-[#FFBE29]" />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {[
                      { label: 'Total Revenue', value: fmtLKR(stats.totalRevenueLKR) },
                      { label: 'This Month', value: fmtLKR(stats.thisMonthRevenueLKR) },
                      { label: 'Avg Per Consult', value: stats.totalAppointments > 0 ? fmtLKR(Math.round(stats.totalRevenueLKR / stats.totalAppointments)) : 'LKR 0' },
                      { label: 'Completion Rate', value: `${stats.totalAppointments > 0 ? Math.round((stats.completedAppointments / stats.totalAppointments) * 100) : 0}%` },
                    ].map(({ label, value }) => (
                      <div key={label}>
                        <p className="text-slate-600 font-bold text-xs mb-1">{label}</p>
                        <p className="text-xl font-black">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-24 text-slate-600"><TrendingUp size={48} className="mx-auto mb-4 opacity-30" /><p className="font-bold">Could not load analytics</p></div>
          )}
        </div>
      </main>
    </div>
  );
}
