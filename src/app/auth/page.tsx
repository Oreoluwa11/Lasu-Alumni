import Link from "next/link";

export default function AuthPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
      <div className="max-w-3xl w-full rounded-3xl border border-slate-800 bg-slate-900/80 px-4 py-8 shadow-2xl backdrop-blur-xl sm:px-6 sm:py-10">
        <div className="space-y-6 text-center">
          <p className="text-sky-400 uppercase tracking-[0.35em] text-sm font-semibold">
            LASU Alumni Connect
          </p>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
            Connect with alumni mentors and build your future.
          </h1>
          <p className="max-w-xl mx-auto text-slate-400">
            Sign in to explore mentorship, news, and your student profile.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <Link
              href="/auth/login"
              className="rounded-2xl bg-sky-500 px-5 py-4 text-white shadow-lg shadow-sky-500/20 transition hover:bg-sky-400"
            >
              Login
            </Link>
            <Link
              href="/auth/signup"
              className="rounded-2xl border border-slate-700 px-5 py-4 text-slate-100 transition hover:border-slate-500"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
