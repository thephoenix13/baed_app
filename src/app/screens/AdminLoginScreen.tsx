/**
 * Admin Login Screen
 *
 * Login screen for admin users (Trust & Operations Console).
 */

import { useState } from 'react';
import { fontDisplay } from '@/lib/fonts';
import type { AdminRole } from '@/core/auth/permissions';

interface AdminLoginScreenProps {
  onLogin: (adminId: string, role: AdminRole) => void;
  onBack: () => void;
}

export function AdminLoginScreen({ onLogin, onBack }: AdminLoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Mock admin login
    // In production, this would call /api/v1/admin/auth/login
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Mock credentials for demo
      if (email === 'admin@baed.in' && password === 'admin123') {
        onLogin('admin-1', 'SUPER_ADMIN');
      } else if (email === 'trust@baed.in' && password === 'trust123') {
        onLogin('admin-2', 'TRUST_AND_SAFETY');
      } else if (email === 'verify@baed.in' && password === 'verify123') {
        onLogin('admin-3', 'VERIFICATION_OPERATOR');
      } else {
        setError('Invalid credentials');
      }
    } catch {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-plum-deep flex flex-col">
      {/* Header */}
      <div className="px-6 pt-12 pb-4">
        <button
          onClick={onBack}
          className="btn btn-ghost !px-3 !py-2 !border-dark-text !text-dark-text"
          aria-label="Go back"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 flex flex-col justify-center">
        <div className="max-w-sm mx-auto w-full">
          {/* Brand */}
          <div className="text-center mb-8">
            <h1
              className="text-h2 text-white mb-2"
              style={fontDisplay.style}
            >
              Trust Console
            </h1>
            <p className="text-lead text-dark-muted">
              Admin Login
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label htmlFor="admin-email" className="text-label text-dark-muted mb-1 block">
                Email
              </label>
              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@baed.in"
                className="input !bg-dark-card !text-dark-text !border-dark-muted/20 placeholder:text-dark-muted/50"
                required
                autoFocus
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="admin-password" className="text-label text-dark-muted mb-1 block">
                Password
              </label>
              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input !bg-dark-card !text-dark-text !border-dark-muted/20 placeholder:text-dark-muted/50"
                required
              />
            </div>

            {/* Error */}
            {error && (
              <p className="text-body text-error">{error}</p>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className={`btn btn-secondary w-full ${isLoading ? 'btn-disabled' : ''}`}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="spinner !w-4 !h-4 !border-2"></span>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-8 p-4 bg-dark-card rounded-xl border border-dark-muted/20">
            <p className="text-label text-dark-muted mb-2">Demo Credentials</p>
            <div className="space-y-1 text-sm text-dark-muted">
              <p><span className="text-dark-text font-medium">Super Admin:</span> admin@baed.in / admin123</p>
              <p><span className="text-dark-text font-medium">Trust & Safety:</span> trust@baed.in / trust123</p>
              <p><span className="text-dark-text font-medium">Verification:</span> verify@baed.in / verify123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
