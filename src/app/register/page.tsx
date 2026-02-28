"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Flame } from "lucide-react";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ displayName: "", username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (!res.ok) { const d = await res.json(); toast.error(d.error || "Failed"); setLoading(false); return; }
      const result = await signIn("credentials", { email: form.email, password: form.password, redirect: false });
      if (result?.error) { router.push("/login"); return; }
      router.push("/feed");
      router.refresh();
    } catch { toast.error("Something went wrong"); setLoading(false); }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-bg-primary">
      <div className="w-full max-w-sm">
        <div className="bg-bg-secondary border border-border-primary rounded-lg p-8">
          <div className="flex justify-center mb-4">
            <Flame className="w-10 h-10 text-accent" />
          </div>
          <p className="text-text-secondary text-sm text-center mb-6">Sign up to see posts that live, breathe, and fade.</p>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input type="text" value={form.displayName} onChange={e => setForm({ ...form, displayName: e.target.value })} className="input-field w-full" placeholder="Full name" required />
            <input type="text" value={form.username} onChange={e => setForm({ ...form, username: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, "") })} className="input-field w-full" placeholder="Username" required minLength={3} />
            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="input-field w-full" placeholder="Email" required />
            <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="input-field w-full" placeholder="Password (8+ characters)" required minLength={8} />
            <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? "Creating..." : "Sign up"}</button>
          </form>

          <p className="text-[11px] text-text-tertiary text-center mt-4">
            By signing up, you agree to the MIT-licensed terms of this open source project.
          </p>
        </div>

        <div className="bg-bg-secondary border border-border-primary rounded-lg p-5 mt-3 text-center text-sm">
          Have an account?{" "}
          <Link href="/login" className="text-accent font-semibold">Log in</Link>
        </div>
      </div>
    </div>
  );
}
