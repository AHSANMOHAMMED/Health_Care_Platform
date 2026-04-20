import React, { useState } from 'react';
import { 
  Calendar, Clock, Search, Filter, PlusCircle, 
  MessageCircle, Video, FileText, Users, ChevronRight,
  AlertTriangle, CheckCircle, XCircle, Phone
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.png';

interface Appointment {
  id: number;
  patientName: string;
  age: number;
  gender: string;
  time: string;
  date: string;
  type: string;
  status: 'waiting' | 'confirmed' | 'completed' | 'cancelled';
  reason: string;
  duration: string;
  priority: 'normal' | 'high' | 'urgent';
  notes: string;
  contact: string;
}

export default function AppointmentsPage() {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  const appointments: Appointment[] = [
    {
      id: 1,
      patientName: 'Aruni Wijesinghe',
      age: 34,
      gender: 'Female',
      time: '10:30 AM',
      date: '2024-04-21',
      type: 'Video Consult',
      status: 'waiting',
      reason: 'Annual Checkup',
      duration: '30 mins',
      priority: 'normal',
      notes: 'Regular follow-up for hypertension',
      contact: '+94 77 123 4567'
    },
    {
      id: 2,
      patientName: 'Kasun Perera',
      age: 45,
      gender: 'Male',
      time: '11:15 AM',
      date: '2024-04-21',
      type: 'Physical Follow-up',
      status: 'confirmed',
      reason: 'Post-Surgery Review',
      duration: '45 mins',
      priority: 'high',
      notes: 'Cardiac surgery follow-up, review ECG results',
      contact: '+94 71 234 5678'
    },
    {
      id: 3,
      patientName: 'Imara Jaffar',
      age: 28,
      gender: 'Female',
      time: '02:00 PM',
      date: '2024-04-21',
      type: 'New Patient',
      status: 'confirmed',
      reason: 'Initial Consultation',
      duration: '60 mins',
      priority: 'normal',
      notes: 'First-time visit, comprehensive evaluation needed',
      contact: '+94 76 345 6789'
    },
    {
      id: 4,
      patientName: 'Nimal Fernando',
      age: 52,
      gender: 'Male',
      time: '03:30 PM',
      date: '2024-04-21',
      type: 'Emergency',
      status: 'waiting',
      reason: 'Chest Pain',
      duration: '30 mins',
      priority: 'urgent',
      notes: 'Patient reports chest pain, immediate attention required',
      contact: '+94 77 456 7890'
    }
  ];

  const filteredAppointments = appointments.filter(apt => {
    const matchesSearch = apt.patientName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || apt.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting': return 'bg-emerald-100 text-emerald-700';
      case 'confirmed': return 'bg-blue-100 text-blue-700';
      case 'completed': return 'bg-purple-100 text-purple-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-600';
      case 'high': return 'bg-orange-100 text-orange-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden">
      {/* Sidebar */}
      <aside className="w-80 bg-white border-r border-slate-100 flex flex-col">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-16 px-2">
            <img src={logo} alt="MediConnect" className="h-10 w-auto" />
            <div className="leading-none">
              <p className="text-lg font-black text-slate-950 tracking-tighter">MediConnect <span className="text-[#8D153A]">Lanka</span></p>
              <p className="text-[9px] font-bold text-[#E5AB22] uppercase tracking-widest mt-1">Medical Specialist</p>
            </div>
          </div>

          <nav className="space-y-2">
            {[
              { name: 'Patient Overview', icon: Users, path: '/doctor' },
              { name: 'Appointments', icon: Calendar, path: '/doctor/appointments' },
              { name: 'Daily Schedule', icon: Clock, path: '/doctor/schedule' },
              { name: 'Medical Reports', icon: FileText, path: '/doctor/reports' },
              { name: 'Consultations', icon: MessageCircle, path: '/doctor/chats' },
              { name: 'Analytics', icon: ChevronRight, path: '/doctor/analytics' },
            ].map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${
                  location.pathname === item.path
                    ? 'bg-[#8D153A] text-white shadow-lg shadow-[#8D153A]/20'
                    : 'text-slate-500 hover:bg-[#8D153A]/5 hover:text-[#8D153A]'
                }`}
              >
                <item.icon size={22} />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-black text-slate-950 mb-2">Appointments</h1>
            <p className="text-lg text-slate-600 font-bold">Manage your patient appointments and consultations</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <Calendar className="text-[#8D153A]" size={24} />
                <span className="text-2xl font-black text-slate-950">12</span>
              </div>
              <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Today</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <CheckCircle className="text-emerald-600" size={24} />
                <span className="text-2xl font-black text-slate-950">8</span>
              </div>
              <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Confirmed</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <AlertTriangle className="text-orange-600" size={24} />
                <span className="text-2xl font-black text-slate-950">2</span>
              </div>
              <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Waiting</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <XCircle className="text-red-600" size={24} />
                <span className="text-2xl font-black text-slate-950">1</span>
              </div>
              <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Cancelled</p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder="Search patients..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-950 font-bold placeholder-slate-400 focus:outline-none focus:border-[#8D153A] focus:ring-2 focus:ring-[#8D153A]/10"
                />
              </div>
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-950 font-bold focus:outline-none focus:border-[#8D153A] focus:ring-2 focus:ring-[#8D153A]/10"
                >
                  <option value="all">All Status</option>
                  <option value="waiting">Waiting</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
                <button className="px-6 py-3 bg-[#8D153A] text-white rounded-xl font-black hover:bg-[#8D153A]/80 transition-all flex items-center gap-2">
                  <PlusCircle size={20} />
                  New Appointment
                </button>
              </div>
            </div>
          </div>

          {/* Appointments List */}
          <div className="space-y-4">
            {filteredAppointments.map((appointment) => (
              <div key={appointment.id} className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-[#FFBE29]/40 hover:shadow-lg transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-6">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#8D153A] to-[#E5AB22] flex items-center justify-center text-white font-black text-xl shadow-lg">
                        {appointment.patientName.split(' ').map(n => n[0]).join('')}
                      </div>
                      {appointment.priority === 'urgent' && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse"></div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <p className="font-black text-slate-950 text-lg">{appointment.patientName}</p>
                        <span className="px-2 py-1 bg-slate-100 rounded-lg text-xs font-black text-slate-600">
                          {appointment.age}y, {appointment.gender}
                        </span>
                        <span className={`px-2 py-1 rounded-lg text-xs font-black ${getPriorityColor(appointment.priority)}`}>
                          {appointment.priority.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-600 font-bold mb-3">
                        <span className="flex items-center gap-1">
                          <Calendar size={14} /> {appointment.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={14} /> {appointment.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <Video size={14} /> {appointment.type}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone size={14} /> {appointment.contact}
                        </span>
                      </div>
                      <p className="text-sm text-slate-600 font-medium mb-2">
                        <span className="font-black">Reason:</span> {appointment.reason}
                      </p>
                      <p className="text-xs text-slate-500 italic">
                        {appointment.notes}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-3">
                    <div className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all" title="View Details">
                        <FileText size={16} />
                      </button>
                      <button className="p-2 rounded-xl bg-emerald-100 text-emerald-600 hover:bg-emerald-200 transition-all" title="Start Consultation">
                        <Video size={16} />
                      </button>
                      <button className="p-2 rounded-xl bg-blue-100 text-blue-600 hover:bg-blue-200 transition-all" title="Message Patient">
                        <MessageCircle size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
