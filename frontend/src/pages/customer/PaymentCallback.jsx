import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';
import { verifyPayment } from '../../services/paymentService';
import { formatPrice } from '../../utils/format';
import { ROUTES } from '../../constants/routes';
import LoadingScreen from '../../components/common/LoadingScreen';
import ErrorState from '../../components/common/ErrorState';

export default function PaymentCallback() {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get('reference') || searchParams.get('trxref');

  const [status, setStatus] = useState('verifying'); // verifying | success | failed | error
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!reference) {
      setError('No payment reference was provided.');
      setStatus('error');
      return;
    }

    // We never trust that reaching this page means payment succeeded —
    // this call re-checks the transaction against Paystack's API on the server.
    verifyPayment(reference)
      .then(({ order, payment }) => {
        setResult({ order, payment });
        setStatus(payment.status === 'successful' ? 'success' : 'failed');
      })
      .catch((err) => {
        setError(err.message);
        setStatus('error');
      });
  }, [reference]);

  if (status === 'verifying') {
    return <LoadingScreen label="Verifying your payment" />;
  }

  if (status === 'error') {
    return (
      <div className="mx-auto max-w-md px-4 py-16">
        <ErrorState message={error} />
      </div>
    );
  }

  const isSuccess = status === 'success';

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-brand-haze px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="card-surface w-full max-w-md p-8 text-center"
      >
        {isSuccess ? (
          <CheckCircle2 size={40} className="mx-auto text-brand" />
        ) : (
          <XCircle size={40} className="mx-auto text-red-500" />
        )}

        <h1 className="mt-4 font-display text-2xl font-semibold text-ink">
          {isSuccess ? 'Payment successful' : 'Payment not completed'}
        </h1>
        <p className="mt-2 text-sm text-ink/60">
          {isSuccess
            ? 'Your purchase is confirmed. Your download is ready in your dashboard.'
            : "We couldn't verify this payment. You can retry from your purchases."}
        </p>

        {result?.order && (
          <div className="mt-5 rounded-xl border border-line bg-brand-haze/50 p-4 text-left text-sm">
            <div className="flex justify-between text-ink/60"><span>Design</span><span className="font-medium text-ink">{result.order.design?.name}</span></div>
            <div className="mt-1.5 flex justify-between text-ink/60"><span>Amount</span><span className="font-medium text-ink">{formatPrice(result.order.amount)}</span></div>
            <div className="mt-1.5 flex justify-between text-ink/60"><span>Reference</span><span className="font-mono text-xs text-ink">{result.order.orderReference}</span></div>
          </div>
        )}

        <Link to={ROUTES.MY_PURCHASES} className="btn-primary mt-6 w-full">
          Go to My Purchases
        </Link>
      </motion.div>
    </div>
  );
}
