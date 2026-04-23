import { useState, useEffect, useCallback } from 'react';
import {
  Users, Stethoscope, Calendar, Activity,
  Settings, LogOut, Search, ShieldCheck, Menu, Loader2,
  UserPlus, Trash2
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { Link, useNavigate } from 'react-router-dom';
import { appointmentService } from '../api/services';
import { authService } from '../utils/auth';

const TABS = [
  { id: 'stats', label: 'Analytics', icon: Activity },
  { id: 'approvals', label: 'Doctor Approvals', icon: ShieldCheck },
  { id: 'users', label: 'User Management', icon: Users },
  { id: 'appointments', label: 'All Appointments', icon: Calendar },
  { id: 'settings', label: 'System Settings', icon: Settings },
];

export default function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('stats');
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  // Data
  const [users, setUsers] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  const handleDeleteUser = (id: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      // Future: authService.deleteUser(id);
      setUsers(users.filter(u => u.id !== id));
    }
  };

  if (loading) return <div className="min-h-screen bg-[#0C1220] flex items-center justify-center"><Loader2 className="w-8 h-8 text-[#0EA5E9] animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-[#0C1220] flex font-sans text-slate-300">
      
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#111B2E] border-r border-[#1E3A5F]/50 transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col">
          <div className="p-6">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#0EA5E9]/20 flex items-center justify-center">
                <ShieldCheck size={18} className="text-[#0EA5E9]" />
              </div>
              <div>
                <p className="text-sm font-bold text-white leading-none">MediConnect</p>
                <p className="text-[9px] text-slate-500 uppercase tracking-widest font-medium mt-0.5">Control Center</p>
              </div>
            </Link>
          </div>

          <nav className="flex-1 px-4 py-2 space-y-1">
            {TABS.map(t => (
              <button key={t.id} onClick={() => { setActiveTab(t.id); setSidebarOpen(false); }}
                className={`w-full sidebar-link ${activeTab === t.id ? 'sidebar-link-active' : ''}`}>
                <t.icon size={18} /> {t.label}
              </button>
            ))}
          </nav>

          <div className="p-4 mt-auto">
            <button onClick={handleLogout} className="w-full sidebar-link text-red-400 hover:bg-red-500/10">
              <LogOut size={18} /> Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        <header className="h-16 bg-[#111B2E]/80 backdrop-blur border-b border-[#1E3A5F]/50 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-slate-400"><Menu size={20} /></button>
            <h1 className="text-lg font-bold text-white capitalize">{activeTab.replace('-', ' ')}</h1>
          </div>
          <div className="flex items-center gap-4 text-xs font-medium text-slate-500">
            <span className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> System Live</span>
          </div>
        </header>

        <div className="flex-1 p-4 lg:p-8">
          
          {activeTab === 'stats' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { label: 'Total Users', val: '12.4k', icon: Users, color: 'text-sky-400' },
                  { label: 'Active Doctors', val: '450', icon: Stethoscope, color: 'text-emerald-400' },
                  { label: 'Appointments', val: '1.2k', icon: Calendar, color: 'text-amber-400' },
                  { label: 'System Load', val: '12%', icon: Activity, color: 'text-rose-400' },
                ].map((s, i) => (
                  <div key={i} className="clinical-card p-5">
                    <div className="flex justify-between items-center mb-2">
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{s.label}</p>
                      <s.icon size={16} className={s.color} />
                    </div>
                    <p className="text-2xl font-bold text-white">{s.val}</p>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="clinical-card p-6">
                  <h3 className="font-bold text-white mb-4">Service Status</h3>
                  <div className="space-y-4">
                    {['Auth Service', 'Patient Service', 'Doctor Service', 'AI Analysis Node'].map(s => (
                      <div key={s} className="flex items-center justify-between p-3 bg-[#0C1220] rounded-xl border border-[#1E3A5F]/30">
                        <span className="text-sm font-medium">{s}</span>
                        <span className="badge-success">Operational</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="clinical-card p-6">
                  <h3 className="font-bold text-white mb-4">Recent System Logs</h3>
                  <div className="space-y-3 text-xs font-mono">
                    <p className="text-slate-500"><span className="text-emerald-500">[OK]</span> 14:32:01 — Backup completed successfully</p>
                    <p className="text-slate-500"><span className="text-sky-500">[INFO]</span> 14:28:15 — New doctor registered: Dr. Wickramasinghe</p>
                    <p className="text-slate-500"><span className="text-amber-500">[WARN]</span> 14:15:33 — High latency in AI Node (Asia-South)</p>
                    <p className="text-slate-500"><span className="text-emerald-500">[OK]</span> 13:45:00 — Cache synchronized across clusters</p>
                  </div>
                </div>
              </div>
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
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="relative flex-1 max-w-sm">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input type="text" className="clinical-input pl-10" placeholder="Search users..." />
                </div>
                <button className="btn-primary"><UserPlus size={16} /> Add User</button>
              </div>

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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'appointments' && (
            <div className="clinical-card overflow-hidden">
              <table className="clinical-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Patient ID</th>
                    <th>Doctor ID</th>
                    <th>Status</th>
                    <th>Reason</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map(a => (
                    <tr key={a.id}>
                      <td>{a.date} <span className="text-slate-500 ml-2">{a.time}</span></td>
                      <td>{a.patientId}</td>
                      <td>{a.doctorId}</td>
                      <td><span className={`badge-${a.status === 'scheduled' ? 'warning' : 'success'}`}>{a.status}</span></td>
                      <td className="truncate max-w-xs">{a.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {(activeTab === 'settings') && (
            <div className="clinical-card p-12 text-center">
              <Settings size={48} className="mx-auto mb-4 opacity-10" />
              <p className="text-slate-500">Module under maintenance.</p>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
