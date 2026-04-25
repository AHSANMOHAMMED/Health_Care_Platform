import { useState } from 'react';
import { Eye, EyeOff, AlertCircle, Loader2, ArrowRight, ShieldCheck, Mail, Lock, Users, Stethoscope, X } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../utils/auth';

// ── Social Auth Role Selection Modal ──────────────────────────────────────────
function RoleSelectModal({ platform, onSelect, onClose }: { platform: string; onSelect: (role: 'PATIENT' | 'DOCTOR') => void; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
      <div className="bg-white border border-slate-300/60 rounded-2xl p-7 w-full max-w-sm shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">Continue with {platform}</p>
            <h3 className="text-lg font-bold text-slate-900">Select your role</h3>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/10 text-slate-600 hover:text-slate-900 transition-colors">
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
              <p className="text-xs text-slate-500">Access appointments, records & AI care</p>
            </div>
          </button>
          <button onClick={() => onSelect('DOCTOR')}
            className="w-full p-4 rounded-xl border border-slate-300/60 bg-slate-50 hover:border-[#06B6D4]/50 hover:bg-slate-100 transition-all text-left flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#06B6D4]/15 flex items-center justify-center">
              <Stethoscope size={20} className="text-[#06B6D4]" />
            </div>
            <div>
              <p className="font-semibold text-slate-900 text-sm">Doctor</p>
              <p className="text-xs text-slate-500">Manage patients, prescriptions & schedule</p>
            </div>
          </button>
        </div>
        <p className="text-[11px] text-slate-600 text-center mt-5">You can update your role later in settings</p>
      </div>
    </div>
  );
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Signing in...');
  const [error, setError] = useState('');
  const [socialPlatform, setSocialPlatform] = useState<string | null>(null);
  const navigate = useNavigate();

  const [showRoleSelect, setShowRoleSelect] = useState(false);
  const [pendingOAuthPlatform, setPendingOAuthPlatform] = useState<string | null>(null);

  const handleSocialClick = (platform: string) => {
    // For OAuth, we need to select role first since new users won't have one
    setPendingOAuthPlatform(platform);
    setShowRoleSelect(true);
  };

  const handleSocialRole = async (role: 'PATIENT' | 'DOCTOR') => {
    const platform = pendingOAuthPlatform!;
    setShowRoleSelect(false);
    setPendingOAuthPlatform(null);
    setLoading(true);
    setLoadingMessage(`Connecting to ${platform}...`);

    try {
      // Open OAuth popup
      const width = 500;
      const height = 600;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;
      
      const popup = window.open(
        `${import.meta.env.VITE_API_GATEWAY_URL || '/api'}/oauth/${platform.toLowerCase()}?role=${role}`,
        `${platform} OAuth`,
        `width=${width},height=${height},left=${left},top=${top},popup=1`
      );

      if (!popup) {
        throw new Error('Popup blocked. Please allow popups for this site.');
      }

      // Listen for OAuth callback message
      const handleMessage = (event: MessageEvent) => {
        if (event.origin !== window.location.origin && !event.origin.includes('localhost')) return;

        if (event.data?.type === 'OAUTH_SUCCESS') {
          window.removeEventListener('message', handleMessage);
          const { token, user } = event.data.payload;
          useAuthStore.getState().setAuth(token, user);
          setLoading(false);
          navigate(user.role === 'DOCTOR' ? '/doctor' : '/patient');
        } else if (event.data?.type === 'OAUTH_ERROR') {
          window.removeEventListener('message', handleMessage);
          setLoading(false);
          setError(event.data.payload?.message || 'Social login failed.');
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const response = await authService.login(email, password);
      useAuthStore.getState().setAuth(response.tokens.accessToken, response.user);
      const r = response.user.role;
      navigate(r === 'DOCTOR' ? '/doctor' : r === 'ADMIN' ? '/admin' : '/patient');
    } catch (err: any) {
      setError(err.message || 'Invalid credentials. Please check your email and password.');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      {showRoleSelect && pendingOAuthPlatform && <RoleSelectModal platform={pendingOAuthPlatform} onSelect={handleSocialRole} onClose={() => { setShowRoleSelect(false); setPendingOAuthPlatform(null); }} />}

      <div className="w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-10 h-10 rounded-xl bg-[#0EA5E9]/20 flex items-center justify-center">
            <ShieldCheck size={20} className="text-[#0EA5E9]" />
          </div>
          <div>
            <p className="text-base font-bold text-slate-900 leading-none">MediConnect <span className="text-[#0EA5E9]">Lanka</span></p>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-medium">National Health Network</p>
          </div>
        </Link>

        <div className="bg-white border border-slate-300/50 rounded-2xl p-8 shadow-2xl">
          <h1 className="text-2xl font-bold text-slate-900 mb-1">Welcome back</h1>
          <p className="text-sm text-slate-500 mb-7">Sign in to your health dashboard</p>

          {/* Social Buttons */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            {[
              { label: 'Google', icon: <svg className="w-4 h-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg> },
              { label: 'Apple', icon: <svg className="w-4 h-4 text-slate-900" fill="currentColor" viewBox="0 0 24 24"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg> },
              { label: 'Facebook', icon: <svg className="w-4 h-4 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> },
            ].map(({ label, icon }) => (
              <button key={label} type="button" onClick={() => handleSocialClick(label)} disabled={loading}
                className="h-11 rounded-xl bg-slate-50 border border-slate-300/60 hover:border-[#0EA5E9]/40 hover:bg-slate-100 transition-all flex items-center justify-center gap-2 text-slate-700 text-sm font-medium disabled:opacity-50">
                {icon} <span className="text-xs">{label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px bg-[#1E3A5F]/50" />
            <span className="text-[11px] font-medium text-slate-600 uppercase tracking-wider">or email</span>
            <div className="flex-1 h-px bg-[#1E3A5F]/50" />
          </div>

          {error && (
            <div className="mb-5 p-3.5 bg-red-900/20 border border-red-700/40 rounded-xl flex items-center gap-2.5 text-red-400 text-sm">
              <AlertCircle size={16} className="flex-shrink-0" /> {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="clinical-label">Email Address</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input type="email" required className="clinical-input pl-10" placeholder="aruni@example.com" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="clinical-label !mb-0">Password</label>
                <Link to="/reset-password" className="text-[11px] text-[#0EA5E9] hover:underline font-medium">Forgot password?</Link>
              </div>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input type={showPassword ? 'text' : 'password'} required className="clinical-input pl-10 pr-10" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 transition-colors">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-60 shadow-lg shadow-[#0EA5E9]/20">
              {loading ? <><Loader2 size={16} className="animate-spin" />{loadingMessage}</> : <>Sign In <ArrowRight size={16} /></>}
            </button>
          </form>

        </div>

        <p className="text-center text-sm text-slate-500 mt-6">
          New to MediConnect?{' '}
          <Link to="/register" className="text-[#0EA5E9] hover:underline font-medium">Create your Health ID</Link>
        </p>
      </div>
    </div>
  );
}
