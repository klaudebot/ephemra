"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Flame } from "lucide-react";
import toast from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await signIn("credentials", { email, password, redirect: false });
    if (result?.error) { toast.error("Invalid credentials"); setLoading(false); return; }
    router.push("/feed");
    router.refresh();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-bg-primary">
      <div className="w-full max-w-sm">
        <div className="bg-bg-secondary border border-border-primary rounded-lg p-8">
          <div className="flex justify-center mb-6">
            <Flame className="w-10 h-10 text-accent" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input-field w-full" placeholder="Email" required />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="input-field w-full" placeholder="Password" required />
            <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? "Logging in..." : "Log in"}</button>
          </form>
        </div>

        <div className="bg-bg-secondary border border-border-primary rounded-lg p-5 mt-3 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="text-accent font-semibold">Sign up</Link>
        </div>
      </div>
    </div>
  );
}
