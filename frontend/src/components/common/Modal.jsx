import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.2 }}
              className={`card-surface w-full ${maxWidth} max-h-[90vh] overflow-y-auto p-6`}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display text-lg font-semibold text-ink">{title}</h3>
                <button onClick={onClose} className="rounded-lg p-1.5 text-ink/40 hover:bg-brand-mist hover:text-ink" aria-label="Close">
                  <X size={18} />
                </button>
              </div>
              <div className="mt-5">{children}</div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
