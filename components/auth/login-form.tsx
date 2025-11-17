import { useState } from 'react';

interface LoginFormProps {
  role: 'patient' | 'health-worker' | 'admin';
  onSignupClick: () => void;
  onBackClick: () => void;
  onLoginSuccess: () => void;
}

export default function LoginForm({
  role,
  onSignupClick,
  onBackClick,
  onLoginSuccess,
}: LoginFormProps) {
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

      // Call MongoDB API for login
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Set error in state instead of throwing
        setError(data.error || 'Login failed. Please check your credentials and try again.');
        return;
      }

      // Store current user session
      localStorage.setItem('currentUser', JSON.stringify(data.user));

      onLoginSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const roleNames = {
    patient: 'Patient',
    'health-worker': 'Health Worker',
    admin: 'Administrator',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/8 via-background to-secondary/5 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full space-y-8">
        <div className="space-y-3">
          <button
            onClick={onBackClick}
            className="text-primary font-semibold text-sm flex items-center gap-1 hover:text-primary/80 transition-colors"
          >
            ← Back
          </button>
          <div className="mt-6">
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              Welcome Back, {roleNames[role]}
            </h1>
            <p className="text-muted-foreground mt-2">Sign in to access your health dashboard</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-bold text-foreground mb-3">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full px-4 py-3 rounded-xl border-2 border-border bg-card text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-base transition-all"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-bold text-foreground mb-3">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border-2 border-border bg-card text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-base transition-all"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-destructive/10 border-l-4 border-destructive rounded-lg text-destructive text-sm font-medium">
              {error}
            </div>
          )}

          {/* Forgot Password */}
          <button
            type="button"
            className="text-primary text-sm font-semibold hover:text-primary/80 transition-colors"
          >
            Forgot password?
          </button>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-gradient-to-r from-primary to-accent text-primary-foreground rounded-xl font-bold text-lg hover:shadow-lg hover:shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 mt-6"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        {/* Signup Link */}
        <div className="text-center pt-4 border-t border-border">
          <p className="text-muted-foreground text-sm">
            Don't have an account?{' '}
            <button
              onClick={onSignupClick}
              className="text-primary font-bold hover:text-primary/80 transition-colors"
            >
              Sign up
            </button>
          </p>
          <p className="text-xs text-muted-foreground mt-4">Developed by ArshXCoder</p>
        </div>
      </div>
    </div>
  );
}
