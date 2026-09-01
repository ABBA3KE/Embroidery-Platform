const STATUS_STYLES = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  successful: 'bg-brand-mist text-brand border-brand/20',
  paid: 'bg-brand-mist text-brand border-brand/20',
  completed: 'bg-brand-mist text-brand border-brand/20',
  failed: 'bg-red-50 text-red-700 border-red-200',
  rejected: 'bg-red-50 text-red-700 border-red-200',
  cancelled: 'bg-ink/5 text-ink/50 border-line',
  refunded: 'bg-ink/5 text-ink/50 border-line',
};

const STATUS_LABELS = {
  pending: 'Pending',
  successful: 'Successful',
  paid: 'Paid',
  completed: 'Completed',
  failed: 'Failed',
  rejected: 'Rejected',
  cancelled: 'Cancelled',
  refunded: 'Refunded',
};

export default function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.pending;
  const label = STATUS_LABELS[status] || (status ? status.replace(/_/g, ' ') : 'Pending');
  return (
    <span className={`inline-block rounded-full border px-2.5 py-1 text-xs font-medium capitalize ${style}`}>
      {label}
    </span>
  );
}
