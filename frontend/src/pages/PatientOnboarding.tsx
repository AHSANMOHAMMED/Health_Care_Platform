import React, { useState } from 'react';
import { 
  User, 
  FileText, 
  Upload, 
  Shield, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Activity, 
  Heart, 
  CreditCard,
  Plus,
  Trash2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

export default function PatientOnboarding() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const steps = [
    { id: 1, title: 'Identity', icon: User, desc: 'Personal details' },
    { id: 2, title: 'Medical', icon: Activity, desc: 'Health history' },
    { id: 3, title: 'Insurance', icon: CreditCard, desc: 'Coverage info' },
    { id: 4, title: 'Docs', icon: FileText, desc: 'Verification' }
  ];

  const nextStep = () => setStep(s => Math.min(s + 1, 4));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const handleFinish = () => {
     setLoading(true);
     setTimeout(() => {
        setLoading(false);
        navigate('/patient');
     }, 2000);
  };

  return (
    <div className="min-h-[calc(100vh-100px)] flex flex-col items-center justify-center py-12 px-4 animate-in fade-in duration-700">
      <div className="max-w-5xl w-full">
        
        {/* Progress Stepper */}
        <div className="flex justify-between mb-12 relative px-4 md:px-12">
           <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-200 -translate-y-1/2 z-0"></div>
           <div 
             className="absolute top-1/2 left-0 h-0.5 bg-indigo-600 -translate-y-1/2 z-0 transition-all duration-500" 
             style={{ width: `${((step - 1) / 3) * 100}%` }}></div>
           
           {steps.map(s => (
             <div key={s.id} className="relative z-10 flex flex-col items-center">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 border-4 ${
                  step >= s.id ? 'bg-indigo-600 border-indigo-100 text-slate-900 shadow-lg shadow-indigo-200' : 'bg-white border-slate-100 text-slate-600'
                }`}>
                   <s.icon size={20} />
                </div>
                <div className="hidden md:block absolute -bottom-8 whitespace-nowrap text-center">
                   <p className={`text-xs font-black uppercase tracking-widest ${step >= s.id ? 'text-indigo-600' : 'text-slate-600'}`}>{s.title}</p>
                </div>
             </div>
           ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mt-16">
           {/* Sidebar Info */}
           <div className="lg:col-span-1 space-y-6 hidden lg:block">
              <div className="premium-glass p-8 bg-slate-900 text-slate-900 relative overflow-hidden h-full">
                 <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500/10 to-transparent"></div>
                 <Shield className="h-12 w-12 text-indigo-400 mb-6" />
                 <h2 className="text-3xl font-black mb-4 leading-tight">Secure <br/>Onboarding</h2>
                 <p className="text-slate-600 font-medium leading-relaxed mb-8">Your medical data is encrypted with AES-256 standards and stored in compliance with SL-Health privacy laws.</p>
                 
                 <div className="space-y-4">
                    {[ 'End-to-End Encryption', 'Private Consultation', 'Instant Health Sync' ].map((text, i) => (
                       <div key={i} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                          <CheckCircle2 size={16} className="text-emerald-500" /> {text}
                       </div>
                    ))}
                 </div>
              </div>
           </div>

           {/* Main Form Area */}
           <div className="lg:col-span-2">
              <div className="premium-glass p-8 md:p-12 min-h-[600px] flex flex-col">
                 <div className="mb-10">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight">{steps[step-1].title} Details</h2>
                    <p className="text-slate-500 font-medium mt-1">{steps[step-1].desc}. Required for accurate diagnostic mapping.</p>
                 </div>

                 <div className="flex-1 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    {step === 1 && (
                       <div className="grid grid-cols-2 gap-6">
                          <div className="col-span-2 md:col-span-1">
                             <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-2">First Name</label>
                             <input type="text" defaultValue={user?.firstName} className="input-premium" placeholder="John" />
                          </div>
                          <div className="col-span-2 md:col-span-1">
                             <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-2">Last Name</label>
                             <input type="text" defaultValue={user?.lastName} className="input-premium" placeholder="Doe" />
                          </div>
                          <div className="col-span-2">
                             <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-2">Date of Birth</label>
                             <input type="date" className="input-premium" />
                          </div>
                          <div className="col-span-2">
                             <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-2">Residential Address</label>
                             <input type="text" className="input-premium" placeholder="123 Wellness Blvd, Colombo" />
                          </div>
                       </div>
                    )}

                    {step === 2 && (
                       <div className="space-y-8">
                          <div>
                             <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-4">Known Allergies</label>
                             <div className="flex flex-wrap gap-2">
                                {['Penicillin', 'Peanuts', 'Lactose'].map(a => (
                                   <span key={a} className="px-4 py-2 bg-red-50 text-red-600 rounded-xl text-sm font-bold flex items-center gap-2 border border-red-100">
                                      {a} <Trash2 size={14} className="cursor-pointer" />
                                   </span>
                                ))}
                                <button className="px-4 py-2 bg-slate-50 text-slate-600 rounded-xl text-sm font-bold border border-dashed border-slate-300 hover:bg-slate-100 transition-colors">
                                   + Add New
                                </button>
                             </div>
                          </div>
                          
                          <div>
                             <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-4">Current Medications</label>
                             <div className="space-y-3">
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex justify-between items-center">
                                   <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center"><Activity size={20}/></div>
                                      <div>
                                         <p className="font-bold text-slate-900">Amoxicillin</p>
                                         <p className="text-xs text-slate-500">500mg • 2x daily</p>
                                      </div>
                                   </div>
                                   <Trash2 size={18} className="text-slate-700 hover:text-red-500 cursor-pointer" />
                                </div>
                                <button className="w-full py-3 bg-white border-2 border-dashed border-slate-200 rounded-2xl text-slate-600 font-bold hover:bg-slate-50 transition-all">+ Add Medical History Item</button>
                             </div>
                          </div>
                       </div>
                    )}

                    {step === 3 && (
                       <div className="grid grid-cols-2 gap-6">
                          <div className="col-span-2">
                             <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-2">Provider Name</label>
                             <select className="input-premium appearance-none">
                                <option>AIA Insurance Lanka</option>
                                <option>Ceylinco General</option>
                                <option>Softlogic Life</option>
                                <option>Other / Private</option>
                             </select>
                          </div>
                          <div className="col-span-2 md:col-span-1">
                             <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-2">Policy Number</label>
                             <input type="text" className="input-premium" placeholder="POL-99281-X" />
                          </div>
                          <div className="col-span-2 md:col-span-1">
                             <label className="block text-xs font-black text-slate-600 uppercase tracking-widest mb-2">Group ID</label>
                             <input type="text" className="input-premium" placeholder="GRP-101" />
                          </div>
                       </div>
                    )}

                    {step === 4 && (
                       <div className="flex flex-col items-center justify-center h-full py-10">
                          <div className="w-full border-4 border-dashed border-slate-100 rounded-[2rem] p-12 text-center group hover:border-indigo-100 transition-all cursor-pointer bg-slate-50/50">
                             <div className="w-20 h-20 bg-white shadow-xl rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                                <Upload className="text-indigo-600" size={32} />
                             </div>
                             <h4 className="text-xl font-bold text-slate-900 mb-2">Upload ID Proof</h4>
                             <p className="text-slate-500 font-medium mb-6">Drop your NIC, Passport or Driving License here.</p>
                             <button className="px-6 py-3 bg-slate-900 text-slate-900 rounded-xl font-bold text-sm">Browse Files</button>
                          </div>
                          
                          <div className="mt-8 flex items-start gap-3 bg-amber-50 p-4 rounded-2xl border border-amber-100">
                             <AlertCircle className="text-amber-500 shrink-0" size={20} />
                             <p className="text-xs text-amber-900 font-medium leading-relaxed">
                                Please ensure files are under 5MB and in PDF or JPG format. Our automated verification system will review these within 24 hours.
                             </p>
                          </div>
                       </div>
                    )}
                 </div>

                 {/* Navigation Buttons */}
                 <div className="mt-12 pt-8 border-t border-slate-100 flex justify-between gap-4">
                    <button 
                      onClick={prevStep}
                      disabled={step === 1}
                      className="px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold transition-all hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed flex items-center gap-2">
                       <ArrowLeft size={18} /> Back
                    </button>
                    
                    {step < 4 ? (
                      <button 
                        onClick={nextStep}
                        className="btn-gradient px-10 py-4 shadow-indigo-500/20 text-lg font-bold flex items-center gap-2">
                         Continue <ArrowRight size={18} />
                      </button>
                    ) : (
                      <button 
                        onClick={handleFinish}
                        disabled={loading}
                        className="px-10 py-4 bg-emerald-600 text-slate-900 rounded-2xl font-bold hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-500/20 flex items-center gap-2 min-w-[180px] justify-center">
                         {loading ? <Loader2 className="animate-spin" /> : <>Finish Setup <CheckCircle2 size={18} /></>}
                      </button>
                    )}
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
