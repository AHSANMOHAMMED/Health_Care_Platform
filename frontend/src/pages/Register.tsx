import { useState } from 'react';
import { Eye, EyeOff, AlertCircle, Loader2, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../utils/auth';
import logo from '../assets/logo.png';
import hero3 from '../assets/hero-3.png';

interface FormErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('PATIENT');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      return;
    }
    setLoading(true);
    setErrors({});

    try {
      await authService.register({ email, password, role: role as 'PATIENT' | 'DOCTOR', firstName: '', lastName: '' });
      const { login } = useAuthStore.getState();
      await login(email, password);
      const userRole = useAuthStore.getState().role;
      if (userRole === 'PATIENT') navigate('/patient');
      else if (userRole === 'DOCTOR') navigate('/doctor');
      else navigate('/');
    } catch(err: any) {
      setErrors({ general: 'Registration failed. Try a different email.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-0 lg:p-8 overflow-hidden">
      
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#FFBE29]/5 rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2 animate-blob" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#8D153A]/10 rounded-full blur-[120px] -translate-x-1/2 translate-y-1/2 animate-blob animation-delay-2000" />

      <div className="w-full max-w-[1200px] bg-white lg:rounded-[4rem] lg:shadow-[0_50px_100px_-20px_rgba(141,21,58,0.15)] flex flex-col lg:flex-row-reverse overflow-hidden relative z-10 lg:border lg:border-slate-100 h-full lg:h-auto min-h-screen lg:min-h-0">
        
        {/* Right Aspect - Premium Branding */}
        <div className="lg:w-1/2 relative overflow-hidden hidden lg:block">
           <img src={hero3} alt="Wellness" className="absolute inset-0 w-full h-full object-cover" />
           <div className="absolute inset-0 bg-gradient-to-t from-[#8D153A] via-[#8D153A]/40 to-[#8D153A]/20" />
           
           <div className="absolute inset-0 p-20 flex flex-col justify-between text-white">
              <Link to="/" className="flex items-center gap-4">
                 <img src={logo} alt="Logo" className="h-16 w-auto brightness-0 invert" />
              </Link>
              
              <div className="text-right">
                 <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-black text-[10px] uppercase tracking-widest mb-8">
                    <ShieldCheck size={14} className="text-[#FFBE29]" /> National Health Grid
                 </div>
                 <h1 className="text-6xl font-black tracking-tighter leading-[0.9] mb-8">
                    Join the digital <br/> <span className="text-[#FFBE29]">Healthcare Elite.</span>
                 </h1>
                 <p className="text-xl text-white/80 font-medium ml-auto max-w-sm leading-relaxed">
                   Experience the most advanced medical ecosystem in South Asia.
                 </p>
              </div>

              <div className="flex gap-4 justify-end">
                 <div className="w-4 h-1 bg-white/20 rounded-full" />
                 <div className="w-12 h-1 bg-[#FFBE29] rounded-full" />
                 <div className="w-4 h-1 bg-white/20 rounded-full" />
              </div>
           </div>
        </div>

        {/* Left Aspect - Modern Form */}
        <div className="flex-1 p-8 lg:p-20 flex flex-col justify-center">
           <div className="max-w-md mx-auto w-full">
              
              {/* Mobile Logo */}
              <Link to="/" className="lg:hidden flex items-center gap-3 mb-12">
                 <img src={logo} alt="Logo" className="h-12 w-auto" />
                 <p className="text-xl font-black text-slate-950">MediConnect</p>
              </Link>

              <h2 className="text-4xl font-black text-slate-950 tracking-tighter mb-4">Create Health ID</h2>
              <p className="text-slate-500 font-bold mb-8">Select your role to begin your high-tech journey.</p>

              {/* Role Selector */}
              <div className="grid grid-cols-2 gap-4 mb-10">
                 <button 
                   onClick={() => setRole('PATIENT')}
                   className={`h-20 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-1 ${role === 'PATIENT' ? 'border-[#8D153A] bg-[#8D153A]/5' : 'border-slate-100 opacity-60'}`}
                 >
                    <span className={`font-black uppercase tracking-widest text-[10px] ${role === 'PATIENT' ? 'text-[#8D153A]' : 'text-slate-400'}`}>Patient</span>
                    <p className={`font-bold ${role === 'PATIENT' ? 'text-[#8D153A]' : 'text-slate-950'}`}>Personal Care</p>
                 </button>
                 <button 
                   onClick={() => setRole('DOCTOR')}
                   className={`h-20 rounded-2xl border-2 transition-all flex flex-col items-center justify-center gap-1 ${role === 'DOCTOR' ? 'border-[#FFBE29] bg-[#FFBE29]/5' : 'border-slate-100 opacity-60'}`}
                 >
                    <span className={`font-black uppercase tracking-widest text-[10px] ${role === 'DOCTOR' ? 'text-[#E5AB22]' : 'text-slate-400'}`}>Professional</span>
                    <p className={`font-bold ${role === 'DOCTOR' ? 'text-[#E5AB22]' : 'text-slate-950'}`}>Medical Expert</p>
                 </button>
              </div>

              {errors.general && (
                 <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 font-bold text-sm mb-8 animate-shake">
                    <AlertCircle size={20} /> {errors.general}
                 </div>
              )}

              <form onSubmit={handleRegister} className="space-y-5">
                 <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 pl-1">Primary Email</label>
                    <input 
                      type="email" 
                      required 
                      className="input-luminous"
                      placeholder="name@example.com"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                 </div>

                 <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 pl-1">Secure Password</label>
                    <div className="relative">
                       <input 
                         type={showPassword ? 'text' : 'password'} 
                         required 
                         className="input-luminous pr-14"
                         placeholder="••••••••"
                         value={password}
                         onChange={e => setPassword(e.target.value)}
                       />
                       <button 
                         type="button" 
                         onClick={() => setShowPassword(!showPassword)}
                         className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-300 hover:text-[#8D153A] transition-colors"
                       >
                         {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                       </button>
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 pl-1">Confirm Identity Key</label>
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      required 
                      className={`input-luminous ${errors.confirmPassword ? 'border-red-500' : ''}`}
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                    />
                    {errors.confirmPassword && <p className="text-xs text-red-500 font-bold pl-1">{errors.confirmPassword}</p>}
                 </div>

                 <button type="submit" disabled={loading} className="w-full btn-luminous group mt-4">
                    {loading ? (
                      <Loader2 size={24} className="animate-spin" />
                    ) : (
                      <>Create Account Now <ArrowRight className="group-hover:translate-x-2 transition-transform" size={20} /></>
                    )}
                 </button>
              </form>

              <div className="mt-10 pt-8 border-t border-slate-100 text-center">
                 <p className="text-slate-500 font-bold">Already part of the network?</p>
                 <Link to="/login" className="inline-block mt-4 text-[#8D153A] font-black hover:underline underline-offset-4 decoration-2">
                    Sign in to your Dashboard
                 </Link>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
