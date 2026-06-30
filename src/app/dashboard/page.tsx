'use client';

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ProtectedRoute from "@/components/auth/protected-route";
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

export default function DashboardPage() {
  const { user } = useAuth();
  const [pendingCount, setPendingCount] = useState(0);
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    if (!user) return;
    const supabase = createClient();
    const isAlumni = user.role === "alumni" || user.status?.toLowerCase() === "alumni";
    const column = isAlumni ? "alumni_id" : "student_id";
    supabase
      .from("mentorship_requests")
      .select("id", { count: "exact" })
      .eq(column, user.id)
      .eq("status", "pending")
      .then(({ count }) => setPendingCount(count ?? 0));
  }, [user]);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("news")
      .select("id,title,slug,summary")
      .order("published_at", { ascending: false })
      .limit(3)
      .then(({ data }) => setNews((data as NewsItem[]) ?? []));
  }, []);

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
              <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
                <p className="font-semibold">Aisha Bello</p>
                <p className="mt-1 text-sm text-slate-400">Product Manager · Tech Spring</p>
              </div>
              <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5">
                <p className="font-semibold">David Okoro</p>
                <p className="mt-1 text-sm text-slate-400">Data Analyst · Future Insights</p>
              </div>
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
            <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-8 shadow-2xl backdrop-blur-xl">
              <h2 className="text-xl font-semibold">Mentorship updates</h2>
              <p className="mt-4 text-slate-400">
                You have 1 accepted request and 1 pending request awaiting a response.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
    </ProtectedRoute>
  );
}
