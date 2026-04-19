import { useState } from 'react';
import { Eye, EyeOff, AlertCircle, Loader2, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import hero1 from '../assets/hero-1.png';

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
  
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      const { login } = useAuthStore.getState();
      await login(email, password);
      const role = useAuthStore.getState().role;
      if (role === 'PATIENT') navigate('/patient');
      else if (role === 'DOCTOR') navigate('/doctor');
      else if (role === 'ADMIN') navigate('/admin');
      else navigate('/');
    } catch(err: any) {
      setErrors({ general: 'Invalid credentials. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-0 lg:p-8 overflow-hidden">
      
      {/* Background Decorative Blobs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#8D153A]/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 animate-blob" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#FFBE29]/10 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2 animate-blob animation-delay-2000" />

      <div className="w-full max-w-[1200px] bg-white lg:rounded-[4rem] lg:shadow-[0_50px_100px_-20px_rgba(141,21,58,0.15)] flex flex-col lg:flex-row overflow-hidden relative z-10 lg:border lg:border-slate-100 h-full lg:h-auto min-h-screen lg:min-h-0">
        
        {/* Left Aspect - Premium Branding */}
        <div className="lg:w-1/2 relative overflow-hidden hidden lg:block">
           <img src={hero1} alt="Lankan Healthcare" className="absolute inset-0 w-full h-full object-cover" />
           <div className="absolute inset-0 bg-gradient-to-t from-[#8D153A] via-[#8D153A]/40 to-[#8D153A]/20" />
           
           <div className="absolute inset-0 p-20 flex flex-col justify-between text-white">
              <Link to="/" className="flex items-center gap-4">
                 <img src={logo} alt="Logo" className="h-16 w-auto brightness-0 invert" />
              </Link>
              
              <div>
                 <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white font-black text-[10px] uppercase tracking-widest mb-8">
                    <ShieldCheck size={14} className="text-[#FFBE29]" /> Secure Access Node
                 </div>
                 <h1 className="text-6xl font-black tracking-tighter leading-[0.9] mb-8">
                    Welcome back to the <span className="text-[#FFBE29]">Elite Network.</span>
                 </h1>
                 <p className="text-xl text-white/80 font-medium max-w-sm leading-relaxed">
                   Access your distributed medical records with government-grade security.
                 </p>
              </div>

              <div className="flex gap-4">
                 <div className="w-12 h-1 bg-[#FFBE29] rounded-full" />
                 <div className="w-4 h-1 bg-white/20 rounded-full" />
                 <div className="w-4 h-1 bg-white/20 rounded-full" />
              </div>
           </div>
        </div>

        {/* Right Aspect - Modern Form */}
        <div className="flex-1 p-8 lg:p-20 flex flex-col justify-center">
           <div className="max-w-md mx-auto w-full">
              
              {/* Mobile Logo */}
              <Link to="/" className="lg:hidden flex items-center gap-3 mb-12">
                 <img src={logo} alt="Logo" className="h-12 w-auto" />
                 <p className="text-xl font-black text-slate-950">MediConnect</p>
              </Link>

              <h2 className="text-4xl font-black text-slate-950 tracking-tighter mb-4">Sign In</h2>
              <p className="text-slate-500 font-bold mb-10">Access your personalized health dashboard.</p>

              {errors.general && (
                 <div className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 font-bold text-sm mb-8 animate-shake">
                    <AlertCircle size={20} /> {errors.general}
                 </div>
              )}

              <form onSubmit={handleLogin} className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-400 pl-1">Health ID / Email</label>
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
                    <div className="flex justify-between pl-1">
                       <label className="text-xs font-black uppercase tracking-widest text-slate-400">Password</label>
                       <Link to="#" className="text-xs font-bold text-[#8D153A] hover:underline">Forgot?</Link>
                    </div>
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

                 <button type="submit" disabled={loading} className="w-full btn-luminous group">
                    {loading ? (
                      <Loader2 size={24} className="animate-spin" />
                    ) : (
                      <>Sign In Now <ArrowRight className="group-hover:translate-x-2 transition-transform" size={20} /></>
                    )}
                 </button>
              </form>

              <div className="mt-12 pt-8 border-t border-slate-100 text-center">
                 <p className="text-slate-500 font-bold">New to MediConnect?</p>
                 <Link to="/register" className="inline-block mt-4 text-[#8D153A] font-black hover:underline underline-offset-4 decoration-2">
                    Create your National Health ID
                 </Link>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
