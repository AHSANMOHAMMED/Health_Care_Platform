import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export default function Navbar() {
  const { role, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-indigo-100">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-teal-500">
          MediConnect Lanka
        </Link>
        <div className="flex gap-4 items-center">
          {role ? (
            <>
              <Link to={`/${role.toLowerCase()}`} className="text-slate-600 hover:text-indigo-600 font-medium">Dashboard</Link>
              <Link to="/video" className="text-slate-600 hover:text-indigo-600 font-medium">Telemedicine</Link>
              <button onClick={handleLogout} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-700 font-medium transition-colors">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-indigo-600 font-medium hover:text-indigo-700">Log In</Link>
              <Link to="/" className="text-slate-600 hover:text-indigo-600 font-medium">Home</Link>
              <Link to="/register" className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium shadow-sm transition-all transform hover:scale-105">
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
