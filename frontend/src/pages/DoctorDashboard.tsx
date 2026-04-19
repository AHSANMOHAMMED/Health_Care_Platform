import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users, Video, Search, Filter, CheckCircle, XCircle, AlertCircle, ChevronRight, Activity, CalendarPlus } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { api } from '../api/axios';

interface Appointment {
  id: number;
  patientId: number;
  patientName: string;
  patientEmail: string;
  appointmentDate: string;
  appointmentTime: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  symptoms: string;
  consultationType: 'IN_PERSON' | 'VIDEO';
  notes?: string;
}

interface DoctorStats {
  totalAppointments: number;
  pendingAppointments: number;
  completedAppointments: number;
  todayAppointments: number;
}

export default function DoctorDashboard() {
  const { user, userId } = useAuthStore();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [stats, setStats] = useState<DoctorStats>({
    totalAppointments: 0, pendingAppointments: 0, completedAppointments: 0, todayAppointments: 0
  });
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'today' | 'pending' | 'completed'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchAppointments();
    fetchStats();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/appointments/doctor/${userId}/appointments`);
      if (response.data) setAppointments(response.data);
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get(`/appointments/doctor/${userId}/stats`);
      if (response.data) setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const updateAppointmentStatus = async (appointmentId: number, status: string) => {
    try {
      await api.patch(`/appointments/${appointmentId}`, { status });
      setAppointments(prev => prev.map(apt => apt.id === appointmentId ? { ...apt, status: status as any } : apt));
      fetchStats(); 
    } catch (error) {
      console.error('Failed to update appointment:', error);
    }
  };

  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) || apt.symptoms.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    switch (selectedFilter) {
      case 'today': return apt.appointmentDate === new Date().toISOString().split('T')[0];
      case 'pending': return apt.status === 'PENDING';
      case 'completed': return apt.status === 'COMPLETED';
      default: return true;
    }
  });

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'text-indigo-700 bg-indigo-100 border-indigo-200';
      case 'PENDING': return 'text-amber-700 bg-amber-100 border-amber-200';
      case 'COMPLETED': return 'text-emerald-700 bg-emerald-100 border-emerald-200';
      case 'CANCELLED': return 'text-rose-700 bg-rose-100 border-rose-200';
      default: return 'text-slate-600 bg-slate-100';
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 md:mb-10 animate-slide-up px-4 md:px-0">
        <div>
          <h1 className="text-2xl md:text-4xl font-bold text-slate-900 mb-2">Doctor Dashboard</h1>
          <p className="text-slate-500 font-medium text-sm md:text-lg">Welcome back, Dr. {user?.firstName || 'Professional'}</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-primary flex items-center gap-2">
            <CalendarPlus size={18} /> Schedule
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 animate-slide-up delay-100">
        {[
          { label: 'Total Patients', value: stats.totalAppointments, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
          { label: 'Pending Appts', value: stats.pendingAppointments, icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-100' },
          { label: 'Completed', value: stats.completedAppointments, icon: CheckCircle, color: 'text-emerald-600', bg: 'bg-emerald-100' },
          { label: 'Today', value: stats.todayAppointments, icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-100' },
        ].map((stat, i) => (
          <div key={i} className="premium-glass p-5 md:p-6 hover-trigger">
            <div className="flex justify-between items-start mb-3 md:mb-4">
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} transform transition-transform group-hover:-translate-y-1`}>
                <stat.icon size={26} />
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-extrabold text-slate-900 mb-1">{stat.value}</h3>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-slide-up delay-200">
        <div className="lg:col-span-2 px-4 md:px-0">
          {/* Appointments List */}
          <div className="premium-glass p-4 md:p-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4">
              <h2 className="text-xl md:text-2xl font-bold text-slate-900 border-l-4 border-indigo-500 pl-3 md:pl-4">Appointments Scheduler</h2>
              <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3">
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    type="text" placeholder="Search patients..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                  />
                </div>
                <select
                  value={selectedFilter} onChange={(e) => setSelectedFilter(e.target.value as any)}
                  className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none font-medium text-slate-600 cursor-pointer"
                >
                  <option value="all">All</option>
                  <option value="today">Today</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[1,2,3].map(i => (
                  <div key={i} className="h-24 bg-slate-100 rounded-2xl animate-pulse"></div>
                ))}
              </div>
            ) : filteredAppointments.length === 0 ? (
              <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
                <Calendar className="mx-auto text-slate-300 mb-4" size={56} />
                <h3 className="text-lg font-bold text-slate-700">No appointments found</h3>
                <p className="text-slate-500 mt-1">Try adjusting your filters.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAppointments.map((apt) => (
                  <div key={apt.id} className="group bg-white rounded-2xl border border-slate-100 p-5 hover:border-indigo-300 hover:shadow-lg transition-all">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      
                      <div className="flex gap-4">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-100 to-blue-50 text-indigo-700 font-bold text-xl flex items-center justify-center shrink-0">
                          {apt.patientName.split(' ').map(n=>n[0]).join('')}
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-slate-900 leading-tight">{apt.patientName}</h3>
                          <div className="flex flex-wrap items-center gap-3 mt-2">
                            <span className="text-sm font-medium text-slate-500 flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md"><Calendar size={14}/> {apt.appointmentDate}</span>
                            <span className="text-sm font-medium text-slate-500 flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md"><Clock size={14}/> {apt.appointmentTime}</span>
                            {apt.consultationType === 'VIDEO' ? (
                              <span className="text-xs font-bold text-teal-700 bg-teal-50 border border-teal-100 px-2.5 py-1 rounded-full flex items-center gap-1"><Video size={12}/> Video Call</span>
                            ) : (
                              <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full flex items-center gap-1"><Users size={12}/> In Person</span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center md:items-start flex-row md:flex-col justify-between md:justify-start gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border ${getStatusStyle(apt.status)}`}>
                          {apt.status}
                        </span>
                        
                        <div className="flex gap-2 w-full md:w-auto mt-2 md:mt-0">
                          {apt.status === 'PENDING' && (
                            <>
                              <button onClick={() => updateAppointmentStatus(apt.id, 'CONFIRMED')} className="flex-1 md:flex-none px-3 py-2.5 md:py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs md:text-sm font-bold rounded-xl transition-colors text-center shadow-sm hover:shadow-md">Accept</button>
                              <button onClick={() => updateAppointmentStatus(apt.id, 'CANCELLED')} className="flex-1 md:flex-none px-3 py-2.5 md:py-1.5 bg-rose-100 hover:bg-rose-200 text-rose-700 text-xs md:text-sm font-bold rounded-xl transition-colors text-center border border-rose-200">Decline</button>
                            </>
                          )}
                          {apt.status === 'CONFIRMED' && apt.consultationType === 'VIDEO' && (
                            <button className="flex-1 md:flex-none px-3 py-2.5 md:py-1.5 bg-teal-500 hover:bg-teal-600 text-white text-xs md:text-sm font-bold rounded-xl transition-colors flex items-center justify-center gap-1 shadow-sm hover:shadow-md"><Video size={16}/> Join</button>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-50 text-sm text-slate-600 bg-slate-50/50 p-3 rounded-xl">
                      <span className="font-semibold text-slate-800">Symptoms:</span> {apt.symptoms}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          <div className="premium-glass p-6 text-center">
             <div className="w-20 h-20 mx-auto bg-gradient-to-br from-indigo-500 to-blue-600 rounded-full flex items-center justify-center text-white shadow-xl mb-4">
               <Activity size={32} />
             </div>
             <h3 className="text-lg font-bold text-slate-900">Dr. {user?.firstName}</h3>
             <p className="text-sm font-medium text-emerald-600 bg-emerald-50 inline-block px-3 py-1 rounded-full mt-2">Available for Video</p>
             <div className="h-px bg-slate-200 w-full my-6"></div>
             <div className="flex justify-between text-sm">
               <span className="text-slate-500 font-medium">Rating</span>
               <span className="text-slate-900 font-bold flex items-center">4.9 ⭐️</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
