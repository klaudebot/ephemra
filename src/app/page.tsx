"use client";

import Link from "next/link";
import { Clock, Heart, Star, ArrowRight, Github, Flame, Eye, MessageCircle, Search, Users } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-bg-primary/80 backdrop-blur-sm border-b border-border-primary">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-accent" />
            <span className="font-bold text-base">ephemra</span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="btn-ghost text-sm">Log in</Link>
            <Link href="/register" className="btn-primary !py-2 !px-4 !text-xs">Sign up</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-accent text-sm font-medium mb-4">Open source social network</p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1] mb-5">
            Posts have a lifespan.
            <br />
            <span className="text-text-secondary">Quality keeps them alive.</span>
          </h1>
          <p className="text-text-secondary text-base max-w-lg mx-auto mb-8 leading-relaxed">
            Every post starts with 6 hours. Engagement extends it.
            Reach 50 resonances and it becomes permanent. The feed curates itself.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link href="/register" className="btn-primary !py-3 !px-7 flex items-center gap-2 text-sm">
              Get started <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="https://github.com/klaudebot/ephemra" target="_blank" className="btn-outline !py-3 !px-6 flex items-center gap-2 text-sm">
              <Github className="w-4 h-4" /> GitHub
            </Link>
          </div>
        </div>

        {/* Demo post */}
        <div className="max-w-md mx-auto mt-14">
          <div className="bg-bg-secondary border border-border-primary rounded-lg overflow-hidden">
            <div className="flex items-center gap-3 px-4 py-3">
              <div className="w-8 h-8 rounded-full bg-bg-elevated flex items-center justify-center text-xs font-semibold">M</div>
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold">michael</span>
                  <Star className="w-3 h-3 text-accent fill-accent" />
                  <span className="text-text-tertiary text-xs">· 2h</span>
                </div>
              </div>
              <span className="text-text-tertiary text-[11px] flex items-center gap-1"><Clock className="w-3 h-3" />4h 12m</span>
            </div>
            <div className="px-4 pb-2">
              <p className="text-sm">The best ideas don&apos;t need an algorithm. They earn their place through genuine resonance. That&apos;s the whole point.</p>
            </div>
            <div className="px-4 py-1 flex items-center gap-2">
              <span className="text-[11px] text-text-tertiary">✦ neutral</span>
              <div className="flex-1 h-0.5 bg-border-primary rounded-full overflow-hidden">
                <div className="h-full bg-success rounded-full" style={{ width: "70%" }} />
              </div>
            </div>
            <div className="flex items-center gap-4 px-4 py-2.5">
              <span className="flex items-center gap-1.5"><Heart className="w-5 h-5 text-danger fill-danger" /><span className="text-xs text-text-secondary">47</span></span>
              <span className="flex items-center gap-1.5"><MessageCircle className="w-5 h-5 text-text-secondary" /><span className="text-xs text-text-secondary">12</span></span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-6 border-t border-border-primary">
        <div className="max-w-4xl mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border-primary">
            {[
              { icon: Clock, title: "Living posts", desc: "Every post starts with 6 hours. Time ticks down visually." },
              { icon: Heart, title: "Resonance", desc: "Each resonance adds 30 min. Comments add 15 min." },
              { icon: Star, title: "Eternal", desc: "50 resonances = permanently preserved." },
              { icon: Eye, title: "Whisper mode", desc: "Post anonymously when you need to." },
              { icon: Search, title: "Explore", desc: "Search, trending, mood-based discovery." },
              { icon: Users, title: "Self-host", desc: "Open source. Your S3. Your data." },
            ].map((f) => (
              <div key={f.title} className="bg-bg-primary p-6">
                <f.icon className="w-5 h-5 text-text-secondary mb-3" />
                <h3 className="text-sm font-semibold mb-1">{f.title}</h3>
                <p className="text-xs text-text-tertiary leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-6 border-t border-border-primary">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-2xl font-bold mb-3">Try it now</h2>
          <p className="text-text-secondary text-sm mb-6">Free. Open source. No tracking.</p>
          <Link href="/register" className="btn-primary !py-3 !px-8 text-sm inline-flex items-center gap-2">
            Create account <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-border-primary py-6 px-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between text-xs text-text-tertiary">
          <span>Ephemra — MIT License</span>
          <div className="flex gap-4">
            <Link href="/login" className="hover:text-text-primary transition-colors">Log in</Link>
            <a href="https://github.com/klaudebot/ephemra" target="_blank" className="hover:text-text-primary transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
