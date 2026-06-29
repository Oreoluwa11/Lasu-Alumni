import { notFound } from "next/navigation";

interface PageParams {
  params: {
    id: string;
  };
}

export default function AlumniProfilePage({ params }: Readonly<PageParams>) {
  const alumniId = params.id;
  if (!alumniId) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-6xl space-y-10">
        <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-slate-950/20 backdrop-blur-xl">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_0.6fr]">
            <div className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="h-28 w-28 rounded-3xl bg-slate-800" />
                <div>
                  <p className="text-sm uppercase tracking-[0.35em] text-sky-400">Featured mentor</p>
                  <h1 className="mt-3 text-4xl font-semibold">Alumni Mentor {alumniId}</h1>
                  <p className="mt-2 text-slate-400">Lead Product Designer · Creative Labs</p>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-6">
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Department</p>
                  <p className="mt-3 text-slate-100">Architecture</p>
                </div>
                <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-6">
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Graduation year</p>
                  <p className="mt-3 text-slate-100">2018</p>
                </div>
              </div>
              <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-6">
                <h2 className="text-xl font-semibold">About</h2>
                <p className="mt-4 text-slate-400">
                  Experienced product designer with a passion for mentoring students in design strategy, user experience, and creative leadership.
                </p>
              </div>
              <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-6">
                <h2 className="text-xl font-semibold">Skills & expertise</h2>
                <div className="mt-4 flex flex-wrap gap-3">
                  {['Design Thinking', 'UX Research', 'Product Strategy', 'Team Leadership'].map((skill) => (
                    <span key={skill} className="rounded-full bg-slate-900 px-4 py-2 text-sm text-slate-300">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <aside className="space-y-6">
              <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-6">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Company</p>
                <p className="mt-3 text-slate-100">Creative Labs</p>
                <p className="mt-6 text-sm uppercase tracking-[0.2em] text-slate-500">Title</p>
                <p className="mt-3 text-slate-100">Lead Product Designer</p>
              </div>
              <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-6 space-y-4">
                <button className="w-full rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-sky-400 ring-1 ring-slate-700 transition hover:bg-slate-900">
                  Contact mentor
                </button>
                <button className="w-full rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400">
                  Request mentorship
                </button>
              </div>
              <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-6">
                <h2 className="text-xl font-semibold">Quick info</h2>
                <ul className="mt-4 space-y-3 text-slate-400 text-sm">
                  <li>Location: Lagos</li>
                  <li>Industry: Design</li>
                  <li>Alumni since 2018</li>
                </ul>
              </div>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}
