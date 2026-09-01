import { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Phone, Lock, AlertCircle, CheckCircle2 } from 'lucide-react';
import api from '../../services/api';
import useAuth from '../../hooks/useAuth';

export default function Settings() {
  const { user, refresh } = useAuth();
  const [profileForm, setProfileForm] = useState({ fullName: user?.fullName || '', phone: user?.phone || '' });
  const [profileError, setProfileError] = useState('');
  const [profileSuccess, setProfileSuccess] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileError('');
    setProfileSuccess('');
    setIsSavingProfile(true);
    try {
      await api.put('/users/me', profileForm);
      await refresh();
      setProfileSuccess('Profile updated successfully.');
    } catch (err) {
      setProfileError(err.message);
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setIsSavingPassword(true);
    try {
      await api.put('/users/me/password', {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setPasswordSuccess('Password changed successfully.');
    } catch (err) {
      setPasswordError(err.message);
    } finally {
      setIsSavingPassword(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-semibold text-ink">Settings</h1>
      <div className="stitch-rule mt-3 w-16" />

      <motion.form
        onSubmit={handleProfileSubmit}
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}
        className="card-surface mt-8 p-6"
      >
        <h2 className="font-display text-lg font-semibold text-ink">Profile</h2>

        {profileError && (
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle size={16} className="mt-0.5 shrink-0" /><span>{profileError}</span>
          </div>
        )}
        {profileSuccess && (
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-brand/20 bg-brand-mist px-4 py-3 text-sm text-brand">
            <CheckCircle2 size={16} className="mt-0.5 shrink-0" /><span>{profileSuccess}</span>
          </div>
        )}

        <div className="mt-4 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">Full name</label>
            <div className="relative">
              <User size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" />
              <input value={profileForm.fullName} onChange={(e) => setProfileForm((f) => ({ ...f, fullName: e.target.value }))} className="input-field pl-10" />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">Phone number</label>
            <div className="relative">
              <Phone size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" />
              <input value={profileForm.phone} onChange={(e) => setProfileForm((f) => ({ ...f, phone: e.target.value }))} className="input-field pl-10" />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">Email</label>
            <input value={user?.email || ''} disabled className="input-field bg-ink/5 text-ink/50" />
            <p className="mt-1 text-xs text-ink/40">Email cannot be changed.</p>
          </div>
        </div>

        <button type="submit" disabled={isSavingProfile} className="btn-primary mt-5">
          {isSavingProfile ? 'Saving…' : 'Save Profile'}
        </button>
      </motion.form>

      <motion.form
        onSubmit={handlePasswordSubmit}
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.1 }}
        className="card-surface mt-6 p-6"
      >
        <h2 className="font-display text-lg font-semibold text-ink">Change Password</h2>

        {passwordError && (
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle size={16} className="mt-0.5 shrink-0" /><span>{passwordError}</span>
          </div>
        )}
        {passwordSuccess && (
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-brand/20 bg-brand-mist px-4 py-3 text-sm text-brand">
            <CheckCircle2 size={16} className="mt-0.5 shrink-0" /><span>{passwordSuccess}</span>
          </div>
        )}

        <div className="mt-4 space-y-4">
          {['currentPassword', 'newPassword', 'confirmPassword'].map((field) => (
            <div key={field}>
              <label className="mb-1.5 block text-sm font-medium text-ink">
                {field === 'currentPassword' ? 'Current password' : field === 'newPassword' ? 'New password' : 'Confirm new password'}
              </label>
              <div className="relative">
                <Lock size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" />
                <input
                  type="password"
                  value={passwordForm[field]}
                  onChange={(e) => setPasswordForm((f) => ({ ...f, [field]: e.target.value }))}
                  className="input-field pl-10"
                />
              </div>
            </div>
          ))}
        </div>

        <button type="submit" disabled={isSavingPassword} className="btn-primary mt-5">
          {isSavingPassword ? 'Updating…' : 'Change Password'}
        </button>
      </motion.form>
    </div>
  );
}
