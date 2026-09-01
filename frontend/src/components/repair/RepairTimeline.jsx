import { Check, X } from 'lucide-react';
import { REPAIR_STATUS_STEPS } from '../../constants/repair';

export default function RepairTimeline({ status }) {
  if (status === 'rejected') {
    return (
      <div className="flex items-center gap-2 text-sm font-medium text-red-600">
        <X size={16} />
        Request rejected
      </div>
    );
  }

  const currentIndex = REPAIR_STATUS_STEPS.findIndex((s) => s.value === status);

  return (
    <div className="flex items-center">
      {REPAIR_STATUS_STEPS.map((step, i) => {
        const isDone = i <= currentIndex;
        const isLast = i === REPAIR_STATUS_STEPS.length - 1;
        return (
          <div key={step.value} className="flex flex-1 items-center last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold ${
                  isDone ? 'bg-brand text-white' : 'bg-ink/10 text-ink/40'
                }`}
              >
                {isDone ? <Check size={13} /> : i + 1}
              </div>
              <span className={`mt-1.5 text-[11px] ${isDone ? 'text-brand font-medium' : 'text-ink/40'}`}>
                {step.label}
              </span>
            </div>
            {!isLast && (
              <div className={`mx-1.5 h-0.5 flex-1 ${i < currentIndex ? 'bg-brand' : 'bg-ink/10'}`} style={{ marginBottom: 18 }} />
            )}
          </div>
        );
      })}
    </div>
  );
}
