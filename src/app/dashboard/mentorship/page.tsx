import ProtectedRoute from "@/components/auth/protected-route";

export default function MentorshipPage() {
  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-slate-950 text-slate-100 px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
        <div className="mx-auto max-w-6xl space-y-8">
          <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-slate-950/20 backdrop-blur-xl">
            <h1 className="text-3xl font-semibold">Mentorship requests</h1>
            <p className="mt-2 text-slate-400">Track pending and accepted mentorship connections.</p>
            <div className="mt-8 space-y-4">
              <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-6">
                <p className="font-semibold">Aisha Bello</p>
                <p className="mt-2 text-slate-400">Pending request for career guidance in product management.</p>
              </div>
              <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-6">
                <p className="font-semibold">David Okoro</p>
                <p className="mt-2 text-slate-400">Accepted mentorship for data analytics.</p>
              </div>
            </div>
          </section>
        </div>
      </main>
    </ProtectedRoute>
  );
}
