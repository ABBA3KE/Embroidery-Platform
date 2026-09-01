import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wrench, FileSearch, Hammer, PackageCheck, LogIn } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { ROUTES } from '../../constants/routes';
import RepairRequestForm from '../../components/repair/RepairRequestForm';

const STEPS = [
  { icon: FileSearch, title: 'Submit', desc: 'Upload your file, describe the issue, and add a reference image if it helps.' },
  { icon: Hammer, title: 'We work on it', desc: 'Our team reviews your request and repairs, resizes, or corrects the file.' },
  { icon: PackageCheck, title: 'Download', desc: 'Once complete, your repaired file is ready in your dashboard.' },
];

export default function RepairService() {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      <section className="border-b border-line bg-brand-haze px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand text-white">
              <Wrench size={22} />
            </div>
            <h1 className="mt-4 font-display text-3xl font-semibold text-ink sm:text-4xl">Embroidery Repair Service</h1>
            <div className="stitch-rule mx-auto mt-4 w-20" />
            <p className="mx-auto mt-4 max-w-xl text-ink/60">
              Got a broken, corrupted, or badly digitized embroidery file? Send it our way for repair,
              modification, resizing, or format conversion.
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
          <RepairRequestForm />
        ) : (
          <div className="card-surface flex flex-col items-center gap-4 p-10 text-center">
            <LogIn size={28} className="text-brand" />
            <div>
              <h3 className="font-display text-lg font-semibold text-ink">Log in to submit a repair request</h3>
              <p className="mt-1 text-sm text-ink/60">You'll need an account to upload files and track progress.</p>
            </div>
            <Link
              to={ROUTES.LOGIN}
              state={{ from: { pathname: ROUTES.REPAIR_SERVICE } }}
              className="btn-primary"
            >
              Log in to continue
            </Link>
          </div>
        )}
      </section>
    </div>
  );
}
