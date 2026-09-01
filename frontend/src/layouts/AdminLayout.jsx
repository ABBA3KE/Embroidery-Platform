import { useState } from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  LayoutDashboard, Palette, Layers, Users, ShoppingCart, CreditCard,
  Download, Wrench, Sparkles, BarChart3, Menu, X, LogOut, ArrowLeft,
} from 'lucide-react';
import ADMIN_ROUTES from '../constants/adminRoutes';
import { ROUTES } from '../constants/routes';
import useAuth from '../hooks/useAuth';

const NAV_ITEMS = [
  { to: ADMIN_ROUTES.DASHBOARD, label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: ADMIN_ROUTES.DESIGNS, label: 'Designs', icon: Palette },
  { to: ADMIN_ROUTES.CATEGORIES, label: 'Categories', icon: Layers },
  { to: ADMIN_ROUTES.CUSTOMERS, label: 'Customers', icon: Users },
  { to: ADMIN_ROUTES.ORDERS, label: 'Orders', icon: ShoppingCart },
  { to: ADMIN_ROUTES.PAYMENTS, label: 'Payments', icon: CreditCard },
  { to: ADMIN_ROUTES.DOWNLOADS, label: 'Downloads', icon: Download },
  { to: ADMIN_ROUTES.REPAIRS, label: 'Repair Requests', icon: Wrench },
  { to: ADMIN_ROUTES.CUSTOM_DESIGNS, label: 'Custom Designs', icon: Sparkles },
  { to: ADMIN_ROUTES.REPORTS, label: 'Reports', icon: BarChart3 },
];

function SidebarContent({ onNavigate }) {
  const { user, logout } = useAuth();

  return (
    <div className="flex h-full flex-col">
      <div className="px-5 py-6">
        <Link to={ROUTES.HOME} className="font-display text-lg font-semibold text-brand">Afuhak</Link>
        <p className="mt-0.5 text-xs text-ink/40">Admin Panel</p>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3">
        {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onNavigate}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive ? 'bg-brand text-white' : 'text-ink/60 hover:bg-brand-mist hover:text-brand'
              }`
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-line px-3 py-4">
        <Link to={ROUTES.HOME} className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink/60 hover:bg-brand-mist hover:text-brand">
          <ArrowLeft size={17} />
          Back to Site
        </Link>
        <div className="mt-2 flex items-center justify-between rounded-xl px-3 py-2.5">
          <span className="truncate text-sm text-ink/50">{user?.fullName}</span>
          <button onClick={logout} className="text-ink/40 hover:text-red-600" aria-label="Logout">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-brand-haze">
      {/* Desktop sidebar */}
      <aside className="hidden w-64 shrink-0 border-r border-line bg-white lg:block">
        <SidebarContent />
      </aside>

      {/* Mobile top bar + drawer */}
      <div className="flex-1">
        <div className="flex items-center justify-between border-b border-line bg-white px-4 py-3 lg:hidden">
          <span className="font-display font-semibold text-brand">Stitchfolio Admin</span>
          <button onClick={() => setMobileOpen(true)} className="rounded-lg p-2 text-ink hover:bg-brand-mist" aria-label="Open menu">
            <Menu size={20} />
          </button>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setMobileOpen(false)}
                className="fixed inset-0 z-40 bg-ink/30 lg:hidden"
              />
              <motion.div
                initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lift lg:hidden"
              >
                <button onClick={() => setMobileOpen(false)} className="absolute right-3 top-4 rounded-lg p-1.5 text-ink/50 hover:bg-brand-mist" aria-label="Close menu">
                  <X size={18} />
                </button>
                <SidebarContent onNavigate={() => setMobileOpen(false)} />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
