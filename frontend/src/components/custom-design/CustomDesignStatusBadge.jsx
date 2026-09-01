import { CUSTOM_DESIGN_STATUS_LABELS, CUSTOM_DESIGN_STATUS_STYLES } from '../../constants/customDesign';

export default function CustomDesignStatusBadge({ status }) {
  const style = CUSTOM_DESIGN_STATUS_STYLES[status] || CUSTOM_DESIGN_STATUS_STYLES.pending;
  const label = CUSTOM_DESIGN_STATUS_LABELS[status] || status;
  return (
    <span className={`inline-block rounded-full border px-2.5 py-1 text-xs font-medium ${style}`}>
      {label}
    </span>
  );
}
