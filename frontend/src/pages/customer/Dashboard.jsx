import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag, Download, Wrench, Sparkles, Settings as SettingsIcon } from 'lucide-react';
import { ROUTES } from '../../constants/routes';
import useAuth from '../../hooks/useAuth';

const LINKS = [
  { to: ROUTES.MY_PURCHASES, label: 'My Purchases', desc: 'Orders, payment status, and downloads', icon: ShoppingBag },
  { to: ROUTES.MY_PURCHASES, label: 'Downloads', desc: 'Files you have downloaded', icon: Download },
  { to: ROUTES.MY_REPAIRS, label: 'Repair Requests', desc: 'Track your embroidery repair submissions', icon: Wrench },
  { to: ROUTES.MY_CUSTOM_DESIGNS, label: 'Custom Designs', desc: 'Track quotations and custom design requests', icon: Sparkles },
  { to: ROUTES.SETTINGS, label: 'Settings', desc: 'Update your profile and password', icon: SettingsIcon },
];

export default function CustomerDashboard() {
  const { user } = useAuth();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-semibold text-ink">
        Welcome, {user?.fullName?.split(' ')[0]}
      </h1>
      <div className="stitch-rule mt-3 w-16" />

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {LINKS.map(({ to, label, desc, icon: Icon }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: i * 0.05 }}>
            <Link to={to} className="card-surface flex items-start gap-4 p-5 transition-shadow hover:shadow-lift">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brand-mist text-brand">
                <Icon size={20} />
              </div>
              <div>
                <h3 className="font-display font-semibold text-ink">{label}</h3>
                <p className="mt-0.5 text-sm text-ink/60">{desc}</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
