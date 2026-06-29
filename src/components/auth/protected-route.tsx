'use client';

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/auth/login");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-6">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 text-center shadow-2xl shadow-slate-950/20">
          <p className="text-slate-400">Checking session...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
