import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Sparkles, Wrench, ShieldCheck } from 'lucide-react';
import { ROUTES } from '../../constants/routes';
import useAuth from '../../hooks/useAuth';

export default function Home() {
  const { isAuthenticated, user } = useAuth();

  return (
    <div>
      <section className="border-b border-line bg-gradient-to-b from-brand-haze to-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            {isAuthenticated && (
              <p className="mb-3 text-sm font-medium text-brand">Welcome back, {user.fullName.split(' ')[0]} </p>
            )}
            <h1 className="font-display text-4xl font-semibold leading-tight text-ink sm:text-5xl">
              Embroidery designs, repairs &amp; custom digitizing 
              <span className="text-brand"> done right.</span>
            </h1>
            <div className="stitch-rule mx-auto mt-5 w-24" />
            <p className="mx-auto mt-5 max-w-xl text-ink/60">
              Browse a curated gallery of ready-to-stitch designs, get a damaged file repaired,
              or request a completely custom design  with secure payment and protected downloads.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mx-auto mt-8 flex max-w-lg items-center gap-2 rounded-xl border border-line bg-white p-2 shadow-card"
          >
            <Search size={18} className="ml-2 shrink-0 text-ink/40" />
            <input
              type="text"
              placeholder="Search designs — e.g. floral, logo, cap…"
              className="w-full bg-transparent px-1 py-2 text-sm text-ink placeholder:text-ink/40 focus:outline-none"
            />
            <Link to={ROUTES.GALLERY} className="btn-primary shrink-0 py-2.5">Search</Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 flex flex-wrap justify-center gap-3"
          >
            <Link to={ROUTES.GALLERY} className="btn-secondary">Browse Designs</Link>
            <Link to={ROUTES.CUSTOM_DESIGN} className="btn-primary">Request Custom Design</Link>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {[
            { icon: Sparkles, title: 'Curated Gallery', desc: 'Browse ready-made embroidery designs across every category.' },
            { icon: Wrench, title: 'Repair Service', desc: 'Send a damaged or broken file for correction and get it back working.' },
            { icon: ShieldCheck, title: 'Protected Downloads', desc: 'Files unlock only after your payment is verified — every time.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="card-surface p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-mist text-brand">
                <Icon size={20} />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-ink">{title}</h3>
              <p className="mt-1.5 text-sm text-ink/60">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
