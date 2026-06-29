import Link from "next/link";
import LoginForm from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4 py-6 sm:px-6 sm:py-10">
      <div className="w-full max-w-md rounded-3xl border border-slate-800 bg-slate-900/90 p-8 sm:p-10 shadow-2xl shadow-slate-950/20">
        <div className="space-y-6">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-sky-600">Login</p>
            <h1 className="mt-4 text-3xl font-semibold text-slate-950">Welcome back</h1>
            <p className="mt-2 text-slate-500">Sign in to continue to LASU Alumni Connect.</p>
          </div>
          <LoginForm />
          <p className="text-center text-sm text-slate-400">
            New to LASU Alumni Connect?{' '}
            <Link href="/auth/signup" className="text-sky-400 hover:text-sky-300">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
