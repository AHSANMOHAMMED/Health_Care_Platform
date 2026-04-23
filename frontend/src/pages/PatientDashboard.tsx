import { useState, useEffect, useCallback } from 'react';
import {
  Activity, Pill, FileText, Brain, Loader2, Plus, X, CreditCard,
  Bell, LogOut, Menu, ShieldCheck, Heart, Calendar, Target, CheckCircle, AlertTriangle, PhoneCall, ChevronRight
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { Link, useNavigate } from 'react-router-dom';
import { appointmentService, prescriptionService, type Appointment, type Prescription } from '../api/services';
import { api } from '../api/axios';

const TABS = [
  { id: 'overview', label: 'Overview', icon: Activity },
  { id: 'appointments', label: 'Appointments', icon: Calendar },
  { id: 'prescriptions', label: 'Prescriptions', icon: Pill },
  { id: 'history', label: 'Medical History', icon: FileText },
  { id: 'ai-scans', label: 'AI Scan History', icon: Brain },
  { id: 'billing', label: 'Billing & Payments', icon: CreditCard },
];

export default function PatientDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const { user, userId, logout } = useAuthStore();
  const navigate = useNavigate();

  // Data
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Forms
  const [showApptModal, setShowApptModal] = useState(false);
  const [newAppt, setNewAppt] = useState({ date: '', time: '', reason: '' });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [apptRes, rxRes, txRes] = await Promise.all([
        appointmentService.getAll({ patientId: userId ?? undefined }),
        prescriptionService.getAll({ patientId: userId ?? undefined }),
        api.get(`/payments/transactions/patient/${userId}`)
      ]);
      setAppointments(apptRes.data || []);
      setPrescriptions(rxRes.data || []);
      setTransactions(txRes.data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { load(); }, [load]);

  const handleLogout = () => { logout(); navigate('/login'); };

  const handleCreateAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAppt.date || !newAppt.time) return;
    try {
      const created = await appointmentService.create({
        patientId: userId ?? 1,
        doctorId: 2, // Mock doctor
        date: newAppt.date,
        time: newAppt.time,
        status: 'pending',
        reason: newAppt.reason
      });
      setAppointments([...appointments, created]);
      setShowApptModal(false);
      setNewAppt({ date: '', time: '', reason: '' });
    } catch (error) {
      console.error('Failed to create appointment', error);
    }
  };

  const handleCancelAppointment = async (id: number) => {
    try {
      await appointmentService.delete(id);
      setAppointments(appointments.filter(a => a.id !== id));
    } catch (error) {
      console.error('Failed to delete appointment', error);
    }
  };

  const handlePayNow = (appointmentId: number, amount: number, doctorId: number, date: string) => {
    navigate(`/payment?appointmentId=${appointmentId}&amount=${amount}&doctorId=${doctorId}&date=${date}`);
  };

  if (loading) return <div className="min-h-screen bg-[#0C1220] flex items-center justify-center"><Loader2 className="w-8 h-8 text-[#0EA5E9] animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-[#0C1220] flex font-sans text-slate-300">
      
      {/* ── Sidebar ── */}
      <aside className={`fixed inset-y-0 left-0 z-40 w-64 bg-[#111B2E] border-r border-[#1E3A5F]/50 transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col">
          <div className="p-6">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#0EA5E9]/20 flex items-center justify-center">
                <ShieldCheck size={18} className="text-[#0EA5E9]" />
              </div>
              <div>
                <p className="text-sm font-bold text-white leading-none">MediConnect</p>
                <p className="text-[9px] text-slate-500 uppercase tracking-widest font-medium mt-0.5">Patient Portal</p>
              </div>
            </Link>
          </div>

          <div className="px-4 py-2">
            <div className="clinical-card p-4 mb-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#0EA5E9]/10 flex items-center justify-center text-[#0EA5E9] font-bold">
                {(user as any)?.firstName?.[0] || 'P'}
              </div>
              <div>
                <p className="text-sm font-bold text-white">{(user as any)?.firstName || 'Patient'}</p>
                <p className="text-[10px] text-slate-400">ID: {(user as any)?.id || 'PT-10024'}</p>
              </div>
            </div>

            <nav className="space-y-1">
              {TABS.map(t => (
                <button key={t.id} onClick={() => { setActiveTab(t.id); setSidebarOpen(false); }}
                  className={`w-full sidebar-link ${activeTab === t.id ? 'sidebar-link-active' : ''}`}>
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
            <Link to="/ai-checker" className="btn-primary text-xs !py-1.5 !px-3">
              <Target size={14} /> AI Checker
            </Link>
            <button className="relative p-2 text-slate-400 hover:text-white">
              <Bell size={20} /><span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#111B2E]"></span>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-4 lg:p-8 overflow-auto">
          
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="clinical-card p-5">
                  <div className="flex justify-between items-start mb-2">
                    <div className="p-2 rounded-lg bg-emerald-500/10"><Heart size={20} className="text-emerald-400" /></div>
                    <span className="badge-success">Normal</span>
                  </div>
                  <p className="text-2xl font-bold text-white">72 <span className="text-sm text-slate-500 font-normal">bpm</span></p>
                  <p className="text-xs text-slate-400 mt-1">Heart Rate</p>
                </div>
                <div className="clinical-card p-5">
                  <div className="flex justify-between items-start mb-2">
                    <div className="p-2 rounded-lg bg-sky-500/10"><Activity size={20} className="text-sky-400" /></div>
                    <span className="badge-info">Normal</span>
                  </div>
                  <p className="text-2xl font-bold text-white">120/80 <span className="text-sm text-slate-500 font-normal">mmHg</span></p>
                  <p className="text-xs text-slate-400 mt-1">Blood Pressure</p>
                </div>
                <div className="clinical-card p-5">
                  <div className="flex justify-between items-start mb-2">
                    <div className="p-2 rounded-lg bg-amber-500/10"><CheckCircle size={20} className="text-amber-400" /></div>
                    <span className="text-xs text-slate-500">Upcoming</span>
                  </div>
                  <p className="text-lg font-bold text-white truncate">
                    {appointments.find(a => a.status === 'confirmed' || a.status === 'waiting')?.date || 'No upcoming'}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">Next Appointment</p>
                </div>
              </div>

              <div className="clinical-card p-6">
                <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><AlertTriangle size={16} className="text-[#FFBE29]" /> Emergency SOS Protocol</h3>
                <div className="p-4 bg-red-900/10 border border-red-900/30 rounded-xl flex items-start gap-4">
                  <div className="p-3 bg-red-500/20 rounded-full animate-pulse"><PhoneCall size={24} className="text-red-500" /></div>
                  <div>
                    <h4 className="text-red-400 font-bold mb-1">1990 Suwa Seriya Ambulance</h4>
                    <p className="text-xs text-slate-400 mb-3">One-tap emergency alert will share your exact GPS location and critical medical history (Blood Type, Allergies) with responders.</p>
                    <button className="btn-danger">Activate SOS Alert</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appointments' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-white">My Appointments</h2>
                <button onClick={() => setShowApptModal(true)} className="btn-primary"><Plus size={16} /> Book Appointment</button>
              </div>
              
              <div className="clinical-card overflow-hidden">
                <table className="clinical-table">
                  <thead>
                    <tr>
                      <th>Date & Time</th>
                      <th>Doctor</th>
                      <th>Reason</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments.map(appt => (
                      <tr key={appt.id}>
                        <td>{appt.date} <span className="text-slate-500">at {appt.time}</span></td>
                        <td>Dr. ID {appt.doctorId}</td>
                        <td>{appt.reason || '-'}</td>
                        <td>
                          <span className={`badge-${appt.status === 'waiting' || appt.status === 'pending' ? 'warning' : appt.status === 'confirmed' || appt.status === 'completed' ? 'success' : 'danger'}`}>
                            {appt.status}
                          </span>
                        </td>
                        <td>
                          {appt.status === 'waiting' && (
                            <button onClick={() => handleCancelAppointment(Number(appt.id))} className="text-xs text-red-400 hover:underline">Cancel</button>
                          )}
                          {appt.status === 'pending' && (
                            <button onClick={() => handlePayNow(Number(appt.id), 2500, Number(appt.doctorId || 0), appt.date || '')} className="ml-3 px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-lg text-[10px] font-bold hover:bg-emerald-500/20 transition-colors">Pay Now</button>
                          )}
                        </td>
                      </tr>
                    ))}
                    {appointments.length === 0 && (
                      <tr><td colSpan={5} className="text-center py-8 text-slate-500">No appointments found.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'prescriptions' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-white">My Prescriptions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {prescriptions.map(rx => (
                  <div key={rx.id} className="clinical-card p-5 border-l-4 border-l-[#0EA5E9]">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-white flex items-center gap-2"><Pill size={16} className="text-[#0EA5E9]"/> {rx.medicineName}</h3>
                      <span className="badge-success">{rx.status}</span>
                    </div>
                    <div className="text-sm space-y-1 mb-4 text-slate-400">
                      <p><span className="text-slate-500">Dosage:</span> {rx.dosage}</p>
                      <p><span className="text-slate-500">Duration:</span> {rx.duration}</p>
                      <p><span className="text-slate-500">Instructions:</span> {rx.instructions}</p>
                    </div>
                  </div>
                ))}
                {prescriptions.length === 0 && <div className="col-span-full p-8 text-center text-slate-500 clinical-card">No active prescriptions.</div>}
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-white">My Medical Profile</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="clinical-card p-6">
                  <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><AlertTriangle size={16} className="text-amber-400" /> Allergies & Reactions</h3>
                  <div className="space-y-3">
                    {['Penicillin', 'Peanuts', 'Latex'].map(a => (
                      <div key={a} className="flex items-center justify-between p-3 bg-red-900/10 border border-red-900/20 rounded-xl">
                        <span className="text-sm font-medium text-red-400">{a}</span>
                        <span className="text-[10px] uppercase font-bold text-red-900 bg-red-400/20 px-2 py-0.5 rounded">Severe</span>
                      </div>
                    ))}
                    <button className="w-full py-2 border border-dashed border-[#1E3A5F] rounded-xl text-xs text-slate-500 hover:border-[#0EA5E9] hover:text-[#0EA5E9] transition-all">+ Add Allergy</button>
                  </div>
                </div>
                <div className="clinical-card p-6">
                  <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><Activity size={16} className="text-sky-400" /> Chronic Conditions</h3>
                  <div className="space-y-3">
                    {['Type 2 Diabetes', 'Hypertension'].map(c => (
                      <div key={c} className="flex items-center justify-between p-3 bg-sky-900/10 border border-sky-900/20 rounded-xl">
                        <span className="text-sm font-medium text-sky-400">{c}</span>
                        <span className="text-[10px] uppercase font-bold text-sky-900 bg-sky-400/20 px-2 py-0.5 rounded">Active</span>
                      </div>
                    ))}
                    <button className="w-full py-2 border border-dashed border-[#1E3A5F] rounded-xl text-xs text-slate-500 hover:border-[#0EA5E9] hover:text-[#0EA5E9] transition-all">+ Add Condition</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'ai-scans' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-white">AI Analysis History</h2>
              <div className="space-y-4">
                {[
                  { date: '2024-04-20', symptoms: 'Severe headache and blurred vision', severity: 'HIGH', specialty: 'Neurologist' },
                  { date: '2024-04-15', symptoms: 'Mild cough and sore throat', severity: 'LOW', specialty: 'General Physician' },
                  { date: '2024-03-28', symptoms: 'Chest pain and shortness of breath', severity: 'CRITICAL', specialty: 'Cardiologist' },
                ].map((scan, i) => (
                  <div key={i} className="clinical-card p-5 hover:border-[#0EA5E9]/30 transition-all cursor-pointer group">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{scan.date}</p>
                        <h4 className="font-bold text-white group-hover:text-[#0EA5E9] transition-colors">{scan.symptoms}</h4>
                      </div>
                      <span className={`badge-${scan.severity === 'CRITICAL' ? 'danger' : scan.severity === 'HIGH' ? 'warning' : 'success'}`}>{scan.severity}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <p className="text-slate-500">Recommended Specialty: <span className="text-slate-300">{scan.specialty}</span></p>
                      <button className="text-[#0EA5E9] flex items-center gap-1 font-bold">View Report <ChevronRight size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="space-y-6">
              <h2 className="text-lg font-bold text-white">Billing & Transactions</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="clinical-card p-5 border-l-4 border-l-emerald-500">
                  <p className="text-xs text-slate-500 uppercase font-bold mb-1">Total Spent</p>
                  <p className="text-2xl font-bold text-white">LKR 7,500.00</p>
                </div>
                <div className="clinical-card p-5 border-l-4 border-l-amber-500">
                  <p className="text-xs text-slate-500 uppercase font-bold mb-1">Pending Dues</p>
                  <p className="text-2xl font-bold text-white">LKR 2,500.00</p>
                </div>
              </div>
              <div className="clinical-card overflow-hidden">
                <table className="clinical-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Reference</th>
                      <th>Amount</th>
                      <th>Method</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx, i) => (
                      <tr key={i}>
                        <td>{new Date(tx.createdAt || tx.timestamp).toLocaleDateString()}</td>
                        <td className="font-mono text-[10px] text-slate-400">TXN-{tx.id}</td>
                        <td className="font-bold text-white">LKR {tx.amount.toLocaleString()}</td>
                        <td className="text-xs text-slate-500">{tx.paymentMethod || 'Stripe'}</td>
                        <td><span className={`badge-${tx.status === 'SUCCESS' ? 'success' : tx.status === 'PENDING' ? 'warning' : 'danger'}`}>{tx.status}</span></td>
                      </tr>
                    ))}
                    {transactions.length === 0 && (
                      <tr><td colSpan={5} className="text-center py-8 text-slate-500">No transaction history.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </div>
      </main>
      {showApptModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="clinical-card p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-bold text-white">Book Appointment</h3>
              <button onClick={() => setShowApptModal(false)} className="text-slate-400 hover:text-white"><X size={20} /></button>
            </div>
            <form onSubmit={handleCreateAppointment} className="space-y-4">
              <div>
                <label className="clinical-label">Date</label>
                <input type="date" required className="clinical-input" value={newAppt.date} onChange={e => setNewAppt({...newAppt, date: e.target.value})} />
              </div>
              <div>
                <label className="clinical-label">Time</label>
                <input type="time" required className="clinical-input" value={newAppt.time} onChange={e => setNewAppt({...newAppt, time: e.target.value})} />
              </div>
              <div>
                <label className="clinical-label">Reason</label>
                <textarea className="clinical-input resize-none" rows={3} value={newAppt.reason} onChange={e => setNewAppt({...newAppt, reason: e.target.value})}></textarea>
              </div>
              <div className="pt-2 flex gap-3">
                <button type="button" onClick={() => setShowApptModal(false)} className="flex-1 btn-secondary justify-center">Cancel</button>
                <button type="submit" className="flex-1 btn-primary justify-center">Confirm Booking</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
