import { useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Loader2, CheckCircle, XCircle, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { api } from '../api/axios';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<'form' | 'loading' | 'success' | 'error'>('form');
  const [message, setMessage] = useState('');

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    try {
      const response = await api.post('/auth/request-password-reset', { email });
      setStatus('success');
      setMessage(response.data.message || 'Password reset instructions sent to your email.');
    } catch (error: any) {
      setStatus('error');
      setMessage(error.response?.data?.message || 'Failed to send reset email. Please try again.');
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 8) {
      setMessage('Password must be at least 8 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    setStatus('loading');
    try {
      const response = await api.post('/auth/reset-password', {
        token,
        newPassword
      });
      setStatus('success');
      setMessage(response.data.message || 'Password reset successful!');
    } catch (error: any) {
      setStatus('error');
      setMessage(error.response?.data?.message || 'Password reset failed. The link may have expired.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0C1220] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-10 h-10 rounded-xl bg-[#0EA5E9]/20 flex items-center justify-center">
            <ShieldCheck size={20} className="text-[#0EA5E9]" />
          </div>
          <div>
            <p className="text-base font-bold text-white leading-none">MediConnect <span className="text-[#0EA5E9]">Lanka</span></p>
            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-medium">National Health Network</p>
          </div>
        </Link>

        <div className="bg-[#111B2E] border border-[#1E3A5F]/50 rounded-2xl p-8 shadow-2xl">
          {!token ? (
            // Request Reset Form
            <>
              {status === 'success' ? (
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={32} className="text-emerald-500" />
                  </div>
                  <h1 className="text-xl font-bold text-white mb-2">Check Your Email</h1>
                  <p className="text-sm text-slate-400 mb-6">{message}</p>
                  <button
                    onClick={() => navigate('/login')}
                    className="w-full py-3 rounded-xl bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-semibold text-sm transition-all"
                  >
                    Back to Login
                  </button>
                </div>
              ) : (
                <>
                  <h1 className="text-xl font-bold text-white mb-1 text-center">Reset Password</h1>
                  <p className="text-sm text-slate-500 mb-6 text-center">
                    Enter your email and we'll send you instructions to reset your password.
                  </p>

                  {status === 'error' && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
                      <p className="text-sm text-red-400">{message}</p>
                    </div>
                  )}

                  <form onSubmit={handleRequestReset} className="space-y-4">
                    <div>
                      <label className="text-xs font-medium text-slate-400 mb-1.5 block">Email Address</label>
                      <div className="relative">
                        <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your@email.com"
                          className="w-full bg-[#0C1220] border border-[#1E3A5F]/50 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#0EA5E9]/50 transition-colors"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="w-full py-3 rounded-xl bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      {status === 'loading' ? (
                        <><Loader2 size={16} className="animate-spin" /> Sending...</>
                      ) : (
                        <>Send Reset Link <ArrowRight size={16} /></>
                      )}
                    </button>
                  </form>

                  <p className="mt-6 text-center text-sm text-slate-500">
                    Remember your password?{' '}
                    <Link to="/login" className="text-[#0EA5E9] hover:underline">Sign in</Link>
                  </p>
                </>
              )}
            </>
          ) : (
            // Reset Password Form
            <>
              {status === 'success' ? (
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={32} className="text-emerald-500" />
                  </div>
                  <h1 className="text-xl font-bold text-white mb-2">Password Updated!</h1>
                  <p className="text-sm text-slate-400 mb-6">{message}</p>
                  <button
                    onClick={() => navigate('/login')}
                    className="w-full py-3 rounded-xl bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-semibold text-sm transition-all"
                  >
                    Sign In with New Password
                  </button>
                </div>
              ) : (
                <>
                  <h1 className="text-xl font-bold text-white mb-1 text-center">Create New Password</h1>
                  <p className="text-sm text-slate-500 mb-6 text-center">
                    Enter your new password below.
                  </p>

                  {message && status !== 'loading' && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl">
                      <p className="text-sm text-red-400">{message}</p>
                    </div>
                  )}

                  <form onSubmit={handleResetPassword} className="space-y-4">
                    <div>
                      <label className="text-xs font-medium text-slate-400 mb-1.5 block">New Password</label>
                      <div className="relative">
                        <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="••••••••"
                          minLength={8}
                          className="w-full bg-[#0C1220] border border-[#1E3A5F]/50 rounded-xl py-3 pl-10 pr-10 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#0EA5E9]/50 transition-colors"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">Must be at least 8 characters</p>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-slate-400 mb-1.5 block">Confirm Password</label>
                      <div className="relative">
                        <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          required
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="••••••••"
                          minLength={8}
                          className="w-full bg-[#0C1220] border border-[#1E3A5F]/50 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#0EA5E9]/50 transition-colors"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="w-full py-3 rounded-xl bg-[#0EA5E9] hover:bg-[#0284C7] text-white font-semibold text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      {status === 'loading' ? (
                        <><Loader2 size={16} className="animate-spin" /> Resetting...</>
                      ) : (
                        <>Reset Password <ArrowRight size={16} /></>
                      )}
                    </button>
                  </form>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
