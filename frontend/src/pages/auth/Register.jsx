import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Lock, Eye, EyeOff, AlertCircle, Check } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';

const STRENGTH_RULES = [
  { label: 'At least 8 characters', test: (v) => v.length >= 8 },
  { label: 'Contains a letter', test: (v) => /[A-Za-z]/.test(v) },
  { label: 'Contains a number', test: (v) => /\d/.test(v) },
];

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const passedRules = useMemo(
    () => STRENGTH_RULES.map((rule) => ({ ...rule, passed: rule.test(form.password) })),
    [form.password]
  );
  const passwordsMatch = form.confirmPassword.length > 0 && form.password === form.confirmPassword;

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!passedRules.every((r) => r.passed)) {
      setError('Please meet all password requirements.');
      return;
    }

    setIsSubmitting(true);
    try {
      await register(form);
      navigate(ROUTES.CUSTOMER_DASHBOARD, { replace: true });
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
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="card-surface w-full max-w-md p-8"
      >
        <h1 className="font-display text-2xl font-semibold text-ink">Create your account</h1>
        <p className="mt-1 text-sm text-ink/60">Buy designs, request repairs, and track orders.</p>
        <div className="stitch-rule mt-4 w-16" />

        {error && (
          <div className="mt-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="fullName" className="mb-1.5 block text-sm font-medium text-ink">Full name</label>
            <div className="relative">
              <User size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" />
              <input
                id="fullName" name="fullName" type="text" required
                value={form.fullName} onChange={handleChange}
                placeholder="Jane Doe" className="input-field pl-10"
              />
            </div>
          </div>

          <div>
            <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-ink">Email address</label>
            <div className="relative">
              <Mail size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" />
              <input
                id="email" name="email" type="email" required autoComplete="email"
                value={form.email} onChange={handleChange}
                placeholder="you@example.com" className="input-field pl-10"
              />
            </div>
          </div>

          <div>
            <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-ink">Phone number</label>
            <div className="relative">
              <Phone size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" />
              <input
                id="phone" name="phone" type="tel" required
                value={form.phone} onChange={handleChange}
                placeholder="+234 800 000 0000" className="input-field pl-10"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-ink">Password</label>
            <div className="relative">
              <Lock size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" />
              <input
                id="password" name="password" type={showPassword ? 'text' : 'password'} required
                value={form.password} onChange={handleChange}
                placeholder="••••••••" className="input-field pl-10 pr-10"
              />
              <button
                type="button" onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {form.password.length > 0 && (
              <ul className="mt-2 space-y-1">
                {passedRules.map((rule) => (
                  <li key={rule.label} className={`flex items-center gap-1.5 text-xs ${rule.passed ? 'text-brand' : 'text-ink/40'}`}>
                    <Check size={12} className={rule.passed ? 'opacity-100' : 'opacity-30'} />
                    {rule.label}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="mb-1.5 block text-sm font-medium text-ink">Confirm password</label>
            <div className="relative">
              <Lock size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" />
              <input
                id="confirmPassword" name="confirmPassword" type={showPassword ? 'text' : 'password'} required
                value={form.confirmPassword} onChange={handleChange}
                placeholder="••••••••" className="input-field pl-10"
              />
            </div>
            {form.confirmPassword.length > 0 && !passwordsMatch && (
              <p className="mt-1.5 text-xs text-red-600">Passwords do not match.</p>
            )}
          </div>

          <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
            {isSubmitting ? 'Creating account…' : 'Create account'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-ink/60">
          Already have an account?{' '}
          <Link to={ROUTES.LOGIN} className="font-medium text-brand hover:underline">Log in</Link>
        </p>
      </motion.div>
    </div>
  );
}
