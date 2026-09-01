import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle } from 'lucide-react';
import { verifyCustomDesignPayment } from '../../services/customDesignService';
import { formatPrice } from '../../utils/format';
import { ROUTES } from '../../constants/routes';
import LoadingScreen from '../../components/common/LoadingScreen';
import ErrorState from '../../components/common/ErrorState';

export default function CustomDesignPaymentCallback() {
  const [searchParams] = useSearchParams();
  const reference = searchParams.get('reference') || searchParams.get('trxref');

  const [status, setStatus] = useState('verifying');
  const [request, setRequest] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!reference) {
      setError('No payment reference was provided.');
      setStatus('error');
      return;
    }

    verifyCustomDesignPayment(reference)
      .then((data) => {
        setRequest(data);
        setStatus(data.paymentStatus === 'successful' ? 'success' : 'failed');
      })
      .catch((err) => {
        setError(err.message);
        setStatus('error');
      });
  }, [reference]);

  if (status === 'verifying') return <LoadingScreen label="Verifying your payment" />;
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
        {isSuccess ? <CheckCircle2 size={40} className="mx-auto text-brand" /> : <XCircle size={40} className="mx-auto text-red-500" />}

        <h1 className="mt-4 font-display text-2xl font-semibold text-ink">
          {isSuccess ? 'Payment successful' : 'Payment not completed'}
        </h1>
        <p className="mt-2 text-sm text-ink/60">
          {isSuccess
            ? 'Your payment is confirmed. Work on your custom design will begin shortly.'
            : "We couldn't verify this payment. You can retry from your dashboard."}
        </p>

        {request && (
          <div className="mt-5 rounded-xl border border-line bg-brand-haze/50 p-4 text-left text-sm">
            <div className="flex justify-between text-ink/60"><span>Design</span><span className="font-medium text-ink">{request.title}</span></div>
            <div className="mt-1.5 flex justify-between text-ink/60"><span>Amount</span><span className="font-medium text-ink">{formatPrice(request.quotation?.amount || 0)}</span></div>
          </div>
        )}

        <Link to={ROUTES.MY_CUSTOM_DESIGNS} className="btn-primary mt-6 w-full">
          Go to My Custom Designs
        </Link>
      </motion.div>
    </div>
  );
}
