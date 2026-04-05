import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Heart, 
  Menu, 
  X, 
  User, 
  Calendar,
  Stethoscope,
  Shield,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { cn } from '../lib/utils';

type Role = 'PATIENT' | 'DOCTOR' | 'ADMIN';

interface HeaderProps {
  role: Role | null;
  onLogout: () => void;
}

export default function Header({ role, onLogout }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: 'Home', href: '/', icon: Heart },
    { name: 'Find Doctors', href: '/doctors', icon: Stethoscope },
    { name: 'Appointments', href: '/appointments', icon: Calendar },
  ];

  const userNavigation = {
    PATIENT: [
      { name: 'Dashboard', href: '/patient', icon: User },
      { name: 'My Appointments', href: '/patient/appointments', icon: Calendar },
      { name: 'Profile', href: '/patient/profile', icon: User },
    ],
    DOCTOR: [
      { name: 'Dashboard', href: '/doctor', icon: Stethoscope },
      { name: 'Schedule', href: '/doctor/schedule', icon: Calendar },
      { name: 'Patients', href: '/doctor/patients', icon: User },
    ],
    ADMIN: [
      { name: 'Dashboard', href: '/admin', icon: Shield },
      { name: 'Users', href: '/admin/users', icon: User },
      { name: 'Settings', href: '/admin/settings', icon: Shield },
    ],
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="glass-effect sticky top-0 z-50 border-b border-white/20">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <Heart className="h-8 w-8 text-blue-600 group-hover:text-blue-700 transition-colors" />
                <div className="absolute -top-1 -right-1 h-3 w-3 bg-emerald-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-emerald-600 bg-clip-text text-transparent">
                  MedCare
                </span>
                <p className="text-xs text-gray-500">Healthcare Platform</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-2",
                      isActive(item.href)
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right side buttons */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6 space-x-3">
              {!role ? (
                <>
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-blue-700 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="healthcare-button text-sm px-4 py-2"
                  >
                    Get Started
                  </Link>
                </>
              ) : (
                <div className="relative">
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="h-8 w-8 rounded-full healthcare-gradient flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700 capitalize">{role.toLowerCase()}</span>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-lg healthcare-card shadow-xl border border-gray-100">
                      <div className="py-1">
                        {userNavigation[role].map((item) => {
                          const Icon = item.icon;
                          return (
                            <Link
                              key={item.name}
                              to={item.href}
                              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                              onClick={() => setIsProfileOpen(false)}
                            >
                              <Icon className="mr-3 h-4 w-4" />
                              {item.name}
                            </Link>
                          );
                        })}
                        <div className="border-t border-gray-100 my-1"></div>
                        <button
                          onClick={() => {
                            onLogout();
                            setIsProfileOpen(false);
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="mr-3 h-4 w-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-gray-600" />
              ) : (
                <Menu className="h-6 w-6 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "flex items-center space-x-2 px-3 py-2 rounded-lg text-base font-medium transition-colors",
                      isActive(item.href)
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:bg-blue-50 hover:text-blue-700"
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
              
                  {!role ? (
                    <>
                      <Link
                        to="/login"
                        className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-700 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Sign In
                      </Link>
                      <Link
                        to="/register"
                        className="block healthcare-button text-center"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Get Started
                      </Link>
                    </>
                  ) : (
                    <>
                      <div className="border-t border-gray-200 pt-2">
                        {userNavigation[role].map((item) => {
                          const Icon = item.icon;
                          return (
                            <Link
                              key={item.name}
                              to={item.href}
                              className="flex items-center space-x-2 px-3 py-2 text-base font-medium text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                              onClick={() => setIsMenuOpen(false)}
                            >
                              <Icon className="h-5 w-5" />
                              <span>{item.name}</span>
                            </Link>
                          );
                        })}
                        <button
                          onClick={() => {
                            onLogout();
                            setIsMenuOpen(false);
                          }}
                          className="flex items-center space-x-2 w-full px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut className="h-5 w-5" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </>
                  )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
