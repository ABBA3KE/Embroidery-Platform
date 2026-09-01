import { motion } from 'framer-motion';
import { ShieldCheck, Wrench, Sparkles, Heart } from 'lucide-react';

const VALUES = [
  { icon: ShieldCheck, title: 'Secure by default', desc: 'Every purchase is protected — files unlock only after verified payment, every time.' },
  { icon: Wrench, title: 'Built for embroiderers', desc: 'From quick repairs to full custom digitizing, we handle the technical work.' },
  { icon: Sparkles, title: 'Made to order', desc: "Can't find it in the gallery? We'll create it for you." },
  { icon: Heart, title: 'Craft-first', desc: 'Every design is reviewed by hand before it reaches the gallery.' },
];

export default function About() {
  return (
    <div>
      <section className="border-b border-line bg-brand-haze px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">About Afuhak</h1>
            <div className="stitch-rule mx-auto mt-4 w-20" />
            <p className="mt-4 text-ink/60">
              Afuhak is a home for embroidery designs, repairs, and custom digitizing 
              built for hobbyists, small studios, and embroidery businesses who need reliable,
              secure access to the files they buy.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {VALUES.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="card-surface p-6"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-mist text-brand">
                <Icon size={20} />
              </div>
              <h3 className="mt-4 font-display text-lg font-semibold text-ink">{title}</h3>
              <p className="mt-1.5 text-sm text-ink/60">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
