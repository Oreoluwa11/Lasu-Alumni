'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";

export default function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = (formData.get("email") as string) ?? "";
    const password = (formData.get("password") as string) ?? "";

    setError(null);
    setIsPending(true);

    const success = await login(email, password);
    setIsPending(false);

    if (success) {
      router.push("/dashboard");
      return;
    }

    setError("Unable to sign in. Please check your email and password.");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
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
      {error && <p className="text-sm text-rose-400">{error}</p>}
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
