import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  Users, 
  Search, 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Video, 
  MapPin, 
  Phone, 
  Mail, 
  Bell, 
  CheckCircle, 
  XCircle, 
  AlertCircle, 
  ChevronLeft, 
  ChevronRight, 
  Today,
  Download,
  Share2,
  RefreshCw,
  User,
  Stethoscope,
  CreditCard,
  FileText,
  MessageSquare,
  Star,
  TrendingUp,
  Activity,
  Heart,
  Shield,
  Info,
  X,
  Camera,
  Mic,
  MicOff,
  VideoOff,
  Settings
} from 'lucide-react';
import { api } from '../api/axios';
import { LoadingSpinner } from '../components/LoadingSpinner';

interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  specialty: string;
  type: 'in-person' | 'video' | 'phone';
  status: 'scheduled' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  date: string;
  startTime: string;
  endTime: string;
  duration: number;
  reason: string;
  notes?: string;
  location?: string;
  meetingLink?: string;
  phoneNumber?: string;
  price: number;
  insuranceCoverage: number;
  patientPaid: boolean;
  reminders: Reminder[];
  documents?: Array<{
    name: string;
    url: string;
    type: string;
    uploadedAt: string;
  }>;
  rating?: number;
  feedback?: string;
}

interface Doctor {
  id: string;
  name: string;
  specialty: string;
  experience: number;
  rating: number;
  reviews: number;
  price: number;
  availability: AvailabilitySlot[];
  education: string;
  languages: string[];
  hospital?: string;
  consultationTypes: ('in-person' | 'video' | 'phone')[];
  profileImage?: string;
  bio?: string;
}

interface AvailabilitySlot {
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
  startTime: string;
  endTime: string;
  available: boolean;
}

interface TimeSlot {
  time: string;
  available: boolean;
  doctorId: string;
}

interface Reminder {
  id: string;
  type: 'email' | 'sms' | 'push';
  time: string; // minutes before appointment
  enabled: boolean;
}

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: 'appointment' | 'reminder' | 'availability';
  color: string;
}

export default function AppointmentScheduling() {
  const [activeTab, setActiveTab] = useState<'schedule' | 'calendar' | 'doctors' | 'history'>('schedule');
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('week');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecialty, setFilterSpecialty] = useState<string>('all');
  const [showBookingModal, setShowBookingModal] = useState(false);

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);

  const [bookingData, setBookingData] = useState({
    reason: '',
    notes: '',
    type: 'video' as 'in-person' | 'video' | 'phone',
    reminders: [
      { id: '1', type: 'email' as const, time: '60', enabled: true },
      { id: '2', type: 'sms' as const, time: '30', enabled: true }
    ]
  });

  useEffect(() => {
    fetchAppointmentData();
  }, []);

  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      fetchAvailableSlots();
    }
  }, [selectedDoctor, selectedDate]);

  const fetchAppointmentData = async () => {
    try {
      setLoading(true);
      const [appointmentsRes, doctorsRes] = await Promise.all([
        api.get('/appointments'),
        api.get('/doctors/available')
      ]);

      setAppointments(appointmentsRes.data);
      setDoctors(doctorsRes.data);
      generateCalendarEvents(appointmentsRes.data);
    } catch (error) {
      console.error('Failed to fetch appointment data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableSlots = async () => {
    if (!selectedDoctor) return;

    try {
      const response = await api.get(`/doctors/${selectedDoctor.id}/availability`, {
        params: {
          date: selectedDate.toISOString().split('T')[0]
        }
      });
      setAvailableSlots(response.data);
    } catch (error) {
      console.error('Failed to fetch available slots:', error);
    }
  };

  const generateCalendarEvents = (appointments: Appointment[]) => {
    const events: CalendarEvent[] = appointments.map(apt => ({
      id: apt.id,
      title: `${apt.doctorName} - ${apt.reason}`,
      start: new Date(`${apt.date}T${apt.startTime}`),
      end: new Date(`${apt.date}T${apt.endTime}`),
      type: 'appointment',
      color: getStatusColor(apt.status)
    }));

    setCalendarEvents(events);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return '#3B82F6';
      case 'confirmed': return '#10B981';
      case 'in-progress': return '#F59E0B';
      case 'completed': return '#6B7280';
      case 'cancelled': return '#EF4444';
      case 'no-show': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'scheduled': return <Clock className="text-blue-500" size={16} />;
      case 'confirmed': return <CheckCircle className="text-green-500" size={16} />;
      case 'in-progress': return <Activity className="text-yellow-500" size={16} />;
      case 'completed': return <CheckCircle className="text-slate-500" size={16} />;
      case 'cancelled': return <XCircle className="text-red-500" size={16} />;
      case 'no-show': return <AlertCircle className="text-purple-500" size={16} />;
      default: return <Clock className="text-slate-500" size={16} />;
    }
  };

  const bookAppointment = async () => {
    if (!selectedDoctor || !selectedTimeSlot) return;

    try {
      const appointmentData = {
        doctorId: selectedDoctor.id,
        date: selectedDate.toISOString().split('T')[0],
        time: selectedTimeSlot,
        type: bookingData.type,
        reason: bookingData.reason,
        notes: bookingData.notes,
        reminders: bookingData.reminders.filter(r => r.enabled)
      };

      const response = await api.post('/appointments', appointmentData);
      setAppointments([...appointments, response.data]);
      setShowBookingModal(false);
      resetBookingForm();
    } catch (error) {
      console.error('Failed to book appointment:', error);
    }
  };

  const cancelAppointment = async (appointmentId: string) => {
    try {
      await api.patch(`/appointments/${appointmentId}`, { status: 'cancelled' });
      setAppointments(prev => prev.map(apt => 
        apt.id === appointmentId ? { ...apt, status: 'cancelled' as const } : apt
      ));
    } catch (error) {
      console.error('Failed to cancel appointment:', error);
    }
  };

  const rescheduleAppointment = async (appointmentId: string, newDate: string, newTime: string) => {
    try {
      await api.patch(`/appointments/${appointmentId}`, {
        date: newDate,
        startTime: newTime
      });
      setAppointments(prev => prev.map(apt => 
        apt.id === appointmentId ? { ...apt, date: newDate, startTime: newTime } : apt
      ));
    } catch (error) {
      console.error('Failed to reschedule appointment:', error);
    }
  };

  const joinVideoCall = (appointmentId: string) => {
    const appointment = appointments.find(apt => apt.id === appointmentId);
    if (appointment?.meetingLink) {
      window.open(appointment.meetingLink, '_blank');
    }
  };

  const resetBookingForm = () => {
    setSelectedDoctor(null);
    setSelectedTimeSlot(null);
    setBookingData({
      reason: '',
      notes: '',
      type: 'video',
      reminders: [
        { id: '1', type: 'email', time: '60', enabled: true },
        { id: '2', type: 'sms', time: '30', enabled: true }
      ]
    });
  };

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty = filterSpecialty === 'all' || doctor.specialty === filterSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  const getDaysInMonth = (date: Date): Array<Date | null> => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: Array<Date | null> = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const getWeekDays = (date: Date): Date[] => {
    const startOfWeek = new Date(date);
    const day = startOfWeek.getDay();
    const diff = startOfWeek.getDate() - day;
    startOfWeek.setDate(diff);

    const weekDays: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      weekDays.push(day);
    }

    return weekDays;
  };

  const getAppointmentsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return appointments.filter(apt => apt.date === dateStr);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" text="Loading appointment data..." />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Appointment Scheduling</h1>
            <p className="text-slate-600 mt-1">Book and manage your healthcare appointments</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowBookingModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <Plus size={16} />
              Book Appointment
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200">
              <Calendar size={16} />
              Sync Calendar
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="border-b border-slate-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {[
              { id: 'schedule', name: 'Schedule', icon: Calendar },
              { id: 'calendar', name: 'Calendar View', icon: Calendar },
              { id: 'doctors', name: 'Find Doctors', icon: Stethoscope },
              { id: 'history', name: 'Appointment History', icon: Clock }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                <tab.icon size={16} />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Schedule Tab */}
          {activeTab === 'schedule' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Doctor Selection */}
                <div className="lg:col-span-1">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Select Doctor</h3>
                  <div className="space-y-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                      <input
                        type="text"
                        placeholder="Search doctors..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <select
                      value={filterSpecialty}
                      onChange={(e) => setFilterSpecialty(e.target.value)}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="all">All Specialties</option>
                      <option value="Cardiology">Cardiology</option>
                      <option value="Dermatology">Dermatology</option>
                      <option value="Pediatrics">Pediatrics</option>
                      <option value="Psychiatry">Psychiatry</option>
                      <option value="Orthopedics">Orthopedics</option>
                    </select>
                  </div>

                  <div className="mt-4 space-y-3 max-h-96 overflow-y-auto">
                    {filteredDoctors.map((doctor) => (
                      <div
                        key={doctor.id}
                        onClick={() => setSelectedDoctor(doctor)}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedDoctor?.id === doctor.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <div className="w-12 h-12 bg-slate-200 rounded-full flex items-center justify-center">
                            <User className="text-slate-500" size={20} />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-slate-900">{doctor.name}</h4>
                            <p className="text-sm text-slate-600">{doctor.specialty}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    size={12} 
                                    className={i < Math.floor(doctor.rating) ? 'text-yellow-400 fill-current' : 'text-slate-300'} 
                                  />
                                ))}
                                <span className="text-xs text-slate-600">({doctor.reviews})</span>
                              </div>
                            </div>
                            <p className="text-xs text-slate-500 mt-1">${doctor.price} per session</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Calendar and Time Slots */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Date Selection */}
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Select Date</h3>
                    <div className="flex items-center gap-4 mb-4">
                      <button
                        onClick={() => {
                          const prevMonth = new Date(selectedDate);
                          prevMonth.setMonth(prevMonth.getMonth() - 1);
                          setSelectedDate(prevMonth);
                        }}
                        className="p-2 text-slate-400 hover:text-slate-600"
                      >
                        <ChevronLeft size={20} />
                      </button>
                      <h4 className="text-lg font-medium text-slate-900">
                        {selectedDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                      </h4>
                      <button
                        onClick={() => {
                          const nextMonth = new Date(selectedDate);
                          nextMonth.setMonth(nextMonth.getMonth() + 1);
                          setSelectedDate(nextMonth);
                        }}
                        className="p-2 text-slate-400 hover:text-slate-600"
                      >
                        <ChevronRight size={20} />
                      </button>
                      <button
                        onClick={() => setSelectedDate(new Date())}
                        className="ml-auto flex items-center gap-2 px-3 py-1 text-sm bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
                      >
                        <Today size={14} />
                        Today
                      </button>
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                        <div key={day} className="text-center text-sm font-medium text-slate-600 py-2">
                          {day}
                        </div>
                      ))}
                      {getDaysInMonth(selectedDate).map((day, index) => (
                        <div
                          key={index}
                          onClick={() => day && setSelectedDate(day)}
                          className={`aspect-square flex flex-col items-center justify-center text-sm rounded-lg cursor-pointer transition-colors ${
                            !day ? 'text-slate-300' :
                            day.toDateString() === selectedDate.toDateString()
                              ? 'bg-blue-600 text-white'
                              : 'hover:bg-slate-100'
                          }`}
                        >
                          {day && (
                            <>
                              <span>{day.getDate()}</span>
                              {getAppointmentsForDate(day).length > 0 && (
                                <div className="w-1 h-1 bg-blue-400 rounded-full mt-1"></div>
                              )}
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Time Slots */}
                  {selectedDoctor && (
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900 mb-4">Available Time Slots</h3>
                      <div className="grid grid-cols-4 gap-3">
                        {availableSlots.map((slot) => (
                          <button
                            key={slot.time}
                            onClick={() => setSelectedTimeSlot(slot.time)}
                            disabled={!slot.available}
                            className={`py-3 px-4 rounded-lg border transition-colors ${
                              !slot.available
                                ? 'border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed'
                                : selectedTimeSlot === slot.time
                                ? 'border-blue-500 bg-blue-50 text-blue-700'
                                : 'border-slate-200 hover:border-slate-300'
                            }`}
                          >
                            {slot.time}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Booking Summary */}
                  {selectedDoctor && selectedTimeSlot && (
                    <div className="border-t pt-6">
                      <h3 className="text-lg font-semibold text-slate-900 mb-4">Booking Summary</h3>
                      <div className="bg-slate-50 rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600">Doctor:</span>
                          <span className="text-sm font-medium text-slate-900">{selectedDoctor.name}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600">Specialty:</span>
                          <span className="text-sm font-medium text-slate-900">{selectedDoctor.specialty}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600">Date:</span>
                          <span className="text-sm font-medium text-slate-900">
                            {selectedDate.toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600">Time:</span>
                          <span className="text-sm font-medium text-slate-900">{selectedTimeSlot}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600">Consultation Fee:</span>
                          <span className="text-sm font-medium text-slate-900">${selectedDoctor.price}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowBookingModal(true)}
                        className="w-full mt-4 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Continue Booking
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Calendar View Tab */}
          {activeTab === 'calendar' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setViewMode('month')}
                    className={`px-4 py-2 rounded-lg ${
                      viewMode === 'month' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    Month
                  </button>
                  <button
                    onClick={() => setViewMode('week')}
                    className={`px-4 py-2 rounded-lg ${
                      viewMode === 'week' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    Week
                  </button>
                  <button
                    onClick={() => setViewMode('day')}
                    className={`px-4 py-2 rounded-lg ${
                      viewMode === 'day' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    Day
                  </button>
                </div>
              </div>

              {viewMode === 'month' && (
                <div>
                  <div className="grid grid-cols-7 gap-px bg-slate-200">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="bg-white p-4 text-center">
                        <div className="text-sm font-medium text-slate-600">{day}</div>
                      </div>
                    ))}
                    {getDaysInMonth(selectedDate).map((day, index) => (
                      <div key={index} className="bg-white p-4 min-h-[100px]">
                        {day && (
                          <>
                            <div className="text-sm font-medium text-slate-900 mb-2">
                              {day.getDate()}
                            </div>
                            <div className="space-y-1">
                              {getAppointmentsForDate(day).slice(0, 3).map(apt => (
                                <div
                                  key={apt.id}
                                  className="text-xs p-1 rounded truncate"
                                  style={{ backgroundColor: getStatusColor(apt.status) + '20', color: getStatusColor(apt.status) }}
                                >
                                  {apt.startTime} {apt.doctorName}
                                </div>
                              ))}
                              {getAppointmentsForDate(day).length > 3 && (
                                <div className="text-xs text-slate-500">
                                  +{getAppointmentsForDate(day).length - 3} more
                                </div>
                              )}
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {viewMode === 'week' && (
                <div>
                  <div className="grid grid-cols-8 gap-px bg-slate-200">
                    <div className="bg-white p-4">
                      <div className="text-sm font-medium text-slate-600">Time</div>
                    </div>
                    {getWeekDays(selectedDate).map((day, index) => (
                      <div key={index} className="bg-white p-4 text-center">
                        <div className="text-sm font-medium text-slate-900">{day.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                        <div className="text-xs text-slate-600">{day.getDate()}</div>
                      </div>
                    ))}
                  </div>
                  {/* Week time slots would go here */}
                </div>
              )}

              {viewMode === 'day' && (
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">
                    {selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </h3>
                  <div className="space-y-2">
                    {getAppointmentsForDate(selectedDate).map(appointment => (
                      <div key={appointment.id} className="border border-slate-200 rounded-lg p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-3">
                            {getStatusIcon(appointment.status)}
                            <div>
                              <h4 className="font-medium text-slate-900">{appointment.doctorName}</h4>
                              <p className="text-sm text-slate-600">{appointment.specialty}</p>
                              <p className="text-sm text-slate-600">
                                {appointment.startTime} - {appointment.endTime} ({appointment.duration} min)
                              </p>
                              <p className="text-sm text-slate-600">Reason: {appointment.reason}</p>
                              <div className="flex items-center gap-2 mt-2">
                                {appointment.type === 'video' && <Video size={16} className="text-blue-500" />}
                                {appointment.type === 'phone' && <Phone size={16} className="text-green-500" />}
                                {appointment.type === 'in-person' && <MapPin size={16} className="text-orange-500" />}
                                <span className="text-xs text-slate-600 capitalize">{appointment.type}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {appointment.status === 'confirmed' && appointment.type === 'video' && (
                              <button
                                onClick={() => joinVideoCall(appointment.id)}
                                className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                              >
                                <Video size={14} />
                                Join
                              </button>
                            )}
                            <button className="text-slate-400 hover:text-slate-600">
                              <Edit size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    {getAppointmentsForDate(selectedDate).length === 0 && (
                      <div className="text-center py-8">
                        <Calendar className="mx-auto text-slate-400 mb-4" size={48} />
                        <p className="text-slate-600">No appointments scheduled for this day</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Doctors Tab */}
          {activeTab === 'doctors' && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                  <input
                    type="text"
                    placeholder="Search doctors by name, specialty..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <select
                  value={filterSpecialty}
                  onChange={(e) => setFilterSpecialty(e.target.value)}
                  className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Specialties</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Dermatology">Dermatology</option>
                  <option value="Pediatrics">Pediatrics</option>
                  <option value="Psychiatry">Psychiatry</option>
                  <option value="Orthopedics">Orthopedics</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDoctors.map((doctor) => (
                  <div key={doctor.id} className="border border-slate-200 rounded-lg p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center">
                        <User className="text-slate-500" size={24} />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900">{doctor.name}</h3>
                        <p className="text-sm text-slate-600">{doctor.specialty}</p>
                        <p className="text-xs text-slate-500 mt-1">{doctor.experience} years experience</p>
                        
                        <div className="flex items-center gap-2 mt-2">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                size={14} 
                                className={i < Math.floor(doctor.rating) ? 'text-yellow-400 fill-current' : 'text-slate-300'} 
                              />
                            ))}
                            <span className="text-sm text-slate-600">({doctor.reviews})</span>
                          </div>
                        </div>

                        <div className="mt-3 space-y-1">
                          <p className="text-sm text-slate-600">
                            <span className="font-medium">Education:</span> {doctor.education}
                          </p>
                          <p className="text-sm text-slate-600">
                            <span className="font-medium">Languages:</span> {doctor.languages.join(', ')}
                          </p>
                          {doctor.hospital && (
                            <p className="text-sm text-slate-600">
                              <span className="font-medium">Hospital:</span> {doctor.hospital}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center gap-2 mt-3">
                          {doctor.consultationTypes.includes('video') && (
                            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">Video</span>
                          )}
                          {doctor.consultationTypes.includes('phone') && (
                            <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">Phone</span>
                          )}
                          {doctor.consultationTypes.includes('in-person') && (
                            <span className="px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded">In-Person</span>
                          )}
                        </div>

                        <div className="flex items-center justify-between mt-4">
                          <p className="text-lg font-semibold text-slate-900">${doctor.price}</p>
                          <button
                            onClick={() => {
                              setSelectedDoctor(doctor);
                              setActiveTab('schedule');
                            }}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                          >
                            Book Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <div className="space-y-4">
              <div className="space-y-3">
                {appointments.map((appointment) => (
                  <div key={appointment.id} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4">
                        {getStatusIcon(appointment.status)}
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <h4 className="font-medium text-slate-900">{appointment.doctorName}</h4>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(appointment.status)}`}>
                              {appointment.status}
                            </span>
                          </div>
                          <p className="text-sm text-slate-600">{appointment.specialty}</p>
                          <p className="text-sm text-slate-600">
                            {new Date(appointment.date).toLocaleDateString()} • {appointment.startTime} - {appointment.endTime}
                          </p>
                          <p className="text-sm text-slate-600">Reason: {appointment.reason}</p>
                          
                          <div className="flex items-center gap-2 mt-2">
                            {appointment.type === 'video' && <Video size={16} className="text-blue-500" />}
                            {appointment.type === 'phone' && <Phone size={16} className="text-green-500" />}
                            {appointment.type === 'in-person' && <MapPin size={16} className="text-orange-500" />}
                            <span className="text-xs text-slate-600 capitalize">{appointment.type}</span>
                          </div>

                          {appointment.rating && (
                            <div className="flex items-center gap-2 mt-2">
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i} 
                                    size={14} 
                                    className={i < appointment.rating ? 'text-yellow-400 fill-current' : 'text-slate-300'} 
                                  />
                                ))}
                              </div>
                            </div>
                          )}

                          {appointment.feedback && (
                            <p className="text-sm text-slate-600 mt-2 italic">"{appointment.feedback}"</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {appointment.status === 'confirmed' && appointment.type === 'video' && (
                          <button
                            onClick={() => joinVideoCall(appointment.id)}
                            className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                          >
                            <Video size={14} />
                            Join
                          </button>
                        )}
                        {appointment.status === 'completed' && !appointment.rating && (
                          <button className="flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200">
                            <Star size={14} />
                            Rate
                          </button>
                        )}
                        {(appointment.status === 'scheduled' || appointment.status === 'confirmed') && (
                          <button className="text-slate-400 hover:text-slate-600">
                            <Edit size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-slate-900">Complete Booking</h2>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Consultation Type</label>
                <div className="grid grid-cols-3 gap-3">
                  {['video', 'phone', 'in-person'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setBookingData({...bookingData, type: type as any})}
                      className={`p-3 border rounded-lg capitalize ${
                        bookingData.type === type
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      {type === 'video' && <Video className="mx-auto mb-1" size={20} />}
                      {type === 'phone' && <Phone className="mx-auto mb-1" size={20} />}
                      {type === 'in-person' && <MapPin className="mx-auto mb-1" size={20} />}
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Reason for Visit</label>
                <textarea
                  value={bookingData.reason}
                  onChange={(e) => setBookingData({...bookingData, reason: e.target.value})}
                  rows={3}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Describe your symptoms or reason for consultation..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Additional Notes (Optional)</label>
                <textarea
                  value={bookingData.notes}
                  onChange={(e) => setBookingData({...bookingData, notes: e.target.value})}
                  rows={2}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Any additional information for the doctor..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Reminders</label>
                <div className="space-y-2">
                  {bookingData.reminders.map((reminder) => (
                    <div key={reminder.id} className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={reminder.enabled}
                        onChange={(e) => {
                          setBookingData({
                            ...bookingData,
                            reminders: bookingData.reminders.map(r =>
                              r.id === reminder.id ? {...r, enabled: e.target.checked} : r
                            )
                          });
                        }}
                        className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm text-slate-700 capitalize">
                        {reminder.type} reminder {reminder.time} minutes before
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-4">
                <h4 className="font-medium text-slate-900 mb-2">Booking Summary</h4>
                {selectedDoctor && (
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-600">Doctor:</span>
                      <span className="font-medium text-slate-900">{selectedDoctor.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Date:</span>
                      <span className="font-medium text-slate-900">{selectedDate.toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Time:</span>
                      <span className="font-medium text-slate-900">{selectedTimeSlot}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-600">Consultation Fee:</span>
                      <span className="font-medium text-slate-900">${selectedDoctor.price}</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4">
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  onClick={bookAppointment}
                  disabled={!bookingData.reason}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirm Booking
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
