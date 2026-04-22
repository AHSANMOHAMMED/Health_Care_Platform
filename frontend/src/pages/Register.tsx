import { useState } from 'react';
import {
  Eye, EyeOff, AlertCircle, Loader2, ArrowRight,
  ShieldCheck, ChevronRight, User, Mail, Lock,
  Phone, PhoneCall, MapPin, Heart, Droplets, AlertTriangle,
  CheckCircle, Users, Stethoscope, Globe
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
  firstName: string; lastName: string; dob: string; gender: string; nic: string;
  email: string; phone: string; whatsapp: string; province: string; district: string; address: string;
  emergencyContactName: string; emergencyContactPhone: string; emergencyContactRelation: string;
  bloodType: string; allergies: string; chronicConditions: string; preferredLanguage: string;
  specialization: string; licenseNumber: string; password: string; confirmPassword: string;
}

const INITIAL: FormData = {
  firstName: '', lastName: '', dob: '', gender: 'Male', nic: '',
  email: '', phone: '+94', whatsapp: '', province: 'Western', district: '', address: '',
  emergencyContactName: '', emergencyContactPhone: '+94', emergencyContactRelation: '',
  bloodType: 'Unknown', allergies: '', chronicConditions: '', preferredLanguage: 'Sinhala',
  specialization: 'General Practice', licenseNumber: '',
  password: '', confirmPassword: '',
};

const iClass = "w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white font-bold placeholder-slate-500 focus:outline-none focus:border-[#8D153A]/60 focus:ring-2 focus:ring-[#8D153A]/10 transition-all";
const lClass = "block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2";

function Field({ label, req, children }: { label: string; req?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className={lClass}>{label}{req && <span className="text-[#8D153A] ml-1">*</span>}</label>
      {children}
    </div>
  );
}

// Sri Lanka NIC validation
function validateNIC(nic: string): string | null {
  if (!nic.trim()) return 'NIC / Passport number is required';
  const old9 = /^[0-9]{9}[VvXx]$/;
  const new12 = /^[0-9]{12}$/;
  const passport = /^[A-Za-z][0-9]{7}$/;
  if (!old9.test(nic) && !new12.test(nic) && !passport.test(nic)) {
    return 'Invalid format. Old NIC: 9 digits + V/X (e.g. 901234567V). New NIC: 12 digits. Passport: letter + 7 digits (e.g. N1234567)';
  }
  return null;
}

// Date of birth validation
function validateDOB(dob: string): string | null {
  if (!dob) return 'Date of birth is required';
  const birth = new Date(dob);
  if (isNaN(birth.getTime())) return 'Invalid date of birth';
  const today = new Date();
  if (birth >= today) return 'Date of birth cannot be today or in the future';
  const age = today.getFullYear() - birth.getFullYear() -
    (today < new Date(today.getFullYear(), birth.getMonth(), birth.getDate()) ? 1 : 0);
  if (age < 1) return 'Date of birth cannot be in the future';
  if (age > 120) return 'Please enter a valid date of birth';
  return null;
}

export default function Register() {
  const [step, setStep] = useState<Step>(1);
  const [role, setRole] = useState<Role>('PATIENT');
  const [form, setForm] = useState<FormData>(INITIAL);
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const setF = (f: keyof FormData, v: string) => setForm(p => ({ ...p, [f]: v }));

  const validateStep1 = (): string | null => {
    if (!form.firstName.trim()) return 'First name is required';
    if (!form.lastName.trim()) return 'Last name is required';
    const dobErr = validateDOB(form.dob);
    if (dobErr) return dobErr;
    const nicErr = validateNIC(form.nic);
    if (nicErr) return nicErr;
    return null;
  };

  const validateStep2 = (): string | null => {
    if (!form.email.trim()) return 'Email address is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Invalid email address';
    const cleanPhone = form.phone.replace(/\s/g, '');
    if (cleanPhone.length < 10) return 'Valid mobile number is required (min. 10 digits)';
    if (!form.address.trim()) return 'Home address is required';
    if (!form.emergencyContactName.trim()) return 'Emergency contact name is required';
    const cleanEmerg = form.emergencyContactPhone.replace(/\s/g, '');
    if (cleanEmerg.length < 10) return 'Valid emergency contact phone is required';
    return null;
  };

  const validateStep3 = (): string | null => {
    if (!form.password || form.password.length < 8) return 'Password must be at least 8 characters';
    if (form.password !== form.confirmPassword) return 'Passwords do not match';
    if (role === 'DOCTOR' && !form.licenseNumber.trim()) return 'SLMC license number is required';
    return null;
  };

  const goNext = (e: React.MouseEvent) => {
    e.preventDefault();
    setError('');
    const err = step === 1 ? validateStep1() : validateStep2();
    if (err) { setError(err); window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
    setStep(p => (p + 1) as Step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = (e: React.MouseEvent) => {
    e.preventDefault();
    setError('');
    setStep(p => (p - 1) as Step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSocial = (platform: string) => {
    setLoading(true);
    setTimeout(() => {
      const mockUser = { id: 'social-' + Math.random().toString(36).substr(2, 9), firstName: platform, lastName: 'User', email: `user@${platform.toLowerCase()}.com`, role: 'PATIENT' } as any;
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
        email: form.email, password: form.password, role,
        firstName: form.firstName, lastName: form.lastName,
        phone: form.phone, dob: form.dob, gender: form.gender, nic: form.nic,
        province: form.province, district: form.district, address: form.address,
        bloodType: form.bloodType, allergies: form.allergies,
        chronicConditions: form.chronicConditions, preferredLanguage: form.preferredLanguage,
        emergencyContactName: form.emergencyContactName,
        emergencyContactPhone: form.emergencyContactPhone,
        emergencyContactRelation: form.emergencyContactRelation,
        specialization: role === 'DOCTOR' ? form.specialization : undefined,
        licenseNumber: role === 'DOCTOR' ? form.licenseNumber : undefined,
      } as any);
      const res = await authService.login(form.email, form.password);
      useAuthStore.getState().setAuth(res.tokens.accessToken, res.user);
      navigate(res.user.role === 'DOCTOR' ? '/doctor' : '/patient');
    } catch {
      setError('Registration failed. This email may already be in use.');
    } finally {
      setLoading(false);
    }
  };

  const stepLabels = ['Identity', 'Contact & Emergency', 'Health & Security'];
  const stepIcons = [User, MapPin, Heart];
  const today = new Date().toISOString().split('T')[0];
  const minDate = new Date(new Date().getFullYear() - 120, 0, 1).toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex overflow-hidden">

      {/* ── LEFT PANEL ── */}
      <div className="hidden lg:flex lg:w-[42%] relative flex-col justify-between p-16 overflow-hidden flex-shrink-0">
        <img src={hero3} alt="Healthcare" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-[#8D153A]/55 to-[#0A0A0F]/80" />

        <Link to="/" className="relative z-10 flex items-center gap-3">
          <img src={logo} alt="Logo" className="h-12 w-auto brightness-0 invert" />
          <div>
            <p className="text-xl font-black text-white tracking-tighter">MediConnect <span className="text-[#FFBE29]">Lanka</span></p>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-0.5">National Health Network</p>
          </div>
        </Link>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-[#FFBE29] text-xs font-black uppercase tracking-widest mb-8">
            <ShieldCheck size={14} /> Secure Registration
          </div>
          <h2 className="text-5xl font-black text-white tracking-tighter leading-[0.95] mb-6">
            Join the Digital<br /><span className="text-[#FFBE29]">Healthcare</span><br />Revolution.
          </h2>
          <p className="text-slate-300 font-medium leading-relaxed max-w-sm text-sm">
            Create your National Health ID. Your health profile auto-protects you in emergencies and connects you with SLMC-certified specialists 24/7.
          </p>
          <div className="mt-10 space-y-4">
            {[
              { icon: ShieldCheck, text: 'SLMC certified & government compliant', color: 'text-emerald-400' },
              { icon: Heart, text: 'Emergency contacts auto-alerted in crisis', color: 'text-red-400' },
              { icon: Globe, text: 'AI speaks Sinhala, Tamil & English', color: 'text-blue-400' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <item.icon size={16} className={item.color} />
                <span className="text-slate-300 font-medium text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-slate-600 text-xs font-bold">
          © 2026 MediConnect Lanka — ISO 27001 Encrypted
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="w-full max-w-xl mx-auto p-6 lg:p-12 flex flex-col gap-6">

          {/* Mobile Logo */}
          <Link to="/" className="lg:hidden flex items-center gap-3">
            <img src={logo} alt="Logo" className="h-10 w-auto brightness-0 invert" />
            <p className="text-lg font-black text-white">MediConnect <span className="text-[#FFBE29]">Lanka</span></p>
          </Link>

          {/* Role Selector */}
          <div>
            <p className={lClass}>I am registering as</p>
            <div className="grid grid-cols-2 gap-3">
              {([['PATIENT', 'Personal Care', Users], ['DOCTOR', 'Medical Expert', Stethoscope]] as const).map(([r, sub, Icon]) => (
                <button key={r} type="button" onClick={() => setRole(r as Role)}
                  className={`p-4 rounded-2xl border-2 text-left transition-all duration-300 ${role === r ? 'border-[#8D153A] bg-[#8D153A]/10' : 'border-white/10 bg-white/3 hover:border-white/20'}`}>
                  <Icon size={20} className={`mb-2 ${role === r ? 'text-[#8D153A]' : 'text-slate-500'}`} />
                  <p className={`font-black text-sm ${role === r ? 'text-[#8D153A]' : 'text-slate-300'}`}>{r === 'PATIENT' ? 'Patient' : 'Doctor'}</p>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{sub}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Social Auth */}
          <div>
            <p className={lClass}>Quick sign up with</p>
            <div className="grid grid-cols-3 gap-3">
              <button type="button" onClick={() => handleSocial('Google')} disabled={loading}
                className="h-13 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-2 font-bold text-white text-sm disabled:opacity-60">
                <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                Google
              </button>
              <button type="button" onClick={() => handleSocial('Apple')} disabled={loading}
                className="h-13 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-2 font-bold text-white text-sm disabled:opacity-60">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                Apple
              </button>
              <button type="button" onClick={() => handleSocial('Facebook')} disabled={loading}
                className="h-13 py-3 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-2 font-bold text-white text-sm disabled:opacity-60">
                <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                Facebook
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Or with email</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Step Progress */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              {([1, 2, 3] as const).map((s, i) => {
                const Icon = stepIcons[i];
                return (
                  <div key={s} className="flex items-center gap-2 flex-1">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${step === s ? 'bg-[#8D153A] text-white shadow-lg shadow-[#8D153A]/30' : step > s ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/5 text-slate-600'}`}>
                      {step > s ? <CheckCircle size={18} /> : <Icon size={18} />}
                    </div>
                    {i < 2 && <div className={`flex-1 h-0.5 transition-all duration-500 ${step > s ? 'bg-emerald-500/40' : 'bg-white/5'}`} />}
                  </div>
                );
              })}
            </div>
            <p className="font-black text-white text-xl tracking-tight">Step {step} of 3: {stepLabels[step - 1]}</p>
            <p className="text-slate-500 font-medium text-sm mt-1">
              {step === 1 ? 'Your personal identity details' : step === 2 ? 'Contact info & emergency contacts — critical for your safety' : 'Health profile, account security'}
            </p>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="p-4 bg-red-900/30 border border-red-700/40 rounded-2xl flex items-start gap-3 text-red-400 font-bold text-sm">
              <AlertCircle size={18} className="flex-shrink-0 mt-0.5" /> {error}
            </div>
          )}

          {/* ── STEP 1: IDENTITY ── */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <Field label="First Name" req>
                  <input type="text" className={iClass} placeholder="Aruni" value={form.firstName} onChange={e => setF('firstName', e.target.value)} />
                </Field>
                <Field label="Last Name" req>
                  <input type="text" className={iClass} placeholder="Wijesinghe" value={form.lastName} onChange={e => setF('lastName', e.target.value)} />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Date of Birth" req>
                  <input type="date" className={iClass} value={form.dob} max={today} min={minDate} onChange={e => setF('dob', e.target.value)} />
                </Field>
                <Field label="Gender" req>
                  <select className={iClass} value={form.gender} onChange={e => setF('gender', e.target.value)}>
                    {['Male', 'Female', 'Other', 'Prefer not to say'].map(g => <option key={g} value={g} className="bg-slate-900">{g}</option>)}
                  </select>
                </Field>
              </div>

              <Field label="NIC / Passport Number" req>
                <div className="relative">
                  <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input type="text" className={iClass + ' pl-12'} placeholder="901234567V  or  200012345678  or  N1234567"
                    value={form.nic} onChange={e => setF('nic', e.target.value)} />
                </div>
                <p className="text-[10px] text-slate-600 font-medium mt-1.5 leading-relaxed">
                  Old NIC: 9 digits + V/X &nbsp;|&nbsp; New NIC: 12 digits &nbsp;|&nbsp; Passport: letter + 7 digits
                </p>
              </Field>

              {role === 'DOCTOR' && (
                <Field label="Specialization" req>
                  <select className={iClass} value={form.specialization} onChange={e => setF('specialization', e.target.value)}>
                    {SPECIALIZATIONS.map(s => <option key={s} className="bg-slate-900">{s}</option>)}
                  </select>
                </Field>
              )}

              <button type="button" onClick={goNext}
                className="w-full py-4 rounded-2xl bg-[#8D153A] hover:bg-[#71112D] text-white font-black transition-all shadow-lg shadow-[#8D153A]/30 flex items-center justify-center gap-2 text-base hover:scale-[1.01] active:scale-95">
                Next: {stepLabels[1]} <ChevronRight size={20} />
              </button>
            </div>
          )}

          {/* ── STEP 2: CONTACT + EMERGENCY ── */}
          {step === 2 && (
            <div className="space-y-5">
              <Field label="Email Address" req>
                <div className="relative">
                  <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input type="email" className={iClass + ' pl-12'} placeholder="aruni@gmail.com" value={form.email} onChange={e => setF('email', e.target.value)} />
                </div>
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Mobile Number" req>
                  <div className="relative">
                    <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input type="tel" className={iClass + ' pl-12'} placeholder="+94 77 123 4567" value={form.phone} onChange={e => setF('phone', e.target.value)} />
                  </div>
                </Field>
                <Field label="WhatsApp Number">
                  <div className="relative">
                    <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input type="tel" className={iClass + ' pl-12'} placeholder="+94 77 123 4567" value={form.whatsapp} onChange={e => setF('whatsapp', e.target.value)} />
                  </div>
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Field label="Province" req>
                  <select className={iClass} value={form.province} onChange={e => setF('province', e.target.value)}>
                    {SL_PROVINCES.map(p => <option key={p} className="bg-slate-900">{p}</option>)}
                  </select>
                </Field>
                <Field label="District">
                  <input type="text" className={iClass} placeholder="Colombo" value={form.district} onChange={e => setF('district', e.target.value)} />
                </Field>
              </div>

              <Field label="Full Address" req>
                <div className="relative">
                  <MapPin size={18} className="absolute left-4 top-4 text-slate-500" />
                  <textarea rows={2} className={iClass + ' pl-12 resize-none'} placeholder="No. 42, Galle Road, Colombo 03" value={form.address} onChange={e => setF('address', e.target.value)} />
                </div>
              </Field>

              {/* Emergency Contact section */}
              <div className="pt-2 border-t border-amber-500/10 rounded-2xl bg-amber-500/5 p-5 space-y-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle size={16} className="text-[#FFBE29]" />
                  <p className="font-black text-[#FFBE29] text-sm uppercase tracking-wider">Emergency Contact</p>
                </div>
                <p className="text-slate-500 text-xs font-medium">This person will be auto-alerted with your GPS location in a medical emergency.</p>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Contact Name" req>
                    <input type="text" className={iClass} placeholder="Kasun Perera" value={form.emergencyContactName} onChange={e => setF('emergencyContactName', e.target.value)} />
                  </Field>
                  <Field label="Relationship">
                    <input type="text" className={iClass} placeholder="Father, Spouse..." value={form.emergencyContactRelation} onChange={e => setF('emergencyContactRelation', e.target.value)} />
                  </Field>
                </div>
                <Field label="Emergency Phone" req>
                  <div className="relative">
                    <PhoneCall size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-red-400" />
                    <input type="tel" className={iClass + ' pl-12 border-red-700/20 focus:border-red-600/40'} placeholder="+94 71 234 5678" value={form.emergencyContactPhone} onChange={e => setF('emergencyContactPhone', e.target.value)} />
                  </div>
                </Field>
              </div>

              <div className="flex gap-3">
                <button type="button" onClick={goBack}
                  className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-black hover:bg-white/10 transition-all">
                  ← Back
                </button>
                <button type="button" onClick={goNext}
                  className="flex-1 py-4 rounded-2xl bg-[#8D153A] hover:bg-[#71112D] text-white font-black transition-all shadow-lg shadow-[#8D153A]/30 flex items-center justify-center gap-2 text-base hover:scale-[1.01] active:scale-95">
                  Next: {stepLabels[2]} <ChevronRight size={20} />
                </button>
              </div>
            </div>
          )}

          {/* ── STEP 3: HEALTH + SECURITY ── */}
          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Blood Type">
                  <div className="relative">
                    <Droplets size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-red-400" />
                    <select className={iClass + ' pl-12'} value={form.bloodType} onChange={e => setF('bloodType', e.target.value)}>
                      {BLOOD_TYPES.map(b => <option key={b} className="bg-slate-900">{b}</option>)}
                    </select>
                  </div>
                </Field>
                <Field label="Preferred Language">
                  <div className="relative">
                    <Globe size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400" />
                    <select className={iClass + ' pl-12'} value={form.preferredLanguage} onChange={e => setF('preferredLanguage', e.target.value)}>
                      {LANGUAGES.map(l => <option key={l} className="bg-slate-900">{l}</option>)}
                    </select>
                  </div>
                </Field>
              </div>

              <Field label="Known Allergies">
                <input type="text" className={iClass} placeholder="Penicillin, Pollen, Shellfish... (comma separated)" value={form.allergies} onChange={e => setF('allergies', e.target.value)} />
              </Field>

              <Field label="Chronic Conditions">
                <input type="text" className={iClass} placeholder="Diabetes, Hypertension... (comma separated)" value={form.chronicConditions} onChange={e => setF('chronicConditions', e.target.value)} />
              </Field>

              {role === 'DOCTOR' && (
                <Field label="SLMC License Number" req>
                  <input type="text" className={iClass} placeholder="SLMC-XXXXX" value={form.licenseNumber} onChange={e => setF('licenseNumber', e.target.value)} />
                </Field>
              )}

              <Field label="Password" req>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input type={showPass ? 'text' : 'password'} className={iClass + ' pl-12 pr-12'} placeholder="Min. 8 characters"
                    value={form.password} onChange={e => setF('password', e.target.value)} />
                  <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {form.password && (
                  <div className="mt-2 flex gap-1">
                    {[8, 12, 16].map((len, i) => (
                      <div key={i} className={`flex-1 h-1 rounded-full transition-all ${form.password.length >= len ? i === 0 ? 'bg-red-500' : i === 1 ? 'bg-[#FFBE29]' : 'bg-emerald-500' : 'bg-white/10'}`} />
                    ))}
                  </div>
                )}
              </Field>

              <Field label="Confirm Password" req>
                <div className="relative">
                  <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input type={showPass ? 'text' : 'password'}
                    className={iClass + ' pl-12 ' + (form.confirmPassword && form.password !== form.confirmPassword ? 'border-red-600/50' : '')}
                    placeholder="Repeat password" value={form.confirmPassword} onChange={e => setF('confirmPassword', e.target.value)} />
                </div>
                {form.confirmPassword && form.password !== form.confirmPassword && (
                  <p className="text-xs text-red-400 font-bold mt-1.5">Passwords do not match</p>
                )}
              </Field>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={goBack}
                  className="px-6 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-black hover:bg-white/10 transition-all">
                  ← Back
                </button>
                <button type="submit" disabled={loading}
                  className="flex-1 py-4 rounded-2xl bg-[#8D153A] hover:bg-[#71112D] text-white font-black transition-all shadow-lg shadow-[#8D153A]/30 flex items-center justify-center gap-2 disabled:opacity-60 text-base hover:scale-[1.01] active:scale-95">
                  {loading ? <><Loader2 size={20} className="animate-spin" />Creating Account...</> : <>Create My Health ID <ArrowRight size={20} /></>}
                </button>
              </div>
            </form>
          )}

          <div className="pt-6 border-t border-white/5 text-center">
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
