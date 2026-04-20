import React, { useState } from 'react';
import { 
  MessageSquare, Search, Filter, PlusCircle, Video, Phone, Mic,
  Send, Paperclip, Calendar, Clock, Users, CheckCircle, AlertCircle,
  Activity, Heart, FileText, ChevronRight, Star
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.png';

interface Consultation {
  id: number;
  patientName: string;
  type: 'video' | 'phone' | 'in-person';
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  date: string;
  time: string;
  duration: string;
  reason: string;
  rating?: number;
  notes?: string;
  price: number; // LKR pricing
  paymentStatus: 'pending' | 'paid' | 'refunded';
}

interface Message {
  id: number;
  sender: 'doctor' | 'patient';
  content: string;
  timestamp: string;
  type: 'text' | 'file' | 'voice';
}

export default function ConsultationsPage() {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedConsultation, setSelectedConsultation] = useState<Consultation | null>(null);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'consultations' | 'messages' | 'history' | 'schedule'>('consultations');
  
  // Enhanced consultation navigation states
  const [viewMode, setViewMode] = useState<'cards' | 'timeline' | 'calendar' | 'list'>('cards');
  const [showVideoCall, setShowVideoCall] = useState(false);
  const [showChatWindow, setShowChatWindow] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [showPatientInfo, setShowPatientInfo] = useState(false);
  const [consultationNotes, setConsultationNotes] = useState('');
  const [prescriptionMode, setPrescriptionMode] = useState(false);
  const [emergenciesOnly, setEmergenciesOnly] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  
  // Schedule consultation form state
  const [scheduleForm, setScheduleForm] = useState({
    patientName: '',
    type: 'video' as 'video' | 'phone' | 'in-person',
    date: '',
    time: '',
    duration: '30 mins',
    reason: '',
    price: 0,
    notes: ''
  });

  const consultations: Consultation[] = [
    {
      id: 1,
      patientName: 'Aruni Wijesinghe',
      type: 'video',
      status: 'completed',
      date: '2024-04-20',
      time: '10:30 AM',
      duration: '30 mins',
      reason: 'Follow-up consultation',
      rating: 5,
      notes: 'Patient responding well to treatment',
      price: 2500,
      paymentStatus: 'paid'
    },
    {
      id: 2,
      patientName: 'Kasun Perera',
      type: 'phone',
      status: 'in-progress',
      date: '2024-04-21',
      time: '11:15 AM',
      duration: '45 mins',
      reason: 'Medication review',
      notes: 'Discussing side effects and dosage adjustments'
    },
    {
      id: 3,
      patientName: 'Imara Jaffar',
      type: 'video',
      status: 'scheduled',
      date: '2024-04-21',
      time: '02:00 PM',
      duration: '60 mins',
      reason: 'Initial consultation',
      notes: 'New patient - comprehensive evaluation needed'
    },
    {
      id: 4,
      patientName: 'Nimal Fernando',
      type: 'in-person',
      status: 'scheduled',
      date: '2024-04-22',
      time: '09:00 AM',
      duration: '45 mins',
      reason: 'Physical examination',
      notes: 'Annual health checkup'
    }
  ];

  const messages: Message[] = [
    {
      id: 1,
      sender: 'patient',
      content: 'Hello Doctor, I have been experiencing headaches for the past few days.',
      timestamp: '10:30 AM',
      type: 'text'
    },
    {
      id: 2,
      sender: 'doctor',
      content: 'I understand. Let me check your recent medical history. Are you taking any medications currently?',
      timestamp: '10:32 AM',
      type: 'text'
    },
    {
      id: 3,
      sender: 'patient',
      content: 'Yes, I\'m taking paracetamol occasionally, but it doesn\'t seem to help much.',
      timestamp: '10:35 AM',
      type: 'text'
    },
    {
      id: 4,
      sender: 'doctor',
      content: 'I\'ve reviewed your test results. Everything looks normal. Let\'s schedule a video consultation to discuss this further.',
      timestamp: '10:40 AM',
      type: 'text'
    }
  ];

  const filteredConsultations = consultations.filter(consultation => {
    const matchesSearch = consultation.patientName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || consultation.status === statusFilter;
    const matchesEmergency = !emergenciesOnly || consultation.type === 'video';
    return matchesSearch && matchesStatus && matchesEmergency;
  });

  // Innovative consultation handlers
  const handleStartVideoCall = (consultation: Consultation) => {
    setSelectedConsultation(consultation);
    setShowVideoCall(true);
  };

  const handleOpenChat = (patientName: string) => {
    setSelectedPatient(patientName);
    setShowChatWindow(true);
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log('Sending message:', message);
      setMessage('');
    }
  };

  const handleStartRecording = () => {
    setIsRecording(!isRecording);
  };

  const handleSaveConsultationNotes = () => {
    console.log('Saving consultation notes:', consultationNotes);
    alert('Consultation notes saved successfully!');
  };

  const handleScheduleConsultation = () => {
    setShowScheduleModal(true);
    setScheduleForm({
      ...scheduleForm,
      date: new Date().toISOString().split('T')[0]
    });
  };

  const handleSaveSchedule = () => {
    if (!scheduleForm.patientName || !scheduleForm.date || !scheduleForm.time) {
      alert('Please fill in all required fields');
      return;
    }
    
    if (scheduleForm.price <= 0) {
      alert('Please set a valid consultation price in LKR');
      return;
    }
    
    console.log('Scheduling consultation:', scheduleForm);
    alert(`Consultation scheduled successfully! Price: LKR ${scheduleForm.price}`);
    setShowScheduleModal(false);
    setScheduleForm({
      patientName: '',
      type: 'video',
      date: '',
      time: '',
      duration: '30 mins',
      reason: '',
      price: 0,
      notes: ''
    });
  };

  const handlePriceChange = (type: string) => {
    const prices = {
      'video': 2500,
      'phone': 2000,
      'in-person': 3500
    };
    setScheduleForm({
      ...scheduleForm,
      type: type as any,
      price: prices[type as keyof typeof prices] || 0
    });
  };

  const handleViewHistory = () => {
    setActiveTab('history');
  };

  const handleEmergencyFilter = () => {
    setEmergenciesOnly(!emergenciesOnly);
  };

  const getActiveConsultations = () => {
    return consultations.filter(c => c.status === 'in-progress');
  };

  const getUrgentConsultations = () => {
    return consultations.filter(c => c.type === 'video' && c.status === 'scheduled');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'in-progress': return 'bg-blue-100 text-blue-700';
      case 'scheduled': return 'bg-yellow-100 text-yellow-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'refunded': return 'bg-slate-100 text-slate-700 border-slate-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'phone': return Phone;
      default: return Users;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'video': return 'text-blue-600 bg-blue-100';
      case 'phone': return 'text-green-600 bg-green-100';
      default: return 'text-purple-600 bg-purple-100';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={14}
        className={i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300'}
      />
    ));
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
              { name: 'Patient Overview', icon: ChevronRight, path: '/doctor' },
              { name: 'Appointments', icon: Calendar, path: '/doctor/appointments' },
              { name: 'Daily Schedule', icon: Clock, path: '/doctor/schedule' },
              { name: 'Medical Reports', icon: FileText, path: '/doctor/reports' },
              { name: 'Consultations', icon: MessageSquare, path: '/doctor/chats' },
              { name: 'Analytics', icon: Activity, path: '/doctor/analytics' },
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
            <h1 className="text-4xl font-black text-slate-950 mb-2">Consultations</h1>
            <p className="text-lg text-slate-600 font-bold">Manage patient consultations and communications</p>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white p-2 rounded-2xl border border-slate-100 mb-6 inline-flex">
            <button
              onClick={() => setActiveTab('consultations')}
              className={`px-6 py-3 rounded-xl font-black transition-all ${
                activeTab === 'consultations'
                  ? 'bg-[#8D153A] text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Consultations
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`px-6 py-3 rounded-xl font-black transition-all ${
                activeTab === 'messages'
                  ? 'bg-[#8D153A] text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Messages
            </button>
          </div>

          {activeTab === 'consultations' && (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl border border-slate-100">
                  <div className="flex items-center justify-between mb-4">
                    <MessageSquare className="text-[#8D153A]" size={24} />
                    <span className="text-2xl font-black text-slate-950">24</span>
                  </div>
                  <p className="text-sm font-black text-slate-400 uppercase tracking-widest">This Week</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100">
                  <div className="flex items-center justify-between mb-4">
                    <Video className="text-blue-600" size={24} />
                    <span className="text-2xl font-black text-slate-950">18</span>
                  </div>
                  <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Video Calls</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100">
                  <div className="flex items-center justify-between mb-4">
                    <Phone className="text-green-600" size={24} />
                    <span className="text-2xl font-black text-slate-950">6</span>
                  </div>
                  <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Phone Calls</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100">
                  <div className="flex items-center justify-between mb-4">
                    <Star className="text-yellow-500" size={24} />
                    <span className="text-2xl font-black text-slate-950">4.8</span>
                  </div>
                  <p className="text-sm font-black text-slate-400 uppercase tracking-widest">Avg Rating</p>
                </div>
              </div>

              {/* Search and Filters */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                    <input
                      type="text"
                      placeholder="Search consultations..."
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
                      <option value="scheduled">Scheduled</option>
                      <option value="in-progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                    <button 
                      onClick={handleScheduleConsultation}
                      className="px-6 py-3 bg-[#8D153A] text-white rounded-xl font-black hover:bg-[#8D153A]/80 transition-all flex items-center gap-2"
                    >
                      <PlusCircle size={20} />
                      Schedule Consultation
                    </button>
                  </div>
                </div>
              </div>

              {/* Consultations List */}
              <div className="space-y-4">
                {filteredConsultations.map((consultation) => {
                  const TypeIcon = getTypeIcon(consultation.type);
                  return (
                    <div key={consultation.id} className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-[#FFBE29]/40 hover:shadow-lg transition-all">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-6">
                          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${getTypeColor(consultation.type)}`}>
                            <TypeIcon size={28} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <p className="font-black text-slate-950 text-lg">{consultation.patientName}</p>
                              <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${getStatusColor(consultation.status)}`}>
                                {consultation.status.replace('-', ' ')}
                              </span>
                              <span className={`px-2 py-1 rounded-lg text-xs font-black ${getTypeColor(consultation.type)}`}>
                                {consultation.type}
                              </span>
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm text-slate-600 font-bold mb-3">
                              <span className="flex items-center gap-1">
                                <Calendar size={14} />
                                {consultation.date}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock size={14} />
                                {consultation.time}
                              </span>
                              <span className="flex items-center gap-1">
                                <Activity size={14} />
                                {consultation.duration}
                              </span>
                            </div>

                            <p className="text-sm text-slate-700 font-medium mb-2">
                              <span className="font-black">Reason:</span> {consultation.reason}
                            </p>

                            {consultation.notes && (
                              <p className="text-sm text-slate-600 italic mb-3">
                                {consultation.notes}
                              </p>
                            )}

                            {consultation.rating && (
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-black text-slate-700">Rating:</span>
                                <div className="flex gap-1">
                                  {renderStars(consultation.rating)}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-3">
                          <div className="flex gap-2">
                            {consultation.status === 'scheduled' && (
                              <button className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-black hover:bg-emerald-700 transition-all flex items-center gap-2">
                                <Video size={16} />
                                Start
                              </button>
                            )}
                            {consultation.status === 'in-progress' && (
                              <button className="px-4 py-2 bg-blue-600 text-white rounded-xl font-black hover:bg-blue-700 transition-all flex items-center gap-2">
                                <Activity size={16} />
                                Join
                              </button>
                            )}
                            <button className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all" title="View Details">
                              <ChevronRight size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {activeTab === 'messages' && (
            <div className="bg-white rounded-2xl border border-slate-100 h-[600px] flex">
              {/* Messages List */}
              <div className="w-80 border-r border-slate-100 p-4">
                <h3 className="font-black text-slate-950 mb-4">Recent Messages</h3>
                <div className="space-y-2">
                  {['Aruni Wijesinghe', 'Kasun Perera', 'Imara Jaffar'].map((name, idx) => (
                    <div key={idx} className="p-3 rounded-xl hover:bg-slate-50 cursor-pointer transition-all">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#8D153A] text-white flex items-center justify-center font-black text-sm">
                          {name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div className="flex-1">
                          <p className="font-black text-slate-950 text-sm">{name}</p>
                          <p className="text-xs text-slate-500 truncate">Last message preview...</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chat Area */}
              <div className="flex-1 flex flex-col">
                <div className="p-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#8D153A] text-white flex items-center justify-center font-black text-sm">
                      AW
                    </div>
                    <div>
                      <p className="font-black text-slate-950">Aruni Wijesinghe</p>
                      <p className="text-xs text-slate-500">Active now</p>
                    </div>
                  </div>
                </div>

                <div className="flex-1 p-4 overflow-y-auto">
                  <div className="space-y-4">
                    {messages.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.sender === 'doctor' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-md px-4 py-3 rounded-2xl ${
                          msg.sender === 'doctor' 
                            ? 'bg-[#8D153A] text-white rounded-tr-none' 
                            : 'bg-slate-100 text-slate-900 rounded-tl-none'
                        }`}>
                          <p className="font-medium">{msg.content}</p>
                          <p className={`text-xs mt-1 ${msg.sender === 'doctor' ? 'text-white/70' : 'text-slate-500'}`}>
                            {msg.timestamp}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 border-t border-slate-100">
                  <div className="flex gap-2">
                    <button className="p-3 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all">
                      <Paperclip size={20} />
                    </button>
                    <button className="p-3 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all">
                      <Mic size={20} />
                    </button>
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-950 font-bold placeholder-slate-400 focus:outline-none focus:border-[#8D153A] focus:ring-2 focus:ring-[#8D153A]/10"
                    />
                    <button className="px-6 py-3 bg-[#8D153A] text-white rounded-xl font-black hover:bg-[#8D153A]/80 transition-all flex items-center gap-2">
                      <Send size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Schedule Consultation Modal */}
          {showScheduleModal && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-3xl max-w-lg w-full max-h-[90vh] flex flex-col">
                <div className="p-6 border-b border-slate-100">
                  <div className="flex justify-between items-center">
                    <h3 className="text-2xl font-black text-slate-950">Schedule Consultation</h3>
                    <button 
                      onClick={() => setShowScheduleModal(false)}
                      className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
                    >
                      <AlertCircle size={20} />
                    </button>
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Patient Name *</label>
                    <input
                      type="text"
                      value={scheduleForm.patientName}
                      onChange={(e) => setScheduleForm({...scheduleForm, patientName: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-950 font-bold placeholder-slate-400 focus:outline-none focus:border-[#8D153A] focus:ring-2 focus:ring-[#8D153A]/10"
                      placeholder="Enter patient name"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Consultation Type *</label>
                    <select
                      value={scheduleForm.type}
                      onChange={(e) => handlePriceChange(e.target.value)}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-950 font-bold focus:outline-none focus:border-[#8D153A] focus:ring-2 focus:ring-[#8D153A]/10"
                    >
                      <option value="video">Video Consultation - LKR 2,500</option>
                      <option value="phone">Phone Consultation - LKR 2,000</option>
                      <option value="in-person">In-Person Consultation - LKR 3,500</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Date *</label>
                      <input
                        type="date"
                        value={scheduleForm.date}
                        onChange={(e) => setScheduleForm({...scheduleForm, date: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-950 font-bold focus:outline-none focus:border-[#8D153A] focus:ring-2 focus:ring-[#8D153A]/10"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Time *</label>
                      <input
                        type="time"
                        value={scheduleForm.time}
                        onChange={(e) => setScheduleForm({...scheduleForm, time: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-950 font-bold focus:outline-none focus:border-[#8D153A] focus:ring-2 focus:ring-[#8D153A]/10"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Duration</label>
                      <select
                        value={scheduleForm.duration}
                        onChange={(e) => setScheduleForm({...scheduleForm, duration: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-950 font-bold focus:outline-none focus:border-[#8D153A] focus:ring-2 focus:ring-[#8D153A]/10"
                      >
                        <option value="15 mins">15 mins</option>
                        <option value="30 mins">30 mins</option>
                        <option value="45 mins">45 mins</option>
                        <option value="60 mins">60 mins</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Price (LKR) *</label>
                      <input
                        type="number"
                        value={scheduleForm.price}
                        onChange={(e) => setScheduleForm({...scheduleForm, price: parseInt(e.target.value) || 0})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-950 font-bold placeholder-slate-400 focus:outline-none focus:border-[#8D153A] focus:ring-2 focus:ring-[#8D153A]/10"
                        placeholder="Enter price in LKR"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Reason for Consultation *</label>
                    <input
                      type="text"
                      value={scheduleForm.reason}
                      onChange={(e) => setScheduleForm({...scheduleForm, reason: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-950 font-bold placeholder-slate-400 focus:outline-none focus:border-[#8D153A] focus:ring-2 focus:ring-[#8D153A]/10"
                      placeholder="Enter reason for consultation"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Additional Notes</label>
                    <textarea
                      value={scheduleForm.notes}
                      onChange={(e) => setScheduleForm({...scheduleForm, notes: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-950 font-bold placeholder-slate-400 focus:outline-none focus:border-[#8D153A] focus:ring-2 focus:ring-[#8D153A]/10"
                      rows={3}
                      placeholder="Enter any additional notes"
                    />
                  </div>

                  <div className="bg-gradient-to-r from-[#8D153A]/10 to-[#E5AB22]/10 p-4 rounded-2xl border border-[#8D153A]/20">
                    <div className="flex items-center justify-between">
                      <span className="font-black text-slate-950">Total Consultation Fee:</span>
                      <span className="text-2xl font-black text-[#8D153A]">LKR {scheduleForm.price.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-6 border-t border-slate-100">
                  <div className="flex gap-3">
                    <button
                      onClick={handleSaveSchedule}
                      className="flex-1 py-4 bg-gradient-to-r from-[#8D153A] to-[#E5AB22] text-white rounded-2xl font-black hover:shadow-lg transition-all"
                    >
                      Schedule Consultation
                    </button>
                    <button
                      onClick={() => setShowScheduleModal(false)}
                      className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-black hover:bg-slate-200 transition-all"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
