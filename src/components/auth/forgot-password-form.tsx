'use client';

import { useActionState } from "react";
import { resetPassword } from "@/app/auth/actions";

export default function ForgotPasswordForm() {
  const [state, formAction, isPending] = useActionState(resetPassword, {});

  return (
    <form action={formAction} className="space-y-5">
      <label className="block">
        <span className="text-sm text-slate-300">Email</span>
        <input
          type="email"
          name="email"
          className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-950 outline-none transition focus:border-sky-500"
          placeholder="you@example.com"
          required
        />
      </label>
      {state.error && <p className="text-sm text-rose-500">{state.error}</p>}
      {state.message && <p className="text-sm text-emerald-600">{state.message}</p>}
      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-2xl bg-sky-600 px-5 py-3 font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Sending..." : "Send reset link"}
      </button>
    </form>
  );
}
