'use client';

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/auth/protected-route";
import AlumniCard from "@/components/alumni/alumni-card";
import { useAuth } from "@/components/auth/auth-provider";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@/types";
import { MdOutlineArrowRightAlt } from "react-icons/md";

type NewsItem = {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
};

function profileCompletion(user: User): number {
  const checks = [
    !!user.fullName,
    !!user.email,
    !!user.faculty,
    !!user.department,
    !!user.location,
    !!user.bio,
    user.skills.length > 0,
    !!user.profileImage,
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
}

function mapProfileRow(row: Record<string, unknown>): User {
  return {
    id: row.id as string,
    fullName: (row.full_name as string) ?? "",
    email: (row.email as string) ?? "",
    role: (row.role as "student" | "alumni") ?? "student",
    status: (row.status as string | null) ?? undefined,
    faculty: (row.faculty as string) ?? "",
    department: (row.department as string) ?? "",
    graduationYear: (row.graduation_year as number) ?? 0,
    company: (row.company as string | null) ?? undefined,
    jobTitle: (row.job_title as string | null) ?? undefined,
    location: (row.location as string) ?? "",
    bio: (row.bio as string) ?? "",
    skills: (row.skills as string[]) ?? [],
    profileImage: (row.profile_image as string | null) ?? undefined,
  };
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [pendingCount, setPendingCount] = useState(0);
  const [acceptedCount, setAcceptedCount] = useState(0);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [mentors, setMentors] = useState<User[]>([]);

  useEffect(() => {
    if (!user) return;
    const supabase = createClient();

    const fetchMentorshipCounts = async () => {
      const statuses: Array<"pending" | "accepted"> = ["pending", "accepted"];
      const counts = await Promise.all(
        statuses.map(async (status) => {
          const { count, error } = await supabase
            .from("mentorship_requests")
            .select("id", { count: "exact" })
            .or(`student_id.eq.${user.id},alumni_id.eq.${user.id}`)
            .eq("status", status);

          if (error) {
            console.error(`Failed to fetch ${status} mentorship count:`, error.message);
            return 0;
          }

          return count ?? 0;
        })
      );

      setPendingCount(counts[0]);
      setAcceptedCount(counts[1]);
    };

    fetchMentorshipCounts();
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const supabase = createClient();
    const mentorFields =
      "id, full_name, email, role, status, faculty, department, graduation_year, company, job_title, location, bio, skills, profile_image";

    supabase
      .from("profiles")
      .select(mentorFields)
      .neq("id", user.id)
      .order("full_name")
      .limit(5)
      .then(({ data, error }) => {
        if (error) {
          console.error("Failed to load suggested mentors:", error.message);
          return;
        }
        setMentors((data ?? []).map(mapProfileRow));
      });

    const newsSupabase = createClient();
    newsSupabase
      .from("news")
      .select("id,title,slug,summary")
      .order("published_at", { ascending: false })
      .limit(3)
      .then(({ data }) => setNews((data as NewsItem[]) ?? []));
  }, [user]);

  const completion = useMemo(() => (user ? profileCompletion(user) : 0), [user]);

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-white text-slate-100 px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="rounded-3xl border border-slate-800 bg-slate-950/90 p-8 shadow-2xl backdrop-blur-xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.32em] text-sky-400">
                Welcome back
              </p>
              <h1 className="mt-3 text-xl md:text-3xl font-semibold">Hello, {user?.fullName}</h1>
              <p className="mt-2 md:text-base text-sm max-w-2xl text-slate-400">
                Your mentorship requests, suggested alumni mentors, and latest news are here.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:w-auto">
              <Link href="/profile">
                <div className="rounded-3xl bg-slate-900/80 p-3 md:p-5 text-center border border-slate-800">
                  <p className="text-sm text-slate-500">Profile Completion</p>
                  <p className="mt-2 text-xl md:text-3xl font-semibold text-sky-400">{completion}%</p>
                </div>
              </Link>
              <Link href="/dashboard/mentorship">
                <div className="rounded-3xl bg-slate-900/80 p-5 text-center border border-slate-800">
                  <p className="text-sm text-slate-500">Mentorship Requests</p>
                  <p className="mt-2 text-xl md:text-3xl font-semibold text-emerald-400">{pendingCount} pending</p>
                </div>
              </Link>
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-8 shadow-2xl backdrop-blur-xl">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold">Suggested mentors</h2>
                <p className="mt-2 text-slate-400">Alumni who match your career interests.</p>
              </div>
              <Link href="/alumni" className="text-sky-400 hover:text-sky-300 flex items-center gap-2">
                View all <MdOutlineArrowRightAlt />
              </Link>
            </div>
            <div className="mt-8 grid gap-4">
              {mentors.length === 0 ? (
                <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 text-slate-400">
                  No mentor suggestions available yet.
                </div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  {mentors.map((mentor) => (
                    <AlumniCard key={mentor.id} profile={mentor} />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-8 shadow-2xl backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Recent news</h2>
                <Link href="/news" className="text-sm text-sky-400 hover:text-sky-300 flex items-center gap-2">
                  View all <MdOutlineArrowRightAlt />
                </Link>
              </div>
              <ul className="mt-6 space-y-4">
                {news.length === 0 && (
                  <li className="text-sm text-slate-500">No news yet.</li>
                )}
                {news.map((article) => (
                  <li key={article.id}>
                    <Link
                      href={`/news/${article.slug}`}
                      className="block rounded-3xl bg-slate-900/80 p-4 border border-slate-800 transition hover:border-sky-500"
                    >
                      <p className="font-semibold">{article.title}</p>
                      {article.summary && (
                        <p className="mt-2 text-sm text-slate-400 line-clamp-2">{article.summary}</p>
                      )}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <Link href="/dashboard/mentorship" className="block rounded-3xl border border-slate-800 bg-slate-950/90 p-8 shadow-2xl backdrop-blur-xl transition hover:border-sky-500 hover:bg-slate-900/95">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h2 className="text-xl font-semibold">Mentorship updates</h2>
                  <p className="mt-4 text-slate-400">
                    You have {acceptedCount} accepted request{acceptedCount === 1 ? "" : "s"} and {pendingCount} pending request{pendingCount === 1 ? "" : "s"}.
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sky-400 hover:text-sky-300">
                  <p>View all</p>
                  <MdOutlineArrowRightAlt className="text-sky-400" size={24} />
                </div>
              </div>
            </Link>
          </div>
        </section>
      </div>
    </main>
    </ProtectedRoute>
  );
}
