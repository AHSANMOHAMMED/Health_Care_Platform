import { useState, useEffect, useCallback } from 'react';
import {
  Users, Stethoscope, Calendar, Activity, TrendingUp, TrendingDown,
  Settings, LogOut, Search, ShieldCheck, Menu, Loader2,
  UserPlus, Trash2, Bell, Command, Crown, ChevronDown, X, Edit2,
  Shield, FileText, Lock, UserCog, HeartPulse, Zap,
  Activity as ActivityIcon, CheckCircle2, Sparkles, Filter,
  CheckCircle, XCircle, Clock, User, Mail, Phone, MapPin, Award,
  FileCheck, AlertCircle, Eye
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { Link, useNavigate } from 'react-router-dom';
import { appointmentService } from '../api/services';
import { authService } from '../utils/auth';

const TABS = [
  { id: 'stats', label: 'Analytics', icon: Activity },
  { id: 'approvals', label: 'Doctor Approvals', icon: ShieldCheck },
  { id: 'users', label: 'User Management', icon: Users },
  { id: 'verifications', label: 'Doctor Verification', icon: FileCheck },
  { id: 'doctors', label: 'Doctors', icon: Stethoscope },
  { id: 'appointments', label: 'All Appointments', icon: Calendar },
  { id: 'settings', label: 'System Settings', icon: Settings },
];

const STATS = [
  { label: 'Total Users', val: '12.4k', trend: '+18.2%', trendUp: true, icon: Users },
  { label: 'Active Doctors', val: '450', trend: '+12.7%', trendUp: true, icon: Stethoscope },
  { label: 'Appointments', val: '1.2k', trend: '+15.3%', trendUp: true, icon: Calendar },
  { label: 'System Load', val: '12%', trend: 'Healthy', trendUp: true, icon: Activity },
];

const SERVICES = [
  { name: 'Auth Service', desc: 'Handles user authentication & authorization', icon: Lock, status: 'Operational' },
  { name: 'Patient Service', desc: 'Manages patient information & records', icon: UserCog, status: 'Operational' },
  { name: 'Doctor Service', desc: 'Handles doctor profiles & availability', icon: HeartPulse, status: 'Operational' },
  { name: 'AI Analysis Node', desc: 'AI-powered health analysis & insights', icon: Zap, status: 'Operational' },
];

const LOGS = [
  { type: 'OK', time: '14:32:01', message: 'Backup completed successfully', color: 'text-emerald-600', bgColor: 'bg-emerald-500' },
  { type: 'INFO', time: '14:28:15', message: 'New doctor registered: Dr. Wickramasinghe', color: 'text-blue-600', bgColor: 'bg-blue-500' },
  { type: 'WARN', time: '14:15:33', message: 'High latency in AI Node (Asia-South)', color: 'text-amber-600', bgColor: 'bg-amber-500' },
  { type: 'OK', time: '13:45:00', message: 'Cache synchronized across clusters', color: 'text-emerald-600', bgColor: 'bg-emerald-500' },
];

const SYSTEM_METRICS = [
  { label: 'Normal', value: 28, color: 'text-slate-600', stroke: 'stroke-slate-400' },
  { label: 'Good', value: 62, color: 'text-blue-600', stroke: 'stroke-blue-400' },
  { label: 'Good', value: 41, color: 'text-emerald-600', stroke: 'stroke-emerald-400' },
  { label: 'Excellent', value: 18, suffix: 'ms', color: 'text-amber-600', stroke: 'stroke-amber-400' },
];

function CircularProgress({ value, color, stroke, suffix = '%' }: { value: number; color: string; stroke: string; suffix?: string }) {
  const radius = 28;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative w-20 h-20 flex items-center justify-center shrink-0">
      <svg className="transform -rotate-90 w-20 h-20" viewBox="0 0 64 64">
        <circle cx="32" cy="32" r={radius} stroke="currentColor" strokeWidth="5" fill="transparent" className="text-slate-200/50" />
        <circle cx="32" cy="32" r={radius} stroke="currentColor" strokeWidth="5" fill="transparent" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" className={stroke} />
      </svg>
      <span className={`absolute text-base font-bold ${color}`}>{value}{suffix}</span>
    </div>
  );
}

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('stats');
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const [users, setUsers] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // CRUD State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'PATIENT',
    status: 'Active'
  });

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const apptRes = await appointmentService.getAll({});
      setAppointments(apptRes.data || []);
      
      const allUsers = await authService.getAllUsers();
      setUsers(allUsers);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleStatusUpdate = async (id: number, status: 'APPROVED' | 'REJECTED') => {
    try {
      await authService.updateUserStatus(id, status);
      loadData();
    } catch (e) {
      alert('Failed to update status');
    }
  };

  useEffect(() => { loadData(); }, [loadData]);

  const handleLogout = () => { logout(); navigate('/login'); };

  // CRUD Functions
  const openCreateModal = () => {
    setModalMode('create');
    setFormData({ name: '', email: '', role: 'PATIENT', status: 'Active' });
    setIsModalOpen(true);
  };

  const openEditModal = (user: any) => {
    setModalMode('edit');
    setSelectedUser(user);
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (modalMode === 'create') {
      const newUser = {
        id: Math.max(...users.map(u => u.id), 0) + 1,
        ...formData
      };
      setUsers([...users, newUser]);
    } else {
      setUsers(users.map(u => u.id === selectedUser.id ? { ...u, ...formData } : u));
    }
    closeModal();
  };

  const handleDeleteUser = (id: number) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // Pending Doctor Verifications State
  const [pendingDoctors, setPendingDoctors] = useState<any[]>([
    { id: 101, name: 'Dr. Nimal Fernando', email: 'nimal.fernando@email.com', phone: '+94 77 123 4567', specialization: 'Cardiology', licenseNumber: 'SLMC-45678', submittedDate: '2024-01-15', status: 'pending', documents: ['Medical License', 'Degree Certificate', 'NIC'] },
    { id: 102, name: 'Dr. Priya Rajapakse', email: 'priya.r@email.com', phone: '+94 76 987 6543', specialization: 'Pediatrics', licenseNumber: 'SLMC-56789', submittedDate: '2024-01-14', status: 'pending', documents: ['Medical License', 'Degree Certificate'] },
    { id: 103, name: 'Dr. Ahmed Hassan', email: 'ahmed.h@email.com', phone: '+94 71 456 7890', specialization: 'Dermatology', licenseNumber: 'SLMC-67890', submittedDate: '2024-01-13', status: 'pending', documents: ['Medical License', 'Degree Certificate', 'Experience Letter'] },
  ]);

  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);

  // Doctor Verification Functions
  const handleApproveDoctor = (doctorId: number) => {
    const doctor = pendingDoctors.find(d => d.id === doctorId);
    if (doctor && window.confirm(`Are you sure you want to approve ${doctor.name}?`)) {
      // Add to users list
      const newUser = {
        id: Math.max(...users.map(u => u.id), 0) + 1,
        name: doctor.name,
        email: doctor.email,
        role: 'DOCTOR',
        status: 'Active',
        specialization: doctor.specialization,
        licenseNumber: doctor.licenseNumber
      };
      setUsers([...users, newUser]);
      // Remove from pending
      setPendingDoctors(pendingDoctors.filter(d => d.id !== doctorId));
      alert(`${doctor.name} has been approved and added as a doctor.`);
    }
  };

  const handleRejectDoctor = (doctorId: number) => {
    const doctor = pendingDoctors.find(d => d.id === doctorId);
    const reason = prompt(`Enter rejection reason for ${doctor?.name}:`);
    if (reason) {
      setPendingDoctors(pendingDoctors.filter(d => d.id !== doctorId));
      alert(`${doctor?.name} has been rejected. Reason: ${reason}`);
    }
  };

  const openDoctorDetails = (doctor: any) => {
    setSelectedDoctor(doctor);
    setIsDoctorModalOpen(true);
  };

  const closeDoctorModal = () => {
    setIsDoctorModalOpen(false);
    setSelectedDoctor(null);
  };

  // Toggle user status (Activate/Deactivate)
  const handleToggleUserStatus = (userId: number) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      const newStatus = user.status === 'Active' ? 'Inactive' : 'Active';
      if (window.confirm(`Are you sure you want to ${newStatus === 'Active' ? 'activate' : 'deactivate'} ${user.name}?`)) {
        setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus } : u));
      }
    }
  };

  // Profile Management State
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [adminProfile, setAdminProfile] = useState({
    name: 'Admin User',
    email: 'admin@mediconnect.lk',
    phone: '+94 77 123 4567',
    role: 'Super Admin',
    department: 'System Administration',
    joinDate: '2023-01-01'
  });

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
      <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50/30 to-indigo-100/40 flex font-sans text-slate-600">
      {/* Premium Glass Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-72 bg-gradient-to-b from-white/80 via-white/70 to-blue-50/60 backdrop-blur-2xl border-r border-white/60 shadow-2xl shadow-slate-300/40 transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col">
          {/* Premium Logo */}
          <div className="p-8">
            <Link to="/" className="flex items-center gap-4 group">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-600 via-blue-700 to-slate-800 flex items-center justify-center shadow-lg shadow-indigo-300/50 group-hover:shadow-indigo-300/70 transition-all duration-300">
                <ShieldCheck size={24} className="text-white" />
              </div>
              <div>
                <p className="text-lg font-bold bg-gradient-to-r from-slate-800 to-indigo-700 bg-clip-text text-transparent leading-none tracking-tight">MediConnect</p>
                <p className="text-base text-indigo-500/80 uppercase tracking-[0.2em] font-medium mt-1">Control Center</p>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-5 py-4 space-y-2">
            {TABS.map(t => {
              const isActive = activeTab === t.id;
              return (
                <button 
                  key={t.id} 
                  onClick={() => { setActiveTab(t.id); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-lg font-medium transition-all duration-300 ${
                    isActive 
                      ? 'bg-white shadow-lg shadow-slate-200/60 text-slate-800 border border-white/60' 
                      : 'text-slate-500 hover:bg-white/50 hover:text-slate-700'
                  }`}
                >
                  <t.icon size={20} className={isActive ? 'text-slate-700' : 'text-slate-400'} /> 
                  <span className="tracking-wide">{t.label}</span>
                  {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-slate-700" />}
                </button>
              );
            })}
          </nav>

          {/* Premium Upgrade Card */}
          <div className="p-6">
            <div className="relative overflow-hidden bg-gradient-to-br from-amber-100/90 via-orange-50/80 to-amber-50/70 backdrop-blur-xl rounded-3xl p-6 border border-amber-200/60 shadow-xl shadow-amber-200/30">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br from-amber-300/40 via-orange-300/30 to-transparent rounded-full blur-3xl" />
              <div className="absolute -bottom-5 -left-5 w-24 h-24 bg-gradient-to-tr from-orange-300/30 to-transparent rounded-full blur-2xl" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-orange-400 to-amber-500 flex items-center justify-center shadow-lg shadow-amber-300/50">
                    <Crown size={18} className="text-white" />
                  </div>
                  <span className="text-lg font-bold bg-gradient-to-r from-amber-700 to-orange-600 bg-clip-text text-transparent">Upgrade to Pro</span>
                </div>
                <p className="text-base text-amber-700/70 mb-4 leading-relaxed">Unlock advanced features and premium customization options.</p>
                <button className="w-full py-3 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white text-base font-bold rounded-xl shadow-lg shadow-amber-400/40 hover:shadow-amber-400/60 hover:scale-[1.02] transition-all duration-300">
                  <Sparkles size={18} className="inline mr-2" /> Upgrade Now
                </button>
              </div>
            </div>
          </div>

          {/* Sign Out */}
          <div className="p-6 pt-0">
            <button onClick={handleLogout} className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-lg font-medium text-slate-500 hover:bg-white/60 hover:text-red-500 transition-all duration-300">
              <LogOut size={20} /> <span className="tracking-wide">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-72 flex flex-col min-h-screen">
        {/* Premium Glass Header */}
        <header className="h-20 bg-gradient-to-r from-white/70 via-blue-50/40 to-indigo-50/50 backdrop-blur-2xl border-b border-white/70 flex items-center justify-between px-8 sticky top-0 z-30 shadow-sm shadow-slate-200/30">
          <div className="flex items-center gap-6 flex-1">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-3 text-slate-400 hover:bg-white/50 rounded-xl transition-colors">
              <Menu size={22} />
            </button>
            {/* Glass Search */}
            <div className="relative max-w-lg flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="w-full pl-12 pr-14 py-3.5 bg-white/70 backdrop-blur border border-white/80 rounded-2xl text-lg text-slate-600 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200/50 shadow-sm shadow-slate-200/30"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-base text-slate-400 font-medium bg-slate-100/80 px-2 py-1 rounded-lg border border-white/60">Ctrl K</span>
            </div>
          </div>

          <div className="flex items-center gap-5">
            {/* Premium Notifications */}
            <button className="relative p-3 text-slate-500 hover:bg-gradient-to-br hover:from-amber-100/60 hover:to-orange-100/40 rounded-2xl transition-all duration-300 border border-white/60 shadow-sm shadow-slate-200/20 hover:border-amber-200/50 hover:shadow-amber-200/30 group">
              <Bell size={20} className="group-hover:text-amber-600 transition-colors" />
              <span className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-rose-500 to-red-600 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-md shadow-rose-300/50 animate-pulse">3</span>
            </button>
            {/* Premium Theme Toggle */}
            <button className="p-3 text-slate-500 hover:bg-gradient-to-br hover:from-indigo-100/60 hover:to-blue-100/40 rounded-2xl transition-all duration-300 border border-white/60 shadow-sm shadow-slate-200/20 hover:border-indigo-200/50 hover:shadow-indigo-200/30 group">
              <Command size={20} className="group-hover:text-indigo-600 transition-colors" />
            </button>
            {/* Glass User Profile */}
            <button 
              onClick={() => setIsProfileModalOpen(true)}
              className="flex items-center gap-4 pl-5 border-l border-slate-200/50 hover:bg-white/40 rounded-2xl p-2 -ml-2 transition-all cursor-pointer"
            >
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center text-white font-semibold text-sm shadow-lg shadow-slate-300/50">
                AD
              </div>
              <div className="hidden md:block text-left">
                <p className="text-lg font-semibold text-slate-800">{adminProfile.name}</p>
                <p className="text-base text-slate-400">{adminProfile.role}</p>
              </div>
              <ChevronDown size={18} className="text-slate-400" />
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="flex-1 p-8">
          {activeTab === 'stats' && (
            <div className="space-y-8 max-w-7xl mx-auto">
              {/* Premium Welcome Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-5xl font-light bg-gradient-to-r from-slate-800 via-indigo-800 to-slate-800 bg-clip-text text-transparent flex items-center gap-4">
                    Welcome back, <span className="font-semibold">{adminProfile.name.split(' ')[0]}</span>
                    <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-amber-300 via-orange-300 to-amber-400 text-3xl shadow-lg shadow-amber-300/40">👋</span>
                  </h1>
                  <p className="text-lg text-slate-500 mt-4 font-light tracking-wide">Here's what's happening with your healthcare platform today.</p>
                </div>
                <div className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-emerald-500/20 via-emerald-400/20 to-teal-400/20 backdrop-blur-xl border border-emerald-300/50 text-emerald-700 rounded-full text-base font-bold shadow-lg shadow-emerald-200/40">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 animate-pulse shadow-lg shadow-emerald-400/50"></div>
                  🟢 System Live
                </div>
              </div>

              {/* Premium Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {STATS.map((s, i) => {
                  const colors = [
                    { bg: 'from-indigo-500/20 via-purple-400/15 to-blue-300/10', icon: 'from-indigo-500 to-purple-500', text: 'text-indigo-600', border: 'border-indigo-200/40', glow: 'shadow-indigo-300/30' },
                    { bg: 'from-emerald-500/20 via-teal-400/15 to-green-300/10', icon: 'from-emerald-500 to-teal-500', text: 'text-emerald-600', border: 'border-emerald-200/40', glow: 'shadow-emerald-300/30' },
                    { bg: 'from-amber-500/20 via-orange-400/15 to-yellow-300/10', icon: 'from-amber-500 to-orange-500', text: 'text-amber-600', border: 'border-amber-200/40', glow: 'shadow-amber-300/30' },
                    { bg: 'from-rose-500/20 via-pink-400/15 to-red-300/10', icon: 'from-rose-500 to-pink-500', text: 'text-rose-600', border: 'border-rose-200/40', glow: 'shadow-rose-300/30' },
                  ];
                  const c = colors[i];
                  return (
                    <div key={i} className="relative group cursor-pointer">
                      <div className={`absolute inset-0 bg-gradient-to-br ${c.bg} backdrop-blur-2xl rounded-3xl border border-white/70 shadow-xl ${c.glow} group-hover:scale-[1.02] transition-transform duration-300`} />
                      <div className="relative p-7 rounded-3xl overflow-hidden">
                        <div className={`absolute -top-10 -right-10 w-32 h-32 bg-gradient-to-br ${c.bg} rounded-full blur-3xl opacity-80 group-hover:opacity-100 transition-opacity`} />
                        <div className="relative">
                          <div className="flex items-start justify-between mb-5">
                            <div>
                              <p className="text-base font-bold text-slate-500 uppercase tracking-[0.15em]">{s.label}</p>
                              <p className={`text-5xl font-bold ${c.text} mt-3 tracking-tight bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text`}>{s.val}</p>
                            </div>
                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${c.icon} backdrop-blur flex items-center justify-center shadow-lg ${c.glow} border ${c.border}`}>
                              <s.icon size={26} className="text-white" />
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className={`flex items-center gap-1.5 px-4 py-2 rounded-xl ${s.trendUp ? 'bg-gradient-to-r from-emerald-500/20 to-teal-400/20 text-emerald-700 border border-emerald-300/50' : 'bg-gradient-to-r from-rose-500/20 to-pink-400/20 text-rose-700 border border-rose-300/50'} backdrop-blur shadow-sm`}>
                              {s.trendUp ? <TrendingUp size={18} className="text-emerald-600" /> : <TrendingDown size={18} className="text-rose-600" />}
                              <span className="text-base font-bold">{s.trend}</span>
                            </div>
                            <span className="text-base text-slate-400 font-medium">vs last month</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Glass Grid - Service Status & Logs */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Glass Service Status */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-white/30 backdrop-blur-xl rounded-3xl border border-white/70 shadow-xl shadow-slate-200/20" />
                  <div className="relative p-6 rounded-3xl">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-100 to-white border border-slate-200/50 flex items-center justify-center shadow-sm">
                          <Shield size={18} className="text-slate-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-700">Service Status</h3>
                      </div>
                      <div className="flex items-center gap-2 text-base bg-emerald-50/80 backdrop-blur px-5 py-2.5 rounded-full border border-emerald-200/50">
                        <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                        <span className="text-emerald-600 font-medium">All Systems Operational</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {SERVICES.map((s, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-white/40 backdrop-blur-sm rounded-2xl border border-white/60 hover:bg-white/60 transition-all duration-300 cursor-pointer group">
                          <div className="flex items-center gap-4">
                            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-white to-slate-50 border border-slate-200/50 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                              <s.icon size={18} className="text-slate-500" />
                            </div>
                            <div>
                              <p className="text-lg font-medium text-slate-700">{s.name}</p>
                              <p className="text-base text-slate-400">{s.desc}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="px-5 py-2.5 bg-emerald-50/80 backdrop-blur text-emerald-600 text-base font-medium rounded-full border border-emerald-200/50">{s.status}</span>
                            <ChevronDown size={20} className="text-slate-300 -rotate-90" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Glass System Logs */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-white/30 backdrop-blur-xl rounded-3xl border border-white/70 shadow-xl shadow-slate-200/20" />
                  <div className="relative p-6 rounded-3xl">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-100 to-white border border-slate-200/50 flex items-center justify-center shadow-sm">
                          <FileText size={18} className="text-slate-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-700">Recent System Logs</h3>
                      </div>
                      <button className="text-base text-slate-500 font-medium hover:text-slate-700 transition-colors">View All Logs</button>
                    </div>
                    <div className="space-y-2">
                      {LOGS.map((log, i) => (
                        <div key={i} className="flex items-start gap-4 p-4 bg-white/40 backdrop-blur-sm rounded-2xl border border-white/60 hover:bg-white/60 transition-all duration-300">
                          <div className={`w-2 h-2 rounded-full ${log.bgColor} mt-2 shrink-0`}></div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-3 mb-1">
                              <span className={`text-base font-bold ${log.color}`}>[{log.type}]</span>
                              <span className="text-base text-slate-400 font-mono">{log.time}</span>
                            </div>
                            <p className="text-lg text-slate-600 truncate">{log.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Glass System Banner & Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Glass Status Banner */}
                <div className="lg:col-span-2 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/90 to-teal-500/90 backdrop-blur-xl rounded-3xl" />
                  <div className="relative p-6 rounded-3xl flex items-center justify-between">
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center border border-white/30">
                        <CheckCircle2 size={26} className="text-white" />
                      </div>
                      <div>
                        <p className="text-white font-medium text-2xl">All systems are running smoothly</p>
                        <p className="text-emerald-100/80 text-base mt-2">Last checked: 14:32:45</p>
                      </div>
                    </div>
                    <div className="flex items-end gap-1.5 h-10">
                      {[40, 60, 30, 70, 50, 80, 40, 60, 45, 75].map((h, i) => (
                        <div key={i} className="w-1.5 bg-white/30 rounded-full backdrop-blur" style={{ height: `${h}%`, opacity: 0.3 + (h/100) * 0.7 }}></div>
                      ))}
                    </div>
                    <div className="w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-lg">
                      <CheckCircle2 size={22} className="text-emerald-500" />
                    </div>
                  </div>
                </div>

                {/* Glass System Overview - Redesigned */}
                <div className="relative group">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-white/30 backdrop-blur-xl rounded-3xl border border-white/70 shadow-xl shadow-slate-200/20" />
                  <div className="relative p-6 rounded-3xl">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-100 to-white border border-slate-200/50 flex items-center justify-center shadow-sm">
                          <ActivityIcon size={22} className="text-slate-600" />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-slate-700">System Overview</h3>
                          <p className="text-sm text-slate-400">Real-time performance metrics</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm bg-emerald-50/80 backdrop-blur px-3 py-1.5 rounded-full border border-emerald-200/50">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        <span className="text-emerald-600 font-medium">Live</span>
                      </div>
                    </div>

                    {/* Metrics Grid - 2x2 Layout */}
                    <div className="grid grid-cols-2 gap-4">
                      {SYSTEM_METRICS.map((m, i) => (
                        <div key={i} className="relative p-4 bg-white/40 backdrop-blur-sm rounded-2xl border border-white/60 hover:bg-white/60 transition-all duration-300">
                          <div className="flex items-center gap-4">
                            <CircularProgress value={m.value} color={m.color} stroke={m.stroke} suffix={m.suffix} />
                            <div>
                              <p className="text-base font-semibold text-slate-700">{m.label}</p>
                              <p className="text-sm text-slate-400 mt-0.5">
                                {i === 0 && "CPU Usage"}
                                {i === 1 && "Memory Load"}
                                {i === 2 && "Disk Space"}
                                {i === 3 && "Response Time"}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Bottom Stats Bar */}
                    <div className="mt-6 pt-5 border-t border-slate-200/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-slate-400"></div>
                            <span className="text-sm text-slate-500">Normal</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-blue-400"></div>
                            <span className="text-sm text-slate-500">Good</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                            <span className="text-sm text-slate-500">Excellent</span>
                          </div>
                        </div>
                        <button className="flex items-center gap-1 text-sm text-slate-400 hover:text-slate-600 bg-white/50 px-3 py-1.5 rounded-lg border border-white/60 transition-all">
                          View Details <ChevronDown size={14} className="-rotate-90" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Elegant Footer */}
              <footer className="pt-8 border-t border-slate-200/50">
                <div className="flex items-center justify-between text-base text-slate-400">
                  <p className="font-light tracking-wide">© 2024 MediConnect Lanka. All rights reserved.</p>
                  <div className="flex items-center gap-3">
                    <span className="font-medium">v2.0.0</span>
                    <span className="px-4 py-2 bg-amber-100/80 backdrop-blur text-amber-600 rounded-full text-sm font-semibold border border-amber-200/50">Premium</span>
                    <Sparkles size={18} className="text-amber-500" />
                  </div>
                </div>
              </footer>
            </div>
          )}

          {activeTab === 'approvals' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-white mb-4">Pending Doctor Approvals</h2>
              <div className="clinical-card overflow-hidden">
                <table className="clinical-table">
                  <thead>
                    <tr>
                      <th>Doctor Name</th>
                      <th>Email</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.filter(u => u.role === 'DOCTOR' && u.status === 'PENDING').map(u => (
                      <tr key={u.id}>
                        <td className="font-bold text-white">{u.firstName} {u.lastName}</td>
                        <td className="text-slate-400">{u.email}</td>
                        <td><span className="badge-warning">PENDING</span></td>
                        <td className="flex gap-2">
                          <button onClick={() => handleStatusUpdate(u.id, 'APPROVED')} className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-lg text-xs font-bold hover:bg-emerald-500/20 transition-colors">Approve</button>
                          <button onClick={() => handleStatusUpdate(u.id, 'REJECTED')} className="px-3 py-1 bg-red-500/10 text-red-500 rounded-lg text-xs font-bold hover:bg-red-500/20 transition-colors">Reject</button>
                        </td>
                      </tr>
                    ))}
                    {users.filter(u => u.role === 'DOCTOR' && u.status === 'PENDING').length === 0 && (
                      <tr><td colSpan={4} className="text-center py-8 text-slate-500">No pending approvals found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="space-y-8 max-w-7xl mx-auto">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-5xl font-light text-slate-800">User <span className="font-semibold">Management</span></h1>
                  <p className="text-lg text-slate-500 mt-4 font-light tracking-wide">Manage and monitor all platform users</p>
                </div>
                <button onClick={openCreateModal} className="flex items-center gap-3 px-7 py-5 bg-gradient-to-r from-slate-700 to-slate-800 text-white rounded-2xl text-lg font-medium shadow-lg shadow-slate-300/50 hover:shadow-xl transition-all duration-300">
                  <UserPlus size={22} /> Add User
                </button>
              </div>

<<<<<<< HEAD
              <div className="clinical-card overflow-hidden">
                <table className="clinical-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id}>
                        <td className="font-bold text-white">{u.firstName} {u.lastName}</td>
                        <td className="text-slate-400">{u.email}</td>
                        <td><span className="text-xs font-bold text-slate-500">{u.role}</span></td>
                        <td><span className={`badge-${u.status === 'APPROVED' ? 'success' : u.status === 'PENDING' ? 'warning' : 'danger'}`}>{u.status}</span></td>
                        <td className="flex gap-2">
                          <button className="p-2 hover:bg-[#1E3A5F] rounded-lg text-slate-400"><Settings size={14} /></button>
                          <button onClick={() => handleDeleteUser(u.id)} className="p-2 hover:bg-red-500/10 rounded-lg text-red-400"><Trash2 size={14} /></button>
                        </td>
=======
              {/* Glass Users Table */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-white/30 backdrop-blur-xl rounded-3xl border border-white/70 shadow-xl shadow-slate-200/20" />
                <div className="relative rounded-3xl overflow-hidden">
                  {/* Search and Filter Bar */}
                  <div className="p-6 border-b border-slate-100/50 flex items-center gap-4">
                    <div className="relative flex-1 max-w-md">
                      <Search size={22} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Search users by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-5 bg-white/60 backdrop-blur border border-white/80 rounded-xl text-lg text-slate-600 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200/50"
                      />
                    </div>
                    <div className="relative">
                      <Filter size={22} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="pl-12 pr-8 py-5 bg-white/60 backdrop-blur border border-white/80 rounded-xl text-lg text-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-200/50 appearance-none cursor-pointer"
                      >
                        <option value="ALL">All Roles</option>
                        <option value="PATIENT">Patient</option>
                        <option value="DOCTOR">Doctor</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                      <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                    </div>
                    <div className="px-5 py-2.5 bg-slate-100/50 rounded-lg">
                      <span className="text-base text-slate-500">Total: <span className="font-semibold text-slate-700">{filteredUsers.length}</span></span>
                    </div>
                  </div>
                  <table className="w-full">
                    <thead className="bg-slate-50/50">
                      <tr>
                        <th className="px-6 py-5 text-left text-base font-semibold text-slate-500 uppercase tracking-wider">User</th>
                        <th className="px-6 py-5 text-left text-base font-semibold text-slate-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-5 text-left text-base font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                        <th className="px-6 py-5 text-left text-base font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-5 text-right text-base font-semibold text-slate-500 uppercase tracking-wider">Actions</th>
>>>>>>> 0c5931b (feat: admin dashboard updates and routing logic)
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100/50">
                      {filteredUsers.map(u => (
                        <tr key={u.id} className="hover:bg-white/40 transition-colors">
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-4">
                              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-slate-100 to-white border border-slate-200/50 flex items-center justify-center text-slate-600 font-semibold text-lg shadow-sm">
                                {u.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <span className="font-medium text-slate-700 text-lg">{u.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-5 text-lg text-slate-500">{u.email}</td>
                          <td className="px-6 py-5"><span className="px-5 py-2.5 bg-slate-100/80 text-slate-600 text-base font-medium rounded-lg">{u.role}</span></td>
                          <td className="px-6 py-5">
                            <span className={`px-5 py-2.5 text-base font-medium rounded-full border ${u.status === 'Active' ? 'bg-emerald-50/80 text-emerald-600 border-emerald-200/50' : 'bg-slate-100/80 text-slate-500 border-slate-200/50'}`}>
                              {u.status}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button 
                                onClick={() => handleToggleUserStatus(u.id)} 
                                className={`p-4 rounded-xl transition-all ${u.status === 'Active' ? 'hover:bg-amber-50 text-slate-400 hover:text-amber-500' : 'hover:bg-emerald-50 text-slate-400 hover:text-emerald-500'}`} 
                                title={u.status === 'Active' ? 'Deactivate User' : 'Activate User'}
                              >
                                {u.status === 'Active' ? <XCircle size={24} /> : <CheckCircle2 size={24} />}
                              </button>
                              <button onClick={() => openEditModal(u)} className="p-4 hover:bg-white rounded-xl text-slate-400 hover:text-blue-500 transition-all" title="Edit User">
                                <Edit2 size={24} />
                              </button>
                              <button onClick={() => handleDeleteUser(u.id)} className="p-4 hover:bg-rose-50 rounded-xl text-slate-400 hover:text-rose-500 transition-all" title="Delete User">
                                <Trash2 size={24} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {filteredUsers.length === 0 && (
                    <div className="p-12 text-center">
                      <div className="w-24 h-24 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Search size={44} className="text-slate-400" />
                      </div>
                      <p className="text-2xl text-slate-500 font-medium">No users found</p>
                      <p className="text-lg text-slate-400 mt-3">Try adjusting your search or filter</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appointments' && (
            <div className="space-y-8 max-w-7xl mx-auto">
              <div>
                <h1 className="text-5xl font-light text-slate-800">All <span className="font-semibold">Appointments</span></h1>
                <p className="text-lg text-slate-500 mt-4 font-light tracking-wide">View and manage all platform appointments</p>
              </div>
              {/* Glass Appointments Table */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-white/30 backdrop-blur-xl rounded-3xl border border-white/70 shadow-xl shadow-slate-200/20" />
                <div className="relative rounded-3xl overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-slate-50/50">
                      <tr>
                        <th className="px-6 py-5 text-left text-base font-semibold text-slate-500 uppercase tracking-wider">Date & Time</th>
                        <th className="px-6 py-5 text-left text-base font-semibold text-slate-500 uppercase tracking-wider">Patient</th>
                        <th className="px-6 py-5 text-left text-base font-semibold text-slate-500 uppercase tracking-wider">Doctor</th>
                        <th className="px-6 py-5 text-left text-base font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                        <th className="px-6 py-5 text-left text-base font-semibold text-slate-500 uppercase tracking-wider">Reason</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100/50">
                      {appointments.map(a => (
                        <tr key={a.id} className="hover:bg-white/40 transition-colors">
                          <td className="px-6 py-6">
                            <div className="flex flex-col">
                              <span className="text-lg font-medium text-slate-700">{a.date}</span>
                              <span className="text-base text-slate-400 font-mono">{a.time}</span>
                            </div>
                          </td>
                          <td className="px-6 py-6 text-lg text-slate-600">{a.patientId}</td>
                          <td className="px-6 py-6 text-lg text-slate-600">{a.doctorId}</td>
                          <td className="px-6 py-6">
                            <span className={`px-5 py-2.5 text-base font-medium rounded-full ${
                              a.status === 'scheduled' ? 'bg-amber-50/80 text-amber-600 border border-amber-200/50' : 'bg-emerald-50/80 text-emerald-600 border border-emerald-200/50'
                            }`}>{a.status}</span>
                          </td>
                          <td className="px-6 py-6 text-lg text-slate-500 truncate max-w-xs">{a.reason}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

<<<<<<< HEAD
          {(activeTab === 'settings') && (
            <div className="clinical-card p-12 text-center">
              <Settings size={48} className="mx-auto mb-4 opacity-10" />
              <p className="text-slate-500">Module under maintenance.</p>
=======
          {activeTab === 'verifications' && (
            <div className="space-y-8 max-w-7xl mx-auto">
              {/* Header with Stats */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-5xl font-light text-slate-800">Doctor <span className="font-semibold">Verifications</span></h1>
                  <p className="text-lg text-slate-500 mt-4 font-light tracking-wide">Review and approve pending doctor registrations</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="px-6 py-4 bg-amber-50/80 backdrop-blur border border-amber-200/50 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <Clock size={24} className="text-amber-600" />
                      <div>
                        <p className="text-2xl font-bold text-amber-600">{pendingDoctors.length}</p>
                        <p className="text-sm text-amber-500">Pending</p>
                      </div>
                    </div>
                  </div>
                  <div className="px-6 py-4 bg-emerald-50/80 backdrop-blur border border-emerald-200/50 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <CheckCircle size={24} className="text-emerald-600" />
                      <div>
                        <p className="text-2xl font-bold text-emerald-600">{users.filter(u => u.role === 'DOCTOR').length}</p>
                        <p className="text-sm text-emerald-500">Approved</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pending Doctors List */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-white/30 backdrop-blur-xl rounded-3xl border border-white/70 shadow-xl shadow-slate-200/20" />
                <div className="relative rounded-3xl overflow-hidden">
                  {pendingDoctors.length === 0 ? (
                    <div className="p-16 text-center">
                      <div className="w-24 h-24 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <CheckCircle size={44} className="text-emerald-500" />
                      </div>
                      <p className="text-2xl text-slate-500 font-medium">All caught up!</p>
                      <p className="text-lg text-slate-400 mt-2">No pending doctor verifications</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100/50">
                      {pendingDoctors.map(doctor => (
                        <div key={doctor.id} className="p-6 hover:bg-white/40 transition-colors">
                          <div className="flex items-start justify-between">
                            <div className="flex items-start gap-5">
                              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-100 to-white border border-slate-200/50 flex items-center justify-center text-slate-600 font-semibold text-xl shadow-sm">
                                {doctor.name.split(' ').map(n => n[0]).join('')}
                              </div>
                              <div>
                                <h3 className="text-xl font-semibold text-slate-800">{doctor.name}</h3>
                                <p className="text-base text-slate-500 mt-1">{doctor.specialization}</p>
                                <div className="flex items-center gap-4 mt-3 text-sm text-slate-400">
                                  <span className="flex items-center gap-1.5"><Mail size={14} /> {doctor.email}</span>
                                  <span className="flex items-center gap-1.5"><Phone size={14} /> {doctor.phone}</span>
                                  <span className="flex items-center gap-1.5"><Award size={14} /> License: {doctor.licenseNumber}</span>
                                </div>
                                <div className="flex items-center gap-2 mt-3">
                                  {doctor.documents.map((doc: string, idx: number) => (
                                    <span key={idx} className="px-3 py-1 bg-blue-50/80 text-blue-600 text-xs font-medium rounded-full border border-blue-200/50">
                                      {doc}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <button 
                                onClick={() => openDoctorDetails(doctor)}
                                className="flex items-center gap-2 px-5 py-3 bg-white/60 backdrop-blur border border-slate-200/70 rounded-xl text-base font-medium text-slate-600 hover:bg-white transition-all"
                              >
                                <Eye size={18} /> View
                              </button>
                              <button 
                                onClick={() => handleApproveDoctor(doctor.id)}
                                className="flex items-center gap-2 px-5 py-3 bg-emerald-500/10 backdrop-blur border border-emerald-200/50 rounded-xl text-base font-medium text-emerald-600 hover:bg-emerald-500/20 transition-all"
                              >
                                <CheckCircle size={18} /> Approve
                              </button>
                              <button 
                                onClick={() => handleRejectDoctor(doctor.id)}
                                className="flex items-center gap-2 px-5 py-3 bg-rose-50/80 backdrop-blur border border-rose-200/50 rounded-xl text-base font-medium text-rose-600 hover:bg-rose-100 transition-all"
                              >
                                <XCircle size={18} /> Reject
                              </button>
                            </div>
                          </div>
                          <div className="mt-4 pt-4 border-t border-slate-100/50 flex items-center justify-between">
                            <span className="text-sm text-slate-400">Submitted on {doctor.submittedDate}</span>
                            <span className="px-4 py-2 bg-amber-50/80 text-amber-600 text-sm font-medium rounded-full border border-amber-200/50">
                              Pending Review
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
>>>>>>> 0c5931b (feat: admin dashboard updates and routing logic)
            </div>
          )}

          {activeTab === 'doctors' && (
            <div className="space-y-8 max-w-7xl mx-auto">
              {/* Header with Stats */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-5xl font-light text-slate-800">Doctor <span className="font-semibold">Directory</span></h1>
                  <p className="text-lg text-slate-500 mt-4 font-light tracking-wide">View and manage all approved doctors</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="px-6 py-4 bg-blue-50/80 backdrop-blur border border-blue-200/50 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <Stethoscope size={24} className="text-blue-600" />
                      <div>
                        <p className="text-2xl font-bold text-blue-600">{users.filter(u => u.role === 'DOCTOR').length}</p>
                        <p className="text-sm text-blue-500">Total Doctors</p>
                      </div>
                    </div>
                  </div>
                  <div className="px-6 py-4 bg-emerald-50/80 backdrop-blur border border-emerald-200/50 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 size={24} className="text-emerald-600" />
                      <div>
                        <p className="text-2xl font-bold text-emerald-600">{users.filter(u => u.role === 'DOCTOR' && u.status === 'Active').length}</p>
                        <p className="text-sm text-emerald-500">Active</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Search and Filter */}
              <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                  <Search size={22} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search doctors by name or specialization..."
                    className="w-full pl-12 pr-4 py-4 bg-white/60 backdrop-blur border border-white/80 rounded-xl text-lg text-slate-600 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200/50"
                  />
                </div>
                <div className="relative">
                  <Filter size={22} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <select className="pl-12 pr-8 py-4 bg-white/60 backdrop-blur border border-white/80 rounded-xl text-lg text-slate-600 focus:outline-none focus:ring-2 focus:ring-slate-200/50 appearance-none cursor-pointer">
                    <option value="ALL">All Specializations</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Dermatology">Dermatology</option>
                    <option value="General">General</option>
                  </select>
                  <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Doctors Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.filter(u => u.role === 'DOCTOR').map(doctor => (
                  <div key={doctor.id} className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-white/30 backdrop-blur-xl rounded-3xl border border-white/70 shadow-xl shadow-slate-200/20" />
                    <div className="relative p-6 rounded-3xl">
                      {/* Doctor Header */}
                      <div className="flex items-start justify-between mb-5">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-white border border-blue-200/50 flex items-center justify-center text-blue-600 font-semibold text-xl shadow-sm">
                            {doctor.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-slate-800">{doctor.name}</h3>
                            <p className="text-base text-slate-500">{doctor.specialization || 'General'}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 text-sm font-medium rounded-full ${doctor.status === 'Active' ? 'bg-emerald-50/80 text-emerald-600 border border-emerald-200/50' : 'bg-slate-100/80 text-slate-500 border border-slate-200/50'}`}>
                          {doctor.status}
                        </span>
                      </div>

                      {/* Doctor Info */}
                      <div className="space-y-3 mb-5">
                        <div className="flex items-center gap-3 text-base text-slate-500">
                          <Mail size={16} className="text-slate-400" />
                          <span className="truncate">{doctor.email}</span>
                        </div>
                        {doctor.licenseNumber && (
                          <div className="flex items-center gap-3 text-base text-slate-500">
                            <Award size={16} className="text-slate-400" />
                            <span>License: {doctor.licenseNumber}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-3 text-base text-slate-500">
                          <Clock size={16} className="text-slate-400" />
                          <span>Joined: {doctor.joinDate || '2024-01-01'}</span>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-3 gap-3 mb-5 pt-4 border-t border-slate-100/50">
                        <div className="text-center">
                          <p className="text-xl font-bold text-slate-700">{doctor.patients || '24'}</p>
                          <p className="text-xs text-slate-400">Patients</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xl font-bold text-slate-700">{doctor.appointments || '156'}</p>
                          <p className="text-xs text-slate-400">Appointments</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xl font-bold text-slate-700">{doctor.rating || '4.8'}</p>
                          <p className="text-xs text-slate-400">Rating</p>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-3">
                        <button 
                          onClick={() => handleToggleUserStatus(doctor.id)}
                          className={`flex-1 py-3 px-4 rounded-xl text-base font-medium transition-all ${doctor.status === 'Active' ? 'bg-amber-50/80 text-amber-600 hover:bg-amber-100' : 'bg-emerald-50/80 text-emerald-600 hover:bg-emerald-100'}`}
                        >
                          {doctor.status === 'Active' ? 'Deactivate' : 'Activate'}
                        </button>
                        <button 
                          onClick={() => openEditModal(doctor)}
                          className="flex-1 py-3 px-4 bg-slate-100/80 text-slate-700 rounded-xl text-base font-medium hover:bg-slate-200/80 transition-all"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(doctor.id)}
                          className="p-3 bg-rose-50/80 text-rose-600 rounded-xl hover:bg-rose-100 transition-all"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {users.filter(u => u.role === 'DOCTOR').length === 0 && (
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-white/30 backdrop-blur-xl rounded-3xl border border-white/70 shadow-xl shadow-slate-200/20" />
                  <div className="relative p-16 text-center">
                    <div className="w-24 h-24 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                      <Stethoscope size={44} className="text-slate-400" />
                    </div>
                    <p className="text-2xl text-slate-500 font-medium">No approved doctors</p>
                    <p className="text-lg text-slate-400 mt-2">Approve pending doctor registrations to see them here</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="flex flex-col items-center justify-center py-20 max-w-7xl mx-auto">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-white/30 backdrop-blur-xl rounded-3xl border border-white/70 shadow-xl shadow-slate-200/20" />
                <div className="relative p-12 flex flex-col items-center">
                  <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-white border border-slate-200/50 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                    <Settings size={32} className="text-slate-400" />
                  </div>
                  <h3 className="text-3xl font-medium text-slate-700 mb-4">Module under maintenance</h3>
                  <p className="text-lg text-slate-400">This feature will be available soon</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* CRUD Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm" onClick={closeModal} />
          {/* Modal Content */}
          <div className="relative w-full max-w-xl bg-white/80 backdrop-blur-xl rounded-3xl border border-white/70 shadow-2xl shadow-slate-300/50 p-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-4xl font-semibold text-slate-800">
                  {modalMode === 'create' ? 'Add New User' : 'Edit User'}
                </h2>
                <p className="text-xl text-slate-500 mt-3">
                  {modalMode === 'create' ? 'Create a new user account' : 'Update user information'}
                </p>
              </div>
              <button onClick={closeModal} className="p-5 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600 transition-all">
                <X size={32} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name Field */}
              <div>
                <label className="block text-xl font-medium text-slate-700 mb-4">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter full name"
                  className="w-full px-6 py-6 bg-white/60 backdrop-blur border border-slate-200/70 rounded-xl text-xl text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300/50"
                />
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-xl font-medium text-slate-700 mb-4">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email address"
                  className="w-full px-6 py-6 bg-white/60 backdrop-blur border border-slate-200/70 rounded-xl text-xl text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-300/50"
                />
              </div>

              {/* Role Field */}
              <div>
                <label className="block text-xl font-medium text-slate-700 mb-4">Role</label>
                <div className="relative">
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-6 py-6 bg-white/60 backdrop-blur border border-slate-200/70 rounded-xl text-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300/50 appearance-none cursor-pointer"
                  >
                    <option value="PATIENT">Patient</option>
                    <option value="DOCTOR">Doctor</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                  <ChevronDown size={24} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Status Field */}
              <div>
                <label className="block text-xl font-medium text-slate-700 mb-4">Status</label>
                <div className="flex gap-4">
                  {['Active', 'Inactive'].map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setFormData({ ...formData, status })}
                      className={`flex-1 py-6 px-7 rounded-xl text-xl font-medium transition-all ${
                        formData.status === status
                          ? 'bg-slate-800 text-white shadow-lg'
                          : 'bg-white/60 text-slate-600 border border-slate-200/70 hover:bg-white'
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 py-6 px-7 bg-slate-100/80 text-slate-700 rounded-xl text-xl font-medium hover:bg-slate-200/80 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-6 px-7 bg-gradient-to-r from-slate-700 to-slate-800 text-white rounded-xl text-xl font-medium shadow-lg hover:shadow-xl transition-all"
                >
                  {modalMode === 'create' ? 'Create User' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Doctor Details Modal */}
      {isDoctorModalOpen && selectedDoctor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm" onClick={closeDoctorModal} />
          <div className="relative w-full max-w-2xl bg-white/80 backdrop-blur-xl rounded-3xl border border-white/70 shadow-2xl shadow-slate-300/50 p-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-100 to-white border border-slate-200/50 flex items-center justify-center text-slate-600 font-semibold text-2xl shadow-sm">
                  {selectedDoctor.name.split(' ').map((n: string) => n[0]).join('')}
                </div>
                <div>
                  <h2 className="text-3xl font-semibold text-slate-800">{selectedDoctor.name}</h2>
                  <p className="text-lg text-slate-500 mt-1">{selectedDoctor.specialization}</p>
                </div>
              </div>
              <button onClick={closeDoctorModal} className="p-5 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600 transition-all">
                <X size={32} />
              </button>
            </div>

            {/* Doctor Details */}
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="p-5 bg-white/60 backdrop-blur rounded-2xl border border-slate-200/50">
                  <p className="text-sm text-slate-400 mb-1">Email Address</p>
                  <p className="text-lg font-medium text-slate-700 flex items-center gap-2">
                    <Mail size={18} className="text-slate-400" /> {selectedDoctor.email}
                  </p>
                </div>
                <div className="p-5 bg-white/60 backdrop-blur rounded-2xl border border-slate-200/50">
                  <p className="text-sm text-slate-400 mb-1">Phone Number</p>
                  <p className="text-lg font-medium text-slate-700 flex items-center gap-2">
                    <Phone size={18} className="text-slate-400" /> {selectedDoctor.phone}
                  </p>
                </div>
                <div className="p-5 bg-white/60 backdrop-blur rounded-2xl border border-slate-200/50">
                  <p className="text-sm text-slate-400 mb-1">License Number</p>
                  <p className="text-lg font-medium text-slate-700 flex items-center gap-2">
                    <Award size={18} className="text-slate-400" /> {selectedDoctor.licenseNumber}
                  </p>
                </div>
                <div className="p-5 bg-white/60 backdrop-blur rounded-2xl border border-slate-200/50">
                  <p className="text-sm text-slate-400 mb-1">Submitted Date</p>
                  <p className="text-lg font-medium text-slate-700 flex items-center gap-2">
                    <Clock size={18} className="text-slate-400" /> {selectedDoctor.submittedDate}
                  </p>
                </div>
              </div>

              {/* Documents */}
              <div>
                <p className="text-lg font-semibold text-slate-700 mb-4">Submitted Documents</p>
                <div className="flex flex-wrap gap-3">
                  {selectedDoctor.documents.map((doc: string, idx: number) => (
                    <div key={idx} className="flex items-center gap-3 px-5 py-3 bg-blue-50/80 text-blue-700 rounded-xl border border-blue-200/50">
                      <FileText size={20} />
                      <span className="text-base font-medium">{doc}</span>
                      <button className="ml-2 text-blue-500 hover:text-blue-700">
                        <Eye size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center justify-between p-5 bg-amber-50/60 rounded-2xl border border-amber-200/50">
                <div className="flex items-center gap-3">
                  <AlertCircle size={24} className="text-amber-600" />
                  <span className="text-lg font-medium text-amber-700">Status: Pending Review</span>
                </div>
                <span className="text-sm text-amber-600">Waiting for admin approval</span>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4">
                <button
                  onClick={closeDoctorModal}
                  className="flex-1 py-5 px-6 bg-slate-100/80 text-slate-700 rounded-xl text-xl font-medium hover:bg-slate-200/80 transition-all"
                >
                  Close
                </button>
                <button
                  onClick={() => { handleRejectDoctor(selectedDoctor.id); closeDoctorModal(); }}
                  className="flex-1 py-5 px-6 bg-rose-50 text-rose-600 rounded-xl text-xl font-medium hover:bg-rose-100 transition-all"
                >
                  <XCircle size={24} className="inline mr-2" /> Reject
                </button>
                <button
                  onClick={() => { handleApproveDoctor(selectedDoctor.id); closeDoctorModal(); }}
                  className="flex-1 py-5 px-6 bg-emerald-500 text-white rounded-xl text-xl font-medium hover:bg-emerald-600 transition-all"
                >
                  <CheckCircle size={24} className="inline mr-2" /> Approve
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Profile Management Modal */}
      {isProfileModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-sm" onClick={() => setIsProfileModalOpen(false)} />
          <div className="relative w-full max-w-xl bg-white/80 backdrop-blur-xl rounded-3xl border border-white/70 shadow-2xl shadow-slate-300/50 p-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-4xl font-semibold text-slate-800">Admin Profile</h2>
                <p className="text-xl text-slate-500 mt-3">Manage your profile information</p>
              </div>
              <button onClick={() => setIsProfileModalOpen(false)} className="p-5 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600 transition-all">
                <X size={32} />
              </button>
            </div>

            {/* Profile Form */}
            <form className="space-y-6">
              <div className="flex items-center gap-6 mb-8">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white font-bold text-3xl shadow-lg">
                  {adminProfile.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="text-2xl font-semibold text-slate-800">{adminProfile.name}</p>
                  <p className="text-lg text-slate-500">{adminProfile.role}</p>
                  <p className="text-sm text-slate-400 mt-1">Member since {adminProfile.joinDate}</p>
                </div>
              </div>

              <div>
                <label className="block text-xl font-medium text-slate-700 mb-4">Full Name</label>
                <input
                  type="text"
                  value={adminProfile.name}
                  onChange={(e) => setAdminProfile({...adminProfile, name: e.target.value})}
                  className="w-full px-6 py-5 bg-white/60 backdrop-blur border border-slate-200/70 rounded-xl text-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300/50"
                />
              </div>

              <div>
                <label className="block text-xl font-medium text-slate-700 mb-4">Email Address</label>
                <input
                  type="email"
                  value={adminProfile.email}
                  onChange={(e) => setAdminProfile({...adminProfile, email: e.target.value})}
                  className="w-full px-6 py-5 bg-white/60 backdrop-blur border border-slate-200/70 rounded-xl text-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300/50"
                />
              </div>

              <div>
                <label className="block text-xl font-medium text-slate-700 mb-4">Phone Number</label>
                <input
                  type="tel"
                  value={adminProfile.phone}
                  onChange={(e) => setAdminProfile({...adminProfile, phone: e.target.value})}
                  className="w-full px-6 py-5 bg-white/60 backdrop-blur border border-slate-200/70 rounded-xl text-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-300/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-xl font-medium text-slate-700 mb-4">Department</label>
                  <input
                    type="text"
                    value={adminProfile.department}
                    disabled
                    className="w-full px-6 py-5 bg-slate-100/60 border border-slate-200/70 rounded-xl text-xl text-slate-500 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xl font-medium text-slate-700 mb-4">Role</label>
                  <input
                    type="text"
                    value={adminProfile.role}
                    disabled
                    className="w-full px-6 py-5 bg-slate-100/60 border border-slate-200/70 rounded-xl text-xl text-slate-500 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsProfileModalOpen(false)}
                  className="flex-1 py-5 px-6 bg-slate-100/80 text-slate-700 rounded-xl text-xl font-medium hover:bg-slate-200/80 transition-all"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => { alert('Profile updated successfully!'); setIsProfileModalOpen(false); }}
                  className="flex-1 py-5 px-6 bg-gradient-to-r from-slate-700 to-slate-800 text-white rounded-xl text-xl font-medium shadow-lg hover:shadow-xl transition-all"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
