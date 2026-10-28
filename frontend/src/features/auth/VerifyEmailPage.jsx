import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import { ROUTES } from '../../constants';
import { Loader } from '../../components/common';
import { extractErrorMessage } from '../../utils/formatters';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [resendEmail, setResendEmail] = useState('');
  const [resending, setResending] = useState(false);
  const [resendMessage, setResendMessage] = useState('');

  useEffect(() => {
    let isMounted = true;
    const verify = async () => {
      if (!token) {
        if (isMounted) {
          setError('No verification token provided. Please check the link from your email.');
          setLoading(false);
        }
        return;
      }

      try {
        await authService.verifyEmail(token);
        if (isMounted) {
          setSuccess(true);
          setError('');
        }
      } catch (err) {
        if (isMounted) {
          setError(extractErrorMessage(err) || 'Verification link is invalid or expired.');
          setSuccess(false);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    verify();
    return () => {
      isMounted = false;
    };
  }, [token]);

  const handleResend = async (e) => {
    e.preventDefault();
    if (!resendEmail) return;
    setResending(true);
    setResendMessage('');
    try {
      const res = await authService.resendVerification(resendEmail.trim());
      setResendMessage(res.message || 'Verification email has been re-sent.');
    } catch (err) {
      setResendMessage(extractErrorMessage(err));
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 sm:px-6 py-12">
      <div className="bg-brand-surface border border-brand-border rounded-3xl shadow-2xl p-6 sm:p-8 transition-colors duration-200">
        {loading ? (
          <div className="py-8 text-center">
            <Loader text="Verifying your email address..." />
          </div>
        ) : success ? (
          <div className="text-center space-y-4 py-2">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>

            <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Email Verified Successfully!
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Your account has been confirmed. You can now sign in with your email, password, and requested role.
            </p>

            <div className="pt-4">
              <Link to={ROUTES.LOGIN}>
                <button
                  type="button"
                  className="w-full py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all"
                >
                  Go to Sign In &rarr;
                </button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-2 text-center">
            <div className="w-14 h-14 rounded-2xl bg-red-500/15 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>

            <h1 className="text-xl font-bold text-slate-900 dark:text-white">
              Verification Link Expired or Invalid
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              {error}
            </p>

            {resendMessage && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 px-3.5 py-2.5 rounded-xl text-xs font-medium">
                {resendMessage}
              </div>
            )}

            {/* Resend Form */}
            <form onSubmit={handleResend} className="pt-2 text-left space-y-3">
              <div>
                <label htmlFor="verify-email-resend" className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Enter registered email for a new link
                </label>
                <input
                  id="verify-email-resend"
                  type="email"
                  placeholder="your-email@company.com"
                  value={resendEmail}
                  onChange={(e) => setResendEmail(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 min-h-[44px] bg-[var(--color-input-bg)] border border-brand-border rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={resending}
                className="w-full py-2.5 px-4 rounded-xl border border-brand-border hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-semibold text-xs transition-all disabled:opacity-50 min-h-[42px]"
              >
                {resending ? 'Sending...' : 'Resend Verification Email'}
              </button>
            </form>

            <div className="pt-4 border-t border-brand-borderSubtle">
              <Link to={ROUTES.LOGIN} className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-semibold">
                Return to Sign In
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
