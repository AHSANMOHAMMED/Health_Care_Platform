import { useState } from 'react';
import { Eye, EyeOff, AlertCircle, Loader2, Check, X } from 'lucide-react';
import { api } from '../api/axios';
import { useNavigate } from 'react-router-dom';

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
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ [key: string]: boolean }>({});
  const [passwordStrength, setPasswordStrength] = useState<PasswordStrength>({
    score: 0,
    feedback: [],
    color: 'bg-gray-300'
  });
  
  const navigate = useNavigate();

  const calculatePasswordStrength = (password: string): PasswordStrength => {
    const feedback: string[] = [];
    let score = 0;

    if (password.length >= 8) score += 1;
    else feedback.push('At least 8 characters');

    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score += 1;
    else feedback.push('Mix of upper and lower case letters');

    if (/\d/.test(password)) score += 1;
    else feedback.push('At least one number');

    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score += 1;
    else feedback.push('At least one special character');

    const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-green-500'];
    
    return {
      score,
      feedback,
      color: colors[Math.min(score, 3)]
    };
  };

  const validateEmail = (email: string): string | undefined => {
    if (!email) return 'Email is required';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Please enter a valid email address';
    return undefined;
  };

  const validatePassword = (password: string): string | undefined => {
    if (!password) return 'Password is required';
    if (password.length < 8) return 'Password must be at least 8 characters long';
    return undefined;
  };

  const validateConfirmPassword = (password: string, confirmPassword: string): string | undefined => {
    if (!confirmPassword) return 'Please confirm your password';
    if (password !== confirmPassword) return 'Passwords do not match';
    return undefined;
  };

  const validateRole = (role: string): string | undefined => {
    if (!role || !['PATIENT', 'DOCTOR'].includes(role)) return 'Please select a valid role';
    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      email: validateEmail(email),
      password: validatePassword(password),
      confirmPassword: validateConfirmPassword(password, confirmPassword),
      role: validateRole(role),
    };
    
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleBlur = (field: string) => {
    setTouched({ ...touched, [field]: true });
    
    const newErrors = { ...errors };
    
    switch (field) {
      case 'email':
        newErrors.email = validateEmail(email);
        break;
      case 'password':
        newErrors.password = validatePassword(password);
        setPasswordStrength(calculatePasswordStrength(password));
        break;
      case 'confirmPassword':
        newErrors.confirmPassword = validateConfirmPassword(password, confirmPassword);
        break;
      case 'role':
        newErrors.role = validateRole(role);
        break;
    }
    
    setErrors(newErrors);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setErrors({ ...errors, general: undefined });
    
    try {
      const { register } = useAuthStore.getState();
      await register({ 
        email, 
        password, 
        role: role as 'PATIENT' | 'DOCTOR',
        firstName: '',
        lastName: ''
      });
      navigate('/login?message=Registration successful! Please login.');
    } catch(err: any) {
      console.error('Registration error:', err);
      let errorMessage = 'Registration failed. Please try again.';
      
      if (err.response?.status === 409) {
        errorMessage = 'An account with this email already exists.';
      } else if (err.response?.status === 400) {
        errorMessage = 'Invalid registration data. Please check your inputs.';
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
      <h2 className="text-3xl font-extrabold text-center text-slate-800 mb-2">Create an Account</h2>
      <p className="text-center text-slate-500 mb-8">Join our healthcare platform today</p>
      
      {/* General Error */}
      {errors.general && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
          <AlertCircle className="text-red-600" size={20} />
          <span className="text-red-700 text-sm">{errors.general}</span>
        </div>
      )}

      <form onSubmit={handleRegister} className="space-y-5">
        {/* Role Field */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">I am a</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setRole('PATIENT')}
              className={`px-4 py-3 border-2 rounded-lg font-medium transition-all ${
                role === 'PATIENT' 
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700' 
                  : 'border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              Patient
            </button>
            <button
              type="button"
              onClick={() => setRole('DOCTOR')}
              className={`px-4 py-3 border-2 rounded-lg font-medium transition-all ${
                role === 'DOCTOR' 
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700' 
                  : 'border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              Doctor
            </button>
          </div>
          {getFieldError('role') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('role')}</p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
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
            {touched.email && !hasFieldError('email') && email && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <Check className="text-green-500" size={20} />
              </div>
            )}
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

        {/* Password Field */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
          <div className="relative">
            <input 
              type={showPassword ? 'text' : 'password'} 
              value={password} 
              onChange={e => {
                setPassword(e.target.value);
                setPasswordStrength(calculatePasswordStrength(e.target.value));
              }} 
              onBlur={() => handleBlur('password')}
              className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none ${
                hasFieldError('password') 
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                  : 'border-slate-200'
              }`}
              placeholder="Create a strong password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          
          {/* Password Strength Indicator */}
          {password && (
            <div className="mt-2">
              <div className="flex items-center gap-2 mb-1">
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${passwordStrength.color}`}
                    style={{ width: `${(passwordStrength.score / 4) * 100}%` }}
                  ></div>
                </div>
                <span className="text-xs text-slate-600">
                  {passwordStrength.score === 0 && 'Weak'}
                  {passwordStrength.score === 1 && 'Fair'}
                  {passwordStrength.score === 2 && 'Good'}
                  {passwordStrength.score === 3 && 'Strong'}
                  {passwordStrength.score === 4 && 'Very Strong'}
                </span>
              </div>
              {passwordStrength.feedback.length > 0 && (
                <div className="text-xs text-slate-500">
                  Add: {passwordStrength.feedback.join(', ')}
                </div>
              )}
            </div>
          )}
          
          {getFieldError('password') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('password')}</p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
          <div className="relative">
            <input 
              type={showConfirmPassword ? 'text' : 'password'} 
              value={confirmPassword} 
              onChange={e => setConfirmPassword(e.target.value)} 
              onBlur={() => handleBlur('confirmPassword')}
              className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all outline-none ${
                hasFieldError('confirmPassword') 
                  ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
                  : 'border-slate-200'
              }`}
              placeholder="Confirm your password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-slate-400 hover:text-slate-600"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {touched.confirmPassword && !hasFieldError('confirmPassword') && confirmPassword && password === confirmPassword && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <Check className="text-green-500" size={20} />
              </div>
            )}
            {hasFieldError('confirmPassword') && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <X className="text-red-500" size={20} />
              </div>
            )}
          </div>
          {getFieldError('confirmPassword') && (
            <p className="mt-1 text-sm text-red-600">{getFieldError('confirmPassword')}</p>
          )}
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-3 bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white font-bold rounded-lg shadow transition-colors flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              Creating Account...
            </>
          ) : (
            'Sign Up'
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-slate-600">
          Already have an account?{' '}
          <a href="/login" className="text-indigo-600 hover:text-indigo-700 font-medium">
            Sign in
          </a>
        </p>
      </div>
    </div>
  );
}
