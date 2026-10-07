import React, { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import { Loader2, ShieldCheck, ShieldOff, Users } from "lucide-react";

export default function PlannerAdmin() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);

  const load = async () => {
    setLoading(true);
    const data = await base44.entities.Purchase.list("-created_date");
    setPurchases(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const setStatus = async (id, status) => {
    setUpdating(id);
    await base44.entities.Purchase.update(id, { accessStatus: status });
    setUpdating(null);
    load();
  };

  if (loading) return <div className="py-20 text-center"><Loader2 className="w-6 h-6 animate-spin text-pink-500 mx-auto" /></div>;

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <Users size={22} className="text-pink-500" />
        <h1 className="font-display text-2xl font-bold text-plum-900">Owner Panel</h1>
      </div>

      <div className="glass rounded-2xl p-4 mb-4">
        <p className="text-sm text-plum-600">Manage customer access. {purchases.length} purchase record(s).</p>
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