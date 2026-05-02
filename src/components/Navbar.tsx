import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogOut, User, Menu, X, PlusCircle, History, Shield, QrCode, Search } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../lib/firebase';
import { signOut } from 'firebase/auth';
import { Button } from './ui/Base';

export const Navbar = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleSignOut = async () => {
    await signOut(auth);
    navigate('/login');
  };

  if (!user || !profile) return null;

  const isPatient = profile.role === 'patient';

  const patientLinks = [
    { to: '/patient/dashboard', label: 'Dashboard', icon: User },
    { to: '/patient/upload', label: 'Upload', icon: PlusCircle },
    { to: '/patient/timeline', label: 'Timeline', icon: History },
  ];

  const doctorLinks = [
    { to: '/doctor/dashboard', label: 'Dashboard', icon: Search },
  ];

  const links = isPatient ? patientLinks : doctorLinks;

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          <Link id="nav-logo" to={isPatient ? '/patient/dashboard' : '/doctor/dashboard'} className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">M</div>
            <span className="font-bold text-xl text-gray-900 tracking-tight">MedVault</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {links.map((link) => (
              <Link 
                id={`nav-link-${link.label.toLowerCase()}`}
                key={link.to} 
                to={link.to} 
                className={`flex items-center gap-2 font-medium transition-colors ${location.pathname === link.to ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
            <div className="h-6 w-px bg-gray-200 mx-2" />
            <Button id="sign-out-btn" variant="ghost" size="sm" onClick={handleSignOut} className="text-gray-500">
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>

          {/* Mobile Right */}
          <div className="md:hidden flex items-center gap-3">
             <button id="mobile-menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-gray-600">
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white absolute top-16 left-0 w-full shadow-lg p-4 space-y-2 animate-in slide-in-from-top duration-200">
          {links.map((link) => (
            <Link 
              id={`mobile-nav-link-${link.label.toLowerCase()}`}
              key={link.to} 
              to={link.to} 
              onClick={() => setIsMenuOpen(false)}
              className={`flex items-center gap-3 p-3 rounded-xl font-medium ${location.pathname === link.to ? 'bg-blue-50 text-blue-600' : 'text-gray-600'}`}
            >
              <link.icon className="w-5 h-5" />
              {link.label}
            </Link>
          ))}
          <button 
            id="mobile-sign-out-btn"
            onClick={handleSignOut}
            className="flex items-center gap-3 p-3 rounded-xl font-medium text-red-600 w-full text-left"
          >
            <LogOut className="w-5 h-5" />
            Sign Out
          </button>
        </div>
      )}
    </nav>
  );
};
