import React, { useState } from 'react';
import { 
  Users, Calendar, FileText, Activity, 
  MessageSquare, Settings, Bell, LogOut, Search,
  ChevronRight, ArrowUpRight, ShieldCheck, 
  Clock, CheckCircle2, UserCheck, Menu, X,
  PlusCircle, Stethoscope, Briefcase, Zap,
  AlertTriangle, Pill, Download, FileDown,
  Heart, TrendingUp, AlertCircle, CheckCircle, Star,
  Phone, MapPin, Mail, Video
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

  const handleLogout = () => {
    logout();
    navigate('/login');
  };


  const navItems = [
    { name: 'Dashboard', icon: Users, path: '/doctor' },
    { name: 'Appointments', icon: Calendar, path: '/doctor/appointments' },
    { name: 'Telemedicine Sessions', icon: Video, path: '/doctor/telemedicine' },
    { name: 'Digital Prescriptions', icon: Pill, path: '/doctor/prescriptions' },
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
               <button
                  onClick={() => navigate('/doctor/chats', { state: { openSchedule: true } })}
                  className="btn-gold h-16 !px-8 text-sm"
               >
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

            {/* Patient Overview Section */}
            <div className="clinical-card p-10">
               <div className="flex justify-between items-center mb-8">
                  <div>
                     <h3 className="text-2xl font-black tracking-tighter">My Patients</h3>
                     <p className="text-sm text-slate-500 font-bold mt-1">Your assigned patients and their current health status</p>
                  </div>
                  <div className="flex gap-2">
                     <button
                        onClick={() => navigate('/doctor/patients')}
                        className="px-4 py-2 bg-slate-100 rounded-xl text-xs font-bold hover:bg-slate-200 transition-all"
                     >
                        <Users size={16} className="inline mr-2" />All Patients
                     </button>
                     <button
                        onClick={() => navigate('/doctor/patients', { state: { openAddPatient: true } })}
                        className="px-4 py-2 bg-[#8D153A] rounded-xl text-xs font-bold text-white hover:opacity-90 transition-all"
                     >
                        <PlusCircle size={16} className="inline mr-2" />Add Patient
                     </button>
                  </div>
               </div>

               {/* Patient Search and Filter */}
               <div className="flex flex-col md:flex-row gap-4 mb-8">
                  <div className="flex-1 relative">
                     <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
                     <input
                        type="text"
                        placeholder="Search your patients..."
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-950 font-bold placeholder-slate-400 focus:outline-none focus:border-[#8D153A] focus:ring-2 focus:ring-[#8D153A]/10"
                     />
                  </div>
                  <div className="flex gap-2">
                     <button className="px-4 py-3 bg-slate-100 rounded-xl text-xs font-black text-slate-600 hover:bg-slate-200 transition-all">
                        All (12)
                     </button>
                     <button className="px-4 py-3 bg-emerald-100 rounded-xl text-xs font-black text-emerald-600 hover:bg-emerald-200 transition-all">
                        Active (8)
                     </button>
                     <button className="px-4 py-3 bg-orange-100 rounded-xl text-xs font-black text-orange-600 hover:bg-orange-200 transition-all">
                        High Risk (2)
                     </button>
                  </div>
               </div>

               {/* Patient Cards with Photos */}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                     {
                        id: 1,
                        name: 'Aruni Wijesinghe',
                        age: 34,
                        gender: 'Female',
                        bloodType: 'O+',
                        condition: 'Hypertension, Type 2 Diabetes',
                        status: 'active',
                        riskLevel: 'medium',
                        lastVisit: '2024-04-18',
                        nextAppointment: '2024-04-21',
                        bloodPressure: '140/90',
                        glucose: '145 mg/dL',
                        medications: 3,
                        photo: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
                     },
                     {
                        id: 2,
                        name: 'Kasun Perera',
                        age: 45,
                        gender: 'Male',
                        bloodType: 'A+',
                        condition: 'Post-Surgery Recovery, CAD',
                        status: 'active',
                        riskLevel: 'high',
                        lastVisit: '2024-04-15',
                        nextAppointment: '2024-04-21',
                        bloodPressure: '130/85',
                        glucose: '95 mg/dL',
                        medications: 4,
                        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
                     },
                     {
                        id: 3,
                        name: 'Imara Jaffar',
                        age: 28,
                        gender: 'Female',
                        bloodType: 'B+',
                        condition: 'Diabetes Type 1, PCOS',
                        status: 'active',
                        riskLevel: 'medium',
                        lastVisit: '2024-04-10',
                        nextAppointment: '2024-04-21',
                        bloodPressure: '120/80',
                        glucose: '165 mg/dL',
                        medications: 3,
                        photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
                     },
                     {
                        id: 4,
                        name: 'Nimal Fernando',
                        age: 52,
                        gender: 'Male',
                        bloodType: 'AB+',
                        condition: 'COPD, Hypertension',
                        status: 'active',
                        riskLevel: 'high',
                        lastVisit: '2024-04-12',
                        nextAppointment: '2024-04-22',
                        bloodPressure: '150/95',
                        glucose: '110 mg/dL',
                        medications: 5,
                        photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
                     },
                     {
                        id: 5,
                        name: 'Samanthi Perera',
                        age: 41,
                        gender: 'Female',
                        bloodType: 'A-',
                        condition: 'Asthma, Allergies',
                        status: 'active',
                        riskLevel: 'low',
                        lastVisit: '2024-04-16',
                        nextAppointment: '2024-04-23',
                        bloodPressure: '125/82',
                        glucose: '92 mg/dL',
                        medications: 2,
                        photo: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&h=150&fit=crop&crop=face'
                     },
                     {
                        id: 6,
                        name: 'Roshan Silva',
                        age: 38,
                        gender: 'Male',
                        bloodType: 'O-',
                        condition: 'Diabetes Type 2',
                        status: 'inactive',
                        riskLevel: 'medium',
                        lastVisit: '2024-03-28',
                        nextAppointment: '2024-04-25',
                        bloodPressure: '135/88',
                        glucose: '180 mg/dL',
                        medications: 2,
                        photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face'
                     }
                  ].map((patient) => (
                     <div key={patient.id} className="group bg-white p-6 rounded-2xl border border-slate-100 hover:border-[#FFBE29]/40 hover:shadow-lg transition-all cursor-pointer">
                        <div className="flex items-start gap-4 mb-4">
                           <div className="relative">
                              <img 
                                 src={patient.photo} 
                                 alt={patient.name}
                                 className="w-16 h-16 rounded-2xl object-cover shadow-lg"
                              />
                              <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${
                                 patient.riskLevel === 'high' ? 'bg-red-500' : 
                                 patient.riskLevel === 'medium' ? 'bg-orange-500' : 'bg-green-500'
                              }`}></div>
                           </div>
                           <div className="flex-1 min-w-0">
                              <h4 className="font-black text-slate-950 text-lg truncate">{patient.name}</h4>
                              <div className="flex items-center gap-2 mt-1">
                                 <span className="text-xs text-slate-600">{patient.age}y, {patient.gender}</span>
                                 <span className="text-xs text-slate-400">•</span>
                                 <span className="text-xs text-blue-600 font-bold">{patient.bloodType}</span>
                              </div>
                           </div>
                           <div className={`px-2 py-1 rounded-full text-xs font-black uppercase tracking-widest ${
                              patient.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'
                           }`}>
                              {patient.status}
                           </div>
                        </div>

                        <div className="space-y-3">
                           <div>
                              <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Condition</p>
                              <p className="text-sm font-black text-slate-950 line-clamp-2">{patient.condition}</p>
                           </div>

                           <div className="grid grid-cols-2 gap-2">
                              <div className="bg-slate-50 p-2 rounded-lg">
                                 <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">BP</p>
                                 <p className="text-sm font-black text-slate-950">{patient.bloodPressure}</p>
                              </div>
                              <div className="bg-slate-50 p-2 rounded-lg">
                                 <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Glucose</p>
                                 <p className="text-sm font-black text-slate-950">{patient.glucose}</p>
                              </div>
                           </div>

                           <div className="flex items-center justify-between text-xs">
                              <div className="flex items-center gap-1">
                                 <Calendar size={12} className="text-slate-400" />
                                 <span className="text-slate-600">Next: {patient.nextAppointment}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                 <Pill size={12} className="text-slate-400" />
                                 <span className="text-slate-600">{patient.medications} meds</span>
                              </div>
                           </div>
                        </div>

                        <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
                           <button 
                              onClick={() => {
                                 setSelectedPatient(patient);
                              }}
                              className="flex-1 px-3 py-2 bg-gradient-to-r from-[#8D153A] to-[#C9204A] text-white rounded-lg text-xs font-black hover:from-[#C9204A] hover:to-[#8D153A] transition-all transform hover:scale-105 shadow-lg"
                           >
                              <span className="flex items-center justify-center gap-2">
                                 <FileText size={14} />
                                 Medical Profile
                              </span>
                           </button>
                           <button 
                              onClick={() => {
                                 // Open quick vitals view
                                 alert(`Quick vitals for ${patient.name}:\n\nBlood Pressure: ${patient.bloodPressure}\nGlucose: ${patient.glucose}\nMedications: ${patient.medications}\n\nNext appointment: ${patient.nextAppointment}`);
                              }}
                              className="px-3 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg text-xs font-black hover:from-emerald-600 hover:to-teal-700 transition-all transform hover:scale-105 shadow-lg"
                           >
                              <span className="flex items-center justify-center gap-2">
                                 <Heart size={14} />
                                 Quick Vitals
                              </span>
                           </button>
                        </div>
                     </div>
                  ))}
               </div>

               {/* Enhanced Patient Details Modal */}
               {selectedPatient && (
                  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                     <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl transform transition-all">
                        {/* Modal Header with Gradient */}
                        <div className="bg-gradient-to-r from-[#8D153A] via-[#C9204A] to-[#E5AB22] p-8 text-white relative">
                           <div className="absolute top-4 right-4">
                              <button 
                                 onClick={() => setSelectedPatient(null)}
                                 className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-all backdrop-blur-sm"
                              >
                                 <X size={20} />
                              </button>
                           </div>
                           
                           <div className="flex items-center gap-6">
                              <div className="relative">
                                 <img 
                                    src={selectedPatient.photo} 
                                    alt={selectedPatient.name}
                                    className="w-24 h-24 rounded-3xl object-cover border-4 border-white/30 shadow-2xl"
                                 />
                                 <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full border-3 border-white shadow-lg ${
                                    selectedPatient.riskLevel === 'high' ? 'bg-red-500' : 
                                    selectedPatient.riskLevel === 'medium' ? 'bg-orange-500' : 'bg-green-500'
                                 }`}></div>
                              </div>
                              <div className="flex-1">
                                 <h2 className="text-3xl font-black mb-2">{selectedPatient.name}</h2>
                                 <div className="flex items-center gap-4 text-white/90">
                                    <span className="flex items-center gap-2">
                                       <Calendar size={16} />
                                       {selectedPatient.age} years, {selectedPatient.gender}
                                    </span>
                                    <span className="flex items-center gap-2">
                                       <Activity size={16} />
                                       {selectedPatient.bloodType}
                                    </span>
                                    <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest ${
                                       selectedPatient.status === 'active' ? 'bg-emerald-500/30 text-white' : 'bg-slate-500/30 text-white'
                                    }`}>
                                       {selectedPatient.status}
                                    </span>
                                 </div>
                              </div>
                           </div>
                        </div>

                        {/* Modal Content */}
                        <div className="p-8 overflow-y-auto max-h-[60vh]">
                           {/* Quick Stats Grid */}
                           <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-2xl border border-blue-200">
                                 <div className="flex items-center gap-2 mb-2">
                                    <Heart className="text-blue-600" size={18} />
                                    <span className="text-xs font-black text-blue-600 uppercase tracking-widest">Blood Pressure</span>
                                 </div>
                                 <p className="text-2xl font-black text-blue-900">{selectedPatient.bloodPressure}</p>
                              </div>
                              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-2xl border border-purple-200">
                                 <div className="flex items-center gap-2 mb-2">
                                    <Activity className="text-purple-600" size={18} />
                                    <span className="text-xs font-black text-purple-600 uppercase tracking-widest">Glucose</span>
                                 </div>
                                 <p className="text-2xl font-black text-purple-900">{selectedPatient.glucose}</p>
                              </div>
                              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-2xl border border-green-200">
                                 <div className="flex items-center gap-2 mb-2">
                                    <Pill className="text-green-600" size={18} />
                                    <span className="text-xs font-black text-green-600 uppercase tracking-widest">Medications</span>
                                 </div>
                                 <p className="text-2xl font-black text-green-900">{selectedPatient.medications}</p>
                              </div>
                              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-2xl border border-orange-200">
                                 <div className="flex items-center gap-2 mb-2">
                                    <AlertTriangle className="text-orange-600" size={18} />
                                    <span className="text-xs font-black text-orange-600 uppercase tracking-widest">Risk Level</span>
                                 </div>
                                 <p className="text-2xl font-black text-orange-900 capitalize">{selectedPatient.riskLevel}</p>
                              </div>
                           </div>

                           {/* Medical Information */}
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                              <div>
                                 <h3 className="text-xl font-black text-slate-950 mb-4 flex items-center gap-3">
                                    <div className="w-8 h-8 bg-[#8D153A]/10 rounded-xl flex items-center justify-center">
                                       <FileText className="text-[#8D153A]" size={16} />
                                    </div>
                                    Medical Conditions
                                 </h3>
                                 <div className="bg-slate-50 p-6 rounded-2xl">
                                    <p className="font-black text-slate-950 mb-3">Primary Conditions:</p>
                                    <p className="text-slate-700 font-medium mb-4">{selectedPatient.condition}</p>
                                    <div className="flex flex-wrap gap-2">
                                       {selectedPatient.condition.split(',').map((condition, idx) => (
                                          <span key={idx} className="px-3 py-1 bg-[#8D153A]/10 text-[#8D153A] rounded-lg text-xs font-black">
                                             {condition.trim()}
                                          </span>
                                       ))}
                                    </div>
                                 </div>
                              </div>

                              <div>
                                 <h3 className="text-xl font-black text-slate-950 mb-4 flex items-center gap-3">
                                    <div className="w-8 h-8 bg-emerald-100 rounded-xl flex items-center justify-center">
                                       <Calendar className="text-emerald-600" size={16} />
                                    </div>
                                    Visit Schedule
                                 </h3>
                                 <div className="bg-slate-50 p-6 rounded-2xl space-y-4">
                                    <div className="flex justify-between items-center">
                                       <span className="text-sm text-slate-600 font-medium">Last Visit:</span>
                                       <span className="font-black text-slate-950">{selectedPatient.lastVisit}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                       <span className="text-sm text-slate-600 font-medium">Next Appointment:</span>
                                       <span className="font-black text-emerald-600">{selectedPatient.nextAppointment}</span>
                                    </div>
                                    <div className="w-full bg-slate-200 rounded-full h-2 mt-4">
                                       <div className="bg-gradient-to-r from-[#8D153A] to-[#E5AB22] h-2 rounded-full" style={{width: '65%'}}></div>
                                    </div>
                                    <p className="text-xs text-slate-500 text-center">Treatment Progress: 65%</p>
                                 </div>
                              </div>
                           </div>

                           {/* Action Buttons */}
                           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              <button className="group p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-2xl font-black hover:from-blue-600 hover:to-blue-700 transition-all transform hover:scale-105 shadow-lg">
                                 <div className="flex flex-col items-center gap-2">
                                    <FileText size={20} />
                                    <span className="text-xs">Full History</span>
                                 </div>
                              </button>
                              <button className="group p-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-2xl font-black hover:from-purple-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg">
                                 <div className="flex flex-col items-center gap-2">
                                    <Pill size={20} />
                                    <span className="text-xs">Medications</span>
                                 </div>
                              </button>
                              <button className="group p-4 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-2xl font-black hover:from-emerald-600 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-lg">
                                 <div className="flex flex-col items-center gap-2">
                                    <Activity size={20} />
                                    <span className="text-xs">Vitals Trend</span>
                                 </div>
                              </button>
                              <button className="group p-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-2xl font-black hover:from-orange-600 hover:to-orange-700 transition-all transform hover:scale-105 shadow-lg">
                                 <div className="flex flex-col items-center gap-2">
                                    <AlertTriangle size={20} />
                                    <span className="text-xs">Risk Analysis</span>
                                 </div>
                              </button>
                           </div>
                        </div>
                     </div>
                  </div>
               )}
            </div>

         </div>

            </main>
    </div>
  );
}
