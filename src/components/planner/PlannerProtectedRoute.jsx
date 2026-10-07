import React, { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { plannerConfig } from "@/data/plannerConfig";
import { Loader2, Lock, LifeBuoy } from "lucide-react";
import PlannerOnboarding from "@/pages/PlannerOnboarding";

export default function PlannerProtectedRoute() {
  const [state, setState] = useState("loading");
  const [reason, setReason] = useState("");
  const location = useLocation();

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const authed = await base44.auth.isAuthenticated();
        if (!authed) {
          if (!cancelled) setState("unauthenticated");
          return;
        }
        const res = await base44.functions.invoke("checkEntitlement", {});
        if (!cancelled) {
          if (!res.data?.hasAccess) { setReason(res.data?.reason || "no_access"); setState("denied"); return; }
          // Skip onboarding for admins or if already onboarded
          if (res.data?.reason === "admin") { setState("ok"); return; }
          const custom = await base44.entities.UserCustomization.list();
          if (!cancelled) setState(custom && custom.length > 0 ? "ok" : "onboarding");
        }
      } catch {
        if (!cancelled) { setReason("error"); setState("denied"); }
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (state === "loading") {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-pink-50">
        <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
      </div>
    );
  }

  if (state === "unauthenticated") {
    const returnTo = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?returnTo=${returnTo}`} replace />;
  }

  if (state === "onboarding") {
    return <PlannerOnboarding onDone={() => setState("ok")} />;
  }

  if (state === "denied") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-pink-50 px-4">
        <div className="max-w-md w-full glass rounded-3xl p-10 text-center">
          <div className="mx-auto w-16 h-16 rounded-3xl bg-gradient-to-br from-pink-500 to-fuchsia-500 grid place-items-center text-white shadow-lg mb-4">
            <Lock size={28} />
          </div>
          <h1 className="font-display text-2xl font-bold text-plum-900">Access Required</h1>
          <p className="mt-3 text-plum-600">
            {reason === "no_purchase"
              ? "We couldn't find an active purchase for this email. Please make sure you're using the email associated with your purchase, or contact support."
              : "Something went wrong checking your access. Please try again or contact support."}
          </p>
          <div className="mt-6 flex flex-wrap gap-3 justify-center">
            <a href={plannerConfig.supportUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-white bg-gradient-to-r from-pink-500 to-fuchsia-500 shadow-md hover:scale-105 transition-transform">
              <LifeBuoy size={18} /> Contact Support
            </a>
          </div>
        </div>
      </div>
    );
  }

  return <Outlet />;
}