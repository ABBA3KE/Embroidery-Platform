import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, FileText, Palette, PackageCheck, LogIn } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';
import CustomDesignForm from '../../components/custom-design/CustomDesignForm';

const STEPS = [
  { icon: FileText, title: 'Submit requirements', desc: "Tell us what you need — size, use, format, and any references." },
  { icon: Palette, title: 'Review & quotation', desc: "Our team reviews your request and sends a price quotation." },
  { icon: PackageCheck, title: 'Approve & receive', desc: 'Approve the quote, pay securely, and download your finished design.' },
];

export default function CustomDesign() {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      <section className="border-b border-line bg-brand-haze px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand text-white">
              <Sparkles size={22} />
            </div>
            <h1 className="mt-4 font-display text-3xl font-semibold text-ink sm:text-4xl">Request a Custom Design</h1>
            <div className="stitch-rule mx-auto mt-4 w-20" />
            <p className="mx-auto mt-4 max-w-xl text-ink/60">
              Can't find the design you need in the gallery? Tell us what you're looking for and our
              team will review your request and create it for you.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          {STEPS.map(({ icon: Icon, title, desc }, i) => (
            <div key={title} className="card-surface p-6 text-center">
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-brand-mist text-brand">
                <Icon size={18} />
              </div>
              <p className="mt-3 text-xs font-medium uppercase tracking-wide text-brand/70">Step {i + 1}</p>
              <h3 className="mt-1 font-display font-semibold text-ink">{title}</h3>
              <p className="mt-1.5 text-sm text-ink/60">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 pb-20 sm:px-6 lg:px-8">
        {isAuthenticated ? (
          <CustomDesignForm />
        ) : (
          <div className="card-surface flex flex-col items-center gap-4 p-10 text-center">
            <LogIn size={28} className="text-brand" />
            <div>
              <h3 className="font-display text-lg font-semibold text-ink">Log in to request a custom design</h3>
              <p className="mt-1 text-sm text-ink/60">You'll need an account to submit requirements and track progress.</p>
            </div>
            <Link to={ROUTES.LOGIN} state={{ from: { pathname: ROUTES.CUSTOM_DESIGN } }} className="btn-primary">
              Log in to continue
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
