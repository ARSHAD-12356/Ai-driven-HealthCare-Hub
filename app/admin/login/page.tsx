'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AdminLoginForm from '@/components/auth/admin-login-form';
import Dashboard from '@/components/dashboard/dashboard';

export default function AdminLoginPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setIsLoggedIn(false);
    router.push('/');
  };

  if (isLoggedIn) {
    return <Dashboard role="admin" onLogout={handleLogout} />;
  }

  return (
    <AdminLoginForm
      onLoginSuccess={handleLoginSuccess}
      onBackClick={() => router.push('/')}
    />
  );
}

