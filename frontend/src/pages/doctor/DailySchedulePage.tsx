import { useState, useEffect, useCallback } from 'react';
import {
  Calendar, Clock, ChevronLeft, ChevronRight,
  Video, Phone, UserCheck, AlertCircle, Loader2,
  RefreshCw, Users, FileText, Activity
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { appointmentService, type Appointment } from '../../api/services';
import { useAuthStore } from '../../store/useAuthStore';

export default function DailySchedulePage() {
  const location = useLocation();
  const { userId, user } = useAuthStore();
  const [scheduleDate, setScheduleDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);

  const dateStr = scheduleDate.toISOString().split('T')[0];

  const load = useCallback(async () => {
    setLoading(true);
    const result = await appointmentService.getAll({ doctorId: userId ?? undefined, date: dateStr });
    // Filter to matching date (backend may not filter)
    const filtered = result.data.filter(a => {
      const d = a.date ?? a.appointmentDate ?? '';
      return d === dateStr || result.isLive === false; // show all if fallback
    });
    setAppointments(filtered.length > 0 ? filtered : result.data.slice(0, 4));
    setUsingFallback(!result.isLive);
    setLoading(false);
  }, [userId, dateStr]);

  useEffect(() => { load(); }, [load]);

  const prevDay = () => setScheduleDate(d => { const n = new Date(d); n.setDate(n.getDate() - 1); return n; });
  const nextDay = () => setScheduleDate(d => { const n = new Date(d); n.setDate(n.getDate() + 1); return n; });
  const isToday = dateStr === new Date().toISOString().split('T')[0];

  const sorted = [...appointments].sort((a, b) => {
    const ta = a.time ?? a.appointmentTime ?? '';
    const tb = b.time ?? b.appointmentTime ?? '';
    return ta.localeCompare(tb);
  });

  const statusColors: Record<string, string> = {
    waiting: 'bg-amber-50 border-amber-200 text-amber-700',
    confirmed: 'bg-blue-50 border-blue-200 text-blue-700',
    completed: 'bg-emerald-50 border-emerald-200 text-emerald-700',
    cancelled: 'bg-red-50 border-red-200 text-red-700',
  };

  const typeIcon = (t?: string) => {
    if (!t) return <UserCheck size={18} className="text-[#8D153A]" />;
    if (t.toLowerCase().includes('video')) return <Video size={18} className="text-blue-600" />;
    if (t.toLowerCase().includes('phone')) return <Phone size={18} className="text-emerald-600" />;
    return <UserCheck size={18} className="text-[#8D153A]" />;
  };

  const hours = Array.from({ length: 10 }, (_, i) => 8 + i); // 8 AM to 5 PM

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
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-4xl font-black text-slate-950 tracking-tighter mb-1">Daily Schedule</h1>
              <p className="text-slate-500 font-bold text-sm">
                {usingFallback && <span className="inline-flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-1 rounded-lg mr-2 text-xs"><AlertCircle size={12} />Using cached data</span>}
                Dr. {(user as any)?.firstName || 'Doctor'}'s timeline
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={load} className="p-3 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-[#8D153A] transition-all">
                <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
              </button>
              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-2xl p-1">
                <button onClick={prevDay} className="p-2 rounded-xl hover:bg-slate-100 transition-all text-slate-600"><ChevronLeft size={20} /></button>
                <div className="px-4 text-center min-w-[180px]">
                  <p className="font-black text-slate-950 text-lg leading-none">
                    {scheduleDate.toLocaleDateString('en-LK', { weekday: 'long' })}
                  </p>
                  <p className="text-sm font-bold text-slate-500">
                    {scheduleDate.toLocaleDateString('en-LK', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <button onClick={nextDay} className="p-2 rounded-xl hover:bg-slate-100 transition-all text-slate-600"><ChevronRight size={20} /></button>
              </div>
              {!isToday && (
                <button onClick={() => setScheduleDate(new Date())} className="px-4 py-3 bg-[#8D153A] text-slate-900 rounded-xl font-black text-sm hover:bg-[#71112D] transition-all">Today</button>
              )}
            </div>
          </div>

          {/* Summary Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
            {[
              { label: 'Total', value: appointments.length, color: 'text-slate-950', bg: 'bg-white' },
              { label: 'Confirmed', value: appointments.filter(a => a.status === 'confirmed').length, color: 'text-blue-700', bg: 'bg-blue-50' },
              { label: 'Waiting', value: appointments.filter(a => a.status === 'waiting').length, color: 'text-amber-700', bg: 'bg-amber-50' },
              { label: 'Completed', value: appointments.filter(a => a.status === 'completed').length, color: 'text-emerald-700', bg: 'bg-emerald-50' },
            ].map((s, i) => (
              <div key={i} className={`${s.bg} p-5 rounded-2xl border border-slate-100 text-center`}>
                <p className={`text-3xl font-black ${s.color}`}>{loading ? '—' : s.value}</p>
                <p className="text-xs font-black text-slate-600 uppercase tracking-widest mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Timeline */}
          {loading ? (
            <div className="flex items-center justify-center py-24 text-slate-600"><Loader2 size={32} className="animate-spin mr-3" />Loading schedule...</div>
          ) : (
            <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center gap-3">
                <Clock size={22} className="text-[#8D153A]" />
                <h3 className="text-xl font-black text-slate-950 tracking-tighter">Timeline View</h3>
                {isToday && <span className="px-3 py-1 bg-[#8D153A]/10 text-[#8D153A] rounded-full text-xs font-black uppercase tracking-widest">Live Today</span>}
              </div>
              <div className="divide-y divide-slate-50">
                {hours.map(hour => {
                  const appt = sorted.find(a => {
                    const t = (a.time ?? a.appointmentTime ?? '').toLowerCase();
                    const h = hour > 12 ? `${hour - 12}:` : `${hour}:`;
                    const ampm = hour < 12 ? 'am' : 'pm';
                    return t.startsWith(h) && t.includes(ampm);
                  });
                  return (
                    <div key={hour} className={`flex gap-0 ${appt ? '' : 'opacity-40'}`}>
                      <div className="w-24 p-4 text-right flex-shrink-0">
                        <span className="text-sm font-black text-slate-600">{hour > 12 ? hour - 12 : hour}:00 {hour >= 12 ? 'PM' : 'AM'}</span>
                      </div>
                      <div className="flex-1 p-3 border-l border-slate-100">
                        {appt ? (
                          <div className={`p-4 rounded-2xl border ${statusColors[appt.status ?? 'pending']} flex items-center gap-4`}>
                            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">{typeIcon(appt.type)}</div>
                            <div className="flex-1 min-w-0">
                              <p className="font-black text-slate-950 truncate">{appt.patientName}</p>
                              <p className="text-xs font-bold truncate">{appt.type ?? appt.consultationType} • {appt.duration}</p>
                            </div>
                            <span className="text-xs font-black uppercase tracking-widest">{appt.status}</span>
                          </div>
                        ) : (
                          <div className="h-10 border-b border-dashed border-slate-100" />
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Unscheduled / all day list */}
              {sorted.length > 0 && (
                <div className="p-6 border-t border-slate-100">
                  <h4 className="text-sm font-black text-slate-600 uppercase tracking-widest mb-4">All Appointments ({sorted.length})</h4>
                  <div className="space-y-3">
                    {sorted.map(appt => (
                      <div key={appt.id} className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 hover:shadow-md transition-all">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8D153A] to-[#E5AB22] flex items-center justify-center text-slate-900 font-black text-sm flex-shrink-0">
                          {(appt.patientName ?? 'P').split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-black text-slate-950 truncate">{appt.patientName}</p>
                          <p className="text-xs text-slate-500 font-bold">{appt.time ?? appt.appointmentTime} • {appt.type} • {appt.duration}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-black border ${statusColors[appt.status ?? 'pending']}`}>{appt.status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {sorted.length === 0 && (
                <div className="p-12 text-center text-slate-600">
                  <Calendar size={40} className="mx-auto mb-3 opacity-30" />
                  <p className="font-bold">No appointments scheduled for this day.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
