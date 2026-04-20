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
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day');
  const [searchQuery, setSearchQuery] = useState('');

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

  const filteredSchedule = scheduleItems.filter(item =>
    item.patientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      <main className="flex-1 overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-black text-slate-950 mb-2">Daily Schedule</h1>
            <p className="text-lg text-slate-600 font-bold">Manage your daily appointments and consultations</p>
          </div>

          {/* Date Navigation */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 mb-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigateDate('prev')}
                  className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
                >
                  <ChevronLeft size={20} />
                </button>
                <div className="text-center">
                  <h2 className="text-xl font-black text-slate-950">{formatDate(currentDate)}</h2>
                  <p className="text-sm text-slate-500">Today's Schedule</p>
                </div>
                <button
                  onClick={() => navigateDate('next')}
                  className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
              
              <div className="flex items-center gap-2">
                {['day', 'week', 'month'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode as any)}
                    className={`px-4 py-2 rounded-xl font-black text-sm capitalize transition-all ${
                      viewMode === mode
                        ? 'bg-[#8D153A] text-white'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>

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
          <div className="space-y-4">
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
