'use client';

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/app/auth/actions";
import { useAuth } from "@/components/auth/auth-provider";

export default function LoginForm() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [state, formAction, isPending] = useActionState(login, {});

  useEffect(() => {
    if (!loading && user) router.replace("/dashboard");
  }, [user, loading, router]);

  useEffect(() => {
    if (state.message === "success") {
      window.location.replace("/dashboard");
    }
  }, [state.message]);

  return (
    <form action={formAction} className="space-y-5">
      <label className="block">
        <span className="text-sm text-slate-300">Email</span>
        <input
          type="email"
          name="email"
          className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-500"
          placeholder="you@example.com"
          required
        />
      </label>
      <label className="block">
        <span className="text-sm text-slate-300">Password</span>
        <input
          type="password"
          name="password"
          className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-500"
          placeholder="Your password"
          required
        />
      </label>
      {state.error && <p className="text-sm text-rose-400">{state.error}</p>}
      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-2xl bg-sky-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
