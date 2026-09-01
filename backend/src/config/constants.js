export const USER_ROLES = {
  CUSTOMER: 'customer',
  ADMIN: 'admin',
};

export const DESIGN_FORMATS = ['EMB', 'EMX', 'DST', 'PNG'];

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  SUCCESSFUL: 'successful',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
  REFUNDED: 'refunded',
};

export const ORDER_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
};

export const REPAIR_STATUS = {
  PENDING: 'pending',
  UNDER_REVIEW: 'under_review',
  ACCEPTED: 'accepted',
  REJECTED: 'rejected',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
};

export const CUSTOM_DESIGN_STATUS = {
  PENDING: 'pending',
  UNDER_REVIEW: 'under_review',
  QUOTATION_SENT: 'quotation_sent',
  AWAITING_CUSTOMER_APPROVAL: 'awaiting_customer_approval',
  AWAITING_PAYMENT: 'awaiting_payment',
  APPROVED: 'approved',
  IN_PROGRESS: 'in_progress',
  REVISION_REQUESTED: 'revision_requested',
  COMPLETED: 'completed',
  REJECTED: 'rejected',
  CANCELLED: 'cancelled',
};

export const REPAIR_SERVICE_TYPES = {
  FILE_REPAIR: 'file_repair',
  MODIFICATION: 'modification',
  RESIZING: 'resizing',
  DIGITIZING_CORRECTION: 'digitizing_correction',
  FORMAT_CONVERSION: 'format_conversion',
  OTHER: 'other',
};

export const NOTIFICATION_TYPES = {
  REGISTRATION: 'registration',
  PAYMENT_SUCCESSFUL: 'payment_successful',
  PAYMENT_FAILED: 'payment_failed',
  PURCHASE_CONFIRMATION: 'purchase_confirmation',
  DOWNLOAD_AVAILABLE: 'download_available',
  REPAIR_SUBMITTED: 'repair_submitted',
  REPAIR_STATUS: 'repair_status',
  REPAIR_COMPLETED: 'repair_completed',
  CUSTOM_REQUEST_SUBMITTED: 'custom_request_submitted',
  CUSTOM_QUOTATION: 'custom_quotation',
  CUSTOM_PAYMENT: 'custom_payment',
  CUSTOM_PROGRESS: 'custom_progress',
  CUSTOM_COMPLETED: 'custom_completed',
};
