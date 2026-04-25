import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Loader2, CheckCircle, XCircle, Mail, ArrowRight } from 'lucide-react';
import { api } from '../api/axios';

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email...');
  const [resendEmail, setResendEmail] = useState('');
  const [resendStatus, setResendStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('No verification token provided. Please check your email link.');
      return;
    }

    verifyToken();
  }, [token]);

  const verifyToken = async () => {
    try {
      const response = await api.get(`/auth/verify-email?token=${token}`);
      setStatus('success');
      setMessage(response.data.message || 'Email verified successfully!');
    } catch (error: any) {
      setStatus('error');
      setMessage(error.response?.data?.message || 'Verification failed. The link may have expired.');
    }
  };

  const handleResend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resendEmail) return;

    setResendStatus('loading');
    try {
      await api.post('/auth/resend-verification', { email: resendEmail });
      setResendStatus('success');
    } catch (error: any) {
      setResendStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
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

        <div className="bg-white border border-slate-300/50 rounded-2xl p-8 shadow-2xl text-center">
          {status === 'loading' && (
            <>
              <div className="w-16 h-16 rounded-full bg-[#0EA5E9]/10 flex items-center justify-center mx-auto mb-6">
                <Loader2 size={32} className="text-[#0EA5E9] animate-spin" />
              </div>
              <h1 className="text-xl font-bold text-slate-900 mb-2">Verifying Email</h1>
              <p className="text-sm text-slate-600">{message}</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={32} className="text-emerald-500" />
              </div>
              <h1 className="text-xl font-bold text-slate-900 mb-2">Email Verified!</h1>
              <p className="text-sm text-slate-600 mb-6">{message}</p>
              <button
                onClick={() => navigate('/login')}
                className="w-full py-3 rounded-xl bg-[#0EA5E9] hover:bg-[#0284C7] text-slate-900 font-semibold text-sm transition-all flex items-center justify-center gap-2"
              >
                Continue to Login <ArrowRight size={16} />
              </button>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
                <XCircle size={32} className="text-red-500" />
              </div>
              <h1 className="text-xl font-bold text-slate-900 mb-2">Verification Failed</h1>
              <p className="text-sm text-slate-600 mb-6">{message}</p>

              <div className="border-t border-slate-300/50 pt-6">
                <p className="text-sm text-slate-700 mb-4">Need a new verification link?</p>

                {resendStatus === 'success' ? (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                    <p className="text-sm text-emerald-400">Verification email sent! Check your inbox.</p>
                  </div>
                ) : (
                  <form onSubmit={handleResend} className="space-y-3">
                    <div className="relative">
                      <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                      <input
                        type="email"
                        required
                        value={resendEmail}
                        onChange={(e) => setResendEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="w-full bg-slate-50 border border-slate-300/50 rounded-xl py-3 pl-10 pr-4 text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:border-[#0EA5E9]/50 transition-colors"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={resendStatus === 'loading'}
                      className="w-full py-2.5 rounded-xl bg-[#1E3A5F] hover:bg-[#2A4A6F] text-slate-900 font-medium text-sm transition-all disabled:opacity-60"
                    >
                      {resendStatus === 'loading' ? (
                        <span className="flex items-center justify-center gap-2">
                          <Loader2 size={14} className="animate-spin" /> Sending...
                        </span>
                      ) : (
                        'Resend Verification Email'
                      )}
                    </button>
                  </form>
                )}
              </div>

              <p className="mt-6 text-sm text-slate-500">
                Already have an account?{' '}
                <Link to="/login" className="text-[#0EA5E9] hover:underline">Sign in</Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
