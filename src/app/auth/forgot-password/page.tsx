import Link from "next/link";
import ForgotPasswordForm from "@/components/auth/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950 flex items-center justify-center px-4 py-6 sm:px-6 sm:py-10">
      <div className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-8 sm:p-10 shadow-xl shadow-slate-200/50">
        <div className="space-y-6">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-sky-600">Reset password</p>
            <h1 className="mt-4 text-3xl font-semibold text-slate-950">Forgot your password?</h1>
            <p className="mt-2 text-slate-500">Enter your email and we’ll send a reset link.</p>
          </div>
          <ForgotPasswordForm />
          <p className="text-center text-sm text-slate-400">
            Remembered your password?{' '}
            <Link href="/auth/login" className="text-sky-600 hover:text-sky-700">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
