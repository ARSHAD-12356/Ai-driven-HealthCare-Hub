import { useState } from 'react';
import PatientDashboard from './patient-dashboard';
import HealthWorkerDashboard from './health-worker-dashboard';
import AdminDashboard from './admin-dashboard';

interface DashboardProps {
  role: 'patient' | 'health-worker' | 'admin';
  onLogout: () => void;
}

export default function Dashboard({ role, onLogout }: DashboardProps) {
  const [showProfile, setShowProfile] = useState(false);

  const handleLogout = () => {
    setShowProfile(false);
    onLogout();
  };

  if (role === 'patient') {
    return <PatientDashboard onLogout={handleLogout} />;
  }

  if (role === 'health-worker') {
    return <HealthWorkerDashboard onLogout={handleLogout} />;
  }

  return <AdminDashboard onLogout={handleLogout} />;
}
