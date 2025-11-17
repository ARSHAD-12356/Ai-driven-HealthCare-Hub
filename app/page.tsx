'use client';

import { useState } from 'react';
import LoginForm from '@/components/auth/login-form';
import SignupForm from '@/components/auth/signup-form';
import RoleSelection from '@/components/auth/role-selection';
import Dashboard from '@/components/dashboard/dashboard';

type AuthStep = 'role' | 'login' | 'signup' | 'dashboard';

export default function Home() {
  const [authStep, setAuthStep] = useState<AuthStep>('role');
  const [userRole, setUserRole] = useState<'patient' | 'health-worker' | 'admin' | null>(null);

  const handleRoleSelect = (role: 'patient' | 'health-worker' | 'admin') => {
    // Admin users must use the dedicated admin login page
    if (role === 'admin') {
      window.location.href = '/admin/login';
      return;
    }
    setUserRole(role);
    setAuthStep('login');
  };

  const handleSignupClick = () => {
    setAuthStep('signup');
  };

  const handleLoginSuccess = () => {
    setAuthStep('dashboard');
  };

  const handleBackToRole = () => {
    setAuthStep('role');
    setUserRole(null);
  };

  if (authStep === 'role') {
    return <RoleSelection onSelectRole={handleRoleSelect} />;
  }

  if (authStep === 'login') {
    return (
      <LoginForm
        role={userRole!}
        onSignupClick={handleSignupClick}
        onBackClick={handleBackToRole}
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  if (authStep === 'signup') {
    // Prevent admin from accessing signup
    if (userRole === 'admin') {
      window.location.href = '/admin/login';
      return null;
    }
    return (
      <SignupForm
        role={userRole!}
        onLoginClick={() => setAuthStep('login')}
        onBackClick={handleBackToRole}
        onSignupSuccess={handleLoginSuccess}
      />
    );
  }

  return <Dashboard role={userRole!} onLogout={handleBackToRole} />;
}
