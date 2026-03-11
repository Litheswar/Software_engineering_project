import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight, ShieldCheck, Users, Zap, BookOpen,
  Cpu, Package, Star, ChevronDown
} from 'lucide-react';
import { mockItems } from '../../data/mockData';
import ItemCard from '../../components/ItemCard/ItemCard';

/* ─── Animation variants ─────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

/* ─── Landing Page ───────────────────────────────────── */
const Landing = () => {
  const howRef = useRef(null);

  const scrollToHow = () => {
    howRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const featuredItems = mockItems.slice(0, 4);

  return (
    <div className="page-container font-body pt-16">

      {/* ── Hero ──────────────────────────────────────────── */}
      <section className="relative overflow-hidden min-h-screen flex flex-col items-center justify-center text-center px-4">
        {/* Gradient background blobs */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-[-120px] left-[-80px] w-[500px] h-[500px] bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-[-100px] right-[-60px] w-[400px] h-[400px] bg-secondary/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl" />
        </div>

        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="max-w-3xl mx-auto"
        >
          {/* Badge */}
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-primary/10 text-primary text-sm font-semibold px-4 py-2 rounded-full mb-6 border border-primary/20">
            <Zap size={14} />
            Campus-only verified marketplace
          </motion.div>

          {/* Headline */}
          <motion.h1 variants={fadeUp} className="font-heading font-extrabold text-4xl sm:text-5xl md:text-6xl text-textDark leading-tight mb-5">
            Buy &amp; Sell{' '}
            <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Within Your Campus
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p variants={fadeUp} className="text-lg text-textMuted max-w-xl mx-auto mb-8 leading-relaxed">
            EECShop is the trusted student marketplace for books, gadgets, lab equipment, and more — all within your college community.
          </motion.p>

          {/* CTA buttons */}
          <motion.div variants={fadeUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/register"
                className="btn-primary flex items-center gap-2 text-base px-7 py-3"
              >
                Explore Marketplace
                <ArrowRight size={18} />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>
              <Link
                to="/login"
                className="btn-outline flex items-center gap-2 text-base px-7 py-3"
              >
                Login
              </Link>
            </motion.div>
          </motion.div>

          {/* Scroll hint */}
          <motion.button
            variants={fadeUp}
            onClick={scrollToHow}
            className="mt-14 flex flex-col items-center gap-1 text-textMuted hover:text-primary transition-colors mx-auto"
            aria-label="Scroll to how it works"
          >
            <span className="text-xs">How it works</span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.4, repeat: Infinity }}
            >
              <ChevronDown size={20} />
            </motion.div>
          </motion.button>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="absolute bottom-10 left-0 right-0 flex justify-center"
        >
          <div className="flex gap-8 sm:gap-16 bg-white/60 backdrop-blur-xl border border-white/80 rounded-2xl px-8 py-4 shadow-lg">
            {[
              { label: 'Items Listed', value: '500+' },
              { label: 'Active Students', value: '1,200+' },
              { label: 'Trades Done', value: '320+' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-heading font-bold text-xl text-primary">{s.value}</p>
                <p className="text-xs text-textMuted">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── How It Works ──────────────────────────────────── */}
      <section ref={howRef} id="how-it-works" className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="text-center mb-14"
          >
            <motion.h2 variants={fadeUp} className="font-heading font-bold text-h2 text-textDark mb-3">
              How EECShop Works
            </motion.h2>
            <motion.p variants={fadeUp} className="text-textMuted max-w-md mx-auto">
              Three simple steps between you and your next deal
            </motion.p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                step: '01',
                title: 'Post Your Item',
                desc: 'List books, gadgets, or lab equipment in 60 seconds. Add price, condition, and a photo.',
                color: 'from-blue-500 to-blue-700',
              },
              {
                step: '02',
                title: 'Admin Approval',
                desc: 'Our college admins review the listing to ensure quality and authenticity before it goes live.',
                color: 'from-purple-500 to-purple-700',
              },
              {
                step: '03',
                title: 'Connect & Trade',
                desc: 'Buyers contact sellers via in-app chat. Meet on campus and complete the deal safely.',
                color: 'from-green-500 to-green-700',
              },
            ].map((item) => (
              <motion.div key={item.step} variants={fadeUp} className="text-center group">
                <div className={`w-16 h-16 bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center text-white font-heading font-bold text-lg mx-auto mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  {item.step}
                </div>
                <h3 className="font-heading font-semibold text-lg text-textDark mb-2">{item.title}</h3>
                <p className="text-textMuted text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Featured Items ─────────────────────────────────── */}
      <section className="py-20 px-4 bg-surface">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4"
          >
            <div>
              <motion.h2 variants={fadeUp} className="font-heading font-bold text-h2 text-textDark mb-1">
                Featured Listings
              </motion.h2>
              <motion.p variants={fadeUp} className="text-textMuted">Latest items from your campus</motion.p>
            </div>
            <motion.div variants={fadeUp} whileHover={{ scale: 1.03 }}>
              <Link to="/register" className="btn-outline text-sm">
                View All →
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={stagger}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {featuredItems.map((item) => (
              <motion.div key={item.id} variants={fadeUp}>
                <ItemCard item={item} />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Trust Section ─────────────────────────────────── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={stagger}
            className="text-center mb-12"
          >
            <motion.h2 variants={fadeUp} className="font-heading font-bold text-h2 text-textDark mb-3">
              Why Students Trust EECShop
            </motion.h2>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: ShieldCheck,
                title: 'Verified Students Only',
                desc: 'Only registered EEC students can access the platform, ensuring safe trades.',
                color: 'text-secondary bg-secondary/10',
              },
              {
                icon: Users,
                title: 'Admin Moderation',
                desc: 'Every listing is reviewed by campus admins before going live. No scams.',
                color: 'text-primary bg-primary/10',
              },
              {
                icon: Star,
                title: 'Seller Trust Scores',
                desc: 'Each seller has a trust score based on completed deals and reviews.',
                color: 'text-accent bg-accent/10',
              },
            ].map((f) => (
              <motion.div
                key={f.title}
                variants={fadeUp}
                className="flex flex-col items-center text-center p-6 rounded-2xl border border-gray-100 hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
              >
                <div className={`w-14 h-14 rounded-2xl ${f.color} flex items-center justify-center mb-4`}>
                  <f.icon size={26} />
                </div>
                <h3 className="font-heading font-semibold text-lg text-textDark mb-2">{f.title}</h3>
                <p className="text-textMuted text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA Banner ────────────────────────────────────── */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-primary to-blue-700 rounded-3xl p-12 text-center text-white relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
            <h2 className="font-heading font-bold text-3xl mb-3 relative z-10">
              Ready to Start Trading?
            </h2>
            <p className="text-white/80 mb-8 relative z-10">
              Join 1,200+ EEC students already buying and selling on campus.
            </p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }} className="relative z-10">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 bg-white text-primary font-bold px-8 py-3.5 rounded-xl hover:bg-gray-50 transition-colors shadow-lg text-base"
              >
                Create Free Account
                <ArrowRight size={18} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────── */}
      <footer className="bg-textDark text-white py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between gap-8 mb-10">
            {/* Brand */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-blue-500 rounded-lg flex items-center justify-center">
                  <Package size={16} className="text-white" />
                </div>
                <span className="font-heading font-bold text-xl">EEC<span className="text-secondary">Shop</span></span>
              </div>
              <p className="text-white/60 text-sm max-w-xs leading-relaxed">
                The campus-only marketplace for EEC students to buy, sell, and trade academic essentials.
              </p>
            </div>

            {/* Links */}
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h4 className="font-semibold text-sm mb-3 text-white/80">Marketplace</h4>
                <ul className="space-y-2">
                  {['Browse Items', 'Post Item', 'Categories', 'Trust Scores'].map((link) => (
                    <li key={link}>
                      <Link to="/register" className="text-white/50 hover:text-white text-sm transition-colors">
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-sm mb-3 text-white/80">Company</h4>
                <ul className="space-y-2">
                  {['About', 'Contact', 'Privacy Policy', 'Terms of Service'].map((link) => (
                    <li key={link}>
                      <span className="text-white/50 text-sm cursor-pointer hover:text-white transition-colors">
                        {link}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
            <p className="text-white/40 text-sm">© 2026 EECShop. Built for EEC students.</p>
            <p className="text-white/40 text-sm flex items-center gap-1">
              <BookOpen size={14} />
              Engineering excellence, every deal.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
