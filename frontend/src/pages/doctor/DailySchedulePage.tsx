import React, { useState } from 'react';
import { 
  Calendar, Clock, Search, Filter, PlusCircle, ChevronLeft, ChevronRight,
  Users, Video, Phone, MapPin, AlertCircle, CheckCircle, Activity
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.png';

interface ScheduleItem {
  id: number;
  time: string;
  duration: string;
  patientName: string;
  type: string;
  status: 'completed' | 'in-progress' | 'upcoming' | 'cancelled';
  location: string;
  priority: 'low' | 'medium' | 'high';
  notes: string;
}

export default function DailySchedulePage() {
  const location = useLocation();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'timeline' | 'calendar' | 'list' | 'agenda'>('timeline');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Enhanced navigation states
  const [showQuickAddModal, setShowQuickAddModal] = useState(false);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [draggedItem, setDraggedItem] = useState<ScheduleItem | null>(null);
  const [showScheduleDetails, setShowScheduleDetails] = useState(false);
  const [selectedScheduleItem, setSelectedScheduleItem] = useState<ScheduleItem | null>(null);
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  
  // Quick appointment form
  const [quickScheduleForm, setQuickScheduleForm] = useState({
    patientName: '',
    time: '',
    duration: '30 mins',
    type: 'Video Consult',
    location: 'Online',
    priority: 'medium',
    notes: ''
  });

  const scheduleItems: ScheduleItem[] = [
    {
      id: 1,
      time: '09:00 AM',
      duration: '30 mins',
      patientName: 'Sarah Johnson',
      type: 'Video Consult',
      status: 'completed',
      location: 'Online',
      priority: 'medium',
      notes: 'Routine follow-up for diabetes management'
    },
    {
      id: 2,
      time: '09:30 AM',
      duration: '45 mins',
      patientName: 'Michael Chen',
      type: 'Physical Examination',
      status: 'completed',
      location: 'Room 201',
      priority: 'high',
      notes: 'Post-surgery checkup'
    },
    {
      id: 3,
      time: '10:30 AM',
      duration: '30 mins',
      patientName: 'Emma Williams',
      type: 'Video Consult',
      status: 'in-progress',
      location: 'Online',
      priority: 'medium',
      notes: 'Initial consultation for migraines'
    },
    {
      id: 4,
      time: '11:00 AM',
      duration: '60 mins',
      patientName: 'Robert Davis',
      type: 'Physical Examination',
      status: 'upcoming',
      location: 'Room 203',
      priority: 'high',
      notes: 'Comprehensive cardiac evaluation'
    },
    {
      id: 5,
      time: '12:00 PM',
      duration: '30 mins',
      patientName: 'Lisa Anderson',
      type: 'Phone Consult',
      status: 'upcoming',
      location: 'Phone',
      priority: 'low',
      notes: 'Test results review'
    },
    {
      id: 6,
      time: '02:00 PM',
      duration: '45 mins',
      patientName: 'James Wilson',
      type: 'Physical Examination',
      status: 'upcoming',
      location: 'Room 201',
      priority: 'medium',
      notes: 'Follow-up for hypertension'
    },
    {
      id: 7,
      time: '03:00 PM',
      duration: '30 mins',
      patientName: 'Maria Garcia',
      type: 'Video Consult',
      status: 'upcoming',
      location: 'Online',
      priority: 'medium',
      notes: 'Medication adjustment review'
    },
    {
      id: 8,
      time: '04:00 PM',
      duration: '60 mins',
      patientName: 'David Brown',
      type: 'Physical Examination',
      status: 'upcoming',
      location: 'Room 205',
      priority: 'high',
      notes: 'New patient comprehensive evaluation'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 border-green-200';
      case 'in-progress': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'upcoming': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-600';
      case 'medium': return 'bg-orange-100 text-orange-600';
      default: return 'bg-green-100 text-green-600';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Video Consult': return Video;
      case 'Phone Consult': return Phone;
      default: return Users;
    }
  };

  const navigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setDate(newDate.getDate() - 1);
    } else {
      newDate.setDate(newDate.getDate() + 1);
    }
    setCurrentDate(newDate);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const filteredSchedule = scheduleItems.filter(item => {
    const matchesSearch = item.patientName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || item.type.toLowerCase().includes(filterType.toLowerCase());
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  // Innovative navigation handlers
  const handleTimeSlotClick = (time: string) => {
    setSelectedTimeSlot(time);
    setQuickScheduleForm({
      ...quickScheduleForm,
      time: time
    });
    setShowQuickAddModal(true);
  };

  const handleScheduleItemClick = (item: ScheduleItem) => {
    setSelectedScheduleItem(item);
    setShowScheduleDetails(true);
  };

  const handleDragStart = (item: ScheduleItem) => {
    setDraggedItem(item);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, newTime: string) => {
    e.preventDefault();
    if (draggedItem) {
      console.log(`Moving schedule item ${draggedItem.id} to ${newTime}`);
      // Here you would update the appointment time
      setDraggedItem(null);
    }
  };

  const handleQuickSaveSchedule = () => {
    if (!quickScheduleForm.patientName || !quickScheduleForm.time) {
      alert('Please fill in all required fields');
      return;
    }
    
    console.log('Quick schedule:', quickScheduleForm);
    alert('Schedule item created successfully!');
    setShowQuickAddModal(false);
    setQuickScheduleForm({
      patientName: '',
      time: '',
      duration: '30 mins',
      type: 'Video Consult',
      location: 'Online',
      priority: 'medium',
      notes: ''
    });
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

  const getScheduleForTimeSlot = (time: string) => {
    return filteredSchedule.filter(item => item.time === time);
  };

  const getWeekDates = () => {
    const dates = [];
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const getMonthDates = () => {
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
              { name: 'Medical Reports', icon: Activity, path: '/doctor/reports' },
              { name: 'Consultations', icon: Phone, path: '/doctor/chats' },
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
      <main className="flex-1 overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-8">
          {/* Innovative Navigation Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-4xl font-black text-slate-950 mb-2">Daily Schedule</h1>
                <p className="text-lg text-slate-600 font-bold">Manage your daily appointments and consultations</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowQuickAddModal(true)}
                  className="px-6 py-3 bg-gradient-to-r from-[#8D153A] to-[#E5AB22] text-white rounded-2xl font-black hover:shadow-lg transition-all flex items-center gap-2"
                >
                  <PlusCircle size={20} />
                  Quick Schedule
                </button>
              </div>
            </div>

            {/* View Mode Navigation */}
            <div className="bg-white p-2 rounded-2xl border border-slate-100 inline-flex mb-6">
              {[
                { mode: 'timeline', icon: Clock, label: 'Timeline' },
                { mode: 'calendar', icon: Calendar, label: 'Calendar' },
                { mode: 'list', icon: Users, label: 'List' },
                { mode: 'agenda', icon: Activity, label: 'Agenda' }
              ].map(({ mode, icon: Icon, label }) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode as any)}
                  className={`px-6 py-3 rounded-xl font-black transition-all flex items-center gap-2 ${
                    viewMode === mode
                      ? 'bg-[#8D153A] text-white shadow-lg'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Icon size={18} />
                  {label}
                </button>
              ))}
            </div>

            {/* Enhanced Date Navigation */}
            <div className="bg-white p-4 rounded-2xl border border-slate-100 mb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => navigateDate('prev')}
                    className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <div className="text-center">
                    <h2 className="text-xl font-black text-slate-950">{formatDate(currentDate)}</h2>
                    <p className="text-sm text-slate-500">{filteredSchedule.length} appointments</p>
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

            {/* Search and Filter */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 mb-6">
              <div className="flex gap-4">
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
                <button className="px-6 py-3 bg-[#8D153A] text-white rounded-xl font-black hover:bg-[#8D153A]/80 transition-all flex items-center gap-2">
                  <PlusCircle size={20} />
                  Add Appointment
                </button>
              </div>
            </div>

          {/* Schedule Timeline */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h3 className="text-xl font-black text-slate-950 mb-6">Today's Schedule</h3>
            <div className="max-h-[400px] overflow-y-auto space-y-4 pr-2">
              {filteredSchedule.map((item) => {
              const TypeIcon = getTypeIcon(item.type);
              return (
                <div key={item.id} className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-[#FFBE29]/40 hover:shadow-lg transition-all">
                  <div className="flex items-start gap-6">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-2xl bg-[#8D153A]/10 flex items-center justify-center text-[#8D153A] font-black">
                        {item.time.split(':')[0]}
                      </div>
                      <div className="text-xs text-slate-500 font-bold mt-1">{item.time.split(' ')[1]}</div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border ${getStatusColor(item.status)}`}>
                            {item.status.replace('-', ' ')}
                          </div>
                          <span className={`px-2 py-1 rounded-lg text-xs font-black ${getPriorityColor(item.priority)}`}>
                            {item.priority} priority
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Clock size={14} />
                          <span>{item.duration}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex items-center gap-2">
                          <TypeIcon size={16} className="text-slate-600" />
                          <span className="font-black text-slate-950">{item.patientName}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          {item.type === 'Video Consult' && <Video size={14} />}
                          {item.type === 'Phone Consult' && <Phone size={14} />}
                          {item.type === 'Physical Examination' && <Users size={14} />}
                          <span>{item.type}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <MapPin size={14} />
                          <span>{item.location}</span>
                        </div>
                      </div>

                      <p className="text-sm text-slate-600 font-medium italic">
                        {item.notes}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2">
                      {item.status === 'upcoming' && (
                        <>
                          <button className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-black hover:bg-emerald-700 transition-all flex items-center gap-2">
                            <CheckCircle size={16} />
                            Start
                          </button>
                          <button className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-black hover:bg-slate-200 transition-all">
                            Reschedule
                          </button>
                        </>
                      )}
                      {item.status === 'in-progress' && (
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-xl font-black hover:bg-blue-700 transition-all flex items-center gap-2">
                          <Activity size={16} />
                          In Progress
                        </button>
                      )}
                      {item.status === 'completed' && (
                        <button className="px-4 py-2 bg-green-600 text-white rounded-xl font-black hover:bg-green-700 transition-all flex items-center gap-2">
                          <CheckCircle size={16} />
                          Completed
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            </div>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
            <div className="bg-white p-6 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <Calendar className="text-[#8D153A]" size={24} />
                <span className="text-2xl font-black text-slate-950">8</span>
              </div>
              <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Total Appointments</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <CheckCircle className="text-green-600" size={24} />
                <span className="text-2xl font-black text-slate-950">2</span>
              </div>
              <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Completed</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <Activity className="text-blue-600" size={24} />
                <span className="text-2xl font-black text-slate-950">1</span>
              </div>
              <p className="text-sm font-black text-slate-400 uppercase tracking-widest">In Progress</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <Clock className="text-orange-600" size={24} />
                <span className="text-2xl font-black text-slate-950">5</span>
              </div>
              <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Upcoming</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
