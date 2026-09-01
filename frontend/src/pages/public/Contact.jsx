import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    // No dedicated contact-message backend endpoint yet — this is a lightweight
    // client-side acknowledgment. Wire this to a real endpoint/email service later.
    setSubmitted(true);
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="text-center">
        <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">Contact Us</h1>
        <div className="stitch-rule mx-auto mt-4 w-20" />
        <p className="mx-auto mt-4 max-w-lg text-ink/60">
          Questions about an order, repair, or custom request? Reach out and we'll get back to you.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-5">
        <div className="space-y-5 lg:col-span-2">
          <div className="card-surface flex items-start gap-3 p-5">
            <Mail size={18} className="mt-0.5 text-brand" />
            <div>
              <p className="text-sm font-medium text-ink">Email</p>
              <p className="mt-0.5 text-sm text-ink/60">afuhak01@gmail.com</p>
            </div>
          </div>
          <div className="card-surface flex items-start gap-3 p-5">
            <Phone size={18} className="mt-0.5 text-brand" />
            <div>
              <p className="text-sm font-medium text-ink">Phone</p>
              <p className="mt-0.5 text-sm text-ink/60">+234 9036150866</p>
            </div>
          </div>
          <div className="card-surface flex items-start gap-3 p-5">
            <MapPin size={18} className="mt-0.5 text-brand" />
            <div>
              <p className="text-sm font-medium text-ink">Support hours</p>
              <p className="mt-0.5 text-sm text-ink/60">Mon–Fri, 9am–5pm WAT</p>
            </div>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="card-surface p-6 lg:col-span-3">
          {submitted ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <CheckCircle2 size={32} className="text-brand" />
              <h3 className="mt-3 font-display text-lg font-semibold text-ink">Message sent</h3>
              <p className="mt-1 text-sm text-ink/60">Thanks for reaching out — we'll respond as soon as we can.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink">Name</label>
                <input name="name" required value={form.name} onChange={handleChange} className="input-field" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink">Email</label>
                <input name="email" type="email" required value={form.email} onChange={handleChange} className="input-field" />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-ink">Message</label>
                <textarea name="message" required rows={5} value={form.message} onChange={handleChange} className="input-field resize-none" />
              </div>
              <button type="submit" className="btn-primary">
                <Send size={15} /> Send Message
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
