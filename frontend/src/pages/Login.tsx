import { useState } from 'react';
import { Eye, EyeOff, AlertCircle, Loader2, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate, Link } from 'react-router-dom';

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  
  const navigate = useNavigate();

  const validateEmail = (email: string): string | undefined => {
    if (!email) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return undefined;
  };

  const validatePassword = (password: string): string | undefined => {
    if (!password) return 'Password is required';
    if (password.length < 6) return 'Password must be at least 6 characters long';
    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      email: validateEmail(email),
      password: validatePassword(password),
    };
    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });
    if (field === 'email') setErrors({ ...errors, email: validateEmail(email) });
    else if (field === 'password') setErrors({ ...errors, password: validatePassword(password) });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setLoading(true);
    setErrors({ ...errors, general: undefined });
    
    try {
      const { login } = useAuthStore.getState();
      await login(email, password);
      // Fallback dashboard routing (use real role later)
      navigate('/patient-dashboard');
    } catch(err: any) {
      console.error('Login error:', err);
      let errorMessage = 'Login failed. Please try again.';
      if (err.response?.status === 401) errorMessage = 'Invalid email or password.';
      else if (err.response?.status === 429) errorMessage = 'Too many attempts. Try again later.';
      else if (err.code === 'NETWORK_ERROR') errorMessage = 'Network error. Check connection.';
      setErrors({ ...errors, general: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const getFieldError = (field: string) => touched[field] ? errors[field as keyof FormErrors] : undefined;
  const hasFieldError = (field: string) => touched[field] && !!errors[field as keyof FormErrors];

  return (
    <div className="min-h-screen ambient-bg flex items-center justify-center p-4">
      <div className="w-full max-w-6xl premium-glass overflow-hidden flex flex-col md:flex-row shadow-2xl animate-slide-up">
        
        {/* Left Side Branding */}
        <div className="md:w-1/2 p-12 lg:p-16 flex flex-col justify-between relative overflow-hidden bg-slate-900 text-white">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 to-slate-900 opacity-90 z-0"/>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 z-0"/>
          
          <div className="relative z-10">
            <Link to="/" className="inline-flex items-center gap-2 text-2xl font-bold mb-12 hover:opacity-80 transition">
              <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
                <span className="text-white">M</span>
              </div>
              MedCare+
            </Link>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              Welcome back to <br/> your <span className="text-indigo-400">health hub.</span>
            </h1>
            <p className="text-slate-300 text-lg max-w-md">
              Securely access your medical records, book appointments, and connect with your doctors instantly.
            </p>
          </div>

          <div className="relative z-10 mt-12 bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10">
            <div className="flex -space-x-4 mb-4">
              {[1,2,3].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-indigo-900 bg-indigo-200 flex items-center justify-center text-indigo-800 font-bold text-xs shadow-lg">
                  U{i}
                </div>
              ))}
            </div>
            <p className="text-sm font-medium text-slate-200">Join 10,000+ users managing health digitally.</p>
          </div>
        </div>

        {/* Right Side Form */}
        <div className="md:w-1/2 p-12 lg:p-16 bg-white/60 relative">
          <div className="max-w-md mx-auto">
            <h2 className="text-3xl font-bold text-slate-900 mb-2">Sign in</h2>
            <p className="text-slate-500 mb-8 font-medium">Please enter your credentials to continue</p>
            
            {errors.general && (
              <div className="mb-6 p-4 premium-glass border-red-200 bg-red-50/80 flex items-start gap-3 animate-fade-in">
                <AlertCircle className="text-red-600 mt-0.5 shrink-0" size={18} />
                <span className="text-red-700 text-sm font-medium">{errors.general}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700 pl-1">Email Address</label>
                <div className="relative">
                  <input 
                    type="email" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    onBlur={() => handleBlur('email')}
                    className={`input-premium ${hasFieldError('email') ? 'border-red-300 ring-4 ring-red-500/10' : ''}`}
                    placeholder="name@example.com"
                  />
                  {hasFieldError('email') && <AlertCircle className="absolute right-4 top-1/2 -translate-y-1/2 text-red-500" size={20} />}
                </div>
                {getFieldError('email') && <p className="text-sm text-red-600 pl-1 animate-fade-in">{getFieldError('email')}</p>}
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-end pl-1 pr-1">
                  <label className="text-sm font-semibold text-slate-700">Password</label>
                  <a href="#" className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition">Forgot password?</a>
                </div>
                <div className="relative">
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    onBlur={() => handleBlur('password')}
                    className={`input-premium pr-12 ${hasFieldError('password') ? 'border-red-300 ring-4 ring-red-500/10' : ''}`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 transition"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {getFieldError('password') && <p className="text-sm text-red-600 pl-1 animate-fade-in">{getFieldError('password')}</p>}
              </div>

              <button type="submit" disabled={loading} className="w-full btn-primary mt-6">
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="animate-spin" size={20} /> Signing In...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Sign In <ArrowRight size={18}/>
                  </span>
                )}
              </button>
            </form>

            <div className="mt-8 text-center text-sm font-medium text-slate-500">
              Don't have an account?{' '}
              <Link to="/register" className="text-indigo-600 hover:text-indigo-800 transition underline decoration-2 underline-offset-4">
                Create one now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
