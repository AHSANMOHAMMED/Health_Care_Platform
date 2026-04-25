import { useState } from 'react';
import {
  AlertCircle, Loader2, ShieldCheck, ChevronRight, X, Users, Stethoscope, CheckCircle, User, MapPin, Heart, Globe
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../utils/auth';
import logo from '../assets/logo.png';
import hero3 from '../assets/hero-3.png';

type Role = 'PATIENT' | 'DOCTOR';
type Step = 1 | 2 | 3;

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
  specialization: string; licenseNumber: string; qualifications: string; hospitalAffiliation: string;
  password: string; confirmPassword: string;
}

const INITIAL: FormData = {
  firstName: '', lastName: '', dob: '', gender: 'Male', nic: '',
  email: '', phone: '+94', whatsapp: '', province: 'Western', district: '', address: '',
  emergencyContactName: '', emergencyContactPhone: '+94', emergencyContactRelation: '',
  bloodType: 'Unknown', allergies: '', chronicConditions: '', preferredLanguage: 'Sinhala',
  specialization: 'General Practice', licenseNumber: '', qualifications: '', hospitalAffiliation: '',
  password: '', confirmPassword: '',
};

function RoleSelectModal({ platform, onSelect, onClose }: { platform: string; onSelect: (role: 'PATIENT' | 'DOCTOR') => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
      <div className="bg-white border border-slate-300/60 rounded-2xl p-7 w-full max-w-sm shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Sign up with {platform}</p>
            <h3 className="text-lg font-bold text-slate-900">Select your role</h3>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-slate-900 transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="space-y-3">
          <button onClick={() => onSelect('PATIENT')}
            className="w-full p-4 rounded-xl border border-slate-300/60 bg-slate-50 hover:border-[#0EA5E9]/50 hover:bg-slate-100 transition-all text-left flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#0EA5E9]/15 flex items-center justify-center">
              <Users size={20} className="text-[#0EA5E9]" />
            </div>
            <div>
              <p className="font-semibold text-slate-900 text-sm">Patient</p>
              <p className="text-xs text-slate-500">I want to manage my health</p>
            </div>
          </button>
          <button onClick={() => onSelect('DOCTOR')}
            className="w-full p-4 rounded-xl border border-slate-300/60 bg-slate-50 hover:border-[#06B6D4]/50 hover:bg-slate-100 transition-all text-left flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#06B6D4]/15 flex items-center justify-center">
              <Stethoscope size={20} className="text-[#06B6D4]" />
            </div>
            <div>
              <p className="font-semibold text-slate-900 text-sm">Doctor</p>
              <p className="text-xs text-slate-500">I am a medical professional</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, req, children }: { label: string; req?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="clinical-label">{label}{req && <span className="text-[#0EA5E9] ml-1">*</span>}</label>
      {children}
    </div>
  );
}

export default function Register() {
  const [step, setStep] = useState<Step>(1);
  const [role, setRole] = useState<Role>('PATIENT');
  const [form, setForm] = useState<FormData>(INITIAL);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Creating account...');
  const [error, setError] = useState('');
  const [socialPlatform, setSocialPlatform] = useState<string | null>(null);
  const navigate = useNavigate();

  const setF = (f: keyof FormData, v: string) => setForm(p => ({ ...p, [f]: v }));

  const validateStep1 = (): string | null => {
    if (!form.firstName.trim()) return 'First name is required';
    if (!form.lastName.trim()) return 'Last name is required';
    if (!form.dob) return 'Date of birth is required';
    if (!form.nic.trim()) return 'NIC / Passport is required';
    return null;
  };

  const validateStep2 = (): string | null => {
    if (!form.email.trim()) return 'Email is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return 'Invalid email';
    if (form.phone.length < 10) return 'Valid phone number required';
    if (!form.address.trim()) return 'Address is required';
    if (!form.emergencyContactName.trim()) return 'Emergency contact name is required';
    if (form.emergencyContactPhone.length < 10) return 'Valid emergency phone required';
    return null;
  };

  const validateStep3 = (): string | null => {
    if (role === 'DOCTOR') {
      if (!form.licenseNumber.trim()) return 'Medical License Number (SLMC) is required for doctors';
      if (!form.qualifications.trim()) return 'Education / Qualifications are required';
    }
    if (form.password.length < 8) return 'Password must be at least 8 characters';
    if (form.password !== form.confirmPassword) return 'Passwords do not match';
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

  const handleSocialClick = (platform: string) => { setSocialPlatform(platform); };

  const handleSocialRole = (selectedRole: Role) => {
    const platform = socialPlatform!;
    setSocialPlatform(null);
    setLoading(true);
    setLoadingMessage(`Connecting to ${platform}...`);

    try {
      const width = 500;
      const height = 600;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;
      
      const popup = window.open(
        `${import.meta.env.VITE_API_GATEWAY_URL || '/api'}/oauth/${platform.toLowerCase()}?role=${selectedRole}`,
        `${platform} OAuth`,
        `width=${width},height=${height},left=${left},top=${top},popup=1`
      );

      if (!popup) throw new Error('Popup blocked.');

      const handleMessage = (event: MessageEvent) => {
        if (event.origin !== window.location.origin && !event.origin.includes('localhost')) return;

        if (event.data?.type === 'OAUTH_SUCCESS') {
          window.removeEventListener('message', handleMessage);
          const { token, user } = event.data.payload;
          useAuthStore.getState().setAuth(token, user);
          setLoading(false);
          navigate(selectedRole === 'DOCTOR' ? '/doctor' : '/patient');
        } else if (event.data?.type === 'OAUTH_ERROR') {
          window.removeEventListener('message', handleMessage);
          setLoading(false);
          setError('Social login failed.');
        }
      };

      window.addEventListener('message', handleMessage);
      const checkClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkClosed);
          window.removeEventListener('message', handleMessage);
          setLoading(false);
        }
      }, 1000);
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'Social login failed.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validateStep3();
    if (err) { setError(err); return; }

    setLoading(true);
    setError('');
    try {
      await authService.register({ ...form, role } as any);
      
      if (role === 'DOCTOR') {
        setLoading(false);
        alert('Registration successful! Your account is now pending administrative approval. You will be notified via email once approved.');
        navigate('/login');
        return;
      }

      // Automatically login for patients
      try {
        const res = await authService.login(form.email, form.password);
        useAuthStore.getState().setAuth(res.tokens.accessToken, res.user);
        navigate('/patient');
      } catch (loginErr) {
        setError('Account created, but automatic sign-in failed. Please sign in manually.');
        setLoading(false);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Registration failed. This email may already be in use.');
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  const stepLabels = ['Identity', 'Contact & Emergency', 'Health Profile'];

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden">
      {socialPlatform && <RoleSelectModal platform={socialPlatform} onSelect={handleSocialRole} onClose={() => setSocialPlatform(null)} />}

      <div className="hidden lg:flex lg:w-[40%] relative flex-col justify-between p-16 overflow-hidden">
        <img src={hero3} alt="Medical" className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent" />
        <Link to="/" className="relative z-10 flex items-center gap-3 group">
          <img src={logo} alt="Logo" className="h-10 w-auto brightness-0 invert group-hover:scale-105 transition-transform" />
          <p className="text-xl font-bold text-white tracking-tighter">MediConnect <span className="text-[#0EA5E9]">Lanka</span></p>
        </Link>
        <div className="relative z-10">
          <h2 className="text-5xl font-black text-white tracking-tighter leading-[1.05] mb-6">Start your<br /><span className="text-[#0EA5E9]">Health ID</span><br />journey today.</h2>
          <p className="text-slate-300 text-lg font-medium max-w-sm mb-10">One secure digital ID for all your medical needs in Sri Lanka.</p>
          <div className="space-y-4">
            {[{ icon: ShieldCheck, text: 'HIPAA & ISO Compliant Security', color: 'text-emerald-400' },
              { icon: Globe, text: 'National Multi-language Support', color: 'text-[#0EA5E9]' }].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <item.icon size={20} className={item.color} />
                <span className="text-white font-bold text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-y-auto bg-slate-50">
        <div className="w-full max-w-xl mx-auto p-6 lg:p-16 flex flex-col gap-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">Register</h1>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mt-1">Step {step} of 3: {stepLabels[step-1]}</p>
            </div>
            <div className="flex gap-2">
              {([1, 2, 3] as const).map(s => (
                <div key={s} className={`h-1.5 w-8 rounded-full transition-all ${step >= s ? 'bg-[#0EA5E9]' : 'bg-slate-200'}`} />
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 mb-4">
            {([1, 2, 3] as const).map((s, i) => (
              <div key={s} className="flex items-center gap-2 flex-1">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${step === s ? 'bg-[#0EA5E9] text-white shadow-lg shadow-[#0EA5E9]/30' : step > s ? 'bg-emerald-500/20 text-emerald-600' : 'bg-slate-200 text-slate-500'}`}>
                  {step > s ? <CheckCircle size={20} /> : i === 0 ? <User size={20} /> : i === 1 ? <MapPin size={20} /> : <Heart size={20} />}
                </div>
                {i < 2 && <div className={`flex-1 h-1 rounded-full transition-all duration-500 ${step > s ? 'bg-emerald-400' : 'bg-slate-200'}`} />}
              </div>
            ))}
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-600 text-sm font-bold shadow-sm">
              <AlertCircle size={18} /> {error}
            </div>
          )}

          {step === 1 && (
            <div className="space-y-6">
              <div>
                <p className="clinical-label">I am a</p>
                <div className="grid grid-cols-2 gap-3">
                  {([['PATIENT', Users], ['DOCTOR', Stethoscope]] as const).map(([r, Icon]) => (
                    <button key={r} type="button" onClick={() => setRole(r as Role)}
                      className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${role === r ? 'border-[#0EA5E9] bg-[#0EA5E9]/10 text-slate-900 shadow-sm' : 'border-slate-200 bg-white text-slate-500 hover:border-[#0EA5E9]/50'}`}>
                      <Icon size={28} className={role === r ? 'text-[#0EA5E9]' : ''} />
                      <span className="text-xs font-black uppercase tracking-wider">{r}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="clinical-label">Sign up with</p>
                <div className="grid grid-cols-3 gap-3">
                  {['Google', 'Apple', 'Facebook'].map(p => (
                    <button key={p} type="button" onClick={() => handleSocialClick(p)}
                      className="h-12 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center gap-2 text-slate-900 text-xs font-bold hover:bg-slate-50 transition-all hover:border-slate-300">
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="First Name" req>
                  <input type="text" className="clinical-input" placeholder="Aruni" value={form.firstName} onChange={e => setF('firstName', e.target.value)} />
                </Field>
                <Field label="Last Name" req>
                  <input type="text" className="clinical-input" placeholder="Wijesinghe" value={form.lastName} onChange={e => setF('lastName', e.target.value)} />
                </Field>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Date of Birth" req>
                  <input type="date" className="clinical-input" value={form.dob} onChange={e => setF('dob', e.target.value)} />
                </Field>
                <Field label="NIC / Passport" req>
                  <input type="text" className="clinical-input" placeholder="901234567V" value={form.nic} onChange={e => setF('nic', e.target.value)} />
                </Field>
              </div>
              <button type="button" onClick={goNext} className="w-full btn-primary justify-center py-4 text-base shadow-lg shadow-[#0EA5E9]/30">Next: Contact Info <ChevronRight size={18} /></button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <Field label="Email Address" req>
                <input type="email" className="clinical-input" placeholder="aruni@gmail.com" value={form.email} onChange={e => setF('email', e.target.value)} />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Mobile Number" req>
                  <input type="tel" className="clinical-input" placeholder="+94 77 123 4567" value={form.phone} onChange={e => setF('phone', e.target.value)} />
                </Field>
                <Field label="District">
                  <input type="text" className="clinical-input" placeholder="Colombo" value={form.district} onChange={e => setF('district', e.target.value)} />
                </Field>
              </div>
              <Field label="Full Address" req>
                <textarea rows={2} className="clinical-input resize-none" placeholder="No. 42, Galle Road..." value={form.address} onChange={e => setF('address', e.target.value)} />
              </Field>
              <div className="p-5 bg-sky-50 border border-sky-100 rounded-2xl space-y-4">
                <p className="text-[10px] font-black text-[#0EA5E9] uppercase tracking-widest">Emergency Contact</p>
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Contact Name" req>
                    <input type="text" className="clinical-input bg-white" placeholder="Kasun" value={form.emergencyContactName} onChange={e => setF('emergencyContactName', e.target.value)} />
                  </Field>
                  <Field label="Emergency Phone" req>
                    <input type="tel" className="clinical-input bg-white" placeholder="+94 71 123 4567" value={form.emergencyContactPhone} onChange={e => setF('emergencyContactPhone', e.target.value)} />
                  </Field>
                </div>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={goBack} className="btn-secondary px-8 border-slate-200">Back</button>
                <button type="button" onClick={goNext} className="flex-1 btn-primary justify-center py-4 text-base shadow-lg shadow-[#0EA5E9]/30">Next: Health Profile <ChevronRight size={18} /></button>
              </div>
            </div>
          )}

          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {role === 'DOCTOR' ? (
                <>
                  <div className="p-5 bg-indigo-50 border border-indigo-100 rounded-2xl space-y-4 mb-6">
                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest flex items-center gap-2">
                      <Stethoscope size={14} /> Medical Credentials
                    </p>
                    <p className="text-xs text-indigo-800 font-medium mb-2">These details are required for Admin approval of your Doctor account.</p>
                    <div className="grid grid-cols-2 gap-4">
                      <Field label="Specialization" req>
                        <select className="clinical-input bg-white" value={form.specialization} onChange={e => setF('specialization', e.target.value)}>
                          {SPECIALIZATIONS.map(s => <option key={s}>{s}</option>)}
                        </select>
                      </Field>
                      <Field label="SLMC License Number" req>
                        <input type="text" className="clinical-input bg-white" placeholder="SLMC-12345" value={form.licenseNumber} onChange={e => setF('licenseNumber', e.target.value)} />
                      </Field>
                    </div>
                    <Field label="Education / Qualifications" req>
                      <input type="text" className="clinical-input bg-white" placeholder="MBBS (Colombo), MD (Cardiology)" value={form.qualifications} onChange={e => setF('qualifications', e.target.value)} />
                    </Field>
                    <Field label="Primary Hospital Affiliation">
                      <input type="text" className="clinical-input bg-white" placeholder="Lanka Hospitals" value={form.hospitalAffiliation} onChange={e => setF('hospitalAffiliation', e.target.value)} />
                    </Field>
                  </div>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Blood Type">
                    <select className="clinical-input" value={form.bloodType} onChange={e => setF('bloodType', e.target.value)}>
                      {BLOOD_TYPES.map(b => <option key={b}>{b}</option>)}
                    </select>
                  </Field>
                  <Field label="Preferred Language">
                    <select className="clinical-input" value={form.preferredLanguage} onChange={e => setF('preferredLanguage', e.target.value)}>
                      {LANGUAGES.map(l => <option key={l}>{l}</option>)}
                    </select>
                  </Field>
                </div>
              )}
              
              <Field label="Password" req>
                <input type="password" required className="clinical-input" placeholder="Min. 8 characters" value={form.password} onChange={e => setF('password', e.target.value)} />
              </Field>
              <Field label="Confirm Password" req>
                <input type="password" required className="clinical-input" placeholder="Repeat password" value={form.confirmPassword} onChange={e => setF('confirmPassword', e.target.value)} />
              </Field>
              <div className="flex gap-3">
                <button type="button" onClick={goBack} className="btn-secondary px-8 border-slate-200">Back</button>
                <button type="submit" disabled={loading} className="flex-1 btn-primary justify-center py-4 text-base shadow-lg shadow-[#0EA5E9]/30">
                  {loading ? <><Loader2 className="animate-spin" /> {loadingMessage}</> : 'Complete Registration'}
                </button>
              </div>
            </form>
          )}

          <p className="text-center text-sm font-medium text-slate-500">
            Already have a Health ID? <Link to="/login" className="text-[#0EA5E9] hover:underline font-bold">Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
