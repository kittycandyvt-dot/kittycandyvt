import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Loader2, Lock, ShieldCheck, ShieldOff, Users, UserPlus, Mail } from "lucide-react";

const OWNER_EMAIL = "kittycandyvt@gmail.com";

export default function PlannerAdmin() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [forbidden, setForbidden] = useState(false);
  const [grantEmail, setGrantEmail] = useState("");
  const [granting, setGranting] = useState(false);
  const [grantMsg, setGrantMsg] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const me = await base44.auth.me();
      if (me.email !== OWNER_EMAIL) { setForbidden(true); setLoading(false); return; }
      const data = await base44.entities.Purchase.list("-created_date");
      setPurchases(data || []);
    } catch {
      setForbidden(true);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const grantAccess = async (e) => {
    e.preventDefault();
    if (!grantEmail.trim()) return;
    setGranting(true);
    setGrantMsg("");
    try {
      const res = await base44.functions.invoke("grantPlannerAccess", { email: grantEmail.trim() });
      if (res.data?.success) {
        setGrantMsg(`Invitation sent to ${grantEmail.trim()}! They'll receive an email with a link to set their password.`);
        setGrantEmail("");
        load();
      } else {
        setGrantMsg(res.data?.error || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setGrantMsg(err.message || "Something went wrong. Please try again.");
    }
    setGranting(false);
  };

  const setStatus = async (id, status) => {
    setUpdating(id);
    await base44.entities.Purchase.update(id, { accessStatus: status });
    setUpdating(null);
    load();
  };

  if (loading) return <div className="py-20 text-center"><Loader2 className="w-6 h-6 animate-spin text-pink-500 mx-auto" /></div>;

  if (forbidden) return (
    <div className="py-20 text-center">
      <Lock size={32} className="mx-auto text-plum-400 mb-3" />
      <p className="text-plum-600 font-medium">Access restricted to the owner.</p>
    </div>
  );

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Users size={22} className="text-pink-500" />
        <h1 className="font-display text-2xl font-bold text-plum-900">Owner Panel</h1>
      </div>

      <div className="glass rounded-2xl p-4 mb-4">
        <p className="text-sm text-plum-600">Manage customer access. {purchases.length} purchase record(s).</p>
      </div>

      <div className="glass rounded-2xl p-5 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <UserPlus size={18} className="text-pink-500" />
          <h2 className="font-semibold text-plum-900">Grant Access</h2>
        </div>
        <form onSubmit={grantAccess} className="flex flex-wrap gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-plum-400" />
            <input
              type="email"
              placeholder="customer@example.com"
              value={grantEmail}
              onChange={(e) => setGrantEmail(e.target.value)}
              className="w-full h-11 pl-10 pr-4 rounded-full border border-pink-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              required
            />
          </div>
          <button
            type="submit"
            disabled={granting}
            className="inline-flex items-center gap-2 px-5 h-11 rounded-full font-semibold text-white bg-gradient-to-r from-pink-500 to-fuchsia-500 shadow-md hover:scale-105 transition-transform disabled:opacity-50"
          >
            {granting ? <Loader2 size={16} className="animate-spin" /> : <UserPlus size={16} />}
            Grant Access
          </button>
        </form>
        {grantMsg && (
          <p className="mt-3 text-sm text-plum-600">{grantMsg}</p>
        )}
      </div>

      {purchases.length === 0 ? (
        <p className="text-center text-plum-400 py-10">No purchases yet.</p>
      ) : (
        <div className="space-y-2">
          {purchases.map(p => (
            <div key={p.id} className="glass rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-medium text-plum-900">{p.customerEmail}</p>
                <p className="text-xs text-plum-400">{p.productName || "VTuber Planner"} · {p.purchaseDate ? new Date(p.purchaseDate).toLocaleDateString() : "—"}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded-full ${p.accessStatus === "active" ? "bg-green-100 text-green-600" : p.accessStatus === "revoked" ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600"}`}>{p.accessStatus}</span>
                {updating === p.id ? <Loader2 className="w-4 h-4 animate-spin text-pink-500" /> : (
                  <>
                    {p.accessStatus !== "active" && (
                      <button onClick={() => setStatus(p.id, "active")} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium text-white bg-green-500"><ShieldCheck size={14} /> Activate</button>
                    )}
                    {p.accessStatus !== "revoked" && (
                      <button onClick={() => setStatus(p.id, "revoked")} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium text-red-600 bg-red-50 border border-red-100"><ShieldOff size={14} /> Revoke</button>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}