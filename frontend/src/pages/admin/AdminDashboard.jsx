import { useEffect, useState } from 'react';
import {
  Users, Palette, ShoppingCart, CreditCard, Wallet, Wrench,
  CheckCircle2, Download, Sparkles, Clock,
} from 'lucide-react';
import { fetchAdminStats } from '../../services/adminService';
import { formatPrice } from '../../utils/format';
import LoadingScreen from '../../components/common/LoadingScreen';
import ErrorState from '../../components/common/ErrorState';
import StatCard from '../../components/common/StatCard';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setIsLoading(true);
    setError('');
    try {
      setStats(await fetchAdminStats());
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (isLoading) return <LoadingScreen label="Loading dashboard" />;
  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!stats) return null;

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">Dashboard</h1>
      <p className="mt-1 text-sm text-ink/60">An overview of platform activity.</p>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        <StatCard label="Total Customers" value={stats.totalCustomers} icon={Users} delay={0.0} />
        <StatCard label="Total Designs" value={stats.totalDesigns} icon={Palette} delay={0.02} />
        <StatCard label="Total Orders" value={stats.totalOrders} icon={ShoppingCart} delay={0.04} />
        <StatCard label="Successful Payments" value={stats.successfulPayments} icon={CreditCard} delay={0.06} />
        <StatCard label="Revenue" value={formatPrice(stats.revenue)} icon={Wallet} delay={0.08} />
        <StatCard label="Pending Repairs" value={stats.pendingRepairs} icon={Clock} delay={0.1} />
        <StatCard label="Completed Repairs" value={stats.completedRepairs} icon={Wrench} delay={0.12} />
        <StatCard label="Total Downloads" value={stats.totalDownloads} icon={Download} delay={0.14} />
        <StatCard label="Custom Design Requests" value={stats.totalCustomRequests} icon={Sparkles} delay={0.16} />
        <StatCard label="Pending Custom Designs" value={stats.pendingCustomRequests} icon={Clock} delay={0.18} />
        <StatCard label="Completed Custom Designs" value={stats.completedCustomRequests} icon={CheckCircle2} delay={0.2} />
        <StatCard label="Custom Design Revenue" value={formatPrice(stats.customDesignRevenue)} icon={Wallet} delay={0.22} />
      </div>
    </div>
  );
}
