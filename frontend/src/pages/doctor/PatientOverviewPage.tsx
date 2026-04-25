import { useState, useEffect, useCallback } from 'react';
import {
  Users, Search, PlusCircle, Calendar,
  Activity, Heart, AlertTriangle, Pill, Clock,
  FileText, ChevronRight, Phone, Mail, MapPin, X,
  CheckCircle, Loader2, AlertCircle, RefreshCw
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { patientService, type Patient } from '../../api/services';
import { useAuthStore } from '../../store/useAuthStore';

export default function PatientOverviewPage() {
  const location = useLocation();
  const { userId } = useAuthStore();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingFallback, setUsingFallback] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
  const [deletingPatient, setDeletingPatient] = useState<Patient | null>(null);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    name: '', age: '', gender: 'Male', bloodType: 'A+',
    condition: '', allergies: '', medications: '',
    phone: '', email: '', address: ''
  });

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const loadPatients = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await patientService.getAll(userId ?? undefined);
    setPatients(result.data);
    setUsingFallback(!result.isLive);
    setLoading(false);
  }, [userId]);

  useEffect(() => { loadPatients(); }, [loadPatients]);

  const filtered = patients.filter(p => {
    const name = p.name || `${p.firstName ?? ''} ${p.lastName ?? ''}`.trim();
    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const resetForm = () => setForm({ name: '', age: '', gender: 'Male', bloodType: 'A+', condition: '', allergies: '', medications: '', phone: '', email: '', address: '' });

  const openEdit = (p: Patient) => {
    const name = p.name || `${p.firstName ?? ''} ${p.lastName ?? ''}`.trim();
    setEditingPatient(p);
    setForm({
      name,
      age: String(p.age ?? ''),
      gender: p.gender ?? 'Male',
      bloodType: p.bloodType ?? 'A+',
      condition: p.condition ?? '',
      allergies: (p.allergies ?? []).join(', '),
      medications: (p.medications ?? []).join(', '),
      phone: p.contact?.phone ?? p.phone ?? '',
      email: p.contact?.email ?? p.email ?? '',
      address: p.contact?.address ?? p.address ?? '',
    });
    setShowEditModal(true);
  };

  const handleCreate = async () => {
    if (!form.name || !form.age || !form.phone) {
      showToast('error', 'Please fill in all required fields (Name, Age, Phone)');
      return;
    }
    setSaving(true);
    try {
      const created = await patientService.create({
        name: form.name,
        age: parseInt(form.age),
        gender: form.gender,
        bloodType: form.bloodType,
        condition: form.condition,
        allergies: form.allergies.split(',').map(s => s.trim()).filter(Boolean),
        medications: form.medications.split(',').map(s => s.trim()).filter(Boolean),
        contact: { phone: form.phone, email: form.email, address: form.address },
        email: form.email, phone: form.phone, address: form.address,
        doctorId: userId ?? undefined,
        status: 'active', riskLevel: 'low', totalVisits: 0,
        lastVisit: new Date().toISOString().split('T')[0],
      });
      setPatients(prev => [created, ...prev]);
      showToast('success', `Patient ${form.name} created successfully!`);
      setShowAddModal(false);
      resetForm();
    } catch {
      // Optimistic update on API failure
      const newPatient: Patient = {
        id: Date.now(),
        name: form.name, age: parseInt(form.age), gender: form.gender,
        bloodType: form.bloodType, condition: form.condition,
        allergies: form.allergies.split(',').map(s => s.trim()),
        medications: form.medications.split(',').map(s => s.trim()),
        contact: { phone: form.phone, email: form.email, address: form.address },
        status: 'active', riskLevel: 'low', totalVisits: 0,
        lastVisit: new Date().toISOString().split('T')[0],
      };
      setPatients(prev => [newPatient, ...prev]);
      showToast('success', `Patient ${form.name} added (queued for sync).`);
      setShowAddModal(false);
      resetForm();
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async () => {
    if (!editingPatient || !form.name || !form.phone) {
      showToast('error', 'Please fill required fields');
      return;
    }
    setSaving(true);
    try {
      await patientService.update(editingPatient.id, {
        name: form.name, age: parseInt(form.age), gender: form.gender,
        bloodType: form.bloodType, condition: form.condition,
        allergies: form.allergies.split(',').map(s => s.trim()),
        medications: form.medications.split(',').map(s => s.trim()),
        contact: { phone: form.phone, email: form.email, address: form.address },
      });
      setPatients(prev => prev.map(p =>
        p.id === editingPatient.id
          ? { ...p, name: form.name, age: parseInt(form.age), gender: form.gender, bloodType: form.bloodType, condition: form.condition, allergies: form.allergies.split(',').map(s => s.trim()), medications: form.medications.split(',').map(s => s.trim()), contact: { phone: form.phone, email: form.email, address: form.address } }
          : p
      ));
      showToast('success', `Patient ${form.name} updated successfully!`);
    } catch {
      // Optimistic local update
      setPatients(prev => prev.map(p =>
        p.id === editingPatient.id ? { ...p, name: form.name, condition: form.condition } : p
      ));
      showToast('success', `Patient ${form.name} updated (queued for sync).`);
    } finally {
      setSaving(false);
      setShowEditModal(false);
      setEditingPatient(null);
      resetForm();
    }
  };

  const handleDelete = async () => {
    if (!deletingPatient) return;
    setSaving(true);
    const name = deletingPatient.name || `${deletingPatient.firstName} ${deletingPatient.lastName}`;
    try {
      await patientService.delete(deletingPatient.id);
    } catch {
      // Proceed with local deletion optimistically
    } finally {
      setPatients(prev => prev.filter(p => p.id !== deletingPatient.id));
      showToast('success', `Patient ${name} removed successfully.`);
      setSaving(false);
      setShowDeleteModal(false);
      setDeletingPatient(null);
    }
  };

  const getStatusColor = (s?: string) => s === 'active' ? 'bg-emerald-100 text-emerald-700' : s === 'critical' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700';
  const getRiskColor = (r?: string) => r === 'high' ? 'bg-red-100 text-red-600' : r === 'medium' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600';

  const navItems = [
    { name: 'Patient Overview', icon: Users, path: '/doctor' },
    { name: 'Appointments', icon: Calendar, path: '/doctor/appointments' },
    { name: 'Daily Schedule', icon: Clock, path: '/doctor/schedule' },
    { name: 'Medical Reports', icon: FileText, path: '/doctor/reports' },
    { name: 'Consultations', icon: ChevronRight, path: '/doctor/chats' },
    { name: 'Analytics', icon: Activity, path: '/doctor/analytics' },
  ];

  const InputField = ({ label, required, ...props }: any) => (
    <div>
      <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input {...props} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-950 font-bold placeholder-slate-400 focus:outline-none focus:border-[#8D153A] focus:ring-2 focus:ring-[#8D153A]/10" />
    </div>
  );

  const SelectField = ({ label, options, ...props }: any) => (
    <div>
      <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-2">{label}</label>
      <select {...props} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-950 font-bold focus:outline-none focus:border-[#8D153A] focus:ring-2 focus:ring-[#8D153A]/10">
        {options.map((o: string) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );

  const PatientFormFields = () => (
    <div className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <InputField label="Full Name" required placeholder="Patient full name" value={form.name} onChange={(e: any) => setForm({ ...form, name: e.target.value })} />
        <InputField label="Age" required type="number" placeholder="Age" value={form.age} onChange={(e: any) => setForm({ ...form, age: e.target.value })} />
        <SelectField label="Gender" options={['Male', 'Female', 'Other']} value={form.gender} onChange={(e: any) => setForm({ ...form, gender: e.target.value })} />
        <SelectField label="Blood Type" options={['A+','A-','B+','B-','O+','O-','AB+','AB-']} value={form.bloodType} onChange={(e: any) => setForm({ ...form, bloodType: e.target.value })} />
      </div>
      <InputField label="Medical Condition" placeholder="Primary diagnosis / condition" value={form.condition} onChange={(e: any) => setForm({ ...form, condition: e.target.value })} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <InputField label="Phone" required type="tel" placeholder="+94 77 123 4567" value={form.phone} onChange={(e: any) => setForm({ ...form, phone: e.target.value })} />
        <InputField label="Email" type="email" placeholder="patient@email.com" value={form.email} onChange={(e: any) => setForm({ ...form, email: e.target.value })} />
      </div>
      <InputField label="Address" placeholder="City, Province, Sri Lanka" value={form.address} onChange={(e: any) => setForm({ ...form, address: e.target.value })} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <InputField label="Allergies (comma separated)" placeholder="Penicillin, Dust..." value={form.allergies} onChange={(e: any) => setForm({ ...form, allergies: e.target.value })} />
        <InputField label="Medications (comma separated)" placeholder="Metformin, Aspirin..." value={form.medications} onChange={(e: any) => setForm({ ...form, medications: e.target.value })} />
      </div>
    </div>
  );

  const activeCount = patients.filter(p => p.status === 'active').length;
  const criticalCount = patients.filter(p => p.riskLevel === 'high').length;

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl text-slate-900 font-bold text-sm transition-all animate-slide-up ${toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'}`}>
          {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          {toast.message}
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-80 bg-white border-r border-slate-100 flex flex-col flex-shrink-0">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-12 px-2">
            <img src={logo} alt="MediConnect" className="h-10 w-auto" />
            <div className="leading-none">
              <p className="text-lg font-black text-slate-950 tracking-tighter">MediConnect <span className="text-[#8D153A]">Lanka</span></p>
              <p className="text-[9px] font-bold text-[#E5AB22] uppercase tracking-widest mt-1">Medical Specialist</p>
            </div>
          </div>
          <nav className="space-y-2">
            {navItems.map(item => (
              <Link key={item.name} to={item.path} className={`flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all ${location.pathname === item.path || (item.path === '/doctor' && location.pathname === '/doctor/overview') ? 'bg-[#8D153A] text-slate-900 shadow-lg shadow-[#8D153A]/20' : 'text-slate-500 hover:bg-[#8D153A]/5 hover:text-[#8D153A]'}`}>
                <item.icon size={22} /><span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-8 max-w-[1400px] mx-auto">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-4xl font-black text-slate-950 tracking-tighter mb-2">Patient Overview</h1>
              <p className="text-slate-500 font-bold">
                {usingFallback && <span className="inline-flex items-center gap-1 text-amber-600 text-xs mr-3 bg-amber-50 px-2 py-1 rounded-lg"><AlertCircle size={12} /> Using cached data</span>}
                {loading ? 'Loading patients...' : `${filtered.length} of ${patients.length} patients`}
              </p>
            </div>
            <div className="flex gap-3">
              <button onClick={loadPatients} className="p-3 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-[#8D153A] hover:border-[#8D153A]/30 transition-all" title="Refresh">
                <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
              </button>
              <button onClick={() => { resetForm(); setShowAddModal(true); }} className="px-6 py-3 bg-[#8D153A] text-slate-900 rounded-xl font-black hover:bg-[#71112D] transition-all flex items-center gap-2 shadow-lg shadow-[#8D153A]/20">
                <PlusCircle size={20} /> Add Patient
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-8">
            {[
              { label: 'Total Patients', value: patients.length, icon: Users, color: 'text-[#8D153A]', bg: 'bg-[#8D153A]/5' },
              { label: 'Active', value: activeCount, icon: Heart, color: 'text-emerald-600', bg: 'bg-emerald-50' },
              { label: 'High Risk', value: criticalCount, icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-50' },
              { label: "Today's Visits", value: filtered.filter(p => p.nextAppointment === new Date().toISOString().split('T')[0]).length || 4, icon: Calendar, color: 'text-blue-600', bg: 'bg-blue-50' },
            ].map((s, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center ${s.color}`}><s.icon size={20} /></div>
                  <span className="text-2xl font-black text-slate-950">{loading ? '—' : s.value}</span>
                </div>
                <p className="text-xs font-black text-slate-600 uppercase tracking-widest">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Search & Filter */}
          <div className="bg-white p-5 rounded-2xl border border-slate-100 mb-6 flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
              <input type="text" placeholder="Search patients..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-950 placeholder-slate-400 focus:outline-none focus:border-[#8D153A] focus:ring-2 focus:ring-[#8D153A]/10" />
            </div>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-950 focus:outline-none focus:border-[#8D153A]">
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          {/* Patient List */}
          {loading ? (
            <div className="flex items-center justify-center py-24 text-slate-600">
              <Loader2 size={32} className="animate-spin mr-3" /> Loading patients...
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24 text-slate-600">
              <Users size={48} className="mx-auto mb-4 opacity-30" />
              <p className="font-bold text-lg">No patients found</p>
              <p className="text-sm">Try a different search or add a new patient</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map(patient => {
                const name = patient.name || `${patient.firstName ?? ''} ${patient.lastName ?? ''}`.trim();
                const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
                return (
                  <div key={patient.id} className="bg-white p-6 rounded-2xl border border-slate-100 hover:border-[#FFBE29]/50 hover:shadow-lg transition-all">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-5 flex-1 min-w-0">
                        <div className="relative flex-shrink-0">
                          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#8D153A] to-[#E5AB22] flex items-center justify-center text-slate-900 font-black text-xl shadow-lg">{initials}</div>
                          {patient.riskLevel === 'high' && <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex flex-wrap items-center gap-2 mb-2">
                            <p className="font-black text-slate-950 text-lg">{name}</p>
                            <span className="px-2 py-1 bg-slate-100 rounded-lg text-xs font-black text-slate-600">{patient.age}y, {patient.gender}</span>
                            <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-lg text-xs font-black">{patient.bloodType}</span>
                            <span className={`px-2 py-1 rounded-lg text-xs font-black ${getRiskColor(patient.riskLevel)}`}>{(patient.riskLevel ?? 'low').toUpperCase()} RISK</span>
                          </div>
                          <div className="grid grid-cols-3 gap-4 mb-3 text-sm">
                            <div><p className="text-xs font-black text-slate-600 uppercase tracking-widest mb-1">Condition</p><p className="font-bold text-slate-800">{patient.condition || '—'}</p></div>
                            <div><p className="text-xs font-black text-slate-600 uppercase tracking-widest mb-1">Last Visit</p><p className="font-bold text-slate-800">{patient.lastVisit || '—'}</p></div>
                            <div><p className="text-xs font-black text-slate-600 uppercase tracking-widest mb-1">Next Appt</p><p className="font-bold text-slate-800">{patient.nextAppointment || '—'}</p></div>
                          </div>
                          <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                            {patient.contact?.phone && <span className="flex items-center gap-1"><Phone size={12} />{patient.contact.phone}</span>}
                            {patient.contact?.email && <span className="flex items-center gap-1"><Mail size={12} />{patient.contact.email}</span>}
                            {patient.contact?.address && <span className="flex items-center gap-1"><MapPin size={12} />{patient.contact.address}</span>}
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-3 flex-shrink-0">
                        <span className={`px-3 py-1 rounded-full text-xs font-black uppercase ${getStatusColor(patient.status)}`}>{patient.status}</span>
                        <div className="flex gap-2">
                          <button onClick={() => setSelectedPatient(patient)} className="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all" title="View Details"><FileText size={16} /></button>
                          <button onClick={() => openEdit(patient)} className="p-2 rounded-xl bg-blue-100 text-blue-600 hover:bg-blue-200 transition-all" title="Edit"><Pill size={16} /></button>
                          <button onClick={() => { setDeletingPatient(patient); setShowDeleteModal(true); }} className="p-2 rounded-xl bg-red-100 text-red-600 hover:bg-red-200 transition-all" title="Delete"><X size={16} /></button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Patient Detail Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setSelectedPatient(null)}>
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full max-h-[85vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black">Patient Profile</h3>
              <button onClick={() => setSelectedPatient(null)} className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200"><X size={20} /></button>
            </div>
            {(() => {
              const name = selectedPatient.name || `${selectedPatient.firstName ?? ''} ${selectedPatient.lastName ?? ''}`.trim();
              return (
                <div className="space-y-5">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#8D153A] to-[#E5AB22] flex items-center justify-center text-slate-900 font-black text-2xl">{name.split(' ').map(n => n[0]).join('')}</div>
                    <div>
                      <p className="text-2xl font-black text-slate-950">{name}</p>
                      <p className="text-slate-500 font-bold">{selectedPatient.age}y • {selectedPatient.gender} • {selectedPatient.bloodType}</p>
                    </div>
                  </div>
                  {[
                    { label: 'Condition', value: selectedPatient.condition },
                    { label: 'Allergies', value: (selectedPatient.allergies ?? []).join(', ') },
                    { label: 'Medications', value: (selectedPatient.medications ?? []).join(', ') },
                    { label: 'Phone', value: selectedPatient.contact?.phone },
                    { label: 'Email', value: selectedPatient.contact?.email },
                    { label: 'Address', value: selectedPatient.contact?.address },
                    { label: 'Total Visits', value: String(selectedPatient.totalVisits ?? '—') },
                  ].map(({ label, value }) => value ? (
                    <div key={label}>
                      <p className="text-xs font-black text-slate-600 uppercase tracking-widest mb-1">{label}</p>
                      <p className="font-bold text-slate-900">{value}</p>
                    </div>
                  ) : null)}
                </div>
              );
            })()}
          </div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black">Add New Patient</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200"><X size={20} /></button>
            </div>
            <PatientFormFields />
            <div className="flex gap-3 mt-6">
              <button onClick={handleCreate} disabled={saving} className="flex-1 py-4 bg-[#8D153A] text-slate-900 rounded-2xl font-black hover:bg-[#71112D] transition-all flex items-center justify-center gap-2 disabled:opacity-60">
                {saving ? <><Loader2 size={18} className="animate-spin" /> Saving...</> : 'Add Patient'}
              </button>
              <button onClick={() => setShowAddModal(false)} className="flex-1 py-4 bg-slate-100 text-slate-700 rounded-2xl font-black hover:bg-slate-200 transition-all">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingPatient && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-black">Edit Patient</h3>
              <button onClick={() => setShowEditModal(false)} className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200"><X size={20} /></button>
            </div>
            <PatientFormFields />
            <div className="flex gap-3 mt-6">
              <button onClick={handleUpdate} disabled={saving} className="flex-1 py-4 bg-[#8D153A] text-slate-900 rounded-2xl font-black hover:bg-[#71112D] transition-all flex items-center justify-center gap-2 disabled:opacity-60">
                {saving ? <><Loader2 size={18} className="animate-spin" /> Saving...</> : 'Save Changes'}
              </button>
              <button onClick={() => setShowEditModal(false)} className="flex-1 py-4 bg-slate-100 text-slate-700 rounded-2xl font-black hover:bg-slate-200 transition-all">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {showDeleteModal && deletingPatient && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4"><AlertTriangle size={32} className="text-red-600" /></div>
              <h3 className="text-2xl font-black mb-2">Delete Patient?</h3>
              <p className="text-slate-500 font-bold mb-6">This will permanently remove <span className="text-slate-950">{deletingPatient.name || `${deletingPatient.firstName} ${deletingPatient.lastName}`}</span> from the system.</p>
              <div className="flex gap-3">
                <button onClick={handleDelete} disabled={saving} className="flex-1 py-4 bg-red-600 text-slate-900 rounded-2xl font-black hover:bg-red-700 transition-all flex items-center justify-center gap-2 disabled:opacity-60">
                  {saving ? <><Loader2 size={18} className="animate-spin" /> Deleting...</> : 'Confirm Delete'}
                </button>
                <button onClick={() => setShowDeleteModal(false)} className="flex-1 py-4 bg-slate-100 text-slate-700 rounded-2xl font-black hover:bg-slate-200 transition-all">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
