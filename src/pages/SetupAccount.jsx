import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Mail, Loader2, CheckCircle, Sparkles } from "lucide-react";
import { plannerConfig } from "@/data/plannerConfig";

export default function SetupAccount() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get("email");
    if (emailParam) {
      setEmail(emailParam);
      sendSetupLink(emailParam);
    }
  }, []);

  const sendSetupLink = async (emailAddress) => {
    const target = emailAddress || email;
    if (!target) return;
    setLoading(true);
    try {
      await base44.auth.resetPasswordRequest(target);
    } catch {
      // Always show generic success — API hides whether email exists
    }
    setSent(true);
    setLoading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendSetupLink();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50 px-4 py-10">
      <div className="max-w-md w-full glass rounded-3xl p-10 text-center">
        <div className="mx-auto w-16 h-16 rounded-3xl bg-gradient-to-br from-pink-500 to-fuchsia-500 grid place-items-center text-white shadow-lg mb-4">
          <Sparkles size={28} />
        </div>
        <h1 className="font-display text-2xl font-bold text-plum-900">Set Up Your Account</h1>
        <p className="mt-2 text-plum-600">
          {sent
            ? `We've sent a password setup link to ${email}. Check your inbox (and spam folder) to finish setting up your account.`
            : "Enter your email and we'll send you a link to set your password."}
        </p>

        {sent ? (
          <div className="mt-6 space-y-3">
            <div className="flex items-center justify-center gap-2 text-green-600">
              <CheckCircle size={20} />
              <span className="text-sm font-medium">Setup link sent</span>
            </div>
            <button
              onClick={() => sendSetupLink(email)}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full font-semibold text-plum-900 bg-white border border-pink-200 hover:bg-pink-50 transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 size={16} className="animate-spin" /> : <Mail size={16} />}
              Resend link
            </button>
            <div>
              <Link to="/login" className="text-sm text-primary font-medium hover:underline">
                Back to login
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" aria-hidden="true" />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 pl-10 pr-4 rounded-xl border border-pink-200 bg-white/80 focus:outline-none focus:ring-2 focus:ring-primary"
                required
                autoFocus
              />
            </div>
            <button
              type="submit"
              disabled={loading || !email}
              className="w-full h-12 rounded-full font-semibold text-white bg-gradient-to-r from-pink-500 to-fuchsia-500 shadow-lg hover:scale-[1.02] transition-transform disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin inline" />
                  Sending link...
                </>
              ) : (
                "Send setup link"
              )}
            </button>
          </form>
        )}

        <p className="mt-6 text-xs text-plum-400">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}