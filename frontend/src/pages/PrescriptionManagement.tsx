import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Calendar, 
  Search, 
  Filter, 
  Clock, 
  Stethoscope, 
  Activity, 
  ExternalLink,
  ChevronRight,
  TrendingDown,
  TrendingUp,
  AlertCircle,
  Share2
} from 'lucide-react';
import { api } from '../api/axios';
import { useAuthStore } from '../store/useAuthStore';

interface Prescription {
  prescriptionId: number;
  diagnosis: string;
  instructions: string;
  doctorName: string;
  doctorSpecialization: string;
  issuedAt: string;
  status: string;
  medicines: Array<{
    medicineName: string;
    dosage: string;
    frequency: string;
    duration: string;
    notes: string;
  }>;
}

interface LabResult {
  id: string;
  testName: string;
  category: string;
  value: string;
  range: string;
  unit: string;
  date: string;
  trend: 'up' | 'down' | 'stable';
  status: 'normal' | 'abnormal' | 'critical';
}

export default function PrescriptionManagement() {
  const { userId } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'prescriptions' | 'lab-results'>('prescriptions');
  const [loading, setLoading] = useState(true);
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  
  const [labResults] = useState<LabResult[]>([
    { id: 'LAB-001', testName: 'Hemoglobin A1c', category: 'Diabetes', value: '5.7', range: '4.8 - 5.6', unit: '%', date: '2024-03-10', trend: 'down', status: 'abnormal' },
    { id: 'LAB-002', testName: 'Total Cholesterol', category: 'Lipid Profile', value: '185', range: '< 200', unit: 'mg/dL', date: '2024-03-10', trend: 'stable', status: 'normal' },
    { id: 'LAB-003', testName: 'Platelets', category: 'CBC', value: '250', range: '150 - 450', unit: 'x10³/µL', date: '2024-03-05', trend: 'up', status: 'normal' }
  ]);

  useEffect(() => {
    if (userId && activeTab === 'prescriptions') {
      fetchPrescriptions();
    }
  }, [userId, activeTab]);

  const fetchPrescriptions = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/prescriptions/patient/${userId}`);
      if (response.data) setPrescriptions(response.data);
    } catch (error) {
      console.error('Failed to fetch prescriptions:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 animate-slide-up">
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Medical Records</h1>
          <p className="text-lg text-slate-500 font-medium mt-1">Manage your active prescriptions and diagnostic data.</p>
        </div>
        
        <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
           <button 
             onClick={() => setActiveTab('prescriptions')}
             className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all duration-300 ${activeTab === 'prescriptions' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}>
              <FileText size={20}/> Prescriptions
           </button>
           <button 
             onClick={() => setActiveTab('lab-results')}
             className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all duration-300 ${activeTab === 'lab-results' ? 'bg-white text-indigo-600 shadow-md' : 'text-slate-500 hover:text-slate-700'}`}>
              <Activity size={20}/> Lab Results
           </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Controls */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
              <input type="text" placeholder={`Search ${activeTab === 'prescriptions' ? 'medications' : 'tests'}...`} className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl font-medium focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all shadow-sm" />
            </div>
            <button className="h-14 w-14 bg-white border border-slate-200 rounded-2xl flex items-center justify-center text-slate-600 hover:bg-slate-50 shadow-sm transition-all">
               <Filter size={20} />
            </button>
          </div>          {activeTab === 'prescriptions' ? (
             <div className="grid gap-6">
                {loading ? (
                   <div className="flex justify-center p-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                   </div>
                ) : prescriptions.length === 0 ? (
                   <div className="text-center p-12 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                      <FileText size={48} className="mx-auto text-slate-700 mb-4" />
                      <h3 className="text-xl font-bold text-slate-900">No prescriptions found</h3>
                      <p className="text-slate-500">You don't have any prescription records yet.</p>
                   </div>
                ) : prescriptions.map(px => (
                  <div key={px.prescriptionId} className="premium-glass p-8 group hover:border-indigo-200 transition-all cursor-pointer relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-1.5 h-full bg-indigo-500 group-hover:w-2 transition-all"></div>
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex gap-5">
                         <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center text-slate-900 shrink-0 shadow-lg group-hover:scale-105 transition-transform duration-500">
                            <Stethoscope size={32} />
                         </div>
                         <div>
                            <div className="flex items-center gap-3 mb-1">
                               <h3 className="text-2xl font-black text-slate-900 tracking-tight">{px.medicines?.[0]?.medicineName || 'Medication'}</h3>
                               <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest border ${
                                 px.status?.toLowerCase() === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                                 px.status?.toLowerCase() === 'completed' ? 'bg-slate-100 text-slate-500 border-slate-200' : 
                                 'bg-red-50 text-red-600 border-red-100'
                               }`}>
                                 {px.status}
                               </span>
                            </div>
                            <p className="text-slate-500 font-bold flex items-center gap-2">
                               <FileText size={16} className="text-slate-600" /> #{px.prescriptionId} • {px.doctorName || 'Unknown Doctor'}
                            </p>
                         </div>
                      </div>
                      <div className="flex gap-2">
                         <button className="h-10 w-10 bg-slate-50 text-slate-500 rounded-xl flex items-center justify-center hover:bg-indigo-50 hover:text-indigo-600 transition-colors shadow-inner" title="Share">
                            <Share2 size={18} />
                         </button>
                         <button className="h-10 w-10 bg-slate-50 text-slate-500 rounded-xl flex items-center justify-center hover:bg-indigo-50 hover:text-indigo-600 transition-colors shadow-inner" title="Download PDF">
                            <Download size={18} />
                         </button>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 bg-slate-50 rounded-2xl p-6 border border-slate-100 mb-6">
                       <div className="space-y-1">
                          <p className="text-xs font-black uppercase tracking-widest text-slate-600">Dosage</p>
                          <p className="text-lg font-bold text-slate-900">{px.medicines?.[0]?.dosage || 'N/A'}</p>
                       </div>
                       <div className="space-y-1">
                          <p className="text-xs font-black uppercase tracking-widest text-slate-600">Frequency</p>
                          <p className="text-lg font-bold text-slate-900">{px.medicines?.[0]?.frequency || 'N/A'}</p>
                       </div>
                       <div className="space-y-1">
                          <p className="text-xs font-black uppercase tracking-widest text-slate-600">Issued Date</p>
                          <p className="text-lg font-bold text-slate-900">{new Date(px.issuedAt).toLocaleDateString()}</p>
                       </div>
                    </div>

                    <p className="text-slate-600 bg-amber-50 px-4 py-3 rounded-xl border border-amber-100 flex items-start gap-3 italic">
                       <AlertCircle className="text-amber-500 shrink-0 mt-0.5" size={18} /> 
                       "{px.instructions || 'No specific instructions provided.'}"
                    </p>
                  </div>
                ))}
             </div>
          ) : (
            <div className="grid gap-4">
               {labResults.map(lab => (
                  <div key={lab.id} className="premium-glass p-6 group hover:translate-x-2 transition-all">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                           <div className={`w-4 h-4 rounded-full ${lab.status === 'normal' ? 'bg-emerald-500' : 'bg-red-500'} shadow-[0_0_10px_currentColor] animate-pulse`}></div>
                           <div>
                              <h3 className="text-xl font-extrabold text-slate-900">{lab.testName}</h3>
                              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-0.5">{lab.category} • {lab.id}</p>
                           </div>
                        </div>
                        <div className="text-right">
                           <div className="flex items-center gap-2 justify-end mb-1">
                              <span className="text-2xl font-black text-slate-900">{lab.value}</span>
                              <span className="text-sm font-bold text-slate-600">{lab.unit}</span>
                           </div>
                           <p className="text-xs font-bold text-slate-600">Range: {lab.range}</p>
                        </div>
                        <div className="hidden md:flex flex-col items-end gap-2 px-8">
                           {lab.trend === 'down' && <TrendingDown className="text-emerald-500" size={24}/>}
                           {lab.trend === 'up' && <TrendingUp className="text-red-500" size={24}/>}
                           {lab.trend === 'stable' && <Clock className="text-slate-700" size={24}/>}
                           <span className="text-xs font-black uppercase tracking-tighter text-slate-600">Last 6 Months</span>
                        </div>
                        <button className="h-12 w-12 bg-slate-900 text-slate-900 rounded-2xl flex items-center justify-center hover:bg-indigo-600 transition-colors shadow-lg active:scale-90">
                           <ChevronRight size={20} />
                        </button>
                     </div>
                  </div>
               ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
           <div className="premium-glass p-8 bg-indigo-600 text-slate-900 border-transparent relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full blur-3xl -translate-y-16 translate-x-16"></div>
              <Activity className="h-12 w-12 mb-6" />
              <h2 className="text-2xl font-black mb-4">Request New Lab Report</h2>
              <p className="text-indigo-100 font-medium mb-8 leading-relaxed opacity-90">Send a request to your primary physician for diagnostic testing or health verification.</p>
              <button className="w-full py-4 bg-white text-indigo-700 font-black rounded-2xl hover:shadow-2xl transition-all active:scale-95 text-lg">
                 Submit Request
              </button>
           </div>

           <div className="premium-glass p-8">
              <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
                 <Clock className="text-indigo-600" /> Recent Activity
              </h3>
              <div className="space-y-6">
                 {[ 
                   { title: 'New Prescription Added', date: '2 hours ago', icon: FileText, color: 'bg-indigo-50 text-indigo-600' },
                   { title: 'Lab Results Uploaded', date: 'Yesterday', icon: Activity, color: 'bg-emerald-50 text-emerald-600' },
                   { title: 'Prescription Expired', date: '3 days ago', icon: AlertCircle, color: 'bg-red-50 text-red-600' }
                 ].map((act, i) => (
                   <div key={i} className="flex gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${act.color}`}>
                         <act.icon size={18} />
                      </div>
                      <div>
                         <p className="text-sm font-bold text-slate-900 leading-tight">{act.title}</p>
                         <p className="text-xs font-medium text-slate-600 mt-0.5">{act.date}</p>
                      </div>
                   </div>
                 ))}
              </div>
              <button className="w-full mt-10 py-3 bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 border border-slate-200">
                 View All Activity <ExternalLink size={14} />
              </button>
           </div>

           <div className="premium-glass p-8 bg-slate-900 text-slate-900 flex flex-col items-center text-center">
              <Calendar size={40} className="text-emerald-400 mb-4" />
              <h3 className="text-lg font-black mb-2 tracking-tight">Verified Records</h3>
              <p className="text-sm text-slate-600 font-medium leading-relaxed">Your medical records are cryptographically verified by Sri Lanka Ministry of Health.</p>
           </div>
        </div>
      </div>
    </div>
  );
}
