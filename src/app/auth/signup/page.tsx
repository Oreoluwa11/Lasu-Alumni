"use client";
import Link from "next/link";
import SignupForm from "@/components/auth/signup-form";

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-[#242E58] text-slate-950 flex items-center justify-center px-4 py-6 sm:px-6 sm:py-10">
      <div className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-8 sm:p-10">
        <div className="space-y-6">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-sky-600">Create account</p>
            <h1 className="mt-4 text-3xl font-semibold text-slate-950">Join the mentorship network</h1>
            <p className="mt-2 text-slate-500">Sign up as a student to connect with alumni mentors.</p>
          </div>
          <SignupForm />
          <p className="text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-sky-600 hover:text-sky-700">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
