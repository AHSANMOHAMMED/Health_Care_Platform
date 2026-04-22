import { useState } from 'react';
import {
  Eye, EyeOff, AlertCircle, Loader2, ArrowRight,
  ShieldCheck, Mail, Lock
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../utils/auth';
import logo from '../assets/logo.png';
import hero1 from '../assets/hero-1.png';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
    }, 1000);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await authService.login(email, password);
      useAuthStore.getState().setAuth(response.tokens.accessToken, response.user);
      const role = response.user.role;
      if (role === 'PATIENT') navigate('/patient');
      else if (role === 'DOCTOR') navigate('/doctor');
      else if (role === 'ADMIN') navigate('/admin');
      else navigate('/');
    } catch {
      setError('Invalid credentials. Please check your email and password.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold placeholder-slate-500 focus:outline-none focus:border-[#8D153A]/60 focus:ring-2 focus:ring-[#8D153A]/10 transition-all";

  return (
    <div className="min-h-screen bg-[#0A0A0F] flex overflow-hidden">

      {/* Left — Cinematic Branding */}
      <div className="hidden lg:flex lg:w-[45%] relative flex-col justify-between p-16 overflow-hidden flex-shrink-0">
        <img src={hero1} alt="Healthcare" className="absolute inset-0 w-full h-full object-cover scale-105" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-[#8D153A]/50 to-[#0A0A0F]/60" />

        <Link to="/" className="relative z-10 flex items-center gap-3">
          <img src={logo} alt="Logo" className="h-12 w-auto brightness-0 invert" />
          <div className="leading-none">
            <p className="text-xl font-black text-white tracking-tighter">MediConnect <span className="text-[#FFBE29]">Lanka</span></p>
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-1">National Health Network</p>
          </div>
        </Link>

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/10 text-[#FFBE29] text-xs font-black uppercase tracking-widest mb-8">
            <ShieldCheck size={14} /> Secure Access Node
          </div>
          <h2 className="text-5xl lg:text-6xl font-black text-white tracking-tighter leading-[0.9] mb-6">
            Welcome<br />Back to the<br /><span className="text-[#FFBE29]">Network.</span>
          </h2>
          <p className="text-slate-300 font-medium max-w-sm leading-relaxed">
            Access your distributed medical records, prescriptions, and specialists with government-grade security.
          </p>

          <div className="mt-10 grid grid-cols-3 gap-4">
            {[
              { label: '248+', sub: 'Specialists' },
              { label: '25', sub: 'Districts' },
              { label: '99.9%', sub: 'Uptime' },
            ].map((s, i) => (
              <div key={i} className="text-center p-4 rounded-2xl bg-white/5 border border-white/5">
                <p className="font-black text-[#FFBE29] text-2xl">{s.label}</p>
                <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest mt-1">{s.sub}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative z-10 text-slate-600 text-xs font-bold">
          © 2026 MediConnect Lanka — ISO 27001 Encrypted
        </div>
      </div>

      {/* Right — Login Form */}
      <div className="flex-1 flex flex-col overflow-y-auto items-center justify-center p-6">
        <div className="w-full max-w-md">

          {/* Mobile Logo */}
          <Link to="/" className="lg:hidden flex items-center gap-3 mb-10">
            <img src={logo} alt="Logo" className="h-10 w-auto brightness-0 invert" />
            <p className="text-lg font-black text-white">MediConnect <span className="text-[#FFBE29]">Lanka</span></p>
          </Link>

          <div className="mb-10">
            <h1 className="text-4xl font-black text-white tracking-tighter mb-2">Sign In</h1>
            <p className="text-slate-500 font-medium">Access your personalized health dashboard.</p>
          </div>

          {/* Social Auth */}
          <div className="mb-8">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">Quick access with</p>
            <div className="grid grid-cols-3 gap-3">
              {[
                {
                  label: 'Google', onClick: () => handleSocialLogin('Google'),
                  icon: (
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                  )
                },
                {
                  label: 'Apple', onClick: () => handleSocialLogin('Apple'),
                  icon: <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                },
                {
                  label: 'Facebook', onClick: () => handleSocialLogin('Facebook'),
                  icon: <svg className="w-5 h-5 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                }
              ].map(({ label, onClick, icon }) => (
                <button key={label} onClick={onClick} disabled={loading}
                  className="h-14 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-center gap-2 font-bold text-white text-sm disabled:opacity-60">
                  {icon} {label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs font-black uppercase tracking-widest text-slate-600">Or sign in with email</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-900/30 border border-red-700/40 rounded-2xl flex items-center gap-3 text-red-400 font-bold text-sm">
              <AlertCircle size={18} className="flex-shrink-0" /> {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Email / Health ID</label>
              <div className="relative">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input type="email" required className={inputClass + ' pl-12'} placeholder="aruni@example.com" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Password</label>
                <Link to="#" className="text-[10px] font-black text-[#8D153A] hover:text-[#FF6B8A] uppercase tracking-widest transition-colors">Forgot?</Link>
              </div>
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input type={showPassword ? 'text' : 'password'} required className={inputClass + ' pl-12 pr-12'} placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-4 rounded-2xl bg-[#8D153A] hover:bg-[#71112D] text-white font-black text-base transition-all shadow-lg shadow-[#8D153A]/30 flex items-center justify-center gap-2 disabled:opacity-60 hover:scale-[1.01] active:scale-95">
              {loading ? <><Loader2 size={20} className="animate-spin" />Signing In...</> : <>Sign In Now <ArrowRight size={20} /></>}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 p-4 rounded-2xl bg-white/3 border border-white/5">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">Demo Credentials</p>
            <div className="space-y-2">
              {[
                { role: 'Admin', email: 'admin@mediconnect.lk', pass: 'Admin@123' },
                { role: 'Doctor', email: 'doctor@mediconnect.lk', pass: 'Doctor@123' },
                { role: 'Patient', email: 'patient@mediconnect.lk', pass: 'Patient@123' },
              ].map(({ role, email: e, pass }) => (
                <button key={role} onClick={() => { setEmail(e); setPassword(pass); }}
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl bg-white/3 hover:bg-white/8 transition-all text-left border border-white/5 hover:border-white/10">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{role}</span>
                    <p className="text-xs font-bold text-slate-400">{e}</p>
                  </div>
                  <span className="text-[10px] text-slate-600 font-mono">{pass}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 text-center">
            <p className="text-slate-500 font-medium text-sm">New to MediConnect?</p>
            <Link to="/register" className="inline-block mt-2 text-[#8D153A] hover:text-[#FF6B8A] font-black text-sm hover:underline underline-offset-4 transition-colors">
              Create your National Health ID →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
