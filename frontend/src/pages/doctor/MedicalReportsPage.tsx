import { useState, useEffect, useCallback } from 'react';
import {
  FileText, PlusCircle, Search, X, ChevronRight,
  Calendar, Clock, Users, Activity, Pill,
  AlertCircle, CheckCircle, Loader2, RefreshCw, Trash2, Edit3
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { prescriptionService, type Prescription } from '../../api/services';
import { useAuthStore } from '../../store/useAuthStore';

export default function MedicalReportsPage() {
  const location = useLocation();
  const { userId, user } = useAuthStore();
  const [reports, setReports] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingReport, setEditingReport] = useState<Prescription | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [form, setForm] = useState({
    patientName: '', medicineName: '', dosage: '',
    duration: '30 days', instructions: '', diagnosis: '',
    status: 'active' as 'active' | 'completed' | 'cancelled'
  });

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const load = useCallback(async () => {
    setLoading(true);
    const result = await prescriptionService.getAll({ doctorId: userId ?? undefined });
    setReports(result.data);
    setUsingFallback(!result.isLive);
    setLoading(false);
  }, [userId]);

  useEffect(() => { load(); }, [load]);

  const filtered = reports.filter(r => {
    const name = r.patientName ?? '';
    const matchSearch = name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.medicineName ?? '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const resetForm = () => setForm({ patientName: '', medicineName: '', dosage: '', duration: '30 days', instructions: '', diagnosis: '', status: 'active' });

  const handleCreate = async () => {
    if (!form.patientName || !form.medicineName || !form.dosage) {
      showToast('error', 'Patient name, medicine, and dosage are required.');
      return;
    }
    setSaving(true);
    const newReport: Prescription = {
      id: Date.now(),
      ...form,
      doctorId: userId ?? undefined,
      createdAt: new Date().toISOString().split('T')[0],
    };
    try {
      const created = await prescriptionService.create({ ...newReport });
      setReports(prev => [created, ...prev]);
    } catch {
      setReports(prev => [newReport, ...prev]);
    } finally {
      showToast('success', `Prescription for ${form.patientName} created!`);
      setSaving(false);
      setShowAddModal(false);
      resetForm();
    }
  };

  const handleUpdate = async () => {
    if (!editingReport) return;
    setSaving(true);
    try {
      await prescriptionService.update(editingReport.id, { ...form });
    } catch { /* optimistic */ }
    setReports(prev => prev.map(r => r.id === editingReport.id ? { ...r, ...form } : r));
    showToast('success', 'Prescription updated!');
    setSaving(false);
    setShowEditModal(false);
    setEditingReport(null);
    resetForm();
  };

  const handleDelete = async (id: number | string, name: string) => {
    if (!confirm(`Delete prescription for ${name}?`)) return;
    try {
      await prescriptionService.delete(id);
    } catch { /* optimistic */ }
    setReports(prev => prev.filter(r => r.id !== id));
    showToast('success', `Prescription deleted.`);
  };

  const openEdit = (r: Prescription) => {
    setEditingReport(r);
    setForm({
      patientName: r.patientName ?? '',
      medicineName: r.medicineName ?? '',
      dosage: r.dosage ?? '',
      duration: r.duration ?? '30 days',
      instructions: r.instructions ?? '',
      diagnosis: r.diagnosis ?? '',
      status: r.status ?? 'active',
    });
    setShowEditModal(true);
  };

  const statusColors: Record<string, string> = {
    active: 'bg-emerald-100 text-emerald-700',
    completed: 'bg-blue-100 text-blue-700',
    cancelled: 'bg-red-100 text-red-700',
  };

  const navItems = [
    { name: 'Patient Overview', icon: Users, path: '/doctor' },
    { name: 'Appointments', icon: Calendar, path: '/doctor/appointments' },
    { name: 'Daily Schedule', icon: Clock, path: '/doctor/schedule' },
    { name: 'Medical Reports', icon: FileText, path: '/doctor/reports' },
    { name: 'Consultations', icon: ChevronRight, path: '/doctor/chats' },
    { name: 'Analytics', icon: Activity, path: '/doctor/analytics' },
  ];

  const inputClass = "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-950 font-bold placeholder-slate-400 focus:outline-none focus:border-[#8D153A] focus:ring-2 focus:ring-[#8D153A]/10";

  const FormFields = () => (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {[
          { label: 'Patient Name *', key: 'patientName', placeholder: 'Patient full name' },
          { label: 'Diagnosis', key: 'diagnosis', placeholder: 'Medical diagnosis' },
          { label: 'Medicine Name *', key: 'medicineName', placeholder: 'e.g., Metformin 500mg' },
          { label: 'Dosage *', key: 'dosage', placeholder: 'e.g., 1 tablet daily' },
        ].map(({ label, key, placeholder }) => (
          <div key={key}>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">{label}</label>
            <input type="text" className={inputClass} placeholder={placeholder}
              value={(form as any)[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} />
          </div>
        ))}
        <div>
          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Duration</label>
          <select className={inputClass} value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })}>
            {['7 days', '14 days', '30 days', '60 days', '90 days', 'Ongoing'].map(d => <option key={d}>{d}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Status</label>
          <select className={inputClass} value={form.status} onChange={e => setForm({ ...form, status: e.target.value as any })}>
            {['active', 'completed', 'cancelled'].map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Instructions</label>
        <textarea className={inputClass + ' resize-none'} rows={3} placeholder="Special instructions for the patient..."
          value={form.instructions} onChange={e => setForm({ ...form, instructions: e.target.value })} />
      </div>
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
              <h1 className="text-4xl font-black text-slate-950 tracking-tighter mb-1">Medical Reports</h1>
              <p className="text-slate-500 font-bold text-sm">
                {usingFallback && <span className="inline-flex items-center gap-1 text-amber-600 bg-amber-50 px-2 py-1 rounded-lg mr-2 text-xs"><AlertCircle size={12} />Using cached data</span>}
                Prescriptions by Dr. {(user as any)?.firstName || 'Doctor'}
              </p>
            </div>
            <div className="flex gap-3">
              <button onClick={load} className="p-3 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-[#8D153A] transition-all"><RefreshCw size={20} className={loading ? 'animate-spin' : ''} /></button>
              <button onClick={() => { resetForm(); setShowAddModal(true); }} className="px-6 py-3 bg-[#8D153A] text-white rounded-xl font-black hover:bg-[#71112D] transition-all flex items-center gap-2 shadow-lg shadow-[#8D153A]/20">
                <PlusCircle size={20} /> New Prescription
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-5 mb-8">
            {[
              { label: 'Total', value: reports.length, color: 'text-slate-950' },
              { label: 'Active', value: reports.filter(r => r.status === 'active').length, color: 'text-emerald-700' },
              { label: 'Completed', value: reports.filter(r => r.status === 'completed').length, color: 'text-blue-700' },
            ].map((s, i) => (
              <div key={i} className="bg-white p-5 rounded-2xl border border-slate-100 text-center">
                <p className={`text-3xl font-black ${s.color}`}>{loading ? '—' : s.value}</p>
                <p className="text-xs font-black text-slate-400 uppercase tracking-widest mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="bg-white p-4 rounded-2xl border border-slate-100 mb-6 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="text" placeholder="Search by patient name or medicine..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-950 placeholder-slate-400 focus:outline-none focus:border-[#8D153A]" />
            </div>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-950 focus:outline-none focus:border-[#8D153A]">
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Reports List */}
          {loading ? (
            <div className="flex items-center justify-center py-24 text-slate-400"><Loader2 size={32} className="animate-spin mr-3" />Loading prescriptions...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24 text-slate-400"><FileText size={48} className="mx-auto mb-4 opacity-30" /><p className="font-bold text-lg">No prescriptions found</p></div>
          ) : (
            <div className="space-y-4">
              {filtered.map(report => (
                <div key={report.id} className="bg-white p-6 rounded-2xl border border-slate-100 hover:shadow-lg transition-all">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-5 flex-1">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#8D153A] to-[#E5AB22] flex items-center justify-center text-white font-black text-xl flex-shrink-0">
                        <Pill size={28} />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <p className="font-black text-slate-950 text-lg">{report.patientName}</p>
                          <span className={`px-2.5 py-1 rounded-full text-xs font-black ${statusColors[report.status ?? 'active']}`}>{report.status}</span>
                        </div>
                        {report.diagnosis && <p className="text-sm text-slate-500 font-bold mb-2">Diagnosis: <span className="text-slate-950">{report.diagnosis}</span></p>}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                          <div><p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Medicine</p><p className="font-bold text-slate-900">{report.medicineName}</p></div>
                          <div><p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Dosage</p><p className="font-bold text-slate-900">{report.dosage}</p></div>
                          <div><p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Duration</p><p className="font-bold text-slate-900">{report.duration}</p></div>
                          <div><p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Date Issued</p><p className="font-bold text-slate-900">{report.createdAt ?? '—'}</p></div>
                        </div>
                        {report.instructions && <p className="text-sm text-slate-400 italic bg-slate-50 px-4 py-2 rounded-xl">{report.instructions}</p>}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 flex-shrink-0">
                      <button onClick={() => openEdit(report)} className="p-2 rounded-xl bg-blue-100 text-blue-600 hover:bg-blue-200 transition-all" title="Edit"><Edit3 size={16} /></button>
                      <button onClick={() => handleDelete(report.id, report.patientName ?? '')} className="p-2 rounded-xl bg-red-100 text-red-600 hover:bg-red-200 transition-all" title="Delete"><Trash2 size={16} /></button>
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
            <div className="flex justify-between items-center mb-6"><h3 className="text-2xl font-black">New Prescription</h3><button onClick={() => setShowAddModal(false)} className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200"><X size={20} /></button></div>
            <FormFields />
            <div className="flex gap-3 mt-6">
              <button onClick={handleCreate} disabled={saving} className="flex-1 py-4 bg-[#8D153A] text-white rounded-2xl font-black hover:bg-[#71112D] disabled:opacity-60 flex items-center justify-center gap-2">
                {saving ? <><Loader2 size={18} className="animate-spin" />Saving...</> : 'Create Prescription'}
              </button>
              <button onClick={() => setShowAddModal(false)} className="flex-1 py-4 bg-slate-100 text-slate-700 rounded-2xl font-black">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingReport && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6"><h3 className="text-2xl font-black">Edit Prescription</h3><button onClick={() => setShowEditModal(false)} className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200"><X size={20} /></button></div>
            <FormFields />
            <div className="flex gap-3 mt-6">
              <button onClick={handleUpdate} disabled={saving} className="flex-1 py-4 bg-[#8D153A] text-white rounded-2xl font-black hover:bg-[#71112D] disabled:opacity-60 flex items-center justify-center gap-2">
                {saving ? <><Loader2 size={18} className="animate-spin" />Saving...</> : 'Save Changes'}
              </button>
              <button onClick={() => setShowEditModal(false)} className="flex-1 py-4 bg-slate-100 text-slate-700 rounded-2xl font-black">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
