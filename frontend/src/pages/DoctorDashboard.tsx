import React, { useState, useEffect } from 'react';
import { 
  Users, Calendar, FileText, Activity, 
  MessageSquare, Settings, Bell, LogOut, Search,
  ChevronRight, ArrowUpRight, ShieldCheck, 
  Clock, CheckCircle2, UserCheck, Menu, X,
  PlusCircle, Stethoscope, Briefcase, Zap,
  AlertTriangle, Pill, Download, FileDown,
  Heart, TrendingUp, AlertCircle, CheckCircle, Star,
  Mic, Send, Paperclip, Phone, Video, Camera,
  FileImage, FileText as FileMedicalIcon, MessageCircle, Volume2
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';

export default function DoctorDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [prescriptionForm, setPrescriptionForm] = useState({
    medicineName: '',
    dosage: '',
    duration: '',
    instructions: ''
  });
  const [appointmentFilter, setAppointmentFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  
  // Communication Center States
  const [showCommunicationCenter, setShowCommunicationCenter] = useState(false);
  const [selectedPatientForChat, setSelectedPatientForChat] = useState(null);
  const [chatMessage, setChatMessage] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [activeTab, setActiveTab] = useState('chat');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDownloadPrescription = () => {
    const prescriptionContent = `
╔══════════════════════════════════════════════════════════════╗
║                    MEDICONNECT LANKA PRESCRIPTION           ║
║                      Digital Prescription                   ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  Doctor: ${(user as any)?.name || 'Dr. Perera'}             ║
║  Date: ${new Date().toLocaleDateString('en-LK')}            ║
║  Time: ${new Date().toLocaleTimeString('en-LK')}            ║
║                                                              ║
║  ───────────────────────────────────────────────────────    ║
║                                                              ║
║  PATIENT PRESCRIPTION                                        ║
║                                                              ║
║  Medicine: ${prescriptionForm.medicineName || 'Not specified'}║
║  Dosage: ${prescriptionForm.dosage || 'Not specified'}      ║
║  Duration: ${prescriptionForm.duration || 'Not specified'}  ║
║                                                              ║
║  Instructions:                                               ║
║  ${prescriptionForm.instructions || 'No specific instructions'}║
║                                                              ║
║  ───────────────────────────────────────────────────────    ║
║                                                              ║
║  Doctor Signature: _______________________                  ║
║                                                              ║
║  This is a digitally generated prescription.                ║
║  Valid only with doctor's official signature.               ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
    `;

    const blob = new Blob([prescriptionContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prescription_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const handleGeneratePrescription = () => {
    if (!prescriptionForm.medicineName || !prescriptionForm.dosage) {
      alert('Please fill in medicine name and dosage');
      return;
    }
    
    // Here you would normally save to backend
    console.log('Prescription generated:', prescriptionForm);
    alert('Prescription generated successfully!');
    
    // Reset form
    setPrescriptionForm({
      medicineName: '',
      dosage: '',
      duration: '',
      instructions: ''
    });
  };

  // Communication Center Handlers
  const handleOpenCommunicationCenter = (patient) => {
    setSelectedPatientForChat(patient);
    setShowCommunicationCenter(true);
  };

  const handleSendMessage = () => {
    if (!chatMessage.trim()) return;
    
    // Here you would normally send to backend
    console.log('Sending message:', chatMessage);
    setChatMessage('');
    alert('Message sent successfully!');
  };

  const handleVoiceRecord = () => {
    if (isRecording) {
      setIsRecording(false);
      alert('Voice note recorded and sent!');
    } else {
      setIsRecording(true);
      alert('Recording voice note... Click again to stop');
    }
  };

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    setUploadedFiles([...uploadedFiles, ...files]);
    alert(`${files.length} file(s) uploaded successfully!`);
  };

  const handleSendAppointmentReminder = () => {
    alert('Appointment reminder sent to patient!');
  };

  const handleSendPostConsultationInstructions = () => {
    alert('Post-consultation instructions sent to patient!');
  };

  const navItems = [
    { name: 'Patient Overview', icon: Users, path: '/doctor' },
    { name: 'Appointments', icon: Calendar, path: '/doctor/appointments' },
    { name: 'Daily Schedule', icon: Clock, path: '/doctor/schedule' },
    { name: 'Medical Reports', icon: FileText, path: '/doctor/reports' },
    { name: 'Consultations', icon: MessageSquare, path: '/doctor/chats' },
    { name: 'Analytics', icon: Activity, path: '/doctor/analytics' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden">
      
      {/* Premium Sidebar (Doctor Variant) */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-80 bg-white border-r border-slate-100 transform transition-transform duration-500 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0`}>
        <div className="h-full flex flex-col p-8">
           <div className="flex items-center gap-3 mb-16 px-2">
              <img src={logo} alt="MediConnect" className="h-10 w-auto" />
              <div className="leading-none">
                 <p className="text-lg font-black text-slate-950 tracking-tighter">MediConnect <span className="text-[#8D153A]">Lanka</span></p>
                 <p className="text-[9px] font-bold text-[#E5AB22] uppercase tracking-widest mt-1">Medical Specialist</p>
              </div>
           </div>

           <nav className="flex-1 space-y-2">
              {navItems.map((item, idx) => (
                <Link 
                  key={idx} 
                  to={item.path} 
                  className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                >
                   <item.icon size={22} />
                   <span>{item.name}</span>
                </Link>
              ))}
           </nav>

           <div className="pt-8 border-t border-slate-100">
              <button onClick={handleLogout} className="flex items-center gap-4 px-6 py-4 rounded-2xl text-red-500 font-bold hover:bg-red-50 transition-all w-full text-left">
                 <LogOut size={22} /> Logout Portal
              </button>
           </div>
        </div>
      </aside>

      {/* Main Workspace */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto relative bg-[#F9FAFB]">
         
         {/* Top Header */}
         <header className="h-24 bg-white/50 backdrop-blur-md border-b border-slate-100 px-8 flex items-center justify-between sticky top-0 z-30">
            <div className="flex items-center gap-6">
                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 text-slate-500">
                   {sidebarOpen ? <X size={28} /> : <Menu size={28} />}
                </button>
                <div className="hidden lg:flex items-center gap-3 bg-slate-100 px-4 py-2 rounded-xl text-slate-500">
                   <Clock size={16} /> <span className="text-xs font-black uppercase tracking-widest">{new Date().toLocaleDateString('en-LK', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                </div>
            </div>
            
            <div className="flex items-center gap-6">
               <button className="relative w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-500 hover:text-[#8D153A] transition-colors">
                  <Bell size={22} />
                  <span className="absolute top-3 right-3 w-2 h-2 bg-[#FFBE29] rounded-full border-2 border-white" />
               </button>
               <div className="flex items-center gap-4 pl-6 border-l border-slate-200">
                  <div className="text-right hidden sm:block">
                     <p className="text-sm font-black text-slate-950">{(user as any)?.name || 'Dr. Perera'}</p>
                     <p className="text-[10px] font-bold text-[#E5AB22] uppercase tracking-widest">Consultant Specialist</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-[#E5AB22] flex items-center justify-center text-white font-black text-xl shadow-lg shadow-[#FFBE29]/20">
                     D
                  </div>
               </div>
            </div>
         </header>

         {/* Content Area */}
         <div className="p-8 lg:p-12 max-w-[1600px] mx-auto w-full">
            
            {/* Greeting */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
               <div>
                  <h1 className="text-4xl md:text-5xl font-black text-slate-950 tracking-tighter mb-3">Welcome, <span className="text-[#8D153A]">Doctor.</span></h1>
                  <p className="text-lg text-slate-500 font-bold">You have 8 patients scheduled for follow-up today.</p>
               </div>
               <button className="btn-gold h-16 !px-8 text-sm">
                  <PlusCircle size={20} /> New Consultation
               </button>
            </div>

            {/* Service-Level Stats Bento */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
               {[
                 { label: 'Total Patients', value: '1,248', icon: Users, color: 'text-[#8D153A]', bg: 'bg-[#8D153A]/5', trend: '+12% this week' },
                 { label: 'Avg Feedback', value: '4.9/5.0', icon: Star, color: 'text-[#FFBE29]', bg: 'bg-[#FFBE29]/10', trend: 'Based on 500+ reviews' },
                 { label: 'Consult Hours', value: '240h', icon: Clock, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: 'Peak efficiency' },
                 { label: 'System Load', value: 'Stable', icon: ShieldCheck, color: 'text-blue-600', bg: 'bg-blue-50', trend: 'Azure Node Online' }
               ].map((stat, i) => (
                 <div key={i} className="clinical-card p-8">
                    <div className={`w-14 h-14 rounded-2xl ${stat.bg} flex items-center justify-center ${stat.color} mb-6`}>
                       <stat.icon size={28} />
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{stat.label}</p>
                    <p className="text-3xl font-black text-slate-950 mb-2">{stat.value}</p>
                    <div className="text-xs font-bold text-slate-500">
                       {stat.trend}
                    </div>
                 </div>
               ))}
            </div>

            {/* Smart Clinical Summary Card */}
            <div className="clinical-card p-10 mb-8">
               <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-black tracking-tighter">Smart Clinical Summary</h3>
                  <button className="px-4 py-2 bg-[#8D153A] rounded-xl text-xs font-bold text-white hover:opacity-90 transition-all">
                     View Full History
                  </button>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                  <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100">
                     <div className="flex items-center gap-3 mb-3">
                        <Clock className="text-blue-600" size={20} />
                        <span className="text-xs font-black text-blue-600 uppercase tracking-widest">Last Visit</span>
                     </div>
                     <p className="text-lg font-black text-slate-950">3 Days Ago</p>
                     <p className="text-sm text-slate-600 font-bold mt-1">Routine Checkup</p>
                  </div>

                  <div className="bg-green-50 p-6 rounded-2xl border border-green-100">
                     <div className="flex items-center gap-3 mb-3">
                        <Heart className="text-green-600" size={20} />
                        <span className="text-xs font-black text-green-600 uppercase tracking-widest">Condition</span>
                     </div>
                     <p className="text-lg font-black text-slate-950">Stable</p>
                     <p className="text-sm text-slate-600 font-bold mt-1">Blood Pressure Normal</p>
                  </div>

                  <div className="bg-red-50 p-6 rounded-2xl border border-red-100">
                     <div className="flex items-center gap-3 mb-3">
                        <AlertTriangle className="text-red-600" size={20} />
                        <span className="text-xs font-black text-red-600 uppercase tracking-widest">Allergies</span>
                     </div>
                     <p className="text-lg font-black text-slate-950">2 Found</p>
                     <p className="text-sm text-slate-600 font-bold mt-1">Penicillin, Peanuts</p>
                  </div>

                  <div className="bg-purple-50 p-6 rounded-2xl border border-purple-100">
                     <div className="flex items-center gap-3 mb-3">
                        <Pill className="text-purple-600" size={20} />
                        <span className="text-xs font-black text-purple-600 uppercase tracking-widest">Medicines</span>
                     </div>
                     <p className="text-lg font-black text-slate-950">3 Active</p>
                     <p className="text-sm text-slate-600 font-bold mt-1">Metformin, Lisinopril</p>
                  </div>

                  <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100">
                     <div className="flex items-center gap-3 mb-3">
                        <AlertCircle className="text-orange-600" size={20} />
                        <span className="text-xs font-black text-orange-600 uppercase tracking-widest">Risk Alerts</span>
                     </div>
                     <p className="text-lg font-black text-slate-950">1 High</p>
                     <p className="text-sm text-slate-600 font-bold mt-1">Glucose Levels Rising</p>
                  </div>
               </div>
            </div>

            {/* Prescription Generator & Schedule Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               
               {/* Enhanced Appointment Management */}
               <div className="lg:col-span-2 clinical-card p-10">
                  <div className="flex justify-between items-center mb-8">
                     <div>
                        <h3 className="text-2xl font-black tracking-tighter">Appointment Management</h3>
                        <p className="text-sm text-slate-500 font-bold mt-1">Manage your patient consultations</p>
                     </div>
                     <div className="flex gap-2">
                        <button className="px-4 py-2 bg-slate-100 rounded-xl text-xs font-bold hover:bg-slate-200 transition-all">
                           <Calendar size={16} className="inline mr-2" />Calendar View
                        </button>
                        <button className="px-4 py-2 bg-[#8D153A] rounded-xl text-xs font-bold text-white hover:opacity-90 transition-all">
                           <PlusCircle size={16} className="inline mr-2" />New Appointment
                        </button>
                     </div>
                  </div>

                  {/* Search and Filter Bar */}
                  <div className="flex flex-col md:flex-row gap-4 mb-8">
                     <div className="flex-1 relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                        <input
                           type="text"
                           placeholder="Search patients by name or ID..."
                           value={searchQuery}
                           onChange={(e) => setSearchQuery(e.target.value)}
                           className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-950 font-bold placeholder-slate-400 focus:outline-none focus:border-[#8D153A] focus:ring-2 focus:ring-[#8D153A]/10"
                        />
                     </div>
                     <div className="flex gap-2">
                        <button
                           onClick={() => setAppointmentFilter('all')}
                           className={`px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                              appointmentFilter === 'all' 
                                 ? 'bg-[#8D153A] text-white' 
                                 : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                           }`}
                        >
                           All (8)
                        </button>
                        <button
                           onClick={() => setAppointmentFilter('waiting')}
                           className={`px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                              appointmentFilter === 'waiting' 
                                 ? 'bg-emerald-600 text-white' 
                                 : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                           }`}
                        >
                           Waiting (2)
                        </button>
                        <button
                           onClick={() => setAppointmentFilter('confirmed')}
                           className={`px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                              appointmentFilter === 'confirmed' 
                                 ? 'bg-blue-600 text-white' 
                                 : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                           }`}
                        >
                           Confirmed (4)
                        </button>
                        <button
                           onClick={() => setAppointmentFilter('completed')}
                           className={`px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
                              appointmentFilter === 'completed' 
                                 ? 'bg-purple-600 text-white' 
                                 : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                           }`}
                        >
                           Completed (2)
                        </button>
                     </div>
                  </div>

                  {/* Enhanced Appointment Cards */}
                  <div className="space-y-4">
                     {[
                        {
                           id: 1,
                           name: 'Aruni Wijesinghe',
                           age: 34,
                           gender: 'Female',
                           time: '10:30 AM',
                           type: 'Video Consult',
                           status: 'waiting',
                           reason: 'Annual Checkup',
                           duration: '30 mins',
                           priority: 'normal',
                           notes: 'Regular follow-up for hypertension'
                        },
                        {
                           id: 2,
                           name: 'Kasun Perera',
                           age: 45,
                           gender: 'Male',
                           time: '11:15 AM',
                           type: 'Physical Follow-up',
                           status: 'confirmed',
                           reason: 'Post-Surgery Review',
                           duration: '45 mins',
                           priority: 'high',
                           notes: 'Cardiac surgery follow-up, review ECG results'
                        },
                        {
                           id: 3,
                           name: 'Imara Jaffar',
                           age: 28,
                           gender: 'Female',
                           time: '02:00 PM',
                           type: 'New Patient',
                           status: 'confirmed',
                           reason: 'Initial Consultation',
                           duration: '60 mins',
                           priority: 'normal',
                           notes: 'First-time visit, comprehensive evaluation needed'
                        }
                     ].filter(apt => {
                        const matchesSearch = apt.name.toLowerCase().includes(searchQuery.toLowerCase());
                        const matchesFilter = appointmentFilter === 'all' || apt.status === appointmentFilter;
                        return matchesSearch && matchesFilter;
                     }).map((apt) => (
                        <div key={apt.id} className="group p-6 rounded-2xl border border-slate-100 hover:border-[#FFBE29]/40 hover:shadow-lg transition-all">
                           <div className="flex items-start justify-between">
                              <div className="flex items-start gap-6">
                                 <div className="relative">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#8D153A] to-[#E5AB22] flex items-center justify-center text-white font-black text-xl shadow-lg">
                                       {apt.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    {apt.priority === 'high' && (
                                       <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>
                                    )}
                                 </div>
                                 <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-2">
                                       <p className="font-black text-slate-950 text-lg">{apt.name}</p>
                                       <span className="px-2 py-1 bg-slate-100 rounded-lg text-xs font-black text-slate-600">
                                          {apt.age}y, {apt.gender}
                                       </span>
                                       <span className={`px-2 py-1 rounded-lg text-xs font-black ${
                                          apt.priority === 'high' 
                                             ? 'bg-red-100 text-red-600' 
                                             : 'bg-slate-100 text-slate-600'
                                       }`}>
                                          {apt.priority === 'high' ? 'High Priority' : 'Normal'}
                                       </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm text-slate-600 font-bold mb-3">
                                       <span className="flex items-center gap-1">
                                          <Clock size={14} /> {apt.time}
                                       </span>
                                       <span className="flex items-center gap-1">
                                          <Stethoscope size={14} /> {apt.type}
                                       </span>
                                       <span className="flex items-center gap-1">
                                          <Activity size={14} /> {apt.duration}
                                       </span>
                                    </div>
                                    <p className="text-sm text-slate-600 font-medium mb-2">
                                       <span className="font-black">Reason:</span> {apt.reason}
                                    </p>
                                    <p className="text-xs text-slate-500 italic">
                                       {apt.notes}
                                    </p>
                                 </div>
                              </div>
                              <div className="flex flex-col items-end gap-3">
                                 <div className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest ${
                                    apt.status === 'waiting' 
                                       ? 'bg-emerald-100 text-emerald-700' 
                                       : apt.status === 'confirmed'
                                       ? 'bg-blue-100 text-blue-700'
                                       : 'bg-purple-100 text-purple-700'
                                 }`}>
                                    {apt.status}
                                 </div>
                                 <div className="flex gap-2">
                                    <button 
                                       onClick={() => setSelectedAppointment(apt)}
                                       className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
                                       title="View Details"
                                    >
                                       <FileText size={16} />
                                    </button>
                                    <button 
                                       onClick={() => handleOpenCommunicationCenter(apt)}
                                       className="p-2 rounded-xl bg-[#8D153A] text-white hover:bg-[#8D153A]/80 transition-all"
                                       title="Open Communication Center"
                                    >
                                       <MessageCircle size={16} />
                                    </button>
                                    <button 
                                       className="p-2 rounded-xl bg-emerald-100 text-emerald-600 hover:bg-emerald-200 transition-all"
                                       title="Start Consultation"
                                    >
                                       <Video size={16} />
                                    </button>
                                    <button 
                                       className="p-2 rounded-xl bg-blue-100 text-blue-600 hover:bg-blue-200 transition-all"
                                       title="Reschedule"
                                    >
                                       <Calendar size={16} />
                                    </button>
                                 </div>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>

                  {/* Appointment Details Modal */}
                  {selectedAppointment && (
                     <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                           <div className="flex justify-between items-start mb-6">
                              <div>
                                 <h3 className="text-2xl font-black text-slate-950">Appointment Details</h3>
                                 <p className="text-slate-600 font-bold mt-1">Patient: {selectedAppointment.name}</p>
                              </div>
                              <button 
                                 onClick={() => setSelectedAppointment(null)}
                                 className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all"
                              >
                                 <X size={20} />
                              </button>
                           </div>
                           
                           <div className="grid grid-cols-2 gap-6 mb-8">
                              <div className="bg-slate-50 p-4 rounded-xl">
                                 <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Personal Info</p>
                                 <p className="font-black text-slate-950">{selectedAppointment.name}</p>
                                 <p className="text-sm text-slate-600">{selectedAppointment.age} years, {selectedAppointment.gender}</p>
                              </div>
                              <div className="bg-slate-50 p-4 rounded-xl">
                                 <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Consultation</p>
                                 <p className="font-black text-slate-950">{selectedAppointment.type}</p>
                                 <p className="text-sm text-slate-600">{selectedAppointment.duration}</p>
                              </div>
                           </div>

                           <div className="mb-8">
                              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Visit Reason</p>
                              <p className="text-slate-700 font-medium">{selectedAppointment.reason}</p>
                           </div>

                           <div className="mb-8">
                              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Medical Notes</p>
                              <p className="text-slate-700 font-medium">{selectedAppointment.notes}</p>
                           </div>

                           <div className="flex gap-3">
                              <button className="flex-1 h-14 rounded-2xl bg-emerald-600 text-white font-black flex items-center justify-center gap-3 hover:bg-emerald-700 transition-all">
                                 <MessageSquare size={20} />
                                 Start Consultation
                              </button>
                              <button className="flex-1 h-14 rounded-2xl bg-blue-600 text-white font-black flex items-center justify-center gap-3 hover:bg-blue-700 transition-all">
                                 <Calendar size={20} />
                                 Reschedule
                              </button>
                              <button className="h-14 w-14 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center hover:bg-red-200 transition-all">
                                 <X size={20} />
                              </button>
                           </div>
                        </div>
                     </div>
                  )}
               </div>

               {/* Prescription Generator Panel */}
               <div className="clinical-card p-10">
                  <div className="flex items-center gap-3 mb-8">
                     <div className="w-14 h-14 rounded-2xl bg-[#8D153A]/10 flex items-center justify-center text-[#8D153A]">
                        <Pill size={28} />
                     </div>
                     <div>
                        <h3 className="text-2xl font-black tracking-tighter">Prescription Generator</h3>
                        <p className="text-sm text-slate-500 font-bold">Create digital prescriptions instantly</p>
                     </div>
                  </div>

                  <div className="space-y-6">
                     <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Medicine Name</label>
                        <input
                           type="text"
                           value={prescriptionForm.medicineName}
                           onChange={(e) => setPrescriptionForm({...prescriptionForm, medicineName: e.target.value})}
                           className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-950 font-bold placeholder-slate-400 focus:outline-none focus:border-[#8D153A] focus:ring-2 focus:ring-[#8D153A]/10"
                           placeholder="e.g., Amoxicillin 500mg"
                        />
                     </div>

                     <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Dosage</label>
                        <input
                           type="text"
                           value={prescriptionForm.dosage}
                           onChange={(e) => setPrescriptionForm({...prescriptionForm, dosage: e.target.value})}
                           className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-950 font-bold placeholder-slate-400 focus:outline-none focus:border-[#8D153A] focus:ring-2 focus:ring-[#8D153A]/10"
                           placeholder="e.g., 1 tablet twice daily"
                        />
                     </div>

                     <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Duration</label>
                        <input
                           type="text"
                           value={prescriptionForm.duration}
                           onChange={(e) => setPrescriptionForm({...prescriptionForm, duration: e.target.value})}
                           className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-950 font-bold placeholder-slate-400 focus:outline-none focus:border-[#8D153A] focus:ring-2 focus:ring-[#8D153A]/10"
                           placeholder="e.g., 7 days, 2 weeks"
                        />
                     </div>

                     <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Instructions</label>
                        <textarea
                           value={prescriptionForm.instructions}
                           onChange={(e) => setPrescriptionForm({...prescriptionForm, instructions: e.target.value})}
                           className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-950 font-bold placeholder-slate-400 focus:outline-none focus:border-[#8D153A] focus:ring-2 focus:ring-[#8D153A]/10 h-24 resize-none"
                           placeholder="e.g., Take after meals, complete full course"
                        />
                     </div>

                     <div className="flex gap-3">
                        <button 
                           onClick={handleGeneratePrescription}
                           className="flex-1 h-14 rounded-2xl bg-[#8D153A] text-white font-black flex items-center justify-center gap-3 hover:opacity-90 transition-all"
                        >
                           <FileText size={20} />
                           Generate Prescription
                        </button>
                        <button 
                           onClick={handleDownloadPrescription}
                           className="h-14 w-14 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center hover:bg-slate-200 transition-all"
                           title="Download Prescription"
                        >
                           <Download size={20} />
                        </button>
                     </div>

                     <div className="pt-6 border-t border-slate-100">
                        <div className="flex items-center justify-between text-sm">
                           <span className="text-slate-500 font-bold">Recent Prescriptions</span>
                           <span className="text-[#8D153A] font-black">5 Today</span>
                        </div>
                     </div>
                  </div>
               </div>

            </div>

         </div>

      {/* Patient Communication Center Modal */}
      {showCommunicationCenter && selectedPatientForChat && (
         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
               {/* Header */}
               <div className="bg-gradient-to-r from-[#8D153A] to-[#C9204A] text-white p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-white font-black text-xl">
                        {selectedPatientForChat.name.split(' ').map(n => n[0]).join('')}
                     </div>
                     <div>
                        <h3 className="text-xl font-black">{selectedPatientForChat.name}</h3>
                        <p className="text-sm opacity-90">Patient Communication Center</p>
                     </div>
                  </div>
                  <button 
                     onClick={() => setShowCommunicationCenter(false)}
                     className="p-2 rounded-xl bg-white/20 hover:bg-white/30 transition-all"
                  >
                     <X size={20} />
                  </button>
               </div>

               {/* Tab Navigation */}
               <div className="border-b border-slate-200 bg-slate-50">
                  <div className="flex p-2 gap-2">
                     {[
                        { id: 'chat', name: 'Chat', icon: MessageCircle },
                        { id: 'files', name: 'File Share', icon: Paperclip },
                        { id: 'voice', name: 'Voice Notes', icon: Mic },
                        { id: 'reminders', name: 'Reminders', icon: Bell },
                        { id: 'instructions', name: 'Instructions', icon: FileText }
                     ].map((tab) => (
                        <button
                           key={tab.id}
                           onClick={() => setActiveTab(tab.id)}
                           className={`flex items-center gap-2 px-4 py-3 rounded-xl font-black text-sm transition-all ${
                              activeTab === tab.id
                                 ? 'bg-white text-[#8D153A] shadow-sm'
                                 : 'text-slate-600 hover:bg-white/50'
                           }`}
                        >
                           <tab.icon size={16} />
                           {tab.name}
                        </button>
                     ))}
                  </div>
               </div>

               {/* Content Area */}
               <div className="flex-1 overflow-hidden">
                  {activeTab === 'chat' && (
                     <div className="h-full flex flex-col">
                        {/* Chat Messages */}
                        <div className="flex-1 p-6 overflow-y-auto bg-slate-50">
                           <div className="space-y-4">
                              <div className="flex justify-start">
                                 <div className="max-w-md">
                                    <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm">
                                       <p className="text-slate-700 font-medium">Hello Doctor, I have been experiencing headaches for the past few days.</p>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1">Patient • 10:30 AM</p>
                                 </div>
                              </div>
                              <div className="flex justify-end">
                                 <div className="max-w-md">
                                    <div className="bg-[#8D153A] text-white p-4 rounded-2xl rounded-tr-none">
                                       <p className="font-medium">I understand. Let me check your recent medical history. Are you taking any medications currently?</p>
                                    </div>
                                    <p className="text-xs text-slate-500 mt-1 text-right">You • 10:32 AM</p>
                                 </div>
                              </div>
                           </div>
                        </div>

                        {/* Chat Input */}
                        <div className="border-t border-slate-200 bg-white p-4">
                           <div className="flex gap-3">
                              <input
                                 type="text"
                                 value={chatMessage}
                                 onChange={(e) => setChatMessage(e.target.value)}
                                 placeholder="Type your message..."
                                 className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-950 font-bold placeholder-slate-400 focus:outline-none focus:border-[#8D153A] focus:ring-2 focus:ring-[#8D153A]/10"
                                 onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                              />
                              <button
                                 onClick={handleVoiceRecord}
                                 className={`p-3 rounded-xl transition-all ${
                                    isRecording 
                                       ? 'bg-red-500 text-white animate-pulse' 
                                       : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                 }`}
                                 title={isRecording ? 'Stop Recording' : 'Record Voice Note'}
                              >
                                 <Mic size={20} />
                              </button>
                              <button
                                 onClick={handleSendMessage}
                                 className="px-6 py-3 bg-[#8D153A] text-white rounded-xl font-black hover:bg-[#8D153A]/80 transition-all flex items-center gap-2"
                              >
                                 <Send size={16} />
                                 Send
                              </button>
                           </div>
                        </div>
                     </div>
                  )}

                  {activeTab === 'files' && (
                     <div className="p-6">
                        <div className="mb-6">
                           <h4 className="text-lg font-black text-slate-950 mb-4">Share Medical Documents</h4>
                           <div className="border-2 border-dashed border-slate-300 rounded-2xl p-8 text-center hover:border-[#8D153A] transition-all">
                              <FileMedicalIcon size={48} className="mx-auto text-slate-400 mb-4" />
                              <p className="text-slate-600 font-medium mb-2">Drop files here or click to browse</p>
                              <p className="text-sm text-slate-500 mb-4">Support: PDF, JPG, PNG, DOC (Max 10MB)</p>
                              <input
                                 type="file"
                                 multiple
                                 onChange={handleFileUpload}
                                 className="hidden"
                                 id="file-upload"
                                 accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                              />
                              <label
                                 htmlFor="file-upload"
                                 className="inline-block px-6 py-3 bg-[#8D153A] text-white rounded-xl font-black hover:bg-[#8D153A]/80 transition-all cursor-pointer"
                              >
                                 Choose Files
                              </label>
                           </div>
                        </div>

                        <div>
                           <h4 className="text-lg font-black text-slate-950 mb-4">Shared Files</h4>
                           <div className="space-y-3">
                              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                                 <FileImage className="text-blue-600" size={24} />
                                 <div className="flex-1">
                                    <p className="font-black text-slate-950">Lab_Report_2024.pdf</p>
                                    <p className="text-sm text-slate-500">2.4 MB • Uploaded 2 hours ago</p>
                                 </div>
                                 <button className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all">
                                    <Download size={16} />
                                 </button>
                              </div>
                              <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                                 <FileMedicalIcon className="text-green-600" size={24} />
                                 <div className="flex-1">
                                    <p className="font-black text-slate-950">X-Ray_Chest.jpg</p>
                                    <p className="text-sm text-slate-500">1.8 MB • Uploaded yesterday</p>
                                 </div>
                                 <button className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all">
                                    <Download size={16} />
                                 </button>
                              </div>
                           </div>
                        </div>
                     </div>
                  )}

                  {activeTab === 'voice' && (
                     <div className="p-6">
                        <div className="text-center py-12">
                           <div className="w-24 h-24 rounded-full bg-[#8D153A]/10 flex items-center justify-center mx-auto mb-6">
                              <Mic className="text-[#8D153A]" size={40} />
                           </div>
                           <h4 className="text-xl font-black text-slate-950 mb-4">Voice Notes</h4>
                           <p className="text-slate-600 font-medium mb-8">Record and send voice messages for quick communication</p>
                           
                           <button
                              onClick={handleVoiceRecord}
                              className={`px-8 py-4 rounded-2xl font-black transition-all flex items-center gap-3 mx-auto ${
                                 isRecording 
                                    ? 'bg-red-500 text-white animate-pulse' 
                                    : 'bg-[#8D153A] text-white hover:bg-[#8D153A]/80'
                              }`}
                           >
                              <Mic size={20} />
                              {isRecording ? 'Stop Recording' : 'Start Recording'}
                           </button>

                           <div className="mt-12 space-y-4">
                              <h5 className="font-black text-slate-950">Recent Voice Notes</h5>
                              <div className="space-y-3">
                                 <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl">
                                    <button className="p-2 rounded-xl bg-emerald-100 text-emerald-600 hover:bg-emerald-200 transition-all">
                                       <Volume2 size={16} />
                                    </button>
                                    <div className="flex-1">
                                       <p className="font-black text-slate-950">Medication Instructions</p>
                                       <p className="text-sm text-slate-500">0:45 • 2 hours ago</p>
                                    </div>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>
                  )}

                  {activeTab === 'reminders' && (
                     <div className="p-6">
                        <h4 className="text-lg font-black text-slate-950 mb-6">Appointment Reminders</h4>
                        
                        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 mb-6">
                           <div className="flex items-start gap-4">
                              <Calendar className="text-blue-600 mt-1" size={24} />
                              <div className="flex-1">
                                 <h5 className="font-black text-slate-950 mb-2">Next Appointment</h5>
                                 <p className="text-slate-700 font-medium mb-4">{selectedPatientForChat.name} - Follow-up Consultation</p>
                                 <p className="text-sm text-slate-600 mb-4">Date: {selectedPatientForChat.time}, Tomorrow</p>
                                 <button
                                    onClick={handleSendAppointmentReminder}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-xl font-black hover:bg-blue-700 transition-all"
                                 >
                                    Send Reminder
                                 </button>
                              </div>
                           </div>
                        </div>

                        <div className="space-y-4">
                           <h5 className="font-black text-slate-950">Quick Reminder Templates</h5>
                           {[
                              'Please remember to take your medication before the appointment.',
                              'Bring your previous medical reports and test results.',
                              'Fast for 8 hours before the blood test.',
                              'Arrive 15 minutes early for paperwork.'
                           ].map((template, idx) => (
                              <div key={idx} className="p-4 bg-slate-50 rounded-xl flex items-center justify-between">
                                 <p className="text-slate-700 font-medium">{template}</p>
                                 <button className="px-3 py-1 bg-[#8D153A] text-white rounded-lg text-xs font-black hover:bg-[#8D153A]/80 transition-all">
                                    Send
                                 </button>
                              </div>
                           ))}
                        </div>
                     </div>
                  )}

                  {activeTab === 'instructions' && (
                     <div className="p-6">
                        <h4 className="text-lg font-black text-slate-950 mb-6">Post-Consultation Instructions</h4>
                        
                        <div className="space-y-6">
                           <div>
                              <h5 className="font-black text-slate-950 mb-3">Medication Instructions</h5>
                              <textarea
                                 className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-950 font-bold placeholder-slate-400 focus:outline-none focus:border-[#8D153A] focus:ring-2 focus:ring-[#8D153A]/10 h-32 resize-none"
                                 placeholder="Enter detailed medication instructions..."
                                 defaultValue="Take Amoxicillin 500mg twice daily after meals for 7 days. Complete the full course even if you feel better."
                              />
                           </div>

                           <div>
                              <h5 className="font-black text-slate-950 mb-3">Lifestyle Recommendations</h5>
                              <textarea
                                 className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-950 font-bold placeholder-slate-400 focus:outline-none focus:border-[#8D153A] focus:ring-2 focus:ring-[#8D153A]/10 h-32 resize-none"
                                 placeholder="Enter lifestyle and dietary recommendations..."
                                 defaultValue="Increase water intake to 8 glasses per day. Avoid spicy and oily foods for 2 weeks. Exercise moderately for 30 minutes daily."
                              />
                           </div>

                           <div>
                              <h5 className="font-black text-slate-950 mb-3">Follow-up Schedule</h5>
                              <textarea
                                 className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-950 font-bold placeholder-slate-400 focus:outline-none focus:border-[#8D153A] focus:ring-2 focus:ring-[#8D153A]/10 h-24 resize-none"
                                 placeholder="Enter follow-up appointment details..."
                                 defaultValue="Next review in 2 weeks. Book appointment for blood tests before next visit."
                              />
                           </div>

                           <button
                              onClick={handleSendPostConsultationInstructions}
                              className="w-full py-4 bg-[#8D153A] text-white rounded-2xl font-black hover:bg-[#8D153A]/80 transition-all flex items-center justify-center gap-3"
                           >
                              <Send size={20} />
                              Send Instructions to Patient
                           </button>
                        </div>
                     </div>
                  )}
               </div>
            </div>
         </div>
      )}
      </main>
    </div>
  );
}
