import React, { useEffect, useMemo, useRef, useState } from 'react';
import { 
  MessageSquare, Search, Filter, PlusCircle, Video, Phone, Mic,
  Send, Paperclip, Calendar, Clock, Users, CheckCircle, AlertCircle,
  Activity, Heart, FileText, ChevronRight, Star, Pill
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
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

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordingChunksRef = useRef<BlobPart[]>([]);
  
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

  useEffect(() => {
    const state = location.state as undefined | { openSchedule?: boolean };
    if (state?.openSchedule) {
      setActiveTab('schedule');
      setShowScheduleModal(true);
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.state, location.pathname, navigate]);

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

  const initialMessages = useMemo<Message[]>(() => ([
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
  ]), []);

  const [chatMessages, setChatMessages] = useState<Message[]>(initialMessages);

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

  const handleVoiceCall = (consultation: Consultation) => {
    alert(`Initiating voice call with ${consultation.patientName}...\n\nPhone: +94 77 123 4567\nThis would connect to a voice call system.`);
  };

  const handleFileShare = (patientName: string) => {
    alert(`Opening file sharing with ${patientName}...\n\nYou can share:\n• Medical reports\n• Test results\n• Prescriptions\n• Images\nThis would open a file sharing interface.`);
  };

  const handleViewDetails = (consultation: Consultation) => {
    setSelectedConsultation(consultation);
  };

  const handleSendMessage = () => {
    const trimmed = message.trim();
    if (!trimmed) return;

    const now = new Date();
    const timestamp = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setChatMessages(prev => [
      ...prev,
      {
        id: (prev[prev.length - 1]?.id ?? 0) + 1,
        sender: 'doctor',
        content: trimmed,
        timestamp,
        type: 'text'
      }
    ]);
    setMessage('');
  };

  const handleAttachFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    const now = new Date();
    const timestamp = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setChatMessages(prev => {
      const baseId = (prev[prev.length - 1]?.id ?? 0) + 1;
      return [
        ...prev,
        ...files.map((f, idx) => ({
          id: baseId + idx,
          sender: 'doctor' as const,
          content: `📎 ${f.name} (${Math.round(f.size / 1024)} KB)`,
          timestamp,
          type: 'file' as const
        }))
      ];
    });

    // allow selecting same file again
    e.target.value = '';
  };

  const handleToggleRecording = async () => {
    if (isRecording) {
      mediaRecorderRef.current?.stop();
      return;
    }

    if (!navigator.mediaDevices?.getUserMedia) {
      alert('Voice recording is not supported in this browser.');
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      recordingChunksRef.current = [];

      recorder.ondataavailable = (evt) => {
        if (evt.data && evt.data.size > 0) recordingChunksRef.current.push(evt.data);
      };

      recorder.onstop = () => {
        stream.getTracks().forEach(t => t.stop());

        const blob = new Blob(recordingChunksRef.current, { type: recorder.mimeType || 'audio/webm' });
        const seconds = Math.max(1, Math.round(blob.size / 16000)); // rough estimate

        const now = new Date();
        const timestamp = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        setChatMessages(prev => [
          ...prev,
          {
            id: (prev[prev.length - 1]?.id ?? 0) + 1,
            sender: 'doctor',
            content: `🎤 Voice message (${seconds}s)`,
            timestamp,
            type: 'voice'
          }
        ]);
      };

      mediaRecorderRef.current = recorder;
      recorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error(err);
      alert('Microphone permission denied or unavailable.');
    }
  };

  useEffect(() => {
    if (!isRecording) return;
    const recorder = mediaRecorderRef.current;
    if (!recorder) return;
    const handleStop = () => setIsRecording(false);
    recorder.addEventListener('stop', handleStop);
    return () => recorder.removeEventListener('stop', handleStop);
  }, [isRecording]);

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
        className={i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-slate-700'}
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
              { name: 'Telemedicine Sessions', icon: Video, path: '/doctor/telemedicine' },
              { name: 'Digital Prescriptions', icon: Pill, path: '/doctor/prescriptions' },
              { name: 'Medical Reports', icon: FileText, path: '/doctor/reports' },
              { name: 'Consultations', icon: MessageSquare, path: '/doctor/chats' },
              { name: 'Analytics', icon: Activity, path: '/doctor/analytics' },
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
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-black text-slate-950 mb-2">Consultations</h1>
            <p className="text-lg text-slate-600 font-bold">Manage patient consultations and communication</p>
          </div>

          {/* Tab Navigation */}
          <div className="bg-white p-2 rounded-2xl border border-slate-100 mb-6 inline-flex">
            <button
              onClick={() => setActiveTab('consultations')}
              className={`px-6 py-3 rounded-xl font-black transition-all ${
                activeTab === 'consultations'
                  ? 'bg-[#8D153A] text-slate-900'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setActiveTab('messages')}
              className={`px-6 py-3 rounded-xl font-black transition-all ${
                activeTab === 'messages'
                  ? 'bg-[#8D153A] text-slate-900'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Messages
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-6 py-3 rounded-xl font-black transition-all ${
                activeTab === 'history'
                  ? 'bg-[#8D153A] text-slate-900'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              History
            </button>
            <button
              onClick={() => setActiveTab('schedule')}
              className={`px-6 py-3 rounded-xl font-black transition-all ${
                activeTab === 'schedule'
                  ? 'bg-[#8D153A] text-slate-900'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              Schedule
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
                  <p className="text-sm font-black text-slate-600 uppercase tracking-widest">This Week</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100">
                  <div className="flex items-center justify-between mb-4">
                    <Video className="text-blue-600" size={24} />
                    <span className="text-2xl font-black text-slate-950">18</span>
                  </div>
                  <p className="text-sm font-black text-slate-600 uppercase tracking-widest">Video Calls</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100">
                  <div className="flex items-center justify-between mb-4">
                    <Phone className="text-green-600" size={24} />
                    <span className="text-2xl font-black text-slate-950">6</span>
                  </div>
                  <p className="text-sm font-black text-slate-600 uppercase tracking-widest">Phone Calls</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-100">
                  <div className="flex items-center justify-between mb-4">
                    <Star className="text-yellow-500" size={24} />
                    <span className="text-2xl font-black text-slate-950">4.8</span>
                  </div>
                  <p className="text-sm font-black text-slate-600 uppercase tracking-widest">Avg Rating</p>
                </div>
              </div>

              {/* Search and Filters */}
              <div className="bg-white p-6 rounded-2xl border border-slate-100 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-600" size={20} />
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
                      className="px-6 py-3 bg-[#8D153A] text-slate-900 rounded-xl font-black hover:bg-[#8D153A]/80 transition-all flex items-center gap-2"
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
                              <button 
                                onClick={() => handleStartVideoCall(consultation)}
                                className="px-4 py-2 bg-emerald-600 text-slate-900 rounded-xl font-black hover:bg-emerald-700 transition-all flex items-center gap-2"
                              >
                                <Video size={16} />
                                Start
                              </button>
                            )}
                            {consultation.status === 'in-progress' && (
                              <button 
                                onClick={() => handleStartVideoCall(consultation)}
                                className="px-4 py-2 bg-blue-600 text-slate-900 rounded-xl font-black hover:bg-blue-700 transition-all flex items-center gap-2"
                              >
                                <Activity size={16} />
                                Join
                              </button>
                            )}
                            <button 
                              onClick={() => handleOpenChat(consultation.patientName)}
                              className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all" 
                              title="Start Chat"
                            >
                              <MessageSquare size={16} />
                            </button>
                            <button 
                              onClick={() => handleVoiceCall(consultation)}
                              className="p-2 rounded-xl bg-green-100 text-green-600 hover:bg-green-200 transition-all" 
                              title="Voice Call"
                            >
                              <Phone size={16} />
                            </button>
                            <button 
                              onClick={() => handleFileShare(consultation.patientName)}
                              className="p-2 rounded-xl bg-blue-100 text-blue-600 hover:bg-blue-200 transition-all" 
                              title="Share Files"
                            >
                              <Paperclip size={16} />
                            </button>
                            <button 
                              onClick={() => handleViewDetails(consultation)}
                              className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all" 
                              title="View Details"
                            >
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
                    <div 
                      key={idx} 
                      onClick={() => handleOpenChat(name)}
                      className="p-3 rounded-xl hover:bg-slate-50 cursor-pointer transition-all"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#8D153A] text-slate-900 flex items-center justify-center font-black text-sm">
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
                    <div className="w-10 h-10 rounded-full bg-[#8D153A] text-slate-900 flex items-center justify-center font-black text-sm">
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
                    {chatMessages.map((msg) => (
                      <div key={msg.id} className={`flex ${msg.sender === 'doctor' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-md px-4 py-3 rounded-2xl ${
                          msg.sender === 'doctor' 
                            ? 'bg-[#8D153A] text-slate-900 rounded-tr-none' 
                            : 'bg-slate-100 text-slate-900 rounded-tl-none'
                        }`}>
                          <p className="font-medium">{msg.content}</p>
                          <p className={`text-xs mt-1 ${msg.sender === 'doctor' ? 'text-slate-900/70' : 'text-slate-500'}`}>
                            {msg.timestamp}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 border-t border-slate-100">
                  <div className="flex gap-2">
                    <button
                      onClick={handleAttachFileClick}
                      className="p-3 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
                      title="Attach file"
                      type="button"
                    >
                      <Paperclip size={20} />
                    </button>
                    <button
                      onClick={handleToggleRecording}
                      className={`p-3 rounded-xl transition-all ${
                        isRecording
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                      title={isRecording ? 'Stop recording' : 'Voice message'}
                      type="button"
                    >
                      <Mic size={20} />
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      multiple
                      onChange={handleFileSelected}
                    />
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSendMessage();
                      }}
                      placeholder="Type a message..."
                      className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-950 font-bold placeholder-slate-400 focus:outline-none focus:border-[#8D153A] focus:ring-2 focus:ring-[#8D153A]/10"
                    />
                    <button
                      onClick={handleSendMessage}
                      className="px-6 py-3 bg-[#8D153A] text-slate-900 rounded-xl font-black hover:bg-[#8D153A]/80 transition-all flex items-center gap-2"
                      title="Send"
                      type="button"
                    >
                      <Send size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="bg-white rounded-2xl border border-slate-100 p-8">
              <h3 className="text-2xl font-black text-slate-950 mb-6">Consultation History</h3>
              <div className="space-y-4">
                {consultations.filter(c => c.status === 'completed').map((consultation) => (
                  <div key={consultation.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-black text-slate-950">{consultation.patientName}</p>
                        <p className="text-sm text-slate-600">{consultation.date} • {consultation.time}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-slate-950">LKR {consultation.price.toLocaleString()}</p>
                        {consultation.rating && (
                          <div className="flex gap-1 mt-1">
                            {renderStars(consultation.rating)}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'schedule' && (
            <div className="bg-white rounded-2xl border border-slate-100 p-8 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 250px)' }}>
              <div className="sticky top-0 bg-white z-10 pb-4 mb-2 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black text-slate-950">Add Appointment</h3>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-slate-100 text-slate-600 rounded-xl font-black hover:bg-slate-200 transition-all">
                      Save Draft
                    </button>
                    <button className="px-4 py-2 bg-[#8D153A] text-slate-900 rounded-xl font-black hover:bg-[#8D153A]/80 transition-all">
                      Book
                    </button>
                  </div>
                </div>
              </div>
              
              <p className="text-lg text-slate-600 font-bold mb-8">Schedule a new consultation</p>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Patient Information Card */}
                <div className="bg-white border-2 border-slate-200 rounded-2xl p-6">
                  <h4 className="font-black text-slate-950 mb-4 pb-2 border-b border-slate-200">Patient Information</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-2">Search Patient</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-950 font-bold placeholder-slate-400 focus:outline-none focus:border-[#8D153A] focus:ring-2 focus:ring-[#8D153A]/10"
                        placeholder="Search patient..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-2">Name</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-950 font-bold placeholder-slate-400 focus:outline-none focus:border-[#8D153A] focus:ring-2 focus:ring-[#8D153A]/10"
                        placeholder="Patient name"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-2">Patient ID</label>
                      <input
                        type="text"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-950 font-bold placeholder-slate-400 focus:outline-none focus:border-[#8D153A] focus:ring-2 focus:ring-[#8D153A]/10"
                        placeholder="Patient ID"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-2">Age</label>
                        <input
                          type="number"
                          className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-950 font-bold placeholder-slate-400 focus:outline-none focus:border-[#8D153A] focus:ring-2 focus:ring-[#8D153A]/10"
                          placeholder="Age"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-2">Gender</label>
                        <select className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-950 font-bold focus:outline-none focus:border-[#8D153A] focus:ring-2 focus:ring-[#8D153A]/10">
                          <option>Male</option>
                          <option>Female</option>
                          <option>Other</option>
                        </select>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-2">Contact</label>
                      <input
                        type="tel"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-950 font-bold placeholder-slate-400 focus:outline-none focus:border-[#8D153A] focus:ring-2 focus:ring-[#8D153A]/10"
                        placeholder="Contact number"
                      />
                    </div>
                    
                    <button className="w-full py-2 bg-[#8D153A] text-slate-900 rounded-xl font-black hover:bg-[#8D153A]/80 transition-all">
                      + Add New Patient
                    </button>
                  </div>
                </div>

                {/* Doctor Availability Card */}
                <div className="bg-white border-2 border-slate-200 rounded-2xl p-6">
                  <h4 className="font-black text-slate-950 mb-4 pb-2 border-b border-slate-200">Doctor Availability</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-2">Free Slots</label>
                      <div className="grid grid-cols-3 gap-2">
                        <button className="py-2 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-black hover:bg-emerald-200 transition-all">
                          9:00 AM
                        </button>
                        <button className="py-2 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-black hover:bg-emerald-200 transition-all">
                          10:00 AM
                        </button>
                        <button className="py-2 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-black hover:bg-emerald-200 transition-all">
                          11:00 AM
                        </button>
                        <button className="py-2 bg-slate-100 text-slate-500 rounded-lg text-xs font-black line-through">
                          2:00 PM
                        </button>
                        <button className="py-2 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-black hover:bg-emerald-200 transition-all">
                          3:00 PM
                        </button>
                        <button className="py-2 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-black hover:bg-emerald-200 transition-all">
                          4:00 PM
                        </button>
                      </div>
                    </div>
                    
                    <div className="bg-orange-50 border border-orange-200 rounded-xl p-3">
                      <p className="text-xs font-black text-orange-700 mb-1">⚠️ Conflict Alert</p>
                      <p className="text-xs text-orange-600">You have another appointment at 2:00 PM</p>
                    </div>
                  </div>
                </div>

                {/* Patient Quick Summary */}
                <div className="bg-white border-2 border-slate-200 rounded-2xl p-6">
                  <h4 className="font-black text-slate-950 mb-4 pb-2 border-b border-slate-200">Patient Quick Summary</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-2">Last Visit</label>
                      <p className="text-sm text-slate-600">15 March 2024</p>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-2">Allergies</label>
                      <p className="text-sm text-slate-600">Penicillin, Peanuts</p>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-2">Current Condition</label>
                      <p className="text-sm text-slate-600">Hypertension, Type 2 Diabetes</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                {/* Appointment Details Card */}
                <div className="bg-white border-2 border-slate-200 rounded-2xl p-6">
                  <h4 className="font-black text-slate-950 mb-4 pb-2 border-b border-slate-200">Appointment Details</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-2">Date</label>
                      <input
                        type="date"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-950 font-bold focus:outline-none focus:border-[#8D153A] focus:ring-2 focus:ring-[#8D153A]/10"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-2">Time</label>
                      <input
                        type="time"
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-950 font-bold focus:outline-none focus:border-[#8D153A] focus:ring-2 focus:ring-[#8D153A]/10"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-2">Duration</label>
                      <select className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-950 font-bold focus:outline-none focus:border-[#8D153A] focus:ring-2 focus:ring-[#8D153A]/10">
                        <option>15 mins</option>
                        <option>30 mins</option>
                        <option>45 mins</option>
                        <option>60 mins</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-2">Consultation Type</label>
                      <select className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-950 font-bold focus:outline-none focus:border-[#8D153A] focus:ring-2 focus:ring-[#8D153A]/10">
                        <option>Video Consult</option>
                        <option>Phone Consult</option>
                        <option>Physical Examination</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-2">Appointment Type</label>
                      <select className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-950 font-bold focus:outline-none focus:border-[#8D153A] focus:ring-2 focus:ring-[#8D153A]/10">
                        <option>New Patient</option>
                        <option>Follow-up</option>
                        <option>Emergency</option>
                        <option>Review</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Medical Purpose Card */}
                <div className="bg-white border-2 border-slate-200 rounded-2xl p-6">
                  <h4 className="font-black text-slate-950 mb-4 pb-2 border-b border-slate-200">Medical Purpose</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-2">Reason for Visit</label>
                      <textarea
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-950 font-bold placeholder-slate-400 focus:outline-none focus:border-[#8D153A] focus:ring-2 focus:ring-[#8D153A]/10"
                        rows={3}
                        placeholder="Describe the reason for visit..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-2">Symptoms</label>
                      <textarea
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-950 font-bold placeholder-slate-400 focus:outline-none focus:border-[#8D153A] focus:ring-2 focus:ring-[#8D153A]/10"
                        rows={3}
                        placeholder="Describe symptoms..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-2">Priority</label>
                      <select className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-950 font-bold focus:outline-none focus:border-[#8D153A] focus:ring-2 focus:ring-[#8D153A]/10">
                        <option>Normal</option>
                        <option>High</option>
                        <option>Urgent</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Notes Card */}
                <div className="bg-white border-2 border-slate-200 rounded-2xl p-6">
                  <h4 className="font-black text-slate-950 mb-4 pb-2 border-b border-slate-200">Notes</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-2">Preliminary Notes</label>
                      <textarea
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-950 font-bold placeholder-slate-400 focus:outline-none focus:border-[#8D153A] focus:ring-2 focus:ring-[#8D153A]/10"
                        rows={3}
                        placeholder="Enter preliminary notes..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-2">Special Instructions</label>
                      <textarea
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-950 font-bold placeholder-slate-400 focus:outline-none focus:border-[#8D153A] focus:ring-2 focus:ring-[#8D153A]/10"
                        rows={3}
                        placeholder="Enter special instructions..."
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-2">Required Tests</label>
                      <textarea
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-950 font-bold placeholder-slate-400 focus:outline-none focus:border-[#8D153A] focus:ring-2 focus:ring-[#8D153A]/10"
                        rows={3}
                        placeholder="List required tests..."
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Appointment Summary */}
              <div className="bg-gradient-to-r from-[#8D153A]/10 to-[#E5AB22]/10 border-2 border-[#8D153A]/20 rounded-2xl p-6 mt-6">
                <h4 className="font-black text-slate-950 mb-4">Appointment Summary</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-xs font-black text-slate-600 uppercase tracking-widest mb-1">Patient</p>
                    <p className="font-black text-slate-950">--</p>
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-600 uppercase tracking-widest mb-1">Date</p>
                    <p className="font-black text-slate-950">--</p>
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-600 uppercase tracking-widest mb-1">Time</p>
                    <p className="font-black text-slate-950">--</p>
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-600 uppercase tracking-widest mb-1">Type</p>
                    <p className="font-black text-slate-950">--</p>
                  </div>
                </div>
              </div>

              {/* Bottom Action Buttons */}
              <div className="flex justify-between items-center mt-8">
                <button className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-black hover:bg-slate-200 transition-all">
                  Cancel
                </button>
                <button className="px-8 py-3 bg-gradient-to-r from-[#8D153A] to-[#E5AB22] text-slate-900 rounded-xl font-black hover:shadow-lg transition-all">
                  Confirm Booking
                </button>
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
                    <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-3">Patient Name *</label>
                    <input
                      type="text"
                      value={scheduleForm.patientName}
                      onChange={(e) => setScheduleForm({...scheduleForm, patientName: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-950 font-bold placeholder-slate-400 focus:outline-none focus:border-[#8D153A] focus:ring-2 focus:ring-[#8D153A]/10"
                      placeholder="Enter patient name"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-3">Consultation Type *</label>
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
                      <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-3">Date *</label>
                      <input
                        type="date"
                        value={scheduleForm.date}
                        onChange={(e) => setScheduleForm({...scheduleForm, date: e.target.value})}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-950 font-bold focus:outline-none focus:border-[#8D153A] focus:ring-2 focus:ring-[#8D153A]/10"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-3">Time *</label>
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
                      <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-3">Duration</label>
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
                      <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-3">Price (LKR) *</label>
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
                    <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-3">Reason for Consultation *</label>
                    <input
                      type="text"
                      value={scheduleForm.reason}
                      onChange={(e) => setScheduleForm({...scheduleForm, reason: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-950 font-bold placeholder-slate-400 focus:outline-none focus:border-[#8D153A] focus:ring-2 focus:ring-[#8D153A]/10"
                      placeholder="Enter reason for consultation"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-3">Additional Notes</label>
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
                      className="flex-1 py-4 bg-gradient-to-r from-[#8D153A] to-[#E5AB22] text-slate-900 rounded-2xl font-black hover:shadow-lg transition-all"
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

          {/* Consultation Details Modal */}
          {selectedConsultation && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-[#8D153A] to-[#C9204A] p-6 text-slate-900">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-black mb-2">Consultation Details</h3>
                      <p className="text-slate-900/90 font-medium">{selectedConsultation.patientName}</p>
                    </div>
                    <button 
                      onClick={() => setSelectedConsultation(null)}
                      className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-all"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>

                {/* Modal Content */}
                <div className="p-6 overflow-y-auto max-h-[60vh]">
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div className="bg-slate-50 p-4 rounded-2xl">
                      <p className="text-xs font-black text-slate-600 uppercase tracking-widest mb-2">Date</p>
                      <p className="font-black text-slate-950">{selectedConsultation.date}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl">
                      <p className="text-xs font-black text-slate-600 uppercase tracking-widest mb-2">Time</p>
                      <p className="font-black text-slate-950">{selectedConsultation.time}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl">
                      <p className="text-xs font-black text-slate-600 uppercase tracking-widest mb-2">Duration</p>
                      <p className="font-black text-slate-950">{selectedConsultation.duration}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl">
                      <p className="text-xs font-black text-slate-600 uppercase tracking-widest mb-2">Type</p>
                      <p className="font-black text-slate-950 capitalize">{selectedConsultation.type}</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <p className="text-xs font-black text-slate-600 uppercase tracking-widest mb-3">Reason for Consultation</p>
                    <p className="font-black text-slate-950 bg-slate-50 p-4 rounded-2xl">{selectedConsultation.reason}</p>
                  </div>

                  {selectedConsultation.notes && (
                    <div className="mb-6">
                      <p className="text-xs font-black text-slate-600 uppercase tracking-widest mb-3">Notes</p>
                      <p className="font-black text-slate-950 bg-slate-50 p-4 rounded-2xl">{selectedConsultation.notes}</p>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div className="bg-slate-50 p-4 rounded-2xl">
                      <p className="text-xs font-black text-slate-600 uppercase tracking-widest mb-2">Status</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${getStatusColor(selectedConsultation.status)}`}>
                        {selectedConsultation.status.replace('-', ' ')}
                      </span>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-2xl">
                      <p className="text-xs font-black text-slate-600 uppercase tracking-widest mb-2">Consultation Fee</p>
                      <p className="font-black text-slate-950">LKR {selectedConsultation.price.toLocaleString()}</p>
                    </div>
                  </div>

                  {selectedConsultation.rating && (
                    <div className="mb-6">
                      <p className="text-xs font-black text-slate-600 uppercase tracking-widest mb-3">Patient Rating</p>
                      <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                          {renderStars(selectedConsultation.rating)}
                        </div>
                        <span className="font-black text-slate-950">{selectedConsultation.rating}/5</span>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    {selectedConsultation.status === 'scheduled' && (
                      <button 
                        onClick={() => {
                          handleStartVideoCall(selectedConsultation);
                          setSelectedConsultation(null);
                        }}
                        className="flex-1 py-3 bg-emerald-600 text-slate-900 rounded-xl font-black hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                      >
                        <Video size={16} />
                        Start Consultation
                      </button>
                    )}
                    <button 
                      onClick={() => {
                        handleOpenChat(selectedConsultation.patientName);
                        setSelectedConsultation(null);
                      }}
                      className="flex-1 py-3 bg-blue-600 text-slate-900 rounded-xl font-black hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
                    >
                      <MessageSquare size={16} />
                      Message Patient
                    </button>
                    <button 
                      onClick={() => setSelectedConsultation(null)}
                      className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-black hover:bg-slate-200 transition-all"
                    >
                      Close
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
