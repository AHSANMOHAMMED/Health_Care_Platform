import { useState } from 'react';
import {
  Eye, EyeOff, AlertCircle, Loader2, ArrowRight,
  ShieldCheck, ChevronRight, User, Mail, Lock,
  Phone, MapPin, Heart, Droplets, AlertTriangle,
  CheckCircle, Users, Stethoscope, Globe, Calendar
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../utils/auth';
import logo from '../assets/logo.png';
import hero3 from '../assets/hero-3.png';

type Role = 'PATIENT' | 'DOCTOR';
type Step = 1 | 2 | 3;

const SL_PROVINCES = [
  'Western', 'Central', 'Southern', 'Northern', 'Eastern',
  'North Western', 'North Central', 'Uva', 'Sabaragamuwa'
];

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-', 'Unknown'];
const LANGUAGES = ['Sinhala', 'English', 'Tamil'];
const SPECIALIZATIONS = [
  'General Practice', 'Cardiology', 'Neurology', 'Pediatrics',
  'Orthopedics', 'Dermatology', 'Gynecology', 'Psychiatry',
  'Ophthalmology', 'ENT', 'Oncology', 'Radiology'
];

interface FormData {
  // Step 1 — Identity
  firstName: string;
  lastName: string;
  dob: string;
  gender: string;
  nic: string;
  // Step 2 — Contact
  email: string;
  phone: string;
  whatsapp: string;
  province: string;
  district: string;
  address: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  emergencyContactRelation: string;
  // Step 3 — Health + Auth
  bloodType: string;
  allergies: string;
  chronicConditions: string;
  preferredLanguage: string;
  specialization: string;   // doctor only
  licenseNumber: string;    // doctor only
  password: string;
  confirmPassword: string;
}

const INITIAL: FormData = {
  firstName: '', lastName: '', dob: '', gender: 'Male', nic: '',
  email: '', phone: '+94 ', whatsapp: '', province: 'Western', district: '', address: '',
  emergencyContactName: '', emergencyContactPhone: '+94 ', emergencyContactRelation: '',
  bloodType: 'Unknown', allergies: '', chronicConditions: '', preferredLanguage: 'Sinhala',
  specialization: 'General Practice', licenseNumber: '',
  password: '', confirmPassword: '',
};

const inputClass = "w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white font-bold placeholder-slate-500 focus:outline-none focus:border-[#8D153A]/60 focus:ring-2 focus:ring-[#8D153A]/10 focus:bg-white/8 transition-all";
const labelClass = "block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2";

function FieldGroup({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className={labelClass}>{label}{required && <span className="text-[#8D153A] ml-1">*</span>}</label>
      {children}
    </div>
  );
}

export default function Register() {
  const [step, setStep] = useState<Step>(1);
  const [role, setRole] = useState<Role>('PATIENT');
  const [form, setForm] = useState<FormData>(INITIAL);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const setF = (field: keyof FormData, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const validateStep1 = () => {
    if (!form.firstName) return 'First name is required';
    if (!form.lastName) return 'Last name is required';
    if (!form.dob) return 'Date of birth is required';
    if (!form.nic) return 'NIC / Passport number is required';
    return null;
  };

  const validateStep2 = () => {
    if (!form.email) return 'Email address is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Invalid email address';
    if (!form.phone || form.phone.length < 6) return 'Phone number is required';
    if (!form.address) return 'Address is required';
    if (!form.emergencyContactName) return 'Emergency contact name is required';
    if (!form.emergencyContactPhone || form.emergencyContactPhone.length < 6) return 'Emergency contact phone is required';
    return null;
  };

  const validateStep3 = () => {
    if (!form.password || form.password.length < 8) return 'Password must be at least 8 characters';
    if (form.password !== form.confirmPassword) return 'Passwords do not match';
    if (role === 'DOCTOR' && !form.licenseNumber) return 'SLMC license number is required';
    return null;
  };

  const handleNext = () => {
    setError('');
    const err = step === 1 ? validateStep1() : step === 2 ? validateStep2() : null;
    if (err) { setError(err); return; }
    setStep(prev => (prev + 1) as Step);
  };

  const handleSocialLogin = (platform: string) => {
    setLoading(true);
    setTimeout(() => {
      const mockUser = {
        id: 'social-' + Math.random().toString(36).substr(2, 9),
        firstName: platform === 'Google' ? 'Google' : platform === 'Apple' ? 'Apple' : 'Meta',
        lastName: 'User',
        email: `user@${platform.toLowerCase()}.com`,
        role: 'PATIENT'
      } as any;
      useAuthStore.getState().setAuth('mock-social-token-' + Date.now(), mockUser);
      setLoading(false);
      navigate('/patient');
    }, 1200);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateStep3();
    if (err) { setError(err); return; }
    setLoading(true);
    setError('');
    try {
      await authService.register({
        email: form.email,
        password: form.password,
        role,
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        dob: form.dob,
        gender: form.gender,
        nic: form.nic,
        province: form.province,
        district: form.district,
        address: form.address,
        bloodType: form.bloodType,
        allergies: form.allergies,
        chronicConditions: form.chronicConditions,
        preferredLanguage: form.preferredLanguage,
        emergencyContactName: form.emergencyContactName,
        emergencyContactPhone: form.emergencyContactPhone,
        emergencyContactRelation: form.emergencyContactRelation,
        specialization: role === 'DOCTOR' ? form.specialization : undefined,
        licenseNumber: role === 'DOCTOR' ? form.licenseNumber : undefined,
      } as any);
      const response = await authService.login(form.email, form.password);
      useAuthStore.getState().setAuth(response.tokens.accessToken, response.user);
      const r = response.user.role;
      if (r === 'PATIENT') navigate('/patient');
      else if (r === 'DOCTOR') navigate('/doctor');
      else navigate('/');
    } catch {
      setError('Registration failed. This email may already be in use.');
    } finally {
      setLoading(false);
    }
  };

  const stepLabels = ['Identity', 'Contact & Emergency', 'Health Profile & Security'];
  const stepIcons = [User, MapPin, Heart];

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex overflow-hidden">

      {/* Left Panel — Branding */}
      <div className="hidden lg:flex lg:w-[45%] relative flex-col justify-between p-16 overflow-hidden flex-shrink-0">
        <img src={hero3} alt="Medical" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-[#8D153A]/60 to-[#0A0A0F]/80" />

        <Link to="/" className="relative z-10 flex items-center gap-3">
          <img src={logo} alt="Logo" className="h-12 w-auto brightness-0 invert" />
          <div>
            <p className="text-xl font-black text-white tracking-tighter">MediConnect <span className="text-[#FFBE29]">Lanka</span></p>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">National Health Network</p>
          </div>
        </Link>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-[#FFBE29] text-xs font-black uppercase tracking-widest mb-8">
            <ShieldCheck size={14} /> Secure Registration
          </div>
          <h2 className="text-5xl font-black text-white tracking-tighter leading-[0.95] mb-6">
            Join the Digital<br /><span className="text-[#FFBE29]">Healthcare</span><br />Revolution.
          </h2>
          <p className="text-slate-300 font-medium leading-relaxed max-w-sm">
            Your health profile protects you in emergencies, connects you with specialists, and gives you AI-powered care 24/7.
          </p>

          <div className="mt-10 space-y-4">
            {[
              { icon: ShieldCheck, text: 'SLMC certified & government compliant', color: 'text-emerald-400' },
              { icon: Heart, text: 'Emergency contacts auto-notified in crisis', color: 'text-red-400' },
              { icon: Globe, text: 'AI speaks Sinhala, Tamil & English', color: 'text-blue-400' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <item.icon size={18} className={item.color} />
                <span className="text-slate-300 font-medium text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-slate-500 text-xs font-bold">
          © 2026 MediConnect Lanka — ISO 27001 Encrypted
        </div>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="flex-1 flex flex-col p-6 lg:p-16 justify-start pt-8 max-w-2xl mx-auto w-full">

          {/* Mobile Logo */}
          <Link to="/" className="lg:hidden flex items-center gap-3 mb-8">
            <img src={logo} alt="Logo" className="h-10 w-auto brightness-0 invert" />
            <p className="text-lg font-black text-white">MediConnect <span className="text-[#FFBE29]">Lanka</span></p>
          </Link>

          {/* Role Selector — Pre-form */}
          <div className="mb-8">
            <p className={labelClass}>I am registering as</p>
            <div className="grid grid-cols-2 gap-3">
              {([['PATIENT', 'Personal Care', Users], ['DOCTOR', 'Medical Expert', Stethoscope]] as const).map(([r, sub, Icon]) => (
                <button key={r} onClick={() => setRole(r as Role)}
                  className={`p-5 rounded-2xl border-2 text-left transition-all duration-300 ${role === r ? 'border-[#8D153A] bg-[#8D153A]/10' : 'border-white/10 bg-white/3 hover:border-white/20'}`}>
                  <Icon size={22} className={role === r ? 'text-[#8D153A] mb-2' : 'text-slate-500 mb-2'} />
                  <p className={`font-black text-sm ${role === r ? 'text-[#8D153A]' : 'text-slate-300'}`}>{r === 'PATIENT' ? 'Patient' : 'Doctor'}</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{sub}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Social Auth */}
          <div className="mb-8">
            <p className={labelClass}>Quick sign up with</p>
            <div className="grid grid-cols-3 gap-3">
              <button onClick={() => handleSocialLogin('Google')} disabled={loading}
                className="h-14 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-2 font-bold text-white text-sm disabled:opacity-60">
                <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Google
              </button>
              <button onClick={() => handleSocialLogin('Apple')} disabled={loading}
                className="h-14 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-2 font-bold text-white text-sm disabled:opacity-60">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                Apple
              </button>
              <button onClick={() => handleSocialLogin('Facebook')} disabled={loading}
                className="h-14 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-2 font-bold text-white text-sm disabled:opacity-60">
                <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                Facebook
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs font-black uppercase tracking-widest text-slate-500">Or register with email</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Progress Steps */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              {([1, 2, 3] as const).map((s, i) => {
                const StepIcon = stepIcons[i];
                return (
                  <div key={s} className="flex items-center gap-2 flex-1">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${step === s ? 'bg-[#8D153A] text-white shadow-lg shadow-[#8D153A]/30' : step > s ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-slate-500'}`}>
                      {step > s ? <CheckCircle size={18} /> : <StepIcon size={18} />}
                    </div>
                    {i < 2 && <div className={`flex-1 h-0.5 transition-all duration-500 ${step > s ? 'bg-emerald-500/40' : 'bg-white/5'}`} />}
                  </div>
                );
              })}
            </div>
            <div>
              <p className="font-black text-white text-xl tracking-tight">Step {step} of 3: {stepLabels[step - 1]}</p>
              <p className="text-slate-500 font-medium text-sm">{step === 1 ? 'Your personal identity details' : step === 2 ? 'Contact info and emergency contacts — critical for your safety' : 'Health profile and account security'}</p>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-700/40 rounded-2xl flex items-center gap-3 text-red-400 font-bold text-sm">
              <AlertCircle size={18} className="flex-shrink-0" /> {error}
            </div>
          )}

          <form onSubmit={step < 3 ? (e) => { e.preventDefault(); handleNext(); } : handleSubmit} className="space-y-5">

            {/* ======================== STEP 1: IDENTITY ======================== */}
            {step === 1 && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <FieldGroup label="First Name" required>
                    <input type="text" className={inputClass} placeholder="Aruni" value={form.firstName} onChange={e => setF('firstName', e.target.value)} />
                  </FieldGroup>
                  <FieldGroup label="Last Name" required>
                    <input type="text" className={inputClass} placeholder="Wijesinghe" value={form.lastName} onChange={e => setF('lastName', e.target.value)} />
                  </FieldGroup>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FieldGroup label="Date of Birth" required>
                    <input type="date" className={inputClass} value={form.dob} onChange={e => setF('dob', e.target.value)} />
                  </FieldGroup>
                  <FieldGroup label="Gender" required>
                    <select className={inputClass} value={form.gender} onChange={e => setF('gender', e.target.value)}>
                      {['Male', 'Female', 'Other', 'Prefer not to say'].map(g => <option key={g} value={g} className="bg-slate-900">{g}</option>)}
                    </select>
                  </FieldGroup>
                </div>
                <FieldGroup label="NIC / Passport Number" required>
                  <input type="text" className={inputClass} placeholder="199012345678 or A1234567" value={form.nic} onChange={e => setF('nic', e.target.value)} />
                </FieldGroup>
                {role === 'DOCTOR' && (
                  <FieldGroup label="Specialization" required>
                    <select className={inputClass} value={form.specialization} onChange={e => setF('specialization', e.target.value)}>
                      {SPECIALIZATIONS.map(s => <option key={s} className="bg-slate-900">{s}</option>)}
                    </select>
                  </FieldGroup>
                )}
              </>
            )}

            {/* ======================== STEP 2: CONTACT + EMERGENCY ======================== */}
            {step === 2 && (
              <>
                <FieldGroup label="Email Address" required>
                  <div className="relative">
                    <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input type="email" className={inputClass + ' pl-12'} placeholder="aruni@gmail.com" value={form.email} onChange={e => setF('email', e.target.value)} />
                  </div>
                </FieldGroup>
                <div className="grid grid-cols-2 gap-4">
                  <FieldGroup label="Mobile Number" required>
                    <div className="relative">
                      <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input type="tel" className={inputClass + ' pl-12'} placeholder="+94 77 123 4567" value={form.phone} onChange={e => setF('phone', e.target.value)} />
                    </div>
                  </FieldGroup>
                  <FieldGroup label="WhatsApp Number">
                    <div className="relative">
                      <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input type="tel" className={inputClass + ' pl-12'} placeholder="+94 77 123 4567" value={form.whatsapp} onChange={e => setF('whatsapp', e.target.value)} />
                    </div>
                  </FieldGroup>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <FieldGroup label="Province" required>
                    <select className={inputClass} value={form.province} onChange={e => setF('province', e.target.value)}>
                      {SL_PROVINCES.map(p => <option key={p} className="bg-slate-900">{p}</option>)}
                    </select>
                  </FieldGroup>
                  <FieldGroup label="District">
                    <input type="text" className={inputClass} placeholder="e.g., Colombo" value={form.district} onChange={e => setF('district', e.target.value)} />
                  </FieldGroup>
                </div>
                <FieldGroup label="Full Address" required>
                  <div className="relative">
                    <MapPin size={18} className="absolute left-4 top-4 text-slate-500" />
                    <textarea rows={2} className={inputClass + ' pl-12 resize-none'} placeholder="No. 42, Galle Road, Colombo 03" value={form.address} onChange={e => setF('address', e.target.value)} />
                  </div>
                </FieldGroup>

                <div className="pt-2 border-t border-white/5">
                  <div className="flex items-center gap-2 mb-4">
                    <AlertTriangle size={16} className="text-[#FFBE29]" />
                    <p className="font-black text-[#FFBE29] text-sm uppercase tracking-widest">Emergency Contact</p>
                  </div>
                  <p className="text-slate-500 text-xs font-medium mb-4">This person will be automatically alerted and given your location in a medical emergency.</p>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <FieldGroup label="Contact Name" required>
                        <input type="text" className={inputClass} placeholder="Kasun (Father)" value={form.emergencyContactName} onChange={e => setF('emergencyContactName', e.target.value)} />
                      </FieldGroup>
                      <FieldGroup label="Relationship">
                        <input type="text" className={inputClass} placeholder="Father, Mother, Spouse..." value={form.emergencyContactRelation} onChange={e => setF('emergencyContactRelation', e.target.value)} />
                      </FieldGroup>
                    </div>
                    <FieldGroup label="Emergency Phone" required>
                      <div className="relative">
                        <PhoneCall size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-red-400" />
                        <input type="tel" className={inputClass + ' pl-12 border-red-700/20 focus:border-red-600/40'} placeholder="+94 71 234 5678" value={form.emergencyContactPhone} onChange={e => setF('emergencyContactPhone', e.target.value)} />
                      </div>
                    </FieldGroup>
                  </div>
                </div>
              </>
            )}

            {/* ======================== STEP 3: HEALTH + SECURITY ======================== */}
            {step === 3 && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <FieldGroup label="Blood Type">
                    <div className="relative">
                      <Droplets size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-red-400" />
                      <select className={inputClass + ' pl-12'} value={form.bloodType} onChange={e => setF('bloodType', e.target.value)}>
                        {BLOOD_TYPES.map(b => <option key={b} className="bg-slate-900">{b}</option>)}
                      </select>
                    </div>
                  </FieldGroup>
                  <FieldGroup label="Preferred Language">
                    <div className="relative">
                      <Globe size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400" />
                      <select className={inputClass + ' pl-12'} value={form.preferredLanguage} onChange={e => setF('preferredLanguage', e.target.value)}>
                        {LANGUAGES.map(l => <option key={l} className="bg-slate-900">{l}</option>)}
                      </select>
                    </div>
                  </FieldGroup>
                </div>
                <FieldGroup label="Known Allergies">
                  <input type="text" className={inputClass} placeholder="Penicillin, Pollen, Shellfish... (comma separated)" value={form.allergies} onChange={e => setF('allergies', e.target.value)} />
                </FieldGroup>
                <FieldGroup label="Chronic Conditions">
                  <input type="text" className={inputClass} placeholder="Diabetes, Hypertension... (comma separated)" value={form.chronicConditions} onChange={e => setF('chronicConditions', e.target.value)} />
                </FieldGroup>
                {role === 'DOCTOR' && (
                  <FieldGroup label="SLMC License Number" required>
                    <input type="text" className={inputClass} placeholder="SLMC-XXXXX" value={form.licenseNumber} onChange={e => setF('licenseNumber', e.target.value)} />
                  </FieldGroup>
                )}
                <FieldGroup label="Password" required>
                  <div className="relative">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input type={showPassword ? 'text' : 'password'} className={inputClass + ' pl-12 pr-12'} placeholder="Min. 8 characters" value={form.password} onChange={e => setF('password', e.target.value)} />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {form.password && (
                    <div className="mt-2 flex gap-1">
                      {[8, 12, 16].map((len, i) => (
                        <div key={i} className={`flex-1 h-1 rounded-full transition-all ${form.password.length >= len ? i === 0 ? 'bg-red-500' : i === 1 ? 'bg-[#FFBE29]' : 'bg-emerald-500' : 'bg-white/10'}`} />
                      ))}
                    </div>
                  )}
                </FieldGroup>
                <FieldGroup label="Confirm Password" required>
                  <div className="relative">
                    <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input type={showPassword ? 'text' : 'password'} className={inputClass + ' pl-12 ' + (form.confirmPassword && form.password !== form.confirmPassword ? 'border-red-600/60' : '')} placeholder="Repeat password" value={form.confirmPassword} onChange={e => setF('confirmPassword', e.target.value)} />
                  </div>
                  {form.confirmPassword && form.password !== form.confirmPassword && <p className="text-xs text-red-400 font-bold mt-1">Passwords do not match</p>}
                </FieldGroup>
              </>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-3 pt-4">
              {step > 1 && (
                <button type="button" onClick={() => setStep(prev => (prev - 1) as Step)} className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-black hover:bg-white/10 transition-all">
                  Back
                </button>
              )}
              <button type="submit" disabled={loading} className="flex-1 py-4 rounded-2xl bg-[#8D153A] hover:bg-[#71112D] text-white font-black transition-all shadow-lg shadow-[#8D153A]/30 flex items-center justify-center gap-2 disabled:opacity-60 text-base">
                {loading ? (
                  <><Loader2 size={20} className="animate-spin" /> Creating Account...</>
                ) : step < 3 ? (
                  <>Next: {stepLabels[step]} <ChevronRight size={20} /></>
                ) : (
                  <>Create My Health ID <ArrowRight size={20} /></>
                )}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-slate-500 font-medium text-sm">Already registered?</p>
            <Link to="/login" className="inline-block mt-2 text-[#8D153A] hover:text-[#FF6B8A] font-black text-sm hover:underline underline-offset-4 transition-colors">
              Sign in to your Dashboard →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
