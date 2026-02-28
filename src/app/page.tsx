"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  Clock,
  Heart,
  Sparkles,
  Users,
  Zap,
  Shield,
  Github,
  ArrowRight,
  MessageSquare,
  Search,
  Ghost,
  ChevronDown,
} from "lucide-react";

const features = [
  {
    icon: Clock,
    title: "Living Posts",
    description:
      "Every post has a heartbeat. They start with 6 hours of life and decay over time. Watch the life ring fade as time passes.",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Heart,
    title: "Resonance, Not Likes",
    description:
      "Resonate, Amplify, or Echo. Each interaction extends a post's life. Meaningful engagement literally keeps content alive.",
    color: "from-pink-500 to-rose-500",
  },
  {
    icon: Sparkles,
    title: "Eternal Status",
    description:
      "Posts that reach 50 resonances become Eternal — permanently preserved in the creator's collection. True quality rises.",
    color: "from-brand-400 to-purple-500",
  },
  {
    icon: Shield,
    title: "Whisper Mode",
    description:
      "Share vulnerable thoughts anonymously. Whisper posts hide your identity while keeping the conversation real.",
    color: "from-gray-400 to-gray-500",
  },
  {
    icon: MessageSquare,
    title: "Direct Messages",
    description:
      "Private conversations with the people who matter. Real-time messaging built right in.",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: Search,
    title: "Discover & Explore",
    description:
      "Find trending moments, discover new people, and explore moods. Search across posts and profiles.",
    color: "from-amber-500 to-orange-500",
  },
  {
    icon: Zap,
    title: "Mood-Based Feed",
    description:
      "Tag your posts with vibes. Filter your feed by energy, chill, creative, or thoughtful moods.",
    color: "from-yellow-500 to-amber-500",
  },
  {
    icon: Users,
    title: "Open Source & Self-Hostable",
    description:
      "Full control over your data. Configure your own S3 storage. Built for the community, by the community.",
    color: "from-brand-400 to-brand-600",
  },
];

const stats = [
  { label: "Open Source", value: "MIT" },
  { label: "Post Lifespan", value: "6h" },
  { label: "Eternal Threshold", value: "50" },
  { label: "Mood Types", value: "7" },
];

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95]);

  useEffect(() => setMounted(true), []);

  return (
    <div className="min-h-screen bg-surface-900 overflow-x-hidden">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold gradient-text">
            ephemra
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/login" className="btn-ghost text-sm">
              Sign In
            </Link>
            <Link href="/register" className="btn-primary text-sm !py-2 !px-5">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden min-h-[90vh] flex items-center">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand-500/20 rounded-full blur-[150px] animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-brand-400/10 rounded-full blur-[150px] animate-pulse-slow" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/5 rounded-full blur-[200px]" />
        </div>

        <motion.div
          style={{ opacity: mounted ? heroOpacity : 1, scale: mounted ? heroScale : 1 }}
          className="relative max-w-5xl mx-auto text-center w-full"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 glass rounded-full px-5 py-2 text-sm text-surface-300 mb-8">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Open source & self-hostable
              <span className="text-surface-300/30">|</span>
              <span className="text-brand-300">v2.0</span>
            </div>

            <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold tracking-tight mb-8 leading-[0.9]">
              Where moments
              <br />
              <span className="gradient-text">live & breathe</span>
            </h1>

            <p className="text-lg md:text-xl text-surface-300 max-w-2xl mx-auto mb-12 leading-relaxed">
              The social network where posts have a lifespan. Engagement keeps them alive.
              The best become eternal. Quality over quantity. Moments over metrics.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <Link
                href="/register"
                className="btn-primary text-lg !py-4 !px-10 flex items-center gap-2 group"
              >
                Start Your Journey
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="https://github.com"
                className="btn-outline flex items-center gap-2 !py-3.5 !px-7"
                target="_blank"
              >
                <Github className="w-5 h-5" />
                Star on GitHub
              </Link>
            </div>

            {/* Stats */}
            <div className="flex items-center justify-center gap-8 md:gap-12">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl md:text-3xl font-bold gradient-text">{stat.value}</p>
                  <p className="text-xs text-surface-300 mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Demo Card */}
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4, ease: "easeOut" }}
            className="mt-16 max-w-xl mx-auto"
          >
            <div className="glass rounded-2xl p-6 text-left relative overflow-hidden">
              {/* Glow effect */}
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-brand-500/20 rounded-full blur-[60px]" />

              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="relative w-11 h-11">
                    <svg className="w-11 h-11 -rotate-90" viewBox="0 0 44 44">
                      <circle cx="22" cy="22" r="20" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />
                      <circle
                        cx="22" cy="22" r="20" fill="none" stroke="#7c3aed" strokeWidth="2"
                        strokeDasharray="112 125.6" strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute inset-1 rounded-full gradient-brand flex items-center justify-center text-white font-bold text-xs">
                      E
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-sm">ephemra</p>
                    <p className="text-xs text-surface-300 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> 5h 23m remaining
                    </p>
                  </div>
                  <div className="ml-auto">
                    <span className="text-xs px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 border border-brand-500/20">
                      ✨ neutral
                    </span>
                  </div>
                </div>
                <p className="text-surface-200 mb-4">
                  Just shipped something special. A place where your words have weight,
                  where engagement matters, and where the best ideas become eternal. 🌟
                </p>
                <div className="flex items-center gap-4 text-surface-300 text-sm">
                  <span className="flex items-center gap-1 text-brand-400">
                    <Heart className="w-4 h-4 fill-current" /> 47
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-4 h-4" /> 12
                  </span>
                  <span className="ml-auto flex items-center gap-1 text-xs text-brand-300">
                    <Sparkles className="w-3 h-3" /> 3 away from Eternal
                  </span>
                </div>
                <div className="mt-4 h-1.5 bg-surface-700 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full gradient-brand rounded-full"
                    initial={{ width: "100%" }}
                    animate={{ width: "89%" }}
                    transition={{ duration: 3, delay: 1.5, ease: "easeInOut" }}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
            className="mt-12 flex flex-col items-center gap-1 text-surface-300/30"
          >
            <span className="text-xs">Scroll to explore</span>
            <ChevronDown className="w-4 h-4 animate-bounce" />
          </motion.div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-brand-500/5 to-transparent pointer-events-none" />

        <div className="max-w-6xl mx-auto relative">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <span className="text-sm text-brand-400 font-medium">Features</span>
              <h2 className="text-3xl md:text-5xl font-bold mt-2 mb-4">
                Social media, <span className="gradient-text">reimagined</span>
              </h2>
              <p className="text-surface-300 max-w-xl mx-auto">
                Built on the idea that the best content shouldn&apos;t just be liked —
                it should be kept alive.
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass rounded-2xl p-6 hover-lift group"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-semibold text-sm mb-2">{feature.title}</h3>
                <p className="text-surface-300 text-xs leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-sm text-brand-400 font-medium">How it works</span>
            <h2 className="text-3xl md:text-5xl font-bold mt-2">
              Three simple steps
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                title: "Share a Moment",
                desc: "Post a thought, image, or moment. Choose your mood. Every post starts with 6 hours of life.",
                icon: "🌟",
              },
              {
                step: "02",
                title: "Engage & Extend",
                desc: "Resonate, comment, amplify. Each interaction adds time. Keep the best content alive.",
                icon: "💫",
              },
              {
                step: "03",
                title: "Become Eternal",
                desc: "Hit 50 resonances and your post transcends time. It's permanently preserved forever.",
                icon: "✨",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative"
              >
                <div className="text-6xl mb-4">{item.icon}</div>
                <span className="text-xs text-brand-400 font-mono">STEP {item.step}</span>
                <h3 className="text-xl font-semibold mt-1 mb-2">{item.title}</h3>
                <p className="text-surface-300 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-sm text-brand-400 font-medium">Built with</span>
            <h2 className="text-2xl font-bold mt-2 mb-8">Modern, battle-tested tech</h2>
          </motion.div>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {["Next.js 14", "TypeScript", "Tailwind CSS", "Prisma", "NextAuth.js", "Framer Motion", "AWS S3 SDK"].map(
              (tech) => (
                <span
                  key={tech}
                  className="glass rounded-full px-4 py-2 text-sm text-surface-300"
                >
                  {tech}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center glass rounded-3xl p-12 relative overflow-hidden"
        >
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-brand-500/30 rounded-full blur-[80px]" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-brand-400/20 rounded-full blur-[80px]" />

          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to join?</h2>
            <p className="text-surface-300 mb-8 max-w-md mx-auto">
              Start sharing moments that matter. No algorithms, no infinite scroll addiction.
              Just real, ephemeral connections.
            </p>
            <Link
              href="/register"
              className="btn-primary text-lg !py-4 !px-10 inline-flex items-center gap-2 group"
            >
              Create Your Account
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold gradient-text">ephemra</span>
            <span className="text-sm text-surface-300">— Open source under MIT License</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-surface-300">
            <Link href="/login" className="hover:text-white transition">
              Sign In
            </Link>
            <Link href="/register" className="hover:text-white transition">
              Register
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              className="hover:text-white transition flex items-center gap-1"
            >
              <Github className="w-4 h-4" />
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
