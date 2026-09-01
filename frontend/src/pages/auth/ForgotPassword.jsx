import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, AlertCircle, CheckCircle2 } from 'lucide-react';
import { forgotPasswordRequest } from '../../services/authService';
import { ROUTES } from '../../constants/routes';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await forgotPasswordRequest(email);
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-brand-haze px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="card-surface w-full max-w-md p-8"
      >
        <h1 className="font-display text-2xl font-semibold text-ink">Reset your password</h1>
        <p className="mt-1 text-sm text-ink/60">We'll send a reset link to your email.</p>
        <div className="stitch-rule mt-4 w-16" />

        {error && (
          <div className="mt-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {sent ? (
          <div className="mt-6 flex items-start gap-2 rounded-xl border border-brand/20 bg-brand-mist px-4 py-3 text-sm text-brand">
            <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
            <span>If an account exists for that email, a reset link is on its way.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink">Email address</label>
              <div className="relative">
                <Mail size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" />
                <input
                  id="email" type="email" required value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com" className="input-field pl-10"
                />
              </div>
            </div>
            <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
              {isSubmitting ? 'Sending…' : 'Send reset link'}
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-ink/60">
          Remembered it?{' '}
          <Link to={ROUTES.LOGIN} className="font-medium text-brand hover:underline">Back to login</Link>
        </p>
      </motion.div>
    </div>
  );
}
