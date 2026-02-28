"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Clock, Heart, Sparkles, Users, Zap, Shield, Github } from "lucide-react";

const features = [
  {
    icon: Clock,
    title: "Living Posts",
    description: "Every post has a heartbeat. They start with 6 hours of life and decay over time. Watch the life ring fade as time passes.",
  },
  {
    icon: Heart,
    title: "Resonance, Not Likes",
    description: "Resonate, Amplify, or Echo. Each interaction extends a post's life. Meaningful engagement literally keeps content alive.",
  },
  {
    icon: Sparkles,
    title: "Eternal Status",
    description: "Posts that reach 50 resonances become Eternal — permanently preserved in the creator's collection. True quality rises.",
  },
  {
    icon: Shield,
    title: "Whisper Mode",
    description: "Share vulnerable thoughts anonymously. Whisper posts hide your identity while keeping the conversation real.",
  },
  {
    icon: Zap,
    title: "Mood-Based Feed",
    description: "Tag your posts with vibes. Filter your feed by energy, chill, creative, or thoughtful moods.",
  },
  {
    icon: Users,
    title: "Open Source",
    description: "Self-host with your own S3 storage. Full control over your data. Built for the community, by the community.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface-900">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 glass border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold gradient-text">
            ephemra
          </Link>
          <div className="flex items-center gap-4">
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
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-500/20 rounded-full blur-[128px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-400/10 rounded-full blur-[128px]" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 text-sm text-surface-300 mb-8">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              Open source & self-hostable
            </div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
              Where moments
              <br />
              <span className="gradient-text">live & breathe</span>
            </h1>

            <p className="text-lg md:text-xl text-surface-300 max-w-2xl mx-auto mb-10 leading-relaxed">
              Posts have a lifespan. Engagement keeps them alive.
              The best become eternal. A social network that values
              quality over quantity, moments over metrics.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register" className="btn-primary text-lg !py-3.5 !px-8">
                Start Your Journey
              </Link>
              <Link
                href="https://github.com"
                className="btn-outline flex items-center gap-2 !py-3 !px-6"
                target="_blank"
              >
                <Github className="w-5 h-5" />
                View on GitHub
              </Link>
            </div>
          </motion.div>

          {/* Animated demo card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="mt-16 max-w-lg mx-auto"
          >
            <div className="glass rounded-2xl p-6 text-left">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full gradient-brand flex items-center justify-center text-white font-bold">
                  E
                </div>
                <div>
                  <p className="font-medium text-sm">ephemra</p>
                  <p className="text-xs text-surface-300">5h 23m remaining</p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300">
                    ✨ neutral
                  </span>
                </div>
              </div>
              <p className="text-surface-200 mb-4">
                Just shipped something special. A place where your words have weight,
                where engagement matters, and where the best ideas become eternal. 🌟
              </p>
              <div className="flex items-center gap-4 text-surface-300 text-sm">
                <span className="flex items-center gap-1">
                  <Heart className="w-4 h-4" /> 42 resonances
                </span>
                <span>12 comments</span>
              </div>
              {/* Life bar */}
              <div className="mt-4 h-1 bg-surface-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full gradient-brand rounded-full"
                  initial={{ width: "100%" }}
                  animate={{ width: "89%" }}
                  transition={{ duration: 2, delay: 1 }}
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Social media, <span className="gradient-text">reimagined</span>
            </h2>
            <p className="text-surface-300 max-w-xl mx-auto">
              Built on the idea that the best content shouldn&apos;t just be liked — it should be kept alive.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass rounded-2xl p-6 hover-lift"
              >
                <div className="w-12 h-12 rounded-xl gradient-brand flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-surface-300 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-16">
            How <span className="gradient-text">Ephemra</span> works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Post", desc: "Share a thought, image, or moment. Every post starts with 6 hours of life." },
              { step: "02", title: "Engage", desc: "Resonate, comment, amplify. Each interaction adds time to the post's life." },
              { step: "03", title: "Eternalize", desc: "Hit 50 resonances and your post becomes Eternal — preserved forever." },
            ].map((item) => (
              <div key={item.step} className="text-left">
                <span className="text-5xl font-bold text-brand-500/20">{item.step}</span>
                <h3 className="text-xl font-semibold mt-2 mb-2">{item.title}</h3>
                <p className="text-surface-300 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center glass rounded-3xl p-12">
          <h2 className="text-3xl font-bold mb-4">Ready to join?</h2>
          <p className="text-surface-300 mb-8">
            Start sharing moments that matter. No algorithms, no infinite scroll addiction.
            Just real, ephemeral connections.
          </p>
          <Link href="/register" className="btn-primary text-lg !py-3.5 !px-8">
            Create Your Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-sm text-surface-300">
            Ephemra — Open source under MIT License
          </span>
          <div className="flex items-center gap-6 text-sm text-surface-300">
            <Link href="/login" className="hover:text-white transition">Sign In</Link>
            <Link href="/register" className="hover:text-white transition">Register</Link>
            <a href="https://github.com" target="_blank" className="hover:text-white transition">
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
