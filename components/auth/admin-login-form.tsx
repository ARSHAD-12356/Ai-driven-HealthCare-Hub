'use client';

import { useState } from 'react';

interface AdminLoginFormProps {
  onLoginSuccess: () => void;
  onBackClick?: () => void;
}

export default function AdminLoginForm({
  onLoginSuccess,
  onBackClick,
}: AdminLoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!email || !password) {
        throw new Error('Please fill in all fields');
      }

      // Call admin login API (separate from regular login)
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      // Verify that the user is actually an admin
      if (data.user?.role !== 'admin') {
        throw new Error('Access denied. This login is only for administrators.');
      }

      // Store admin session
      localStorage.setItem('currentUser', JSON.stringify(data.user));

      onLoginSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="space-y-2">
          {onBackClick && (
            <button
              onClick={onBackClick}
              className="text-primary font-semibold text-sm flex items-center gap-1 hover:text-primary/80"
            >
              ← Back
            </button>
          )}
          <div className="text-center space-y-2">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center shadow-lg">
                <span className="text-3xl">🔐</span>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-foreground">
              Admin Login
            </h1>
            <p className="text-muted-foreground">
              Administrator access only
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="w-full px-4 py-3 rounded-lg border-2 border-border bg-card text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none text-base"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg border-2 border-border bg-card text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none text-base"
              required
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-destructive/10 border border-destructive rounded-lg text-destructive text-sm">
              {error}
            </div>
          )}

          {/* Security Notice */}
          <div className="p-3 bg-muted/50 border border-border rounded-lg text-xs text-muted-foreground">
            <strong>Security Notice:</strong> This page is for administrators only. 
            Unauthorized access attempts are logged.
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-lg font-bold text-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 mt-6"
          >
            {isLoading ? 'Logging in...' : 'Login as Administrator'}
          </button>
        </form>
      </div>
    </div>
  );
}

