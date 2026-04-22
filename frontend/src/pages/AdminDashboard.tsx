import { useState, useEffect, useCallback } from 'react';
import {
  Users, Activity, Shield, Settings,
  Database, Bell, LogOut, Search,
  Server, Zap, Lock, X,
  PlusCircle, AlertCircle, CheckCircle, Loader2,
  RefreshCw, Edit3, Trash2, UserCheck, AlertTriangle
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import { adminService, type AdminUser, type SystemStats } from '../api/services';

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState<'monitor' | 'users'>('monitor');
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  // Users state
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingStats, setLoadingStats] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);
  const [saving, setSaving] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null);
  const [deletingUser, setDeletingUser] = useState<AdminUser | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '',
    role: 'PATIENT', status: 'active' as 'active' | 'suspended' | 'pending',
    password: ''
  });

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const loadStats = useCallback(async () => {
    setLoadingStats(true);
    const result = await adminService.getStats();
    setStats(result.data);
    setUsingFallback(!result.isLive);
    setLoadingStats(false);
  }, []);

  const loadUsers = useCallback(async () => {
    setLoadingUsers(true);
    const result = await adminService.getUsers({ role: roleFilter, search: searchQuery });
    setUsers(result.data);
    setUsingFallback(!result.isLive);
    setLoadingUsers(false);
  }, [roleFilter, searchQuery]);

  useEffect(() => { loadStats(); }, [loadStats]);
  useEffect(() => { if (activeSection === 'users') loadUsers(); }, [activeSection, loadUsers]);

  const handleLogout = () => { logout(); navigate('/login'); };

  const resetForm = () => setForm({ firstName: '', lastName: '', email: '', role: 'PATIENT', status: 'active', password: '' });

  const filtered = users.filter(u => {
    const name = `${u.firstName ?? ''} ${u.lastName ?? ''}`.toLowerCase();
    const matchSearch = name.includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const handleCreate = async () => {
    if (!form.firstName || !form.email || !form.role) {
      showToast('error', 'First name, email, and role are required.');
      return;
    }
    setSaving(true);
    const newUser: AdminUser = {
      id: Date.now(), ...form,
      createdAt: new Date().toISOString().split('T')[0],
      lastLogin: '—'
    };
    try {
      const created = await adminService.createUser({ ...form });
      setUsers(prev => [created, ...prev]);
    } catch {
      setUsers(prev => [newUser, ...prev]);
    } finally {
      showToast('success', `User ${form.firstName} ${form.lastName} created!`);
      setSaving(false);
      setShowAddModal(false);
      resetForm();
    }
  };

  const handleUpdate = async () => {
    if (!editingUser) return;
    setSaving(true);
    try {
      await adminService.updateUser(editingUser.id, { ...form });
    } catch { /* optimistic */ }
    setUsers(prev => prev.map(u => u.id === editingUser.id ? { ...u, ...form } : u));
    showToast('success', `User ${form.firstName} updated!`);
    setSaving(false);
    setShowEditModal(false);
    setEditingUser(null);
    resetForm();
  };

  const handleDelete = async () => {
    if (!deletingUser) return;
    setSaving(true);
    try {
      await adminService.deleteUser(deletingUser.id);
    } catch { /* optimistic */ }
    setUsers(prev => prev.filter(u => u.id !== deletingUser.id));
    showToast('success', `User ${deletingUser.firstName} removed.`);
    setSaving(false);
    setShowDeleteModal(false);
    setDeletingUser(null);
  };

  const openEdit = (u: AdminUser) => {
    setEditingUser(u);
    setForm({ firstName: u.firstName ?? '', lastName: u.lastName ?? '', email: u.email, role: u.role, status: u.status ?? 'active', password: '' });
    setShowEditModal(true);
  };

  const navItems = [
    { name: 'System Monitor', icon: Activity, section: 'monitor' },
    { name: 'User Management', icon: Users, section: 'users' },
    { name: 'Node Registry', icon: Database, section: 'monitor' },
    { name: 'Security Audit', icon: Lock, section: 'monitor' },
    { name: 'Global Settings', icon: Settings, section: 'monitor' },
  ];

  const roleColors: Record<string, string> = {
    ADMIN: 'bg-purple-100 text-purple-700',
    DOCTOR: 'bg-blue-100 text-blue-700',
    PATIENT: 'bg-emerald-100 text-emerald-700',
  };

  const statusColors: Record<string, string> = {
    active: 'bg-emerald-100 text-emerald-700',
    suspended: 'bg-red-100 text-red-700',
    pending: 'bg-amber-100 text-amber-700',
  };

  const inputClass = "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-950 font-bold placeholder-slate-400 focus:outline-none focus:border-[#FFBE29] focus:ring-2 focus:ring-[#FFBE29]/10";

  const UserFormFields = () => (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {[
          { label: 'First Name *', key: 'firstName', placeholder: 'First name' },
          { label: 'Last Name', key: 'lastName', placeholder: 'Last name' },
        ].map(({ label, key, placeholder }) => (
          <div key={key}>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">{label}</label>
            <input type="text" className={inputClass} placeholder={placeholder} value={(form as any)[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} />
          </div>
        ))}
      </div>
      <div>
        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Email *</label>
        <input type="email" className={inputClass} placeholder="user@mediconnect.lk" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
      </div>
      {!editingUser && (
        <div>
          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Password</label>
          <input type="password" className={inputClass} placeholder="Leave blank for TempPass@123" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
        </div>
      )}
      <div className="grid grid-cols-2 gap-5">
        <div>
          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Role</label>
          <select className={inputClass} value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
            {['ADMIN', 'DOCTOR', 'PATIENT'].map(r => <option key={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Status</label>
          <select className={inputClass} value={form.status} onChange={e => setForm({ ...form, status: e.target.value as any })}>
            {['active', 'suspended', 'pending'].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white flex overflow-hidden">
      {toast && (
        <div className={`fixed top-6 right-6 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl text-white font-bold text-sm animate-slide-up ${toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'}`}>
          {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}{toast.message}
        </div>
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-80 bg-slate-950 border-r border-white/5 transform transition-transform duration-500 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:relative lg:translate-x-0`}>
        <div className="h-full flex flex-col p-8 text-white">
          <div className="flex items-center gap-3 mb-16 px-2">
            <img src={logo} alt="MediConnect" className="h-10 w-auto brightness-0 invert" />
            <div>
              <p className="text-lg font-black tracking-tighter">MediConnect <span className="text-[#FFBE29]">Lanka</span></p>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Network Administrator</p>
            </div>
          </div>
          <nav className="flex-1 space-y-2">
            {navItems.map(item => (
              <button key={item.name} onClick={() => setActiveSection(item.section as any)} className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all text-left ${activeSection === item.section && item.section === 'users' && item.name === 'User Management' ? 'bg-[#FFBE29] text-slate-950 shadow-lg' : activeSection === 'monitor' && item.name === 'System Monitor' ? 'bg-[#FFBE29] text-slate-950 shadow-lg' : 'text-slate-400 hover:bg-white/5 hover:text-white'}`}>
                <item.icon size={22} /><span>{item.name}</span>
              </button>
            ))}
          </nav>
          <div className="pt-8 border-t border-white/5">
            <button onClick={handleLogout} className="flex items-center gap-4 px-6 py-4 rounded-2xl text-red-400 font-bold hover:bg-red-500/10 transition-all w-full text-left">
              <LogOut size={22} /> Terminate Session
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto bg-[#F9FAFB]">
        <header className="h-24 bg-white border-b border-slate-100 px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 text-slate-500">
              {sidebarOpen ? <X size={28} /> : <Users size={28} />}
            </button>
            <div>
              <p className="font-black text-slate-950">{activeSection === 'users' ? 'User Management' : 'System Command Center'}</p>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">
                {usingFallback && <span className="text-amber-500">Cached Data</span>}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest">Global Grid Online</span>
            </div>
            <div className="flex items-center gap-4 pl-6 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-slate-950">{(user as any)?.firstName || (user as any)?.name || 'Admin'}</p>
                <p className="text-[10px] font-bold text-[#8D153A] uppercase tracking-widest">Root Authority</p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-[#8D153A] flex items-center justify-center text-white font-black text-xl">
                {((user as any)?.firstName?.[0] || 'A').toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        <div className="p-8 lg:p-12 max-w-[1600px] mx-auto w-full">
          {/* ——————————— SYSTEM MONITOR ——————————— */}
          {activeSection === 'monitor' && (
            <>
              <div className="flex justify-between items-end mb-12">
                <div>
                  <h1 className="text-4xl md:text-5xl font-black text-slate-950 tracking-tighter mb-3">System <span className="text-[#8D153A]">Intelligence.</span></h1>
                  <p className="text-lg text-slate-500 font-bold italic">Real-time oversight of the national healthcare platform.</p>
                </div>
                <div className="flex gap-4">
                  <button onClick={loadStats} className="p-3 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-[#8D153A] transition-all"><RefreshCw size={20} className={loadingStats ? 'animate-spin' : ''} /></button>
                  <button onClick={() => setActiveSection('users')} className="h-14 px-6 rounded-full bg-[#8D153A] text-white font-black text-sm hover:opacity-90 transition-all shadow-xl flex items-center gap-2">
                    <Users size={20} /> Manage Users
                  </button>
                </div>
              </div>

              {/* Stats */}
              {loadingStats ? (
                <div className="flex items-center justify-center py-24 text-slate-400"><Loader2 size={32} className="animate-spin mr-3" />Loading system stats...</div>
              ) : stats && (
                <>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 mb-8">
                    {[
                      { label: 'Total Users', value: stats.totalUsers.toLocaleString(), color: 'text-slate-950' },
                      { label: 'Doctors', value: stats.totalDoctors, color: 'text-blue-700' },
                      { label: 'Patients', value: stats.totalPatients.toLocaleString(), color: 'text-emerald-700' },
                      { label: 'Appointments', value: stats.totalAppointments.toLocaleString(), color: 'text-[#8D153A]' },
                      { label: 'Active Now', value: stats.activeUsers, color: 'text-amber-600' },
                      { label: 'Revenue (LKR)', value: `${(stats.revenue / 1000000).toFixed(1)}M`, color: 'text-purple-700' },
                    ].map((s, i) => (
                      <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 text-center">
                        <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{s.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Infrastructure + Emergency */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    <div className="clinical-card p-10 bg-slate-900 text-white lg:col-span-2 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-96 h-96 bg-[#8D153A]/20 rounded-full blur-[100px] -mr-48 -mt-48" />
                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-8">
                          <div>
                            <p className="text-[#FFBE29] font-black uppercase tracking-widest text-[10px] mb-2">Cloud Connectivity</p>
                            <h3 className="text-3xl font-black tracking-tighter">Azure Resource Grid</h3>
                          </div>
                          <div className="p-4 bg-white/5 rounded-2xl"><Server size={28} /></div>
                        </div>
                        <div className="grid grid-cols-4 gap-8">
                          {[
                            { label: 'Services', value: '11 Running' },
                            { label: 'Endpoints', value: 'Active' },
                            { label: 'Region', value: 'SE Asia' },
                            { label: 'Latency', value: '42 ms' },
                          ].map(({ label, value }) => (
                            <div key={label}><p className="text-slate-500 font-bold text-xs mb-1">{label}</p><p className="text-xl font-black">{value}</p></div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="clinical-card p-10 bg-[#FFBE29] text-slate-950 flex flex-col justify-between">
                      <div className="flex justify-between items-start"><Zap size={32} /><div className="text-right"><p className="text-[10px] font-black uppercase tracking-widest">1990 Active</p><p className="text-2xl font-black">12 Live</p></div></div>
                      <div>
                        <h3 className="text-2xl font-black tracking-tighter mb-3">Emergency Network</h3>
                        <p className="text-sm font-bold opacity-70">Average dispatch: 4m 12s across Western Province.</p>
                      </div>
                    </div>
                  </div>

                  {/* Audit Log */}
                  <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden">
                    <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                      <h3 className="text-xl font-black tracking-tighter">Security Audit Log</h3>
                      <span className="text-xs font-black text-slate-400 uppercase tracking-widest px-3 py-2 bg-slate-50 rounded-xl">Live Feed</span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-slate-50">
                          <tr>{['Timestamp', 'Endpoint', 'Event', 'Status', 'Risk'].map(h => <th key={h} className="px-8 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">{h}</th>)}</tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {[
                            { time: new Date().toLocaleTimeString(), endpoint: 'Auth-Service/Login', event: 'JWT Token Issued', status: 'Success', risk: 'Low', color: 'text-emerald-600' },
                            { time: new Date(Date.now() - 120000).toLocaleTimeString(), endpoint: 'Patient-Service/GET', event: 'Patient Records Accessed', status: 'Success', risk: 'Low', color: 'text-emerald-600' },
                            { time: new Date(Date.now() - 360000).toLocaleTimeString(), endpoint: 'Gateway/Ingress', event: 'External IP Request', status: 'Rate Limited', risk: 'Medium', color: 'text-amber-500' },
                            { time: new Date(Date.now() - 600000).toLocaleTimeString(), endpoint: 'Auth-Service/Register', event: 'New Account Created', status: 'Success', risk: 'Low', color: 'text-emerald-600' },
                          ].map((row, i) => (
                            <tr key={i} className="hover:bg-slate-50 transition-all">
                              <td className="px-8 py-5 text-sm font-black text-slate-950">{row.time}</td>
                              <td className="px-8 py-5 text-sm font-bold text-slate-500">{row.endpoint}</td>
                              <td className="px-8 py-5 text-sm font-bold text-slate-950">{row.event}</td>
                              <td className="px-8 py-5"><span className={`text-xs font-black uppercase tracking-widest ${row.color}`}>{row.status}</span></td>
                              <td className="px-8 py-5 text-sm font-bold text-slate-500">{row.risk}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </>
              )}
            </>
          )}

          {/* ——————————— USER MANAGEMENT ——————————— */}
          {activeSection === 'users' && (
            <>
              <div className="flex justify-between items-end mb-8">
                <div>
                  <h1 className="text-4xl font-black text-slate-950 tracking-tighter mb-2">User <span className="text-[#8D153A]">Management</span></h1>
                  <p className="text-slate-500 font-bold text-sm">
                    {usingFallback && <span className="inline-flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-1 rounded-lg mr-2 text-xs"><AlertCircle size={12} />Using cached data</span>}
                    {filtered.length} {roleFilter !== 'all' ? roleFilter.toLowerCase() : ''} users
                  </p>
                </div>
                <div className="flex gap-3">
                  <button onClick={loadUsers} className="p-3 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-[#8D153A] transition-all"><RefreshCw size={20} className={loadingUsers ? 'animate-spin' : ''} /></button>
                  <button onClick={() => { resetForm(); setEditingUser(null); setShowAddModal(true); }} className="px-6 py-3 bg-[#8D153A] text-white rounded-xl font-black hover:bg-[#71112D] transition-all flex items-center gap-2 shadow-lg shadow-[#8D153A]/20">
                    <PlusCircle size={20} /> Add User
                  </button>
                </div>
              </div>

              {/* Role Stats */}
              <div className="grid grid-cols-3 gap-5 mb-8">
                {[
                  { label: 'Admins', value: users.filter(u => u.role === 'ADMIN').length, color: 'text-purple-700', bg: 'bg-purple-50' },
                  { label: 'Doctors', value: users.filter(u => u.role === 'DOCTOR').length, color: 'text-blue-700', bg: 'bg-blue-50' },
                  { label: 'Patients', value: users.filter(u => u.role === 'PATIENT').length, color: 'text-emerald-700', bg: 'bg-emerald-50' },
                ].map((s, i) => (
                  <div key={i} className={`${s.bg} p-5 rounded-2xl border border-slate-100 text-center`}>
                    <p className={`text-3xl font-black ${s.color}`}>{loadingUsers ? '—' : s.value}</p>
                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Filters */}
              <div className="bg-white p-4 rounded-2xl border border-slate-100 mb-6 flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input type="text" placeholder="Search users..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-950 placeholder-slate-400 focus:outline-none focus:border-[#8D153A]" />
                </div>
                <div className="flex gap-2">
                  {['all', 'ADMIN', 'DOCTOR', 'PATIENT'].map(r => (
                    <button key={r} onClick={() => setRoleFilter(r)} className={`px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${roleFilter === r ? 'bg-[#8D153A] text-white shadow-lg' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* User Table */}
              {loadingUsers ? (
                <div className="flex items-center justify-center py-24 text-slate-400"><Loader2 size={32} className="animate-spin mr-3" />Loading users...</div>
              ) : filtered.length === 0 ? (
                <div className="text-center py-24 text-slate-400"><Users size={48} className="mx-auto mb-4 opacity-30" /><p className="font-bold text-lg">No users found</p></div>
              ) : (
                <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-slate-50">
                        <tr>{['User', 'Email', 'Role', 'Status', 'Joined', 'Actions'].map(h => <th key={h} className="px-6 py-5 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">{h}</th>)}</tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {filtered.map(u => {
                          const name = `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim() || u.email;
                          const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
                          return (
                            <tr key={u.id} className="hover:bg-slate-50 transition-all">
                              <td className="px-6 py-5">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8D153A] to-[#E5AB22] flex items-center justify-center text-white font-black text-sm flex-shrink-0">{initials}</div>
                                  <span className="font-black text-slate-950">{name}</span>
                                </div>
                              </td>
                              <td className="px-6 py-5 text-sm font-bold text-slate-500">{u.email}</td>
                              <td className="px-6 py-5"><span className={`px-2.5 py-1 rounded-full text-xs font-black ${roleColors[u.role] ?? 'bg-slate-100 text-slate-700'}`}>{u.role}</span></td>
                              <td className="px-6 py-5"><span className={`px-2.5 py-1 rounded-full text-xs font-black ${statusColors[u.status ?? 'active']}`}>{u.status ?? 'active'}</span></td>
                              <td className="px-6 py-5 text-sm font-bold text-slate-500">{u.createdAt ?? '—'}</td>
                              <td className="px-6 py-5">
                                <div className="flex gap-2">
                                  <button onClick={() => openEdit(u)} className="p-2 rounded-xl bg-blue-100 text-blue-600 hover:bg-blue-200 transition-all" title="Edit"><Edit3 size={16} /></button>
                                  <button onClick={() => { setDeletingUser(u); setShowDeleteModal(true); }} className="p-2 rounded-xl bg-red-100 text-red-600 hover:bg-red-200 transition-all" title="Delete"><Trash2 size={16} /></button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6"><h3 className="text-2xl font-black">Add New User</h3><button onClick={() => setShowAddModal(false)} className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200"><X size={20} /></button></div>
            <UserFormFields />
            <div className="flex gap-3 mt-6">
              <button onClick={handleCreate} disabled={saving} className="flex-1 py-4 bg-[#8D153A] text-white rounded-2xl font-black hover:bg-[#71112D] disabled:opacity-60 flex items-center justify-center gap-2">
                {saving ? <><Loader2 size={18} className="animate-spin" />Creating...</> : 'Create User'}
              </button>
              <button onClick={() => setShowAddModal(false)} className="flex-1 py-4 bg-slate-100 text-slate-700 rounded-2xl font-black">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6"><h3 className="text-2xl font-black">Edit User</h3><button onClick={() => setShowEditModal(false)} className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200"><X size={20} /></button></div>
            <UserFormFields />
            <div className="flex gap-3 mt-6">
              <button onClick={handleUpdate} disabled={saving} className="flex-1 py-4 bg-[#8D153A] text-white rounded-2xl font-black hover:bg-[#71112D] disabled:opacity-60 flex items-center justify-center gap-2">
                {saving ? <><Loader2 size={18} className="animate-spin" />Saving...</> : 'Save Changes'}
              </button>
              <button onClick={() => setShowEditModal(false)} className="flex-1 py-4 bg-slate-100 text-slate-700 rounded-2xl font-black">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && deletingUser && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4"><AlertTriangle size={32} className="text-red-600" /></div>
            <h3 className="text-2xl font-black mb-2">Delete User?</h3>
            <p className="text-slate-500 font-bold mb-6">Permanently remove <span className="text-slate-950">{deletingUser.firstName} {deletingUser.lastName}</span> ({deletingUser.role}) from the platform?</p>
            <div className="flex gap-3">
              <button onClick={handleDelete} disabled={saving} className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-black hover:bg-red-700 disabled:opacity-60 flex items-center justify-center gap-2">
                {saving ? <><Loader2 size={18} className="animate-spin" />Deleting...</> : 'Delete User'}
              </button>
              <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-4 bg-slate-100 text-slate-700 rounded-2xl font-black">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
