import { useEffect, useState } from 'react';
import { fetchAdminReports } from '../../services/adminService';
import { formatPrice } from '../../utils/format';
import LoadingScreen from '../../components/common/LoadingScreen';
import ErrorState from '../../components/common/ErrorState';
import StatCard from '../../components/common/StatCard';
import { Wallet, ShoppingBag, Users, Download, Wrench, Sparkles, Clock } from 'lucide-react';

const RANGES = [
  { value: 'today', label: 'Today' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
  { value: 'year', label: 'This Year' },
];

export default function AdminReports() {
  const [range, setRange] = useState('month');
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setIsLoading(true);
    setError('');
    try {
      setReport(await fetchAdminReports({ range }));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Reports</h1>
          <p className="mt-1 text-sm text-ink/60">Platform performance for the selected period.</p>
        </div>
        <div className="flex gap-1 rounded-xl border border-line bg-white p-1">
          {RANGES.map((r) => (
            <button
              key={r.value}
              onClick={() => setRange(r.value)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${range === r.value ? 'bg-brand text-white' : 'text-ink/60 hover:bg-brand-mist'}`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6">
        {isLoading ? (
          <LoadingScreen />
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : report ? (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              <StatCard label="Total Sales" value={formatPrice(report.totalSales)} icon={Wallet} />
              <StatCard label="Purchases" value={report.totalPurchases} icon={ShoppingBag} />
              <StatCard label="New Customers" value={report.newCustomers} icon={Users} />
              <StatCard label="Downloads" value={report.downloadsInRange} icon={Download} />
              <StatCard label="Pending Repairs" value={report.pendingRepairs} icon={Wrench} />
              <StatCard label="Repairs Completed" value={report.completedRepairsInRange} icon={Wrench} />
              <StatCard label="Custom Requests" value={report.customRequestsInRange} icon={Sparkles} />
              <StatCard label="Custom Design Revenue" value={formatPrice(report.customDesignRevenue)} icon={Wallet} />
              <StatCard label="Avg. Repair Time" value={`${report.averageRepairCompletionHours}h`} icon={Clock} />
            </div>

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="card-surface p-5">
                <h3 className="font-display font-semibold text-ink">Most Purchased Designs</h3>
                <div className="mt-3 space-y-2">
                  {report.mostPurchasedDesigns.length === 0 && <p className="text-sm text-ink/50">No purchases in this period.</p>}
                  {report.mostPurchasedDesigns.map((d) => (
                    <div key={d._id} className="flex items-center justify-between rounded-lg bg-brand-haze/50 px-3 py-2 text-sm">
                      <span className="text-ink">{d.design.name}</span>
                      <span className="text-ink/50">{d.purchases} purchase{d.purchases !== 1 ? 's' : ''}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card-surface p-5">
                <h3 className="font-display font-semibold text-ink">Most Requested Categories</h3>
                <div className="mt-3 space-y-2">
                  {report.mostRequestedCategories.length === 0 && <p className="text-sm text-ink/50">No custom requests in this period.</p>}
                  {report.mostRequestedCategories.map((c) => (
                    <div key={c._id} className="flex items-center justify-between rounded-lg bg-brand-haze/50 px-3 py-2 text-sm">
                      <span className="text-ink">{c.category.name}</span>
                      <span className="text-ink/50">{c.count} request{c.count !== 1 ? 's' : ''}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}
