import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import { ROUTES } from '../../constants';
import { extractErrorMessage } from '../../utils/formatters';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.trim()) {
      setError('Please enter your email address.');
      return;
    }

    setSubmitting(true);
    setError('');
    setStatusMessage('');

    try {
      const res = await authService.forgotPassword(email.trim());
      setStatusMessage(res.message || 'If an account exists for this email address, password reset instructions have been sent.');
    } catch (err) {
      setError(extractErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-12">
      <div className="bg-brand-surface border border-brand-border rounded-3xl shadow-2xl p-6 sm:p-8 transition-colors duration-200">
        <div className="mb-6">
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Forgot Password?
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Enter your registered email address to receive password reset instructions.
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 px-3.5 py-2.5 rounded-xl mb-4 text-xs font-medium">
            {error}
          </div>
        )}

        {statusMessage ? (
          <div className="space-y-4 text-center py-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed max-w-sm mx-auto">
              {statusMessage}
            </p>
            <div className="pt-2">
              <Link to={ROUTES.LOGIN}>
                <button
                  type="button"
                  className="w-full py-2.5 px-4 rounded-xl border border-brand-border hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs transition-all min-h-[42px]"
                >
                  Return to Sign In
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="forgot-email" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Registered Email Address <span className="text-red-500">*</span>
              </label>
              <input
                id="forgot-email"
                type="email"
                placeholder="user@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                className="w-full px-3.5 py-2.5 min-h-[44px] bg-[var(--color-input-bg)] border border-brand-border rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center disabled:opacity-50 min-h-[46px]"
            >
              {submitting ? 'Sending Instructions...' : 'Send Reset Instructions'}
            </button>

            <div className="mt-6 pt-4 border-t border-brand-borderSubtle text-center">
              <Link to={ROUTES.LOGIN} className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-semibold">
                &larr; Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
