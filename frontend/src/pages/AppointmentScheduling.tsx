import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, User, ChevronLeft, ChevronRight, Search, Filter, Plus, CheckCircle, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { api } from '../api/axios';
import { useAuthStore } from '../store/useAuthStore';

interface Appointment {
  id: number;
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  type: 'IN_PERSON' | 'VIDEO';
  notes?: string;
}

export default function AppointmentScheduling() {
  const user = useAuthStore(state => state.user);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'CONFIRMED' | 'COMPLETED'>('ALL');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const endpoint = user?.role === 'DOCTOR'
        ? `/appointment-service/doctor/${user.id}/appointments`
        : `/appointment-service/patient`;

      const response = await api.get(endpoint);
      setAppointments(response.data || []);
    } catch (error) {
      // Demo data
      setAppointments([
        { id: 1, patientName: 'John Doe', doctorName: 'Dr. Smith', date: '2026-04-25', time: '10:00', status: 'CONFIRMED', type: 'IN_PERSON' },
        { id: 2, patientName: 'Jane Smith', doctorName: 'Dr. Johnson', date: '2026-04-26', time: '14:30', status: 'PENDING', type: 'VIDEO' },
        { id: 3, patientName: 'Mike Brown', doctorName: 'Dr. Davis', date: '2026-04-24', time: '11:00', status: 'COMPLETED', type: 'IN_PERSON' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const getAppointmentsForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return appointments.filter(apt => apt.date === dateStr);
  };

  const filteredAppointments = appointments.filter(apt =>
    filter === 'ALL' || apt.status === filter
  );

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'CONFIRMED': return 'text-emerald-400 bg-emerald-400/10';
      case 'PENDING': return 'text-yellow-400 bg-yellow-400/10';
      case 'COMPLETED': return 'text-blue-400 bg-blue-400/10';
      case 'CANCELLED': return 'text-red-400 bg-red-400/10';
      default: return 'text-slate-600 bg-slate-400/10';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-50/90 backdrop-blur-md border-b border-slate-300/30">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to={user?.role === 'DOCTOR' ? '/doctor' : '/patient'} className="flex items-center gap-2 text-slate-600 hover:text-slate-900" onClick={(e) => !user && e.preventDefault()}>
              <ChevronLeft size={20} />
              <span>Dashboard</span>
            </Link>
          </div>
          <h1 className="text-lg font-semibold text-slate-900">Appointment Scheduling</h1>
          <Link
            to="/booking"
            className="flex items-center gap-2 bg-[#0EA5E9] hover:bg-[#0284C7] text-slate-900 px-4 py-2 rounded-lg text-sm font-medium transition-all"
          >
            <Plus size={18} />
            New Appointment
          </Link>
        </div>
      </header>

      <main className="pt-24 pb-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Calendar */}
            <div className="lg:col-span-2">
              <div className="bg-white border border-slate-300/50 rounded-2xl p-6">
                {/* Calendar Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-slate-900">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                  </h2>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                      className="p-2 rounded-lg bg-slate-50 hover:bg-[#1E3A5F]/50 text-slate-600 hover:text-slate-900 transition-all"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                      className="p-2 rounded-lg bg-slate-50 hover:bg-[#1E3A5F]/50 text-slate-600 hover:text-slate-900 transition-all"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>

                {/* Weekday Headers */}
                <div className="grid grid-cols-7 gap-2 mb-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center text-sm font-medium text-slate-500 py-2">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-2">
                  {getDaysInMonth(currentDate).map((day, idx) => (
                    <div
                      key={idx}
                      onClick={() => day && setSelectedDate(`${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`)}
                      className={`aspect-square rounded-xl p-2 cursor-pointer transition-all ${
                        day
                          ? 'bg-slate-50 hover:bg-[#1E3A5F]/30 border border-slate-300/30'
                          : ''
                      } ${
                        selectedDate?.endsWith(`-${String(day).padStart(2, '0')}`)
                          ? 'ring-2 ring-[#0EA5E9]'
                          : ''
                      }`}
                    >
                      {day && (
                        <>
                          <span className="text-sm text-slate-700">{day}</span>
                          {getAppointmentsForDate(day).length > 0 && (
                            <div className="flex gap-1 mt-1">
                              {getAppointmentsForDate(day).slice(0, 3).map((_, i) => (
                                <div key={i} className="w-1.5 h-1.5 rounded-full bg-[#0EA5E9]" />
                              ))}
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Filters */}
              <div className="bg-white border border-slate-300/50 rounded-2xl p-4">
                <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                  <Filter size={18} />
                  Filter Appointments
                </h3>
                <div className="flex flex-wrap gap-2">
                  {(['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED'] as const).map(f => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                        filter === f
                          ? 'bg-[#0EA5E9] text-slate-900'
                          : 'bg-slate-50 text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="bg-white border border-slate-300/50 rounded-2xl p-4">
                <h3 className="font-semibold text-slate-900 mb-4">Quick Stats</h3>
                <div className="space-y-3">
                  {[
                    { label: 'Total', count: appointments.length, color: 'text-slate-600' },
                    { label: 'Pending', count: appointments.filter(a => a.status === 'PENDING').length, color: 'text-yellow-400' },
                    { label: 'Confirmed', count: appointments.filter(a => a.status === 'CONFIRMED').length, color: 'text-emerald-400' },
                    { label: 'Completed', count: appointments.filter(a => a.status === 'COMPLETED').length, color: 'text-blue-400' },
                  ].map(stat => (
                    <div key={stat.label} className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">{stat.label}</span>
                      <span className={`text-lg font-semibold ${stat.color}`}>{stat.count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Appointments List */}
          <div className="mt-6 bg-white border border-slate-300/50 rounded-2xl p-6">
            <h3 className="font-semibold text-slate-900 mb-4">
              {selectedDate ? `Appointments for ${selectedDate}` : 'All Appointments'}
            </h3>

            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="animate-spin text-[#0EA5E9]" size={32} />
              </div>
            ) : filteredAppointments.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="mx-auto text-slate-500 mb-4" size={48} />
                <p className="text-slate-600">No appointments found</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredAppointments
                  .filter(apt => !selectedDate || apt.date === selectedDate)
                  .map(apt => (
                    <div
                      key={apt.id}
                      className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-300/30 hover:border-[#0EA5E9]/30 transition-all"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-[#1E3A5F]/30 flex items-center justify-center">
                          <Calendar className="text-[#0EA5E9]" size={20} />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">
                            {user?.role === 'DOCTOR' ? apt.patientName : apt.doctorName}
                          </p>
                          <div className="flex items-center gap-3 text-sm text-slate-600">
                            <span className="flex items-center gap-1">
                              <Clock size={14} />
                              {apt.time}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar size={14} />
                              {apt.date}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(apt.status)}`}>
                          {apt.status}
                        </span>
                        {apt.type === 'VIDEO' && (
                          <Link
                            to={`/telemedicine?appointment=${apt.id}`}
                            className="p-2 rounded-lg bg-[#0EA5E9]/10 text-[#0EA5E9] hover:bg-[#0EA5E9]/20"
                          >
                            <CheckCircle size={18} />
                          </Link>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
