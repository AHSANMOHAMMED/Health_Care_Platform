import { useState, useEffect, useCallback } from 'react';
import {
  Users, Calendar, Activity, Pill,
  Bell, LogOut, Search,
  ShieldCheck, Menu, X, Loader2, Plus
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { Link, useNavigate } from 'react-router-dom';
import { appointmentService, prescriptionService, type Appointment, type Prescription } from '../api/services';

const TABS = [
  { id: 'schedule', label: 'Clinical Schedule', icon: Calendar },
  { id: 'patients', label: 'Patient Records', icon: Users },
  { id: 'prescriptions', label: 'Prescription Mgmt', icon: Pill },
  { id: 'history', label: 'Consultation History', icon: Activity },
];

export default function DoctorDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('schedule');
  const { user, userId, logout } = useAuthStore();
  const navigate = useNavigate();

  // Data
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);

  // Forms
  const [showRxModal, setShowRxModal] = useState(false);
  const [newRx, setNewRx] = useState({ patientId: '', medicationName: '', dosage: '', duration: '', instructions: '' });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [apptRes, rxRes] = await Promise.all([
        appointmentService.getAll({ doctorId: userId ?? undefined }),
        prescriptionService.getAll({ doctorId: userId ?? undefined })
      ]);
      setAppointments(apptRes.data || []);
      setPrescriptions(rxRes.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { load(); }, [load]);

  const handleLogout = () => { logout(); navigate('/login'); };

  const handleCreatePrescription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newRx.medicationName || !newRx.patientId) return;
    try {
      const created = await prescriptionService.create({
        patientId: parseInt(newRx.patientId),
        doctorId: userId ?? 2,
        medicineName: newRx.medicationName,
        dosage: newRx.dosage,
        duration: newRx.duration,
        instructions: newRx.instructions,
        status: 'active'
      });
      setPrescriptions([...prescriptions, created]);
      setShowRxModal(false);
      setNewRx({ patientId: '', medicationName: '', dosage: '', duration: '', instructions: '' });
    } catch (error) {
      console.error('Failed to create prescription', error);
    }
  };

  const handleCompleteAppointment = async (id: number) => {
    try {
      const updated = await appointmentService.updateStatus(id, 'completed');
      setAppointments(appointments.map(a => a.id === id ? updated : a));
    } catch (error) {
      console.error('Failed to complete appointment', error);
    }
  };

  if (loading) return <div className="min-h-screen bg-[#0C1220] flex items-center justify-center"><Loader2 className="w-8 h-8 text-[#06B6D4] animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-[#0C1220] flex font-sans text-slate-300">
      
      {/* ── Sidebar ── */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#111B2E] border-r border-[#1E3A5F]/50 transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col">
          <div className="p-6">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#06B6D4]/20 flex items-center justify-center">
                <ShieldCheck size={18} className="text-[#06B6D4]" />
              </div>
              <div>
                <p className="text-sm font-bold text-white leading-none">MediConnect</p>
                <p className="text-[9px] text-slate-500 uppercase tracking-widest font-medium mt-0.5">Doctor Portal</p>
              </div>
            </Link>
          </div>

          <div className="px-4 py-2">
            <div className="clinical-card p-4 mb-6 flex items-center gap-3 border-l-4 border-l-[#06B6D4]">
              <div className="w-10 h-10 rounded-full bg-[#06B6D4]/10 flex items-center justify-center text-[#06B6D4] font-bold">
                Dr
              </div>
              <div>
                <p className="text-sm font-bold text-white">Dr. {(user as any)?.lastName || 'Perera'}</p>
                <p className="text-[10px] text-slate-400">Cardiology</p>
              </div>
            </div>

            <nav className="space-y-1">
              {TABS.map(t => (
                <button key={t.id} onClick={() => { setActiveTab(t.id); setSidebarOpen(false); }}
                  className={`w-full sidebar-link ${activeTab === t.id ? 'bg-[#06B6D4]/15 text-[#06B6D4] border border-[#06B6D4]/20' : ''}`}>
                  <t.icon size={18} /> {t.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="mt-auto p-4">
            <button onClick={handleLogout} className="w-full sidebar-link text-red-400 hover:bg-red-500/10 hover:text-red-300">
              <LogOut size={18} /> Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        
        {/* Header */}
        <header className="h-16 bg-[#111B2E]/80 backdrop-blur border-b border-[#1E3A5F]/50 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-slate-400 hover:text-white"><Menu size={20} /></button>
            <h1 className="text-lg font-bold text-white capitalize">{activeTab}</h1>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-400 hover:text-white">
              <Bell size={20} /><span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#06B6D4] rounded-full border-2 border-[#111B2E]"></span>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-4 lg:p-8 overflow-auto">
          
          {activeTab === 'schedule' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="clinical-card p-5">
                  <p className="text-sm text-slate-400">Upcoming Today</p>
                  <p className="text-3xl font-bold text-white mt-1">{appointments.filter(a => a.status === 'confirmed' || a.status === 'waiting').length}</p>
                </div>
                <div className="clinical-card p-5">
                  <p className="text-sm text-slate-400">Completed</p>
                  <p className="text-3xl font-bold text-[#10B981] mt-1">{appointments.filter(a => a.status === 'completed').length}</p>
                </div>
              </div>

              <div className="clinical-card overflow-hidden">
                <div className="p-4 border-b border-[#1E3A5F]/50 bg-[#132040]/50">
                  <h3 className="font-bold text-white">Upcoming Consultations</h3>
                </div>
                <table className="clinical-table">
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Patient</th>
                      <th>Reason</th>
                      <th>Payment</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.filter(a => a.status === 'confirmed' || a.status === 'waiting' || a.status === 'pending').map(appt => (
                      <tr key={appt.id}>
                        <td className="font-medium text-white">{appt.time || appt.appointmentTime} <span className="text-xs text-slate-500 block">{appt.date || appt.appointmentDate}</span></td>
                        <td>Patient ID: {appt.patientId}</td>
                        <td>{appt.reason || '-'}</td>
                        <td>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black ${appt.status === 'confirmed' || appt.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                            {appt.status === 'confirmed' || appt.status === 'completed' ? 'PAID' : 'UNPAID'}
                          </span>
                        </td>
                        <td>
                          <span className={`badge-${appt.status === 'confirmed' ? 'success' : 'warning'}`}>
                            {appt.status}
                          </span>
                        </td>
                        <td>
                          <button onClick={() => handleCompleteAppointment(Number(appt.id))} className="text-xs px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded-md hover:bg-emerald-500/20 transition-colors">Mark Complete</button>
                        </td>
                      </tr>
                    ))}
                    {appointments.filter(a => a.status === 'confirmed' || a.status === 'waiting' || a.status === 'pending').length === 0 && (
                      <tr><td colSpan={5} className="text-center py-8 text-slate-500">No active appointments.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'patients' && (
            <div className="clinical-card p-8 text-center text-slate-400">
              <Users size={48} className="mx-auto mb-4 opacity-20 text-[#06B6D4]" />
              <p>Patient directory module coming soon.</p>
            </div>
          )}

          {activeTab === 'prescriptions' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-white">Issued Prescriptions</h2>
                <button onClick={() => setShowRxModal(true)} className="btn-primary !bg-[#06B6D4] hover:!bg-[#0891B2]"><Plus size={16} /> Write Prescription</button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {prescriptions.map(rx => (
                  <div key={rx.id} className="clinical-card p-5 border-l-4 border-l-[#06B6D4]">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-white">{rx.medicineName}</h3>
                      <span className="text-xs text-slate-500">Patient ID: {rx.patientId}</span>
                    </div>
                    <div className="text-sm space-y-1 text-slate-400">
                      <p><span className="text-slate-500">Dosage:</span> {rx.dosage}</p>
                      <p><span className="text-slate-500">Duration:</span> {rx.duration}</p>
                      <p className="pt-2 mt-2 border-t border-[#1E3A5F]/30 italic">{rx.instructions}</p>
                    </div>
                  </div>
                ))}
                {prescriptions.length === 0 && <div className="col-span-full p-8 text-center text-slate-500 clinical-card">No prescriptions written yet.</div>}
              </div>
            </div>
          )}

          {activeTab === 'patients' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-white">Clinical Patient Records</h2>
                <div className="relative max-w-xs">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input type="text" className="clinical-input pl-10" placeholder="Search by name or ID..." />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { id: 'PT-102', name: 'Aruni Wijesinghe', age: 34, lastVisit: '2024-04-10', condition: 'Hypertension' },
                  { id: 'PT-105', name: 'Sunil Perera', age: 45, lastVisit: '2024-04-12', condition: 'Type 2 Diabetes' },
                  { id: 'PT-110', name: 'Kamala Silva', age: 28, lastVisit: '2024-04-05', condition: 'Asthma' },
                ].map(p => (
                  <div key={p.id} className="clinical-card p-5 group hover:border-[#06B6D4]/30 cursor-pointer transition-all">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-[#06B6D4]/10 flex items-center justify-center text-[#06B6D4] font-bold">
                        {p.name[0]}
                      </div>
                      <div>
                        <h4 className="font-bold text-white group-hover:text-[#06B6D4] transition-colors">{p.name}</h4>
                        <p className="text-[10px] text-slate-500">ID: {p.id} • {p.age} Yrs</p>
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Primary Condition:</span>
                        <span className="text-slate-300">{p.condition}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-500">Last Consultation:</span>
                        <span className="text-slate-300">{p.lastVisit}</span>
                      </div>
                    </div>
                    <button className="w-full py-2 bg-[#111B2E] border border-[#1E3A5F] rounded-lg text-xs font-bold hover:bg-[#06B6D4]/10 hover:border-[#06B6D4]/50 transition-all">Open Full Record</button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="clinical-card overflow-hidden">
              <div className="p-4 border-b border-[#1E3A5F]/50 bg-[#132040]/50">
                <h3 className="font-bold text-white">Past Consultations</h3>
              </div>
              <table className="clinical-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Patient</th>
                    <th>Diagnosis</th>
                    <th>Outcome</th>
                    <th>Report</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { date: '2024-04-15', patient: 'Sunil Perera', diagnosis: 'Reflux Esophagitis', outcome: 'Prescribed PPI', report: 'PDF' },
                    { date: '2024-04-10', patient: 'Aruni Wijesinghe', diagnosis: 'Essential Hypertension', outcome: 'Adjusted Dosage', report: 'PDF' },
                  ].map((h, i) => (
                    <tr key={i}>
                      <td>{h.date}</td>
                      <td className="font-bold text-white">{h.patient}</td>
                      <td>{h.diagnosis}</td>
                      <td><span className="text-xs text-slate-400">{h.outcome}</span></td>
                      <td><button className="text-[#06B6D4] hover:underline font-bold text-xs">Download</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </main>

      {/* Write Prescription Modal */}
      {showRxModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="clinical-card p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-bold text-white">Write Prescription</h3>
              <button onClick={() => setShowRxModal(false)} className="text-slate-400 hover:text-white"><X size={20} /></button>
            </div>
            <form onSubmit={handleCreatePrescription} className="space-y-4">
              <div>
                <label className="clinical-label">Patient ID</label>
                <input type="number" required className="clinical-input" value={newRx.patientId} onChange={e => setNewRx({...newRx, patientId: e.target.value})} />
              </div>
              <div>
                <label className="clinical-label">Medication Name</label>
                <input type="text" required className="clinical-input" value={newRx.medicationName} onChange={e => setNewRx({...newRx, medicationName: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="clinical-label">Dosage</label>
                  <input type="text" required className="clinical-input" placeholder="e.g. 500mg twice daily" value={newRx.dosage} onChange={e => setNewRx({...newRx, dosage: e.target.value})} />
                </div>
                <div>
                  <label className="clinical-label">Duration</label>
                  <input type="text" required className="clinical-input" placeholder="e.g. 5 days" value={newRx.duration} onChange={e => setNewRx({...newRx, duration: e.target.value})} />
                </div>
              </div>
              <div>
                <label className="clinical-label">Instructions</label>
                <textarea className="clinical-input resize-none" rows={3} placeholder="Take after meals..." value={newRx.instructions} onChange={e => setNewRx({...newRx, instructions: e.target.value})}></textarea>
              </div>
              <div className="pt-2 flex gap-3">
                <button type="button" onClick={() => setShowRxModal(false)} className="flex-1 btn-secondary justify-center">Cancel</button>
                <button type="submit" className="flex-1 btn-primary !bg-[#06B6D4] hover:!bg-[#0891B2] justify-center">Issue Prescription</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
