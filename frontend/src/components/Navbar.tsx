import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { 
  LogOut, 
  HeartPulse, 
  Bell, 
  Settings, 
  User,
  ChevronDown
} from 'lucide-react';

export default function Navbar() {
  const { role, logout, user } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-[100] bg-white/70 backdrop-blur-2xl border-b border-slate-200/50 transition-all duration-500 py-3 md:py-4">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        
        {/* Left: Brand Identity */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-[1.25rem] bg-slate-950 flex items-center justify-center transform group-hover:scale-110 transition-all shadow-xl shadow-indigo-500/10 relative overflow-hidden group-hover:rotate-6">
            <HeartPulse className="text-white w-6 h-6 relative z-10 animate-pulse" />
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
          <div className="flex flex-col">
             <span className="text-2xl font-black tracking-tighter text-slate-950 leading-tight">
               Med<span className="text-indigo-600">Care</span>
             </span>
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Lanka Elite</span>
          </div>
        </Link>
        
        {/* Middle: Primary Navigation (Guest) */}
        {!role && (
          <div className="hidden lg:flex gap-10 items-center">
             {[ 
               { label: 'Platform', path: '#features' },
               { label: 'Doctors', path: '#doctors' },
               { label: 'Pricing', path: '#pricing' },
               { label: 'AI Health', path: '/ai-checker' }
             ].map(link => (
               <Link 
                 key={link.label} 
                 to={link.path} 
                 className="text-sm font-black uppercase tracking-widest text-slate-500 hover:text-slate-950 transition-colors relative group">
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 group-hover:w-full transition-all"></span>
               </Link>
             ))}
          </div>
        )}

        {/* Right: Auth Actions & Profile */}
        <div className="flex gap-4 items-center">
          {role ? (
            <>
              {/* Logged In Utilities */}
              <div className="hidden md:flex gap-2 mr-4">
                 <Link to="/notifications" className="w-10 h-10 rounded-xl bg-slate-50 text-slate-500 flex items-center justify-center hover:bg-slate-100 transition-all relative">
                    <Bell size={18} />
                    <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                 </Link>
                 <Link to="/settings" className="w-10 h-10 rounded-xl bg-slate-50 text-slate-500 flex items-center justify-center hover:bg-slate-100 transition-all">
                    <Settings size={18} />
                 </Link>
              </div>

              {/* User Profile Menu Trigger */}
              <div className="flex items-center gap-3 pl-4 border-l border-slate-100 group cursor-pointer">
                 <div className="text-right hidden sm:block">
                    <p className="text-sm font-black text-slate-900 leading-tight capitalize">{user?.firstName} {user?.lastName}</p>
                    <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest leading-none flex items-center justify-end gap-1">
                       {role} <ChevronDown size={10} className="group-hover:translate-y-0.5 transition-transform" />
                    </p>
                 </div>
                 <div className="w-11 h-11 rounded-2xl bg-indigo-50 border-2 border-white shadow-sm overflow-hidden transform group-hover:scale-105 transition-all">
                    <img src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user?.firstName}`} alt="avatar" className="w-full h-full object-cover" />
                 </div>
                 
                 {/* Logout Button */}
                 <button 
                  onClick={handleLogout}
                  className="w-11 h-11 rounded-2xl bg-slate-900 text-white flex items-center justify-center hover:bg-red-600 transition-all shadow-xl active:scale-95 ml-2">
                    <LogOut size={18} />
                 </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="hidden sm:flex items-center gap-2 font-black text-sm uppercase tracking-widest text-slate-600 hover:text-indigo-600 transition-all mr-6">
                <User size={18} /> Log In
              </Link>
              <Link to="/register" className="btn-gradient !py-3 !px-8 shadow-2xl shadow-indigo-500/30 font-black text-sm uppercase tracking-widest hover:scale-105 transition-transform active:scale-95">
                Join Now
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
