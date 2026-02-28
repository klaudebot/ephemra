"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { LogOut, Save, Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [form, setForm] = useState({ displayName: "", bio: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/users/me").then(r => r.json()).then(d => setForm({ displayName: d.displayName || "", bio: d.bio || "" }));
  }, []);

  const save = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users/me", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      if (res.ok) toast.success("Saved"); else toast.error("Failed");
    } catch { toast.error("Failed"); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-[600px] mx-auto border-x border-border-primary min-h-screen">
      <div className="px-4 py-3 border-b border-border-primary">
        <h1 className="text-[16px] font-bold">Settings</h1>
      </div>

      <div className="p-4 space-y-4 border-b border-border-primary">
        <div>
          <label className="text-xs text-text-secondary mb-1 block">Display name</label>
          <input type="text" value={form.displayName} onChange={e => setForm({ ...form, displayName: e.target.value })} className="input-field w-full" />
        </div>
        <div>
          <label className="text-xs text-text-secondary mb-1 block">Bio</label>
          <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} className="input-field w-full" rows={3} maxLength={160} placeholder="Tell us about yourself" />
          <p className="text-xs text-text-tertiary mt-1">{form.bio.length}/160</p>
        </div>
        <button onClick={save} disabled={loading} className="btn-primary flex items-center gap-2">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save
        </button>
      </div>

      <div className="p-4 border-b border-border-primary">
        <p className="text-sm text-text-secondary mb-3">Signed in as <strong className="text-text-primary">{session?.user?.email}</strong></p>
        <button onClick={() => signOut({ callbackUrl: "/" })} className="btn-danger flex items-center gap-2"><LogOut className="w-4 h-4" /> Log out</button>
      </div>

      <div className="p-4">
        <p className="text-xs text-text-tertiary leading-relaxed">
          <strong className="text-text-secondary">S3 Storage:</strong> Configure S3_ENABLED, S3_BUCKET, S3_REGION, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY
          in your environment for media hosting. Works with AWS S3, Cloudflare R2, MinIO, and DigitalOcean Spaces.
        </p>
      </div>
    </div>
  );
}
