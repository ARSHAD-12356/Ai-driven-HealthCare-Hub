import { useState } from 'react';
import HealthWorkerSignup from './health-worker-signup';

interface SignupFormProps {
  role: 'patient' | 'health-worker' | 'admin';
  onLoginClick: () => void;
  onBackClick: () => void;
  onSignupSuccess: () => void;
}

export default function SignupForm({
  role,
  onLoginClick,
  onBackClick,
  onSignupSuccess,
}: SignupFormProps) {
  // Prevent admin from using signup form
  if (role === 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background flex flex-col items-center justify-center p-6">
        <div className="max-w-md w-full space-y-4 text-center">
          <h1 className="text-2xl font-bold text-foreground">Admin Registration Not Allowed</h1>
          <p className="text-muted-foreground">
            Administrator accounts cannot be created through public registration.
          </p>
          <button
            onClick={onBackClick}
            className="text-primary font-semibold hover:text-primary/80"
          >
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  // Route health workers to the specialized signup form
  if (role === 'health-worker') {
    return (
      <HealthWorkerSignup
        onBackClick={onBackClick}
        onSignupSuccess={() => {
          // Don't open dashboard after signup - just go back to login
          onBackClick();
        }}
      />
    );
  }
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Validate inputs
      if (!email || !password || !confirmPassword) {
        throw new Error('Please fill in all fields');
      }

      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }

      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      // Ensure we never send admin role (double-check)
      const signupRole = role === 'admin' ? 'patient' : role;
      
      // Call MongoDB API for signup
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          role: signupRole, // Only patient or health-worker
          email,
          password,
        }),
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response:', text);
        throw new Error('Server error: Invalid response format. Please check your MongoDB connection.');
      }

      const data = await response.json();

      if (!response.ok) {
        // Set error in state instead of throwing
        setError(data.error || 'Signup failed. Please try again.');
        return;
      }

      onSignupSuccess();
    } catch (err) {
      if (err instanceof SyntaxError) {
        setError('Server error: Invalid response. Please check your MongoDB configuration.');
      } else {
        setError(err instanceof Error ? err.message : 'Signup failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-background flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <button
            onClick={onBackClick}
            className="text-primary font-semibold text-sm flex items-center gap-1 hover:text-primary/80"
          >
            ← Back
          </button>
          <h1 className="text-2xl font-bold text-foreground mt-4">
            Create Account
          </h1>
          <p className="text-muted-foreground">Sign up to get started</p>
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
              placeholder="your@email.com"
              className="w-full px-4 py-3 rounded-lg border-2 border-border bg-card text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none text-base"
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
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg border-2 border-border bg-card text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none text-base"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-destructive/10 border-l-4 border-destructive rounded-lg">
              <div className="flex items-start gap-2">
                <svg className="w-5 h-5 text-destructive mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-destructive mb-1">Signup Error</p>
                  <p className="text-sm text-destructive/90">{error}</p>
                  {error.includes('already exists') && (
                    <p className="text-xs text-muted-foreground mt-2">
                      Try using a different email address or{' '}
                      <button
                        onClick={onLoginClick}
                        className="text-primary hover:underline font-semibold"
                      >
                        sign in
                      </button>
                      {' '}if you already have an account.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Terms */}
          <p className="text-xs text-muted-foreground">
            By signing up, you agree to our Terms of Service and Privacy Policy
          </p>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-lg font-bold text-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-95 mt-6"
          >
            {isLoading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        {/* Login Link */}
        <div className="text-center">
          <p className="text-muted-foreground text-sm">
            Already have an account?{' '}
            <button
              onClick={onLoginClick}
              className="text-primary font-semibold hover:text-primary/80"
            >
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
