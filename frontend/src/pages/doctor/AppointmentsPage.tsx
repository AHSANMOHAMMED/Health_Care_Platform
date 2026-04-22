import { useState, useEffect, useCallback } from 'react';
import {
  Calendar, Clock, Search, PlusCircle, X,
  CheckCircle, AlertTriangle, Phone, Video, UserCheck,
  Loader2, AlertCircle, RefreshCw, ChevronRight,
  Users, FileText, Activity, Edit3, Trash2
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { appointmentService, type Appointment } from '../../api/services';
import { useAuthStore } from '../../store/useAuthStore';

export default function AppointmentsPage() {
  const location = useLocation();
  const { userId, user } = useAuthStore();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingAppt, setEditingAppt] = useState<Appointment | null>(null);
  const [deletingAppt, setDeletingAppt] = useState<Appointment | null>(null);

  const [form, setForm] = useState({
    patientName: '', date: new Date().toISOString().split('T')[0],
    time: '09:00 AM', type: 'Video Consult',
    reason: '', duration: '30 mins', notes: '', priority: 'normal'
  });

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const load = useCallback(async () => {
    setLoading(true);
    const result = await appointmentService.getAll({ doctorId: userId ?? undefined });
    setAppointments(result.data);
    setUsingFallback(!result.isLive);
    setLoading(false);
  }, [userId]);

  useEffect(() => { load(); }, [load]);

  const filtered = appointments.filter(a => {
    const name = a.patientName ?? '';
    const matchSearch = name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const counts = {
    all: appointments.length,
    waiting: appointments.filter(a => a.status === 'waiting').length,
    confirmed: appointments.filter(a => a.status === 'confirmed').length,
    completed: appointments.filter(a => a.status === 'completed').length,
    cancelled: appointments.filter(a => a.status === 'cancelled').length,
  };

  const handleStatusUpdate = async (id: number | string, status: Appointment['status']) => {
    setSaving(true);
    try {
      await appointmentService.updateStatus(id, status);
    } catch {
      // Optimistic proceed
    } finally {
      setAppointments(prev => prev.map(a => a.id === id ? { ...a, status } : a));
      showToast('success', `Appointment marked as ${status}.`);
      setSaving(false);
    }
  };

  const handleCreate = async () => {
    if (!form.patientName || !form.date || !form.time) {
      showToast('error', 'Patient name, date, and time are required.');
      return;
    }
    setSaving(true);
    const newAppt: Appointment = {
      id: Date.now(),
      patientName: form.patientName,
      doctorId: userId ?? undefined,
      date: form.date,
      time: form.time,
      type: form.type,
      reason: form.reason,
      duration: form.duration,
      notes: form.notes,
      priority: form.priority as any,
      status: 'confirmed',
    };
    try {
      const created = await appointmentService.create({ ...newAppt });
      setAppointments(prev => [created, ...prev]);
    } catch {
      setAppointments(prev => [newAppt, ...prev]);
    } finally {
      showToast('success', `Appointment with ${form.patientName} created!`);
      setSaving(false);
      setShowAddModal(false);
      setForm({ patientName: '', date: new Date().toISOString().split('T')[0], time: '09:00 AM', type: 'Video Consult', reason: '', duration: '30 mins', notes: '', priority: 'normal' });
    }
  };

  const handleUpdate = async () => {
    if (!editingAppt) return;
    setSaving(true);
    try {
      await appointmentService.update(editingAppt.id, { ...form });
    } catch { /* optimistic */ }
    setAppointments(prev => prev.map(a => a.id === editingAppt.id ? { ...a, ...form } : a));
    showToast('success', 'Appointment updated!');
    setSaving(false);
    setShowEditModal(false);
    setEditingAppt(null);
  };

  const handleDelete = async () => {
    if (!deletingAppt) return;
    setSaving(true);
    try {
      await appointmentService.delete(deletingAppt.id);
    } catch { /* optimistic */ }
    setAppointments(prev => prev.filter(a => a.id !== deletingAppt.id));
    showToast('success', `Appointment with ${deletingAppt.patientName} cancelled.`);
    setSaving(false);
    setShowDeleteModal(false);
    setDeletingAppt(null);
  };

  const openEdit = (a: Appointment) => {
    setEditingAppt(a);
    setForm({
      patientName: a.patientName ?? '',
      date: a.date ?? a.appointmentDate ?? new Date().toISOString().split('T')[0],
      time: a.time ?? a.appointmentTime ?? '09:00 AM',
      type: a.type ?? a.consultationType ?? 'Video Consult',
      reason: a.reason ?? '',
      duration: a.duration ?? '30 mins',
      notes: a.notes ?? '',
      priority: a.priority ?? 'normal',
    });
    setShowEditModal(true);
  };

  const statusColors: Record<string, string> = {
    waiting: 'bg-amber-100 text-amber-700 border-amber-200',
    confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
    completed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    cancelled: 'bg-red-100 text-red-700 border-red-200',
    pending: 'bg-slate-100 text-slate-700 border-slate-200',
  };

  const typeIcon = (t?: string) => {
    if (!t) return <UserCheck size={16} />;
    if (t.toLowerCase().includes('video')) return <Video size={16} />;
    if (t.toLowerCase().includes('phone')) return <Phone size={16} />;
    return <UserCheck size={16} />;
  };

  const navItems = [
    { name: 'Patient Overview', icon: Users, path: '/doctor' },
    { name: 'Appointments', icon: Calendar, path: '/doctor/appointments' },
    { name: 'Daily Schedule', icon: Clock, path: '/doctor/schedule' },
    { name: 'Medical Reports', icon: FileText, path: '/doctor/reports' },
    { name: 'Consultations', icon: ChevronRight, path: '/doctor/chats' },
    { name: 'Analytics', icon: Activity, path: '/doctor/analytics' },
  ];

  const FormField = ({ label, required, children }: any) => (
    <div>
      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">
        {label}{required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
    </div>
  );

  const inputClass = "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-950 font-bold placeholder-slate-400 focus:outline-none focus:border-[#8D153A] focus:ring-2 focus:ring-[#8D153A]/10";

  const AppointmentFormFields = () => (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FormField label="Patient Name" required>
          <input type="text" className={inputClass} placeholder="Patient full name" value={form.patientName} onChange={e => setForm({ ...form, patientName: e.target.value })} />
        </FormField>
        <FormField label="Appointment Type" required>
          <select className={inputClass} value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}>
            {['Video Consult', 'Phone Call', 'In-Person', 'New Patient', 'Physical Follow-up'].map(t => <option key={t}>{t}</option>)}
          </select>
        </FormField>
        <FormField label="Date" required>
          <input type="date" className={inputClass} value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
        </FormField>
        <FormField label="Time" required>
          <input type="text" className={inputClass} placeholder="10:30 AM" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} />
        </FormField>
        <FormField label="Duration">
          <select className={inputClass} value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })}>
            {['15 mins', '30 mins', '45 mins', '60 mins', '90 mins'].map(d => <option key={d}>{d}</option>)}
          </select>
        </FormField>
        <FormField label="Priority">
          <select className={inputClass} value={form.priority} onChange={e => setForm({ ...form, priority: e.target.value })}>
            {['normal', 'high', 'urgent'].map(p => <option key={p}>{p}</option>)}
          </select>
        </FormField>
      </div>
      <FormField label="Reason for Visit">
        <input type="text" className={inputClass} placeholder="Chief complaint / reason" value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} />
      </FormField>
      <FormField label="Doctor Notes">
        <textarea className={inputClass + ' resize-none'} rows={3} placeholder="Pre-appointment notes..." value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
      </FormField>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {toast && (
        <div className={`fixed top-6 right-6 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl text-white font-bold text-sm animate-slide-up ${toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'}`}>
          {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}{toast.message}
        </div>
      )}

      <aside className="w-80 bg-white border-r border-slate-100 flex-shrink-0">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-12">
            <img src={logo} alt="MediConnect" className="h-10 w-auto" />
            <div><p className="text-lg font-black text-slate-950 tracking-tighter">MediConnect <span className="text-[#8D153A]">Lanka</span></p><p className="text-[9px] font-bold text-[#E5AB22] uppercase tracking-widest">Medical Specialist</p></div>
          </div>
          <nav className="space-y-2">
            {navItems.map(item => (
              <Link key={item.name} to={item.path} className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${location.pathname === item.path ? 'bg-[#8D153A] text-white shadow-lg' : 'text-slate-500 hover:bg-[#8D153A]/5 hover:text-[#8D153A]'}`}>
                <item.icon size={22} /><span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-[1400px] mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-black text-slate-950 tracking-tighter mb-1">Appointments</h1>
              <p className="text-slate-500 font-bold text-sm">
                {usingFallback && <span className="inline-flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-1 rounded-lg mr-2 text-xs"><AlertCircle size={12} />Using cached data</span>}
                Dr. {(user as any)?.firstName || 'Doctor'}'s schedule
              </p>
            </div>
            <div className="flex gap-3">
              <button onClick={load} className="p-3 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-[#8D153A] transition-all">
                <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
              </button>
              <button onClick={() => setShowAddModal(true)} className="px-6 py-3 bg-[#8D153A] text-white rounded-xl font-black hover:bg-[#71112D] transition-all flex items-center gap-2 shadow-lg shadow-[#8D153A]/20">
                <PlusCircle size={20} /> New Appointment
              </button>
            </div>
          </div>

          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {(Object.entries(counts) as [string, number][]).map(([status, count]) => (
              <button key={status} onClick={() => setStatusFilter(status)}
                className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${statusFilter === status ? 'bg-[#8D153A] text-white shadow-lg shadow-[#8D153A]/20' : 'bg-white border border-slate-200 text-slate-600 hover:border-[#8D153A]/30'}`}>
                {status} ({count})
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="bg-white p-4 rounded-2xl border border-slate-100 mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="text" placeholder="Search by patient name..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-950 placeholder-slate-400 focus:outline-none focus:border-[#8D153A]" />
            </div>
          </div>

          {/* Appointments */}
          {loading ? (
            <div className="flex items-center justify-center py-24 text-slate-400"><Loader2 size={32} className="animate-spin mr-3" />Loading appointments...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24 text-slate-400"><Calendar size={48} className="mx-auto mb-4 opacity-30" /><p className="font-bold text-lg">No appointments found</p></div>
          ) : (
            <div className="space-y-4">
              {filtered.map(appt => (
                <div key={appt.id} className="bg-white p-6 rounded-2xl border border-slate-100 hover:shadow-lg transition-all">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-5 flex-1">
                      <div className="relative flex-shrink-0">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#8D153A] to-[#E5AB22] flex items-center justify-center text-white font-black text-lg">
                          {(appt.patientName ?? 'P').split(' ').map(n => n[0]).join('')}
                        </div>
                        {appt.priority === 'high' && <div className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full border-2 border-white" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <p className="font-black text-slate-950 text-lg">{appt.patientName}</p>
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-black border ${statusColors[appt.status ?? 'pending']}`}>{appt.status}</span>
                          {appt.priority === 'high' && <span className="px-2 py-1 bg-red-100 text-red-600 rounded-lg text-xs font-black">High Priority</span>}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm mb-3">
                          <div className="flex items-center gap-2 text-slate-600"><Clock size={14} className="text-[#8D153A]" /><span className="font-bold">{appt.time ?? appt.appointmentTime}</span></div>
                          <div className="flex items-center gap-2 text-slate-600"><Calendar size={14} className="text-[#8D153A]" /><span className="font-bold">{appt.date ?? appt.appointmentDate}</span></div>
                          <div className="flex items-center gap-2 text-slate-600">{typeIcon(appt.type)}<span className="font-bold">{appt.type ?? appt.consultationType}</span></div>
                          <div className="flex items-center gap-2 text-slate-600"><Activity size={14} /><span className="font-bold">{appt.duration}</span></div>
                        </div>
                        {appt.reason && <p className="text-sm text-slate-500 mb-2"><span className="font-black">Reason:</span> {appt.reason}</p>}
                        {appt.notes && <p className="text-sm text-slate-400 italic">{appt.notes}</p>}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <div className="flex gap-2">
                        {appt.status === 'waiting' && <button onClick={() => handleStatusUpdate(appt.id, 'confirmed')} disabled={saving} className="px-3 py-2 bg-blue-600 text-white rounded-xl text-xs font-black hover:bg-blue-700 transition-all disabled:opacity-60"><CheckCircle size={14} className="inline mr-1" />Confirm</button>}
                        {(appt.status === 'confirmed' || appt.status === 'waiting') && <button onClick={() => handleStatusUpdate(appt.id, 'completed')} disabled={saving} className="px-3 py-2 bg-emerald-600 text-white rounded-xl text-xs font-black hover:bg-emerald-700 transition-all disabled:opacity-60"><CheckCircle size={14} className="inline mr-1" />Complete</button>}
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => openEdit(appt)} className="p-2 rounded-xl bg-blue-100 text-blue-600 hover:bg-blue-200 transition-all" title="Edit"><Edit3 size={16} /></button>
                        <button onClick={() => { setDeletingAppt(appt); setShowDeleteModal(true); }} className="p-2 rounded-xl bg-red-100 text-red-600 hover:bg-red-200 transition-all" title="Cancel"><Trash2 size={16} /></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6"><h3 className="text-2xl font-black">New Appointment</h3><button onClick={() => setShowAddModal(false)} className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200"><X size={20} /></button></div>
            <AppointmentFormFields />
            <div className="flex gap-3 mt-6">
              <button onClick={handleCreate} disabled={saving} className="flex-1 py-4 bg-[#8D153A] text-white rounded-2xl font-black hover:bg-[#71112D] disabled:opacity-60 flex items-center justify-center gap-2">
                {saving ? <><Loader2 size={18} className="animate-spin" />Saving...</> : 'Create Appointment'}
              </button>
              <button onClick={() => setShowAddModal(false)} className="flex-1 py-4 bg-slate-100 text-slate-700 rounded-2xl font-black hover:bg-slate-200">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingAppt && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6"><h3 className="text-2xl font-black">Edit Appointment</h3><button onClick={() => setShowEditModal(false)} className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200"><X size={20} /></button></div>
            <AppointmentFormFields />
            <div className="flex gap-3 mt-6">
              <button onClick={handleUpdate} disabled={saving} className="flex-1 py-4 bg-[#8D153A] text-white rounded-2xl font-black hover:bg-[#71112D] disabled:opacity-60 flex items-center justify-center gap-2">
                {saving ? <><Loader2 size={18} className="animate-spin" />Saving...</> : 'Save Changes'}
              </button>
              <button onClick={() => setShowEditModal(false)} className="flex-1 py-4 bg-slate-100 text-slate-700 rounded-2xl font-black hover:bg-slate-200">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {showDeleteModal && deletingAppt && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4"><AlertTriangle size={32} className="text-red-600" /></div>
            <h3 className="text-2xl font-black mb-2">Cancel Appointment?</h3>
            <p className="text-slate-500 font-bold mb-6">Remove appointment with <span className="text-slate-950">{deletingAppt.patientName}</span> on {deletingAppt.date}?</p>
            <div className="flex gap-3">
              <button onClick={handleDelete} disabled={saving} className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-black hover:bg-red-700 disabled:opacity-60 flex items-center justify-center gap-2">
                {saving ? <><Loader2 size={18} className="animate-spin" />...</> : 'Cancel Appointment'}
              </button>
              <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-4 bg-slate-100 text-slate-700 rounded-2xl font-black">Keep</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
