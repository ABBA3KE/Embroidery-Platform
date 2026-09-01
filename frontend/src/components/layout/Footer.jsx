import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter } from 'lucide-react';
import { ROUTES } from '../../constants/routes';

export default function Footer() {
  return (
    <footer className="border-t border-line bg-brand-haze">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <span className="font-display text-lg font-semibold text-brand">Afuhak Monogram</span>
            <p className="mt-3 max-w-xs text-sm text-ink/60">
              Embroidery designs, repairs, and custom digitizing browsed, purchased, and
              delivered securely.
            </p>
            <div className="mt-4 flex gap-3 text-ink/50">
              <Facebook size={18} className="hover:text-brand" />
              <Instagram size={18} className="hover:text-brand" />
              <Twitter size={18} className="hover:text-brand" />
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-ink">Explore</h4>
            <ul className="mt-3 space-y-2 text-sm text-ink/60">
              <li><Link to={ROUTES.GALLERY} className="hover:text-brand">Design Gallery</Link></li>
              <li><Link to={ROUTES.CATEGORIES} className="hover:text-brand">Categories</Link></li>
              <li><Link to={ROUTES.REPAIR_SERVICE} className="hover:text-brand">Repair Service</Link></li>
              <li><Link to={ROUTES.CUSTOM_DESIGN} className="hover:text-brand">Custom Design</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-ink">Company</h4>
            <ul className="mt-3 space-y-2 text-sm text-ink/60">
              <li><Link to={ROUTES.ABOUT} className="hover:text-brand">About</Link></li>
              <li><Link to={ROUTES.CONTACT} className="hover:text-brand">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-ink">Contact</h4>
            <ul className="mt-3 space-y-2 text-sm text-ink/60">
              <li>Afuhak@Gmail.com</li>
              <li>+234 9036150866</li>
            </ul>
          </div>
        </div>

        <div className="stitch-rule mt-10" />
        <p className="mt-6 text-xs text-ink/40">
          © {new Date().getFullYear()} Afuhak Monogram. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
