import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Menu, X, User, LogOut, LayoutDashboard } from 'lucide-react';
import { ROUTES } from '../../constants/routes';
import useAuth from '../../hooks/useAuth';
import NotificationBell from './NotificationBell';

const NAV_LINKS = [
  { label: 'Home', to: ROUTES.HOME },
  { label: 'Designs', to: ROUTES.GALLERY },
  { label: 'Categories', to: ROUTES.CATEGORIES },
  { label: 'Repair Service', to: ROUTES.REPAIR_SERVICE },
  { label: 'Custom Design', to: ROUTES.CUSTOM_DESIGN },
  { label: 'About', to: ROUTES.ABOUT },
  { label: 'Contact', to: ROUTES.CONTACT },
];

function NavItem({ to, label, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `relative text-sm font-medium transition-colors ${
          isActive ? 'text-brand' : 'text-ink/70 hover:text-brand'
        }`
      }
    >
      {({ isActive }) => (
        <span className="relative pb-1">
          {label}
          {isActive && (
            <motion.span
              layoutId="nav-underline"
              className="absolute -bottom-0.5 left-0 right-0 h-[2px] bg-thread"
            />
          )}
        </span>
      )}
    </NavLink>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, isAdmin, user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to={ROUTES.HOME} className="flex items-center gap-2">
          <span className="font-display text-xl font-semibold tracking-tight text-brand">
            AFUHAK MONOGRAM
          </span>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => (
            <NavItem key={link.to} {...link} />
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {isAuthenticated ? (
            <>
              <NotificationBell />
              <Link
                to={isAdmin ? ROUTES.ADMIN_DASHBOARD : ROUTES.CUSTOMER_DASHBOARD}
                className="flex items-center gap-2 text-sm font-medium text-ink/70 hover:text-brand"
              >
                <LayoutDashboard size={17} />
                {user?.fullName?.split(' ')[0] || 'Dashboard'}
              </Link>
              <button
                onClick={logout}
                className="flex items-center gap-2 rounded-xl border border-line px-3 py-2 text-sm font-medium text-ink/70 transition-colors hover:border-brand/30 hover:text-brand"
              >
                <LogOut size={16} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to={ROUTES.LOGIN} className="text-sm font-medium text-ink/70 hover:text-brand">
                Login
              </Link>
              <Link to={ROUTES.REGISTER} className="btn-primary py-2.5">
                <User size={16} />
                Register
              </Link>
            </>
          )}
        </div>

        <button
          className="rounded-lg p-2 text-ink hover:bg-brand-mist lg:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden border-t border-line bg-white lg:hidden"
          >
            <div className="flex flex-col gap-4 px-4 py-5 sm:px-6">
              {NAV_LINKS.map((link) => (
                <NavItem key={link.to} {...link} onClick={() => setOpen(false)} />
              ))}
              <div className="stitch-rule my-1" />
              {isAuthenticated ? (
                <>
                  <Link
                    to={isAdmin ? ROUTES.ADMIN_DASHBOARD : ROUTES.CUSTOMER_DASHBOARD}
                    onClick={() => setOpen(false)}
                    className="text-sm font-medium text-ink/70"
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      setOpen(false);
                      logout();
                    }}
                    className="text-left text-sm font-medium text-ink/70"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to={ROUTES.LOGIN} onClick={() => setOpen(false)} className="text-sm font-medium text-ink/70">
                    Login
                  </Link>
                  <Link to={ROUTES.REGISTER} onClick={() => setOpen(false)} className="btn-primary w-full">
                    Register
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
