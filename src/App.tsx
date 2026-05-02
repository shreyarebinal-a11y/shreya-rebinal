/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Navbar } from './components/Navbar';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import PatientDashboard from './pages/patient/Dashboard';
import PatientUpload from './pages/patient/Upload';
import PatientTimeline from './pages/patient/Timeline';
import DoctorDashboard from './pages/doctor/Dashboard';
import PatientView from './pages/doctor/PatientView';

const ProtectedRoute = ({ children, role }: { children: React.ReactNode, role?: 'patient' | 'doctor' }) => {
  const { user, profile, loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!user) return <Navigate to="/login" />;
  
  if (!profile) return <Navigate to="/onboarding" />;

  if (role && profile.role !== role) {
    return <Navigate to={profile.role === 'patient' ? '/patient/dashboard' : '/doctor/dashboard'} />;
  }

  return <>{children}</>;
};

const AppContent = () => {
  const { user, profile } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {user && profile && <Navbar />}
      <main className="flex-grow">
        <Routes>
          <Route path="/login" element={!user ? <Login /> : <Navigate to={profile ? (profile.role === 'patient' ? '/patient/dashboard' : '/doctor/dashboard') : '/onboarding'} />} />
          <Route path="/onboarding" element={user && !profile ? <Onboarding /> : (user ? <Navigate to={profile?.role === 'patient' ? '/patient/dashboard' : '/doctor/dashboard'} /> : <Navigate to="/login" />)} />
          
          <Route path="/patient/dashboard" element={<ProtectedRoute role="patient"><PatientDashboard /></ProtectedRoute>} />
          <Route path="/patient/upload" element={<ProtectedRoute role="patient"><PatientUpload /></ProtectedRoute>} />
          <Route path="/patient/timeline" element={<ProtectedRoute role="patient"><PatientTimeline /></ProtectedRoute>} />
          
          <Route path="/doctor/dashboard" element={<ProtectedRoute role="doctor"><DoctorDashboard /></ProtectedRoute>} />
          <Route path="/doctor/patient/:id" element={<ProtectedRoute role="doctor"><PatientView /></ProtectedRoute>} />
          
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

