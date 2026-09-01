import { motion } from 'framer-motion';

/**
 * Temporary placeholder for pages that will be built in later phases
 * (gallery, purchase flow, repairs, custom design, dashboards).
 * Replace with the real page as each feature phase is implemented.
 */
export default function ComingSoon({ title, description }) {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 py-20 text-center">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="stitch-rule mx-auto mb-5 w-16" />
        <h1 className="font-display text-3xl font-semibold text-ink">{title}</h1>
        <p className="mt-3 text-ink/60">{description}</p>
      </motion.div>
    </div>
  );
}
