import { motion } from 'framer-motion';

export default function StatCard({ label, value, icon: Icon, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      className="card-surface p-5"
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium text-ink/50">{label}</p>
        {Icon && (
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-mist text-brand">
            <Icon size={15} />
          </div>
        )}
      </div>
      <p className="mt-2 font-display text-2xl font-semibold text-ink">{value}</p>
    </motion.div>
  );
}
