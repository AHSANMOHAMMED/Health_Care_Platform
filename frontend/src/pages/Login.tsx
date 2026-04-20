import { useState } from 'react';
import { Eye, EyeOff, AlertCircle, Loader2, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../utils/auth';
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
      const response = await authService.login(email, password);
      useAuthStore.getState().setAuth(response.tokens.accessToken, response.user);
      
      const role = response.user.role;
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

                 <button type="submit" disabled={loading} className="w-full btn-luminous group h-14 text-sm tracking-widest cursor-pointer hover:scale-[1.02] active:scale-95 transition-all">
                    {loading ? (
                      <Loader2 size={24} className="animate-spin mx-auto" />
                    ) : (
                      <span className="flex items-center justify-center gap-2">Sign In Now <ArrowRight className="group-hover:translate-x-2 transition-transform" size={18} /></span>
                    )}
                 </button>
              </form>

              {/* Social Auth Separator */}
              <div className="relative mt-10 mb-8">
                 <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                 </div>
                 <div className="relative flex justify-center text-xs">
                    <span className="bg-white px-4 text-slate-400 font-bold uppercase tracking-widest">Or continue with</span>
                 </div>
              </div>

              {/* Premium Social Auth Modules */}
              <div className="grid grid-cols-3 gap-4">
                 <button className="h-12 border border-slate-200 rounded-xl flex items-center justify-center hover:bg-slate-50 hover:border-slate-300 transition-all group">
                    <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                       <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                       <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                       <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                       <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                 </button>
                 <button className="h-12 border border-slate-200 rounded-xl flex items-center justify-center hover:bg-slate-50 hover:border-slate-300 transition-all group">
                    <svg className="w-5 h-5 text-slate-900 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                       <path d="M16.365 1.44c0 0 1.002 0 1.002 1.34 0 2.21-1.63 4.29-3.69 4.29-1.48 0-1.66-1.12-1.66-1.12s-1.02.04-1.28.09c-.26.04-.63.22-.84.45-.22.22-.52.63-.52 1.25 0 1.3 1.08 2.04 1.48 2.29.39.26.87.52 1.44.52 0 0 .17-.04.48-.09.3-.04.78.04 1.25.17.48.13.91.43 1.25.82.35.39.52.87.52 1.44 0 .91-.39 1.74-1.04 2.34-.65.61-1.48 1.08-2.52 1.39-1.04.3-2.17.43-3.21.39-1.04-.04-1.95-.26-2.73-.61-.78-.35-1.43-.87-1.91-1.48-.48-.61-.78-1.25-.87-1.82-.09-.56-.04-1.08.13-1.48.17-.39.43-.65.74-.82.3-.17.65-.26 1.04-.26 0 0 .13.04.35.09.22.04.52.09.82.04.3-.04.56-.13.78-.3.22-.17.43-.39.56-.65.13-.26.22-.56.26-.91 0 0 .04-.39 0-.87-.04-.48-.17-1.04-.39-1.64-.22-.61-.56-1.25-1.08-1.82-.52-.56-1.17-1.04-2.04-1.25C9.8 4.43 8.84 4.56 8.01 5c-.82.43-1.52.95-2.04 1.39-.52.43-.87.87-1.04 1.25-.17.39-.26.87-.26 1.43 0 1.04.35 1.95.91 2.64.56.7 1.34 1.25 2.29 1.56.95.3 2.04.43 3.12.39 0 0-.04.3-0 .74 0 .44.04.91.13 1.3.09.39.26.78.48 1.13.22.35.52.65.87.82.35.17.78.26 1.34.26 0 0-.04.3-0 .87 0 .56.09 1.25.3 1.95.22.7.56 1.48 1.04 2.21.48.74 1.13 1.39 1.95 1.86.82.48 1.82.78 3.03.78v-1.64c-.95 0-1.74-.22-2.38-.61-.65-.39-1.17-.91-1.56-1.48-.39-.56-.65-1.13-.82-1.69-.17-.56-.26-1.04-.26-1.39 0 0 .17.04.52.09.35.04.82.09 1.34.09.52 0 1.08-.09 1.56-.26.48-.17.91-.43 1.25-.74.35-.3.65-.65.87-1.04.22-.39.39-.82.48-1.3.09-.48.13-.95.13-1.39v-1.34h-.04v1.34h1.69z"/>
                    </svg>
                 </button>
                 <button className="h-12 border border-slate-200 rounded-xl flex items-center justify-center hover:bg-slate-50 hover:border-slate-300 transition-all group">
                    <svg className="w-5 h-5 text-[#1877F2] group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                       <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                 </button>
              </div>

              <div className="mt-12 pt-8 border-t border-slate-100 text-center">
                 <p className="text-slate-500 font-bold text-sm">New to MediConnect?</p>
                 <Link to="/register" className="inline-block mt-4 text-[#8D153A] text-sm font-black hover:underline underline-offset-4 decoration-2">
                    Create your National Health ID
                 </Link>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
