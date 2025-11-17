'use client';

import { useEffect, useState } from 'react';

/**
 * Admin Initialization Page
 * 
 * This page can be visited to initialize the admin user.
 * It's safe to visit multiple times - it will only create an admin if one doesn't exist.
 * 
 * You can also call the API directly: POST /api/admin/init
 */
export default function AdminInitPage() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [adminExists, setAdminExists] = useState<boolean | null>(null);

  useEffect(() => {
    // Check if admin exists
    checkAdminStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const response = await fetch('/api/admin/init');
      const data = await response.json();
      setAdminExists(data.adminExists);
      if (data.adminExists) {
        setMessage(`Admin already exists: ${data.adminEmail}`);
      }
    } catch (error) {
      console.error('Failed to check admin status:', error);
    }
  };

  const handleInit = async () => {
    setStatus('loading');
    setMessage('');

    try {
      const response = await fetch('/api/admin/init', {
        method: 'POST',
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('success');
        setMessage('Admin user initialized successfully!');
        setAdminExists(true);
        await checkAdminStatus();
      } else {
        setStatus('error');
        setMessage(data.error || 'Failed to initialize admin');
      }
    } catch (error) {
      setStatus('error');
      setMessage('Failed to initialize admin. Please check the server logs.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-foreground">Admin Initialization</h1>
          <p className="text-muted-foreground">
            Initialize the admin user for the system
          </p>
        </div>

        <div className="bg-card border-2 border-border rounded-lg p-6 space-y-4">
          {adminExists !== null && (
            <div className={`p-3 rounded-lg ${adminExists ? 'bg-green-500/10 border border-green-500/20' : 'bg-yellow-500/10 border border-yellow-500/20'}`}>
              <p className={`text-sm font-medium ${adminExists ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}>
                {adminExists ? '✅ Admin user exists' : '⚠️ No admin user found'}
              </p>
            </div>
          )}

          {message && (
            <div className={`p-3 rounded-lg ${
              status === 'success' 
                ? 'bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400' 
                : status === 'error'
                ? 'bg-red-500/10 border border-red-500/20 text-red-600 dark:text-red-400'
                : 'bg-muted/50 border border-border text-muted-foreground'
            }`}>
              <p className="text-sm">{message}</p>
            </div>
          )}

          <div className="space-y-2 text-sm text-muted-foreground">
            <p><strong>Default Admin Credentials:</strong></p>
            <p>Email: <code className="bg-muted px-2 py-1 rounded">admin@ruralhealthcare.com</code></p>
            <p>Password: <code className="bg-muted px-2 py-1 rounded">Admin@123456</code></p>
            <p className="text-xs mt-4 text-destructive">
              ⚠️ Change these credentials in production! Set ADMIN_EMAIL, ADMIN_PASSWORD, and ADMIN_FULL_NAME environment variables.
            </p>
          </div>

          <button
            onClick={handleInit}
            disabled={status === 'loading' || adminExists === true}
            className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-lg font-bold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {status === 'loading' ? 'Initializing...' : adminExists ? 'Admin Already Exists' : 'Initialize Admin User'}
          </button>

          <div className="text-xs text-muted-foreground space-y-1">
            <p>• This will only create an admin if one doesn't exist</p>
            <p>• Safe to run multiple times</p>
            <p>• Admin can be created automatically on server start</p>
          </div>
        </div>

        <a
          href="/admin/login"
          className="block text-center text-primary font-semibold hover:text-primary/80"
        >
          Go to Admin Login →
        </a>
      </div>
    </div>
  );
}

