"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaWhatsapp } from "react-icons/fa";
import { FiArrowLeft, FiLock, FiMail } from "react-icons/fi";
import { supabase } from "@/lib/supabase";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function checkExistingSession() {
      const { data } = await supabase.auth.getSession();
      const session = data.session;

      if (!mounted) return;

      if (!session) {
        setChecking(false);
        return;
      }

      const { data: adminRow } = await supabase
        .from("admin_users")
        .select("user_id")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (!mounted) return;

      if (adminRow) {
        router.replace("/admin");
        return;
      }

      await supabase.auth.signOut();
      setChecking(false);
    }

    checkExistingSession();

    return () => {
      mounted = false;
    };
  }, [router]);

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (loginError) throw loginError;
      if (!data.user) throw new Error("Unable to sign in.");

      const { data: adminRow, error: adminError } = await supabase
        .from("admin_users")
        .select("user_id")
        .eq("user_id", data.user.id)
        .maybeSingle();

      if (adminError) throw adminError;

      if (!adminRow) {
        await supabase.auth.signOut();
        throw new Error("This account does not have administrator access.");
      }

      router.replace("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  }

  if (checking) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#17110C] px-5 text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-[#D6B36A] border-t-transparent" />
          <p className="text-sm text-white/60">Checking admin session…</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F4EEE5] text-[#211A13]">
      <div className="grid min-h-screen lg:grid-cols-[0.95fr_1.05fr]">
        <section className="hidden bg-[#1B140E] p-12 text-white lg:flex lg:flex-col lg:justify-between">
          <div>
            <a
              href="/"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#D6B36A]"
            >
              <FiArrowLeft /> Public website
            </a>
          </div>

          <div className="max-w-xl">
            <p className="text-[10px] font-semibold uppercase tracking-[0.42em] text-[#D6B36A]">
              MMADUABUCHI MOTORS
            </p>
            <h1 className="mt-5 font-serif text-6xl leading-[0.95]">
              Inventory control,
              <br />
              without touching code.
            </h1>
            <p className="mt-6 max-w-md text-sm leading-7 text-white/55">
              Add vehicles, upload showroom media, update availability, mark cars sold and keep the public inventory current.
            </p>
          </div>

          <div className="text-xs text-white/40">Cotonou · Lagos · Onitsha</div>
        </section>

        <section className="flex items-center justify-center px-5 py-12 sm:px-8">
          <div className="w-full max-w-md">
            <a
              href="/"
              className="mb-10 inline-flex items-center gap-2 text-xs font-semibold text-[#856022] lg:hidden"
            >
              <FiArrowLeft /> Back to website
            </a>

            <div className="mb-9">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#D6B36A]/20 text-[#93671C]">
                <FiLock />
              </div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.38em] text-[#A6772B]">
                Secure access
              </p>
              <h2 className="mt-3 font-serif text-4xl sm:text-5xl">Admin Login</h2>
              <p className="mt-3 text-sm leading-6 text-[#796B59]">
                Sign in with the administrator account created for MMADUABUCHI MOTORS.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-[#685A48]">
                  Email
                </span>
                <div className="flex items-center gap-3 border border-[#B69863]/35 bg-white px-4">
                  <FiMail className="shrink-0 text-[#A6772B]" />
                  <input
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    className="min-h-14 w-full bg-transparent text-base outline-none placeholder:text-[#AA9D8B]"
                    placeholder="admin@example.com"
                  />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.16em] text-[#685A48]">
                  Password
                </span>
                <div className="flex items-center gap-3 border border-[#B69863]/35 bg-white px-4">
                  <FiLock className="shrink-0 text-[#A6772B]" />
                  <input
                    type="password"
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    className="min-h-14 w-full bg-transparent text-base outline-none placeholder:text-[#AA9D8B]"
                    placeholder="••••••••"
                  />
                </div>
              </label>

              {error && (
                <div className="border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex min-h-14 w-full items-center justify-center bg-gradient-to-r from-[#9C6A1D] to-[#D3A94D] px-6 text-sm font-bold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in…" : "Sign in to dashboard"}
              </button>
            </form>

            <div className="mt-8 border-t border-[#B69863]/25 pt-6 text-sm text-[#796B59]">
              Need to reach the business instead?{" "}
              <a
                href="https://wa.me/22961565488"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 font-semibold text-[#7C591E]"
              >
                <FaWhatsapp className="text-[#25D366]" /> WhatsApp
              </a>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
