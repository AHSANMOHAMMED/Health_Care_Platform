import { useState } from 'react';
import { Eye, EyeOff, AlertCircle, Loader2, Check, ArrowRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../utils/auth';

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  role?: string;
  general?: string;
}

interface PasswordStrength {
  score: number;
  feedback: string[];
  color: string;
}

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('PATIENT');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({ score: 0, feedback: [], color: 'bg-slate-200' });
  
  const navigate = useNavigate();

  const calculatePasswordStrength = (password: string): PasswordStrength => {
    const feedback: string[] = [];
    let score = 0;
    if (password.length >= 8) score += 1; else feedback.push('At least 8 chars');
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1; else feedback.push('Mixed case');
    if (/\d/.test(password)) score += 1; else feedback.push('Number');
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1; else feedback.push('Special char');
    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-emerald-500'];
    return { score, feedback, color: password ? colors[Math.max(score - 1, 0)] : 'bg-slate-200' };
  };

  const validateField = (field: string, val1: string, val2?: string) => {
    if (field === 'email') return !val1 ? 'Email required' : (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val1) ? 'Invalid email' : undefined);
    if (field === 'password') return val1.length < 8 ? 'Min 8 chars required' : undefined;
    if (field === 'confirmPassword') return val1 !== val2 ? 'Passwords do not match' : undefined;
    return undefined;
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    let error;
    if (field === 'email') error = validateField('email', email);
    if (field === 'password') error = validateField('password', password);
    if (field === 'confirmPassword') error = validateField('confirmPassword', confirmPassword, password);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    const eErr = validateField('email', email);
    const pErr = validateField('password', password);
    const cpErr = validateField('confirmPassword', confirmPassword, password);
    
    setTouched({ email: true, password: true, confirmPassword: true });
    setErrors({ email: eErr, password: pErr, confirmPassword: cpErr });
    
    if (eErr || pErr || cpErr) return;
    
    setLoading(true);
    try {
      await authService.register({ email, password, role: role as 'PATIENT' | 'DOCTOR', firstName: '', lastName: '' });
      navigate('/login?message=Registration successful! Please login.');
    } catch(err: any) {
      setErrors({ ...errors, general: err.response?.status === 409 ? 'Email exists' : 'Registration failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen ambient-bg flex items-center justify-center p-4">
      <div className="w-full max-w-6xl premium-glass overflow-hidden flex flex-col md:flex-row-reverse shadow-2xl animate-slide-up">
        
        {/* Right Side Branding */}
        <div className="md:w-1/2 p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden bg-slate-900 text-white">
          <div className="absolute inset-0 bg-gradient-to-bl from-emerald-900 to-slate-900 opacity-90 z-0"/>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 z-0"/>
          
          <div className="relative z-10 text-right">
            <Link to="/" className="inline-flex flex-row-reverse items-center gap-2 text-2xl font-bold mb-12 hover:opacity-80 transition">
              <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center text-white">M</div>
              MedCare+
            </Link>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              Start your <br/> <span className="text-emerald-400">healing journey.</span>
            </h1>
            <p className="text-slate-300 text-lg max-w-md ml-auto">
              Create an account to unlock telemedicine, precise scheduling, and AI-powered symptom checking.
            </p>
          </div>
        </div>

        {/* Left Side Form */}
        <div className="md:w-1/2 p-12 lg:p-16 bg-white/60 relative">
          <div className="max-w-md mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Create Account</h2>
            <p className="text-slate-500 mb-8 font-medium">Join us as a patient or medical professional.</p>
            
            {errors.general && (
              <div className="mb-6 p-4 premium-glass border-red-200 bg-red-50 flex items-start gap-3 animate-fade-in">
                <AlertCircle className="text-red-600 mt-0.5 shrink-0" size={18} />
                <span className="text-red-700 text-sm font-medium">{errors.general}</span>
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="grid grid-cols-2 gap-3 mb-6">
                <button
                  type="button"
                  onClick={() => setRole('PATIENT')}
                  className={`py-3 rounded-xl font-bold text-sm transition-all border-2 ${role === 'PATIENT' ? 'border-emerald-500 bg-emerald-50 text-emerald-800 shadow-sm' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                >
                  I'm a Patient
                </button>
                <button
                  type="button"
                  onClick={() => setRole('DOCTOR')}
                  className={`py-3 rounded-xl font-bold text-sm transition-all border-2 ${role === 'DOCTOR' ? 'border-indigo-500 bg-indigo-50 text-indigo-800 shadow-sm' : 'border-slate-200 text-slate-500 hover:bg-slate-50'}`}
                >
                  I'm a Doctor
                </button>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700 pl-1">Email Address</label>
                <input 
                  type="email" value={email} onChange={e => setEmail(e.target.value)} onBlur={() => handleBlur('email')}
                  className={`input-premium ${touched.email && errors.email ? 'border-red-300 ring-4 ring-red-500/10' : ''}`}
                  placeholder="name@example.com"
                />
                {touched.email && errors.email && <p className="text-sm text-red-600 pl-1">{errors.email}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700 pl-1">Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? 'text' : 'password'} value={password} 
                    onChange={e => { setPassword(e.target.value); setPasswordStrength(calculatePasswordStrength(e.target.value)); }} 
                    onBlur={() => handleBlur('password')}
                    className={`input-premium pr-12 ${touched.password && errors.password ? 'border-red-300 ring-4 ring-red-500/10' : ''}`}
                    placeholder="Create strong password"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {/* Strength meter */}
                <div className="flex items-center gap-1 mt-2 mb-1">
                  {[1,2,3,4].map(i => (
                    <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= passwordStrength.score ? passwordStrength.color : 'bg-slate-200'}`} />
                  ))}
                </div>
                {touched.password && errors.password && <p className="text-sm text-red-600 pl-1">{errors.password}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700 pl-1">Confirm Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} onBlur={() => handleBlur('confirmPassword')}
                    className={`input-premium pr-12 ${touched.confirmPassword && errors.confirmPassword ? 'border-red-300 ring-4 ring-red-500/10' : ''}`}
                    placeholder="Confirm password"
                  />
                  {touched.confirmPassword && !errors.confirmPassword && confirmPassword && (
                    <Check className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500" size={20} />
                  )}
                </div>
                {touched.confirmPassword && errors.confirmPassword && <p className="text-sm text-red-600 pl-1">{errors.confirmPassword}</p>}
              </div>

              <button type="submit" disabled={loading} className="w-full btn-primary mt-6 !bg-slate-900 before:!bg-gradient-to-r before:!from-emerald-500 before:!to-teal-500">
                {loading ? <span className="flex items-center justify-center gap-2"><Loader2 className="animate-spin" size={20} /> Creating...</span> : <span className="flex items-center justify-center gap-2">Create Account <ArrowRight size={18}/></span>}
              </button>
            </form>

            <div className="mt-8 text-center text-sm font-medium text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="text-emerald-600 hover:text-emerald-800 transition underline decoration-2 underline-offset-4">
                Sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
