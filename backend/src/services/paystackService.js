import ApiError from '../utils/ApiError.js';

const PAYSTACK_BASE_URL = 'https://api.paystack.co';

const authHeaders = () => {
  const secretKey = process.env.PAYSTACK_SECRET_KEY;
  if (!secretKey) {
    throw new ApiError(500, 'Payment provider is not configured. Missing PAYSTACK_SECRET_KEY.');
  }
  return {
    Authorization: `Bearer ${secretKey}`,
    'Content-Type': 'application/json',
  };
};

/**
 * Initializes a Paystack transaction. Amount must be in the currency's
 * smallest unit (kobo for NGN), which callers are responsible for.
 * @returns {Promise<{authorization_url: string, access_code: string, reference: string}>}
 */
export const initializeTransaction = async ({ email, amountKobo, reference, callbackUrl, metadata }) => {
  const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({
      email,
      amount: amountKobo,
      reference,
      callback_url: callbackUrl,
      metadata,
    }),
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok || !payload?.status) {
    throw new ApiError(502, payload?.message || 'Failed to initialize payment with Paystack.');
  }

  return payload.data;
};

/**
 * Verifies a Paystack transaction by reference. This is the ONLY source of
 * truth for whether a payment succeeded — never trust the client callback.
 * @returns {Promise<object>} Paystack's transaction data object
 */
export const verifyTransaction = async (reference) => {
  const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/verify/${encodeURIComponent(reference)}`, {
    method: 'GET',
    headers: authHeaders(),
  });

  const payload = await response.json().catch(() => null);

  if (!response.ok || !payload?.status) {
    throw new ApiError(502, payload?.message || 'Failed to verify payment with Paystack.');
  }

  return payload.data;
};
