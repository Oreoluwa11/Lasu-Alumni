'use client';

import { useEffect, useMemo, useState } from "react";
import ProtectedRoute from "@/components/auth/protected-route";
import AlumniCard from "@/components/alumni/alumni-card";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/auth-provider";
import type { User } from "@/types";

function mapRow(p: Record<string, unknown>): User {
  return {
    id: p.id as string,
    fullName: (p.full_name as string) ?? "",
    email: (p.email as string) ?? "",
    role: (p.role as "student" | "alumni") ?? "student",
    status: (p.status as string | null) ?? undefined,
    faculty: (p.faculty as string) ?? "",
    department: (p.department as string) ?? "",
    graduationYear: (p.graduation_year as number) ?? 0,
    company: (p.company as string | null) ?? undefined,
    jobTitle: (p.job_title as string | null) ?? undefined,
    location: (p.location as string) ?? "",
    bio: (p.bio as string) ?? "",
    skills: (p.skills as string[]) ?? [],
    profileImage: (p.profile_image as string | null) ?? undefined,
  };
}

const selectClass =
  "w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-500 text-sm";

export default function AlumniDirectoryPage() {
  const { user } = useAuth();
  const [profiles, setProfiles] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("");
  const [filterFaculty, setFilterFaculty] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [filterRole, setFilterRole] = useState("");

  useEffect(() => {
    if (!user) return;
    const supabase = createClient();
    supabase
      .from("profiles")
      .select("*")
      .order("full_name")
      .limit(10)
      .then(({ data, error }) => {
        if (error) {
          setFetchError(error.message);
        } else {
          setProfiles((data ?? []).map(mapRow));
        }
        setLoading(false);
      });
  }, [user]);

  const faculties = useMemo(
    () => [...new Set(profiles.map((p) => p.faculty).filter(Boolean))].sort(),
    [profiles]
  );
  const departments = useMemo(
    () =>
      [...new Set(profiles.map((p) => p.department).filter(Boolean))].sort(),
    [profiles]
  );
  const years = useMemo(
    () =>
      [
        ...new Set(
          profiles.map((p) => p.graduationYear).filter((y) => y > 0)
        ),
      ].sort((a, b) => b - a),
    [profiles]
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return profiles.filter((p) => {
      if (q) {
        const matchesName = p.fullName.toLowerCase().includes(q);
        const matchesFaculty = p.faculty.toLowerCase().includes(q);
        const matchesYear = String(p.graduationYear).includes(q);
        const matchesJobTitle = (p.jobTitle ?? "").toLowerCase().includes(q);
        if (!matchesName && !matchesFaculty && !matchesYear && !matchesJobTitle) return false;
      }
      if (filterRole && p.role !== filterRole) return false;
      if (filterFaculty && p.faculty !== filterFaculty) return false;
      if (filterDept && p.department !== filterDept) return false;
      if (filterYear && String(p.graduationYear) !== filterYear) return false;
      return true;
    });
  }, [profiles, search, filterRole, filterFaculty, filterDept, filterYear]);

  const hasFilters = filterRole || filterFaculty || filterDept || filterYear;

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-slate-950 text-slate-100 px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
        <div className="mx-auto max-w-7xl space-y-6">
          <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/20 backdrop-blur-xl sm:p-8">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-semibold sm:text-3xl">Directory</h1>
                <p className="mt-1 text-sm text-slate-400">
                  Connect with students and alumni across LASU.
                </p>
              </div>
              <input
                type="search"
                placeholder="Search by name, faculty, year, job title…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-500 md:max-w-xs"
              />
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-[1fr_260px]">
            <div>
              {loading && (
                <p className="py-16 text-center text-sm text-slate-500">
                  Loading…
                </p>
              )}
              {!loading && fetchError && (
                <div className="rounded-3xl border border-rose-500/30 bg-rose-500/10 p-6 text-sm text-rose-400">
                  <p className="font-semibold">Could not load profiles</p>
                  <p className="mt-1 text-rose-500">{fetchError}</p>
                </div>
              )}
              {!loading && !fetchError && filtered.length === 0 && (
                <p className="py-16 text-center text-sm text-slate-500">
                  {search || hasFilters ? "No profiles match your search." : "No profiles found."}
                </p>
              )}
              <div className="grid gap-4 sm:grid-cols-2">
                {filtered.map((profile) => (
                  <AlumniCard key={profile.id} profile={profile} />
                ))}
              </div>
            </div>

            <aside className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/20 backdrop-blur-xl h-fit">
              <h2 className="font-semibold">Filters</h2>
              <div className="mt-5 space-y-4">
                <div>
                  <label className="mb-1.5 block text-xs uppercase tracking-wider text-slate-400">
                    Role
                  </label>
                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className={selectClass}
                  >
                    <option value="">All roles</option>
                    <option value="student">Student</option>
                    <option value="alumni">Alumni</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs uppercase tracking-wider text-slate-400">
                    Faculty
                  </label>
                  <select
                    value={filterFaculty}
                    onChange={(e) => setFilterFaculty(e.target.value)}
                    className={selectClass}
                  >
                    <option value="">All faculties</option>
                    {faculties.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs uppercase tracking-wider text-slate-400">
                    Department
                  </label>
                  <select
                    value={filterDept}
                    onChange={(e) => setFilterDept(e.target.value)}
                    className={selectClass}
                  >
                    <option value="">All departments</option>
                    {departments.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs uppercase tracking-wider text-slate-400">
                    Graduation year
                  </label>
                  <select
                    value={filterYear}
                    onChange={(e) => setFilterYear(e.target.value)}
                    className={selectClass}
                  >
                    <option value="">All years</option>
                    {years.map((y) => (
                      <option key={y} value={String(y)}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
                {hasFilters && (
                  <button
                    type="button"
                    onClick={() => {
                      setFilterRole("");
                      setFilterFaculty("");
                      setFilterDept("");
                      setFilterYear("");
                    }}
                    className="w-full rounded-2xl border border-slate-700 px-4 py-2 text-sm text-slate-400 transition hover:border-slate-500 hover:text-slate-200"
                  >
                    Clear filters
                  </button>
                )}
              </div>
            </aside>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
