import { useState } from 'react';
import { Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { api } from '../api/axios';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';

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
  
  const setAuth = useAuthStore(state => state.setAuth);
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
    
    if (field === 'email') {
      setErrors({ ...errors, email: validateEmail(email) });
    } else if (field === 'password') {
      setErrors({ ...errors, password: validatePassword(password) });
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setErrors({ ...errors, general: undefined });
    
    try {
      const { login } = useAuthStore.getState();
      await login(email, password);
      navigate('/patient');
    } catch(err: any) {
      console.error('Login error:', err);
      let errorMessage = 'Login failed. Please try again.';
      
      if (err.response?.status === 401) {
        errorMessage = 'Invalid email or password.';
      } else if (err.response?.status === 429) {
        errorMessage = 'Too many login attempts. Please try again later.';
      } else if (err.code === 'NETWORK_ERROR') {
        errorMessage = 'Network error. Please check your connection.';
      }
      
      setErrors({ ...errors, general: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const getFieldError = (field: string) => {
    return touched[field] ? errors[field as keyof FormErrors] : undefined;
  };

  const hasFieldError = (field: string) => {
    return touched[field] && !!errors[field as keyof FormErrors];
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-8 rounded-2xl shadow-xl border border-slate-50">
      <h2 className="text-3xl font-extrabold text-center text-slate-800 mb-2">Welcome Back</h2>
      <p className="text-center text-slate-500 mb-8">Enter your credentials to access your portal</p>
      
      {/* General Error */}
      {errors.general && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <AlertCircle className="text-red-600" size={20} />
          <span className="text-red-700 text-sm">{errors.general}</span>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
          <div className="relative">
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              onBlur={() => handleBlur('email')}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none ${
                hasFieldError('email') 
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                  : 'border-slate-200'
              }`}
              placeholder="Enter your email"
            />
            {hasFieldError('email') && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <AlertCircle className="text-red-500" size={20} />
              </div>
            )}
          </div>
          {getFieldError('email') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('email')}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
          <div className="relative">
            <input 
              type={showPassword ? 'text' : 'password'} 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              onBlur={() => handleBlur('password')}
              className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none ${
                hasFieldError('password') 
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                  : 'border-slate-200'
              }`}
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {getFieldError('password') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('password')}</p>
          )}
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold rounded-lg shadow transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Signing In...
            </>
          ) : (
            'Log In'
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-slate-600">
          Don't have an account?{' '}
          <a href="/register" className="text-indigo-600 hover:text-indigo-700 font-medium">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
