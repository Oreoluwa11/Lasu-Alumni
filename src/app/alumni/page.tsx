import Link from "next/link";
import ProtectedRoute from "@/components/auth/protected-route";

export default function AlumniDirectoryPage() {
  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-slate-950 text-slate-100 px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-slate-950/20 backdrop-blur-xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-semibold">Alumni directory</h1>
              <p className="mt-2 text-slate-400">Search alumni by faculty, department, year, industry, and location.</p>
            </div>
            <div className="grid w-full gap-3 sm:grid-cols-2 md:w-auto md:grid-cols-1 lg:grid-cols-2">
              <input type="search" placeholder="Search alumni" className="rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-500" />
              <button className="rounded-2xl bg-sky-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-sky-400">
                Filter
              </button>
            </div>
          </div>
        </section>
        <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-slate-950/20 backdrop-blur-xl">
              <div className="flex flex-wrap gap-3">
                {['Faculty of Arts', 'Faculty of Science', 'Engineering', 'Law', 'Management'].map((filter) => (
                  <span key={filter} className="rounded-full border border-slate-800 bg-slate-950/90 px-4 py-2 text-sm text-slate-300">
                    {filter}
                  </span>
                ))}
              </div>
            </div>
            <div className="grid gap-4">
              {[
                { id: "mentor-1", name: "Aisha Bello" },
                { id: "mentor-2", name: "David Okoro" },
                { id: "mentor-3", name: "Chidera Nwafor" },
                { id: "mentor-4", name: "Samuel Taiwo" },
              ].map((mentor, index) => (
                <Link key={mentor.id} href={`/alumni/${index + 1}`} className="block rounded-3xl border border-slate-800 bg-slate-950/90 p-6 transition hover:border-sky-500">
                  <div className="flex items-center gap-5">
                    <div className="h-20 w-20 rounded-3xl bg-slate-800" />
                    <div>
                      <h2 className="text-xl font-semibold">{mentor.name}</h2>
                      <p className="mt-1 text-slate-400">Product Designer · Creative Labs</p>
                    </div>
                  </div>
                  <div className="mt-5 grid gap-2 text-sm text-slate-400 sm:grid-cols-2">
                    <span>Graduation year: 2023</span>
                    <span>Location: Lagos</span>
                    <span>Faculty: Arts</span>
                    <span>Industry: Design</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
          <aside className="rounded-3xl border border-slate-800 bg-slate-900/80 p-8 shadow-2xl shadow-slate-950/20 backdrop-blur-xl">
            <h2 className="text-xl font-semibold">Refine search</h2>
            <div className="mt-6 space-y-4 text-sm text-slate-300">
              <div>
                <p className="font-semibold text-slate-200">Faculty</p>
                <select className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none">
                  <option>All faculties</option>
                </select>
              </div>
              <div>
                <p className="font-semibold text-slate-200">Graduation year</p>
                <select className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none">
                  <option>All years</option>
                </select>
              </div>
              <div>
                <p className="font-semibold text-slate-200">Industry</p>
                <select className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none">
                  <option>All industries</option>
                </select>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </main>
    </ProtectedRoute>
  );
}
