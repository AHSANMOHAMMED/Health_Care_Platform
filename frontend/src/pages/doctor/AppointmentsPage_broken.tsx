import React, { useState } from 'react';
import { 
  Calendar, Clock, Search, Filter, PlusCircle, 
  MessageCircle, Video, FileText, Users, ChevronRight,
  AlertTriangle, CheckCircle, XCircle, Phone, X
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
  
  // Innovative navigation states
  const [viewMode, setViewMode] = useState<'list' | 'calendar' | 'timeline' | 'kanban'>('list');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showQuickAddModal, setShowQuickAddModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showAppointmentDetails, setShowAppointmentDetails] = useState(false);
  const [draggedAppointment, setDraggedAppointment] = useState<Appointment | null>(null);
  
  // Comprehensive appointment form
  const [quickAppointmentForm, setQuickAppointmentForm] = useState({
    patientName: '',
    age: '',
    gender: 'Other',
    date: '',
    time: '',
    type: 'Video Consult',
    duration: '30 mins',
    reason: '',
    priority: 'normal',
    contact: '',
    notes: ''
  });

  const [appointments, setAppointments] = useState<Appointment[]>([
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

  // Innovative navigation handlers
  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };

  const handleQuickAddAppointment = () => {
    setShowQuickAddModal(true);
    setQuickAppointmentForm({
      ...quickAppointmentForm,
      date: currentDate.toISOString().split('T')[0]
    });
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setQuickAppointmentForm({
      ...quickAppointmentForm,
      date: date.toISOString().split('T')[0]
    });
    setShowQuickAddModal(true);
  };

  const handleAppointmentClick = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowAppointmentDetails(true);
  };

  const handleDragStart = (appointment: Appointment) => {
    setDraggedAppointment(appointment);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, newDate: string) => {
    e.preventDefault();
    if (draggedAppointment) {
      console.log(`Moving appointment ${draggedAppointment.id} to ${newDate}`);
      // Here you would update the appointment date
      setDraggedAppointment(null);
    }
  };

  const handleQuickSaveAppointment = () => {
    // Validation
    if (!quickAppointmentForm.patientName || !quickAppointmentForm.date || !quickAppointmentForm.time) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Create new appointment
    const newAppointment: Appointment = {
      id: Math.max(...appointments.map(a => a.id)) + 1,
      patientName: quickAppointmentForm.patientName,
      age: parseInt(quickAppointmentForm.age) || 30,
      gender: quickAppointmentForm.gender,
      time: quickAppointmentForm.time,
      date: quickAppointmentForm.date,
      type: quickAppointmentForm.type,
      status: 'confirmed',
      reason: quickAppointmentForm.reason,
      duration: quickAppointmentForm.duration,
      priority: quickAppointmentForm.priority as 'normal' | 'high' | 'urgent',
      notes: quickAppointmentForm.notes,
      contact: quickAppointmentForm.contact || '+94 77 123 4567'
    };
    
    setAppointments([...appointments, newAppointment]);
    alert('Appointment created successfully!');
    setShowQuickAddModal(false);
    setQuickAppointmentForm({
      patientName: '',
      age: '',
      gender: 'Other',
      date: '',
      time: '',
      type: 'Video Consult',
      duration: '30 mins',
      reason: '',
      priority: 'normal',
      contact: '',
      notes: ''
    });
  };

  // Enhanced CRUD operations
  const handleUpdateAppointment = (id: number, updates: Partial<Appointment>) => {
    setAppointments(appointments.map(apt => 
      apt.id === id ? { ...apt, ...updates } : apt
    ));
  };

  const handleDeleteAppointment = (id: number) => {
    if (confirm('Are you sure you want to delete this appointment?')) {
      setAppointments(appointments.filter(apt => apt.id !== id));
      alert('Appointment deleted successfully!');
    }
  };

  const handleUpdateStatus = (id: number, status: Appointment['status']) => {
    handleUpdateAppointment(id, { status });
  };

  const handleRescheduleAppointment = (id: number, newDate: string, newTime: string) => {
    handleUpdateAppointment(id, { date: newDate, time: newTime });
    alert('Appointment rescheduled successfully!');
  };

  const getCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    return days;
  };

  const getAppointmentsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return appointments.filter(apt => apt.date === dateStr);
  };

  const getTimeSlots = () => {
    const slots = [];
    for (let hour = 8; hour <= 18; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayTime = hour === 12 ? `12:${minute.toString().padStart(2, '0')} ${ampm}` : 
                           hour > 12 ? `${hour-12}:${minute.toString().padStart(2, '0')} ${ampm}` : 
                           `${hour}:${minute.toString().padStart(2, '0')} ${ampm}`;
        slots.push({ time, displayTime });
      }
    }
    return slots;
  };

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
                    ? 'bg-[#8D153A] text-slate-900 shadow-lg shadow-[#8D153A]/20'
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
          {/* Innovative Navigation Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl font-black text-slate-950 mb-2">Appointments</h1>
                <p className="text-lg text-slate-600 font-bold">Manage your patient appointments and consultations</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleQuickAddAppointment}
                  className="px-6 py-3 bg-gradient-to-r from-[#8D153A] to-[#E5AB22] text-slate-900 rounded-2xl font-black hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <PlusCircle size={20} />
                  Quick Appointment
                </button>
              </div>
            </div>

            {/* View Mode Navigation */}
            <div className="bg-white p-2 rounded-2xl border border-slate-100 inline-flex mb-6">
              {[
                { mode: 'list', icon: FileText, label: 'List View' },
                { mode: 'calendar', icon: Calendar, label: 'Calendar' },
                { mode: 'timeline', icon: Clock, label: 'Timeline' },
                { mode: 'kanban', icon: Users, label: 'Kanban' }
              ].map(({ mode, icon: Icon, label }) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode as any)}
                  className={`px-6 py-3 rounded-xl font-black transition-all flex items-center gap-2 ${
                    viewMode === mode
                      ? 'bg-[#8D153A] text-slate-900 shadow-lg'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Icon size={18} />
                  {label}
                </button>
              ))}
            </div>

            {/* Date Navigation */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => navigateDate('prev')}
                    className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
                  >
                    <ChevronRight size={20} className="rotate-180" />
                  </button>
                  <div className="text-center">
                    <h2 className="text-xl font-black text-slate-950">
                      {currentDate.toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </h2>
                    <p className="text-sm text-slate-500">
                      {filteredAppointments.length} appointments scheduled
                    </p>
                  </div>
                  <button
                    onClick={() => navigateDate('next')}
                    className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentDate(new Date())}
                    className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-black hover:bg-slate-200 transition-all"
                  >
                    Today
                  </button>
                  <button
                    onClick={() => {
                      const tomorrow = new Date();
                      tomorrow.setDate(tomorrow.getDate() + 1);
                      setCurrentDate(tomorrow);
                    }}
                    className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-black hover:bg-slate-200 transition-all"
                  >
                    Tomorrow
                  </button>
                  <button
                    onClick={() => {
                      const nextWeek = new Date();
                      nextWeek.setDate(nextWeek.getDate() + 7);
                      setCurrentDate(nextWeek);
                    }}
                    className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-black hover:bg-slate-200 transition-all"
                  >
                    Next Week
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <Calendar className="text-[#8D153A]" size={24} />
                <span className="text-2xl font-black text-slate-950">12</span>
              </div>
              <p className="text-sm font-black text-slate-600 uppercase tracking-widest">Today</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <CheckCircle className="text-emerald-600" size={24} />
                <span className="text-2xl font-black text-slate-950">8</span>
              </div>
              <p className="text-sm font-black text-slate-600 uppercase tracking-widest">Confirmed</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <AlertTriangle className="text-orange-600" size={24} />
                <span className="text-2xl font-black text-slate-950">2</span>
              </div>
              <p className="text-sm font-black text-slate-600 uppercase tracking-widest">Waiting</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <XCircle className="text-red-600" size={24} />
                <span className="text-2xl font-black text-slate-950">1</span>
              </div>
              <p className="text-sm font-black text-slate-600 uppercase tracking-widest">Cancelled</p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-600" size={20} />
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
                <button className="px-6 py-3 bg-[#8D153A] text-slate-900 rounded-xl font-black hover:bg-[#8D153A]/80 transition-all flex items-center gap-2">
                  <PlusCircle size={20} />
                  New Appointment
                </button>
              </div>
            </div>
          </div>

          {/* Dynamic View Modes */}
          {viewMode === 'list' && (
            <div className="space-y-4">
              {filteredAppointments.map((appointment) => (
                <div 
                  key={appointment.id} 
                  className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-[#FFBE29]/40 hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => handleAppointmentClick(appointment)}
                  draggable
                  onDragStart={() => handleDragStart(appointment)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-6">
                      <div className="relative">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#8D153A] to-[#E5AB22] flex items-center justify-center text-slate-900 font-black text-xl shadow-lg">
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
                      <div className="flex items-center gap-2">
                        <div className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest ${getStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </div>
                        <div className="flex gap-1">
                          {appointment.status !== 'completed' && (
                            <button 
                              onClick={() => handleUpdateStatus(appointment.id, 'completed')}
                              className="p-1 rounded-lg bg-green-100 text-green-600 hover:bg-green-200 transition-all" 
                              title="Mark as Completed"
                            >
                              <CheckCircle size={12} />
                            </button>
                          )}
                          {appointment.status !== 'cancelled' && (
                            <button 
                              onClick={() => handleUpdateStatus(appointment.id, 'cancelled')}
                              className="p-1 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 transition-all" 
                              title="Cancel Appointment"
                            >
                              <XCircle size={12} />
                            </button>
                          )}
                        </div>
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
                        <button 
                          onClick={() => handleDeleteAppointment(appointment.id)}
                          className="p-2 rounded-xl bg-red-100 text-red-600 hover:bg-red-200 transition-all" 
                          title="Delete Appointment"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {viewMode === 'calendar' && (
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="text-center font-black text-slate-700 text-sm py-2">
                    {day}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-2">
                {getCalendarDays().map((day, index) => {
                  const dayAppointments = day ? getAppointmentsForDate(day) : [];
                  const isToday = day && day.toDateString() === new Date().toDateString();
                  const isSelected = day && selectedDate && day.toDateString() === selectedDate.toDateString();
                  
                  return (
                    <div
                      key={index}
                      onClick={() => day && handleDateClick(day)}
                      onDragOver={handleDragOver}
                      onDrop={(e) => day && handleDrop(e, day.toISOString().split('T')[0])}
                      className={`min-h-[100px] p-2 border rounded-xl cursor-pointer transition-all ${
                        !day ? 'border-transparent' : 
                        isToday ? 'border-[#8D153A] bg-[#8D153A]/10' :
                        isSelected ? 'border-blue-500 bg-blue-50' :
                        'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {day && (
                        <>
                          <div className={`text-sm font-black mb-1 ${
                            isToday ? 'text-[#8D153A]' : 'text-slate-700'
                          }`}>
                            {day.getDate()}
                          </div>
                          <div className="space-y-1">
                            {dayAppointments.slice(0, 2).map((apt, idx) => (
                              <div
                                key={idx}
                                className="text-xs p-1 rounded bg-gradient-to-r from-[#8D153A]/20 to-[#E5AB22]/20 text-slate-700 font-medium truncate"
                                title={apt.patientName}
                              >
                                {apt.time} {apt.patientName.split(' ')[0]}
                              </div>
                            ))}
                            {dayAppointments.length > 2 && (
                              <div className="text-xs text-slate-500 font-medium">
                                +{dayAppointments.length - 2} more
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {viewMode === 'timeline' && (
            <div className="bg-white rounded-2xl border border-slate-100 p-6">
              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {getTimeSlots().map(({ time, displayTime }) => {
                  const slotAppointments = filteredAppointments.filter(apt => 
                    apt.time.startsWith(time.split(':')[0]) && 
                    apt.date === currentDate.toISOString().split('T')[0]
                  );
                  
                  return (
                    <div key={time} className="flex gap-4">
                      <div className="w-20 text-sm font-black text-slate-600 py-2">
                        {displayTime}
                      </div>
                      <div className="flex-1 min-h-[60px] border-l-2 border-slate-200 pl-4">
                        {slotAppointments.map((apt) => (
                          <div
                            key={apt.id}
                            onClick={() => handleAppointmentClick(apt)}
                            className="mb-2 p-3 rounded-xl bg-gradient-to-r from-[#8D153A]/10 to-[#E5AB22]/10 border border-[#8D153A]/20 cursor-pointer hover:shadow-md transition-all"
                          >
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-black text-slate-950 text-sm">{apt.patientName}</p>
                                <p className="text-xs text-slate-600">{apt.type} • {apt.duration}</p>
                              </div>
                              <div className={`px-2 py-1 rounded-full text-xs font-black ${getStatusColor(apt.status)}`}>
                                {apt.status}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {viewMode === 'kanban' && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {['waiting', 'confirmed', 'completed', 'cancelled'].map(status => (
                <div key={status} className="bg-white rounded-2xl border border-slate-100 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-black text-slate-950 capitalize">{status}</h3>
                    <span className="px-2 py-1 bg-slate-100 rounded-lg text-xs font-black text-slate-600">
                      {filteredAppointments.filter(apt => apt.status === status).length}
                    </span>
                  </div>
                  <div 
                    className="space-y-3 min-h-[200px] p-2 rounded-xl bg-slate-50"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, currentDate.toISOString().split('T')[0])}
                  >
                    {filteredAppointments
                      .filter(apt => apt.status === status)
                      .map((apt) => (
                        <div
                          key={apt.id}
                          draggable
                          onDragStart={() => handleDragStart(apt)}
                          onClick={() => handleAppointmentClick(apt)}
                          className="bg-white p-3 rounded-xl border border-slate-200 cursor-pointer hover:shadow-md transition-all"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#8D153A] to-[#E5AB22] flex items-center justify-center text-slate-900 font-black text-xs">
                              {apt.patientName.split(' ').map(n => n[0]).join('')}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-black text-slate-950 text-sm truncate">{apt.patientName}</p>
                              <p className="text-xs text-slate-500">{apt.time}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-xs">
                            <span className={`px-2 py-1 rounded-lg font-black ${getPriorityColor(apt.priority)}`}>
                              {apt.priority}
                            </span>
                            <span className="text-slate-500">{apt.type}</span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      {/* Quick Appointment Modal */}
      {showQuickAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black text-slate-950">Quick Appointment</h3>
              <button 
                onClick={() => setShowQuickAddModal(false)}
                className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-3">Patient Name *</label>
                <input
                  type="text"
                  value={quickAppointmentForm.patientName}
                  onChange={(e) => setQuickAppointmentForm({...quickAppointmentForm, patientName: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-950 font-bold placeholder-slate-400 focus:outline-none focus:border-[#8D153A] focus:ring-2 focus:ring-[#8D153A]/10"
                  placeholder="Enter patient name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-3">Age</label>
                  <input
                    type="number"
                    value={quickAppointmentForm.age}
                    onChange={(e) => setQuickAppointmentForm({...quickAppointmentForm, age: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-950 font-bold placeholder-slate-400 focus:outline-none focus:border-[#8D153A] focus:ring-2 focus:ring-[#8D153A]/10"
                    placeholder="Age"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-3">Gender</label>
                  <select
                    value={quickAppointmentForm.gender}
                    onChange={(e) => setQuickAppointmentForm({...quickAppointmentForm, gender: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-950 font-bold focus:outline-none focus:border-[#8D153A] focus:ring-2 focus:ring-[#8D153A]/10"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-3">Date *</label>
                  <input
                    type="date"
                    value={quickAppointmentForm.date}
                    onChange={(e) => setQuickAppointmentForm({...quickAppointmentForm, date: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-950 font-bold focus:outline-none focus:border-[#8D153A] focus:ring-2 focus:ring-[#8D153A]/10"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-3">Time *</label>
                  <input
                    type="time"
                    value={quickAppointmentForm.time}
                    onChange={(e) => setQuickAppointmentForm({...quickAppointmentForm, time: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-950 font-bold focus:outline-none focus:border-[#8D153A] focus:ring-2 focus:ring-[#8D153A]/10"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-3">Type</label>
                  <select
                    value={quickAppointmentForm.type}
                    onChange={(e) => setQuickAppointmentForm({...quickAppointmentForm, type: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-950 font-bold focus:outline-none focus:border-[#8D153A] focus:ring-2 focus:ring-[#8D153A]/10"
                  >
                    <option value="Video Consult">Video Consult</option>
                    <option value="Phone Consult">Phone Consult</option>
                    <option value="Physical Examination">Physical Examination</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-3">Duration</label>
                  <select
                    value={quickAppointmentForm.duration}
                    onChange={(e) => setQuickAppointmentForm({...quickAppointmentForm, duration: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-950 font-bold focus:outline-none focus:border-[#8D153A] focus:ring-2 focus:ring-[#8D153A]/10"
                  >
                    <option value="15 mins">15 mins</option>
                    <option value="30 mins">30 mins</option>
                    <option value="45 mins">45 mins</option>
                    <option value="60 mins">60 mins</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-3">Priority</label>
                <select
                  value={quickAppointmentForm.priority}
                  onChange={(e) => setQuickAppointmentForm({...quickAppointmentForm, priority: e.target.value as any})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-950 font-bold focus:outline-none focus:border-[#8D153A] focus:ring-2 focus:ring-[#8D153A]/10"
                >
                  <option value="normal">Normal</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-3">Reason for Visit</label>
                <input
                  type="text"
                  value={quickAppointmentForm.reason}
                  onChange={(e) => setQuickAppointmentForm({...quickAppointmentForm, reason: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-950 font-bold placeholder-slate-400 focus:outline-none focus:border-[#8D153A] focus:ring-2 focus:ring-[#8D153A]/10"
                  placeholder="Enter reason for visit"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-3">Contact Number</label>
                <input
                  type="tel"
                  value={quickAppointmentForm.contact}
                  onChange={(e) => setQuickAppointmentForm({...quickAppointmentForm, contact: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-950 font-bold placeholder-slate-400 focus:outline-none focus:border-[#8D153A] focus:ring-2 focus:ring-[#8D153A]/10"
                  placeholder="+94 XX XXX XXXX"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-3">Additional Notes</label>
                <textarea
                  value={quickAppointmentForm.notes}
                  onChange={(e) => setQuickAppointmentForm({...quickAppointmentForm, notes: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-950 font-bold placeholder-slate-400 focus:outline-none focus:border-[#8D153A] focus:ring-2 focus:ring-[#8D153A]/10"
                  rows={3}
                  placeholder="Enter any additional notes or instructions"
                />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleQuickSaveAppointment}
                  className="flex-1 py-4 bg-gradient-to-r from-[#8D153A] to-[#E5AB22] text-slate-900 rounded-2xl font-black hover:shadow-lg transition-all"
                >
                  Create Appointment
                </button>
                <button
                  onClick={() => setShowQuickAddModal(false)}
                  className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black hover:bg-slate-200 transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Appointment Details Modal */}
      {showAppointmentDetails && selectedAppointment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-black text-slate-950 mb-2">Appointment Details</h3>
                <p className="text-slate-600 font-bold">{selectedAppointment.patientName}</p>
              </div>
              <button 
                onClick={() => setShowAppointmentDetails(false)}
                className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h4 className="text-lg font-black text-slate-950 mb-4">Patient Information</h4>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600 font-medium">Name:</span>
                    <span className="font-black text-slate-950">{selectedAppointment.patientName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600 font-medium">Age:</span>
                    <span className="font-black text-slate-950">{selectedAppointment.age} years</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600 font-medium">Gender:</span>
                    <span className="font-black text-slate-950">{selectedAppointment.gender}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600 font-medium">Contact:</span>
                    <span className="font-black text-slate-950">{selectedAppointment.contact}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-black text-slate-950 mb-4">Appointment Details</h4>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600 font-medium">Date:</span>
                    <span className="font-black text-slate-950">{selectedAppointment.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600 font-medium">Time:</span>
                    <span className="font-black text-slate-950">{selectedAppointment.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600 font-medium">Duration:</span>
                    <span className="font-black text-slate-950">{selectedAppointment.duration}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600 font-medium">Type:</span>
                    <span className="font-black text-slate-950">{selectedAppointment.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600 font-medium">Priority:</span>
                    <span className={`px-2 py-1 rounded-lg text-xs font-black ${getPriorityColor(selectedAppointment.priority)}`}>
                      {selectedAppointment.priority.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600 font-medium">Status:</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${getStatusColor(selectedAppointment.status)}`}>
                      {selectedAppointment.status}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h4 className="text-lg font-black text-slate-950 mb-4">Medical Information</h4>
              <div className="space-y-4">
                <div>
                  <span className="text-sm text-slate-600 font-medium">Reason for Visit:</span>
                  <p className="font-black text-slate-950 mt-1">{selectedAppointment.reason}</p>
                </div>
                <div>
                  <span className="text-sm text-slate-600 font-medium">Notes:</span>
                  <p className="font-black text-slate-950 mt-1">{selectedAppointment.notes}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button className="flex-1 py-4 bg-emerald-600 text-slate-900 rounded-2xl font-black hover:bg-emerald-700 transition-all flex items-center justify-center gap-2">
                <Video size={20} />
                Start Consultation
              </button>
              <button className="flex-1 py-4 bg-blue-600 text-slate-900 rounded-2xl font-black hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                <MessageCircle size={20} />
                Message Patient
              </button>
              <button
                onClick={() => setShowAppointmentDetails(false)}
                className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black hover:bg-slate-200 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      </main>
    </div>
  );
}
