"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { Settings, LogOut, Save, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [form, setForm] = useState({
    displayName: "",
    bio: "",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/users/me")
      .then((r) => r.json())
      .then((data) => {
        setForm({
          displayName: data.displayName || "",
          bio: data.bio || "",
        });
      });
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) toast.success("Profile updated");
      else toast.error("Failed to save");
    } catch {
      toast.error("Failed to save");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center gap-3 mb-6">
        <Settings className="w-6 h-6 text-brand-400" />
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>

      <div className="glass rounded-2xl p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-surface-300 mb-1.5">
            Display Name
          </label>
          <input
            type="text"
            value={form.displayName}
            onChange={(e) => setForm({ ...form, displayName: e.target.value })}
            className="input-dark w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-surface-300 mb-1.5">
            Bio
          </label>
          <textarea
            value={form.bio}
            onChange={(e) => setForm({ ...form, bio: e.target.value })}
            className="input-dark w-full"
            rows={3}
            maxLength={160}
            placeholder="Tell us about yourself..."
          />
          <p className="text-xs text-surface-300/50 mt-1">{form.bio.length}/160</p>
        </div>

        <button onClick={handleSave} disabled={loading} className="btn-primary flex items-center gap-2">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Changes
        </button>
      </div>

      {/* Account info */}
      <div className="glass rounded-2xl p-6 mt-6">
        <h2 className="font-semibold mb-4">Account</h2>
        <p className="text-sm text-surface-300 mb-4">
          Signed in as <strong className="text-white">{session?.user?.email}</strong>
        </p>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="flex items-center gap-2 text-sm text-red-400 hover:text-red-300 transition"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>

      {/* S3 info */}
      <div className="glass rounded-2xl p-6 mt-6">
        <h2 className="font-semibold mb-2">Storage Configuration</h2>
        <p className="text-sm text-surface-300 mb-3">
          Media uploads can be configured to use S3-compatible storage
          (AWS S3, MinIO, Cloudflare R2, DigitalOcean Spaces).
        </p>
        <p className="text-xs text-surface-300/50">
          Set S3_ENABLED=true and configure S3_BUCKET, S3_REGION, S3_ACCESS_KEY_ID,
          and S3_SECRET_ACCESS_KEY in your environment variables. See .env.example for details.
        </p>
      </div>
    </div>
  );
}
