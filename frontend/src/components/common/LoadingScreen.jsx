import { motion } from 'framer-motion';

export default function LoadingScreen({ label = 'Loading' }) {
  return (
    <div className="flex min-h-[40vh] w-full flex-col items-center justify-center gap-3 text-brand">
      <motion.div
        className="h-8 w-8 rounded-full border-2 border-brand/20 border-t-brand"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 0.8, ease: 'linear' }}
      />
      <span className="text-sm font-medium text-ink/60">{label}…</span>
    </div>
  );
}
