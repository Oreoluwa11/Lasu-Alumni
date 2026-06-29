'use client';

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signup } from "@/app/auth/actions";

export default function SignupForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(signup, {});
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [faculty, setFaculty] = useState("");
  const [department, setDepartment] = useState("");
  const [graduationYear, setGraduationYear] = useState(2026);

  useEffect(() => {
    if (state.message === "success") {
      router.push("/dashboard");
    }
  }, [router, state.message]);

  return (
    <form action={formAction} className="space-y-5">
      <label className="block">
        <span className="text-sm text-slate-300">Full name</span>
        <input
          type="text"
          name="fullName"
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-500"
          placeholder="Your full name"
          required
        />
      </label>
      <label className="block">
        <span className="text-sm text-slate-300">Email</span>
        <input
          type="email"
          name="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
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
          placeholder="Create a password"
          minLength={8}
          required
        />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm text-slate-300">Faculty</span>
          <input
            type="text"
            name="faculty"
            value={faculty}
            onChange={(event) => setFaculty(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-500"
            placeholder="Faculty"
          />
        </label>
        <label className="block">
          <span className="text-sm text-slate-300">Department</span>
          <input
            type="text"
            name="department"
            value={department}
            onChange={(event) => setDepartment(event.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-500"
            placeholder="Department"
          />
        </label>
      </div>
      <label className="block">
        <span className="text-sm text-slate-300">Graduation year</span>
        <input
          type="number"
          name="graduationYear"
          value={graduationYear}
          onChange={(event) => setGraduationYear(Number(event.target.value))}
          className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-500"
        />
      </label>
      {state.error && <p className="text-sm text-rose-400">{state.error}</p>}
      {state.message && <p className="text-sm text-emerald-400">{state.message}</p>}
      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-2xl bg-sky-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isPending ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
}
