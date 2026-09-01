import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, FileCheck2, Ruler, Palette, Layers, ShieldCheck, AlertCircle } from 'lucide-react';
import { fetchDesignBySlug } from '../../services/designService';
import { createOrder } from '../../services/orderService';
import { initializePayment } from '../../services/paymentService';
import { formatPrice } from '../../utils/format';
import { ROUTES } from '../../constants/routes';
import useAuth from '../../hooks/useAuth';
import LoadingScreen from '../../components/common/LoadingScreen';
import ErrorState from '../../components/common/ErrorState';

export default function DesignDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [design, setDesign] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [purchaseError, setPurchaseError] = useState('');
  const [isPurchasing, setIsPurchasing] = useState(false);

  const load = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await fetchDesignBySlug(slug);
      setDesign(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN, { state: { from: { pathname: `/designs/${slug}` } } });
      return;
    }
    setPurchaseError('');
    setIsPurchasing(true);
    try {
      const order = await createOrder(design._id);
      const { authorizationUrl } = await initializePayment(order._id);
      window.location.href = authorizationUrl; // hand off to Paystack's hosted checkout
    } catch (err) {
      setPurchaseError(err.message);
      setIsPurchasing(false);
    }
  };

  if (isLoading) return <LoadingScreen label="Loading design" />;
  if (error) return <div className="mx-auto max-w-3xl px-4 py-16"><ErrorState message={error} onRetry={load} /></div>;
  if (!design) return null;

  const spec = design.specifications || {};

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="aspect-square overflow-hidden rounded-2xl border border-line bg-brand-mist shadow-card"
        >
          <img
            src={design.previewImage}
            alt={design.name}
            className="h-full w-full object-cover"
            onError={(e) => { e.currentTarget.src = '/assets/images/designs/placeholder.png'; }}
          />
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
          {design.category?.name && (
            <span className="inline-block rounded-full bg-brand-mist px-3 py-1 text-xs font-medium text-brand">
              {design.category.name}
            </span>
          )}
          <h1 className="mt-3 font-display text-3xl font-semibold text-ink">{design.name}</h1>
          <div className="stitch-rule mt-3 w-16" />
          <p className="mt-4 whitespace-pre-line text-ink/70">{design.description}</p>

          <div className="mt-6 flex items-baseline gap-3">
            <span className="font-display text-3xl font-semibold text-brand">{formatPrice(design.price)}</span>
          </div>

          {design.availableFormats?.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {design.availableFormats.map((fmt) => (
                <span key={fmt} className="flex items-center gap-1.5 rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-ink/70">
                  <FileCheck2 size={13} className="text-brand" />
                  .{fmt}
                </span>
              ))}
            </div>
          )}

          {purchaseError && (
            <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{purchaseError}</span>
            </div>
          )}

          <button onClick={handleBuyNow} disabled={isPurchasing} className="btn-primary mt-6 w-full sm:w-auto">
            <ShoppingCart size={16} />
            {isPurchasing ? 'Redirecting to checkout…' : 'Buy Now'}
          </button>

          <p className="mt-3 flex items-center gap-1.5 text-xs text-ink/50">
            <ShieldCheck size={14} className="text-brand" />
            Files unlock only after secure payment verification.
          </p>

          {(spec.dimensions || spec.stitchCount || spec.colors || spec.hoopSize) && (
            <div className="mt-8 grid grid-cols-2 gap-4 border-t border-line pt-6 sm:grid-cols-4">
              {spec.dimensions && (
                <div>
                  <Ruler size={16} className="text-brand" />
                  <p className="mt-1.5 text-xs text-ink/50">Dimensions</p>
                  <p className="text-sm font-medium text-ink">{spec.dimensions}</p>
                </div>
              )}
              {spec.stitchCount && (
                <div>
                  <Layers size={16} className="text-brand" />
                  <p className="mt-1.5 text-xs text-ink/50">Stitch Count</p>
                  <p className="text-sm font-medium text-ink">{spec.stitchCount.toLocaleString()}</p>
                </div>
              )}
              {spec.colors && (
                <div>
                  <Palette size={16} className="text-brand" />
                  <p className="mt-1.5 text-xs text-ink/50">Colors</p>
                  <p className="text-sm font-medium text-ink">{spec.colors}</p>
                </div>
              )}
              {spec.hoopSize && (
                <div>
                  <Ruler size={16} className="text-brand" />
                  <p className="mt-1.5 text-xs text-ink/50">Hoop Size</p>
                  <p className="text-sm font-medium text-ink">{spec.hoopSize}</p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>

      <div className="mt-16 rounded-2xl border border-dashed border-line bg-brand-haze/50 px-6 py-8 text-center">
        <p className="text-sm text-ink/60">
          Can't find your design?{' '}
          <Link to={ROUTES.CUSTOM_DESIGN} className="font-medium text-brand hover:underline">
            Request a Custom Design
          </Link>
        </p>
      </div>
    </div>
  );
}
