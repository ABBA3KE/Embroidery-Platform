import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './routes/ProtectedRoute';
import { ROUTES } from './constants/routes';
import ADMIN_ROUTES from './constants/adminRoutes';

import Home from './pages/public/Home';
import NotFound from './pages/public/NotFound';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Gallery from './pages/public/Gallery';
import DesignDetails from './pages/public/DesignDetails';
import Categories from './pages/public/Categories';
import RepairService from './pages/public/RepairService';
import CustomDesign from './pages/public/CustomDesign';
import About from './pages/public/About';
import Contact from './pages/public/Contact';

import CustomerDashboard from './pages/customer/Dashboard';
import Purchases from './pages/customer/Purchases';
import RepairRequests from './pages/customer/RepairRequests';
import CustomDesignRequests from './pages/customer/CustomDesignRequests';
import Settings from './pages/customer/Settings';
import PaymentCallback from './pages/customer/PaymentCallback';
import CustomDesignPaymentCallback from './pages/customer/CustomDesignPaymentCallback';

import AdminDashboard from './pages/admin/AdminDashboard';
import AdminDesigns from './pages/admin/AdminDesigns';
import AdminCategories from './pages/admin/AdminCategories';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminCustomerDetail from './pages/admin/AdminCustomerDetail';
import AdminOrders from './pages/admin/AdminOrders';
import AdminPayments from './pages/admin/AdminPayments';
import AdminDownloads from './pages/admin/AdminDownloads';
import AdminRepairs from './pages/admin/AdminRepairs';
import AdminCustomDesigns from './pages/admin/AdminCustomDesigns';
import AdminReports from './pages/admin/AdminReports';

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path={ROUTES.HOME} element={<Home />} />
          <Route path={ROUTES.LOGIN} element={<Login />} />
          <Route path={ROUTES.REGISTER} element={<Register />} />
          <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword />} />
          <Route path={ROUTES.RESET_PASSWORD} element={<ResetPassword />} />

          <Route path={ROUTES.GALLERY} element={<Gallery />} />
          <Route path={ROUTES.DESIGN_DETAILS} element={<DesignDetails />} />
          <Route path={ROUTES.CATEGORIES} element={<Categories />} />
          <Route path={ROUTES.REPAIR_SERVICE} element={<RepairService />} />
          <Route path={ROUTES.CUSTOM_DESIGN} element={<CustomDesign />} />
          <Route path={ROUTES.ABOUT} element={<About />} />
          <Route path={ROUTES.CONTACT} element={<Contact />} />

          {/* Protected — customer */}
          <Route element={<ProtectedRoute allowedRoles={['customer', 'admin']} />}>
            <Route path={ROUTES.CUSTOMER_DASHBOARD} element={<CustomerDashboard />} />
            <Route path={ROUTES.MY_PURCHASES} element={<Purchases />} />
            <Route path={ROUTES.MY_REPAIRS} element={<RepairRequests />} />
            <Route path={ROUTES.MY_CUSTOM_DESIGNS} element={<CustomDesignRequests />} />
            <Route path={ROUTES.SETTINGS} element={<Settings />} />
            <Route path={ROUTES.PAYMENT_CALLBACK} element={<PaymentCallback />} />
            <Route path={ROUTES.CUSTOM_DESIGN_PAYMENT_CALLBACK} element={<CustomDesignPaymentCallback />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Protected — admin only, own layout (sidebar, no public navbar/footer) */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
          <Route element={<AdminLayout />}>
            <Route path={ADMIN_ROUTES.DASHBOARD} element={<AdminDashboard />} />
            <Route path={ADMIN_ROUTES.DESIGNS} element={<AdminDesigns />} />
            <Route path={ADMIN_ROUTES.CATEGORIES} element={<AdminCategories />} />
            <Route path={ADMIN_ROUTES.CUSTOMERS} element={<AdminCustomers />} />
            <Route path={`${ADMIN_ROUTES.CUSTOMERS}/:id`} element={<AdminCustomerDetail />} />
            <Route path={ADMIN_ROUTES.ORDERS} element={<AdminOrders />} />
            <Route path={ADMIN_ROUTES.PAYMENTS} element={<AdminPayments />} />
            <Route path={ADMIN_ROUTES.DOWNLOADS} element={<AdminDownloads />} />
            <Route path={ADMIN_ROUTES.REPAIRS} element={<AdminRepairs />} />
            <Route path={ADMIN_ROUTES.CUSTOM_DESIGNS} element={<AdminCustomDesigns />} />
            <Route path={ADMIN_ROUTES.REPORTS} element={<AdminReports />} />
          </Route>
        </Route>
      </Routes>
    </AuthProvider>
  );
}
