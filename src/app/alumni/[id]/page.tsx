import Image from "next/image";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import RequestMentorshipButton from "@/components/mentorship/request-button";

export default async function AlumniProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (!profile) notFound();

  const initials = (profile.full_name ?? "")
    .split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/20 backdrop-blur-xl sm:p-8">
          <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
            <div className="space-y-6">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-center gap-5">
                  <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-3xl border border-slate-700 bg-slate-800">
                    {profile.profile_image ? (
                      <Image
                        src={profile.profile_image}
                        alt={profile.full_name}
                        fill
                        className="object-cover"
                        unoptimized
                      />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center text-2xl font-semibold text-slate-400">
                        {initials}
                      </span>
                    )}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h1 className="text-2xl font-semibold sm:text-3xl">
                        {profile.full_name}
                      </h1>
                      {(profile.status || profile.role) && (
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            (profile.status ?? profile.role).toLowerCase() === "alumni"
                              ? "bg-sky-500/20 text-sky-400"
                              : "bg-emerald-500/20 text-emerald-400"
                          }`}
                        >
                          {profile.status ?? (profile.role === "alumni" ? "Alumni" : "Student")}
                        </span>
                      )}
                    </div>
                    {(profile.job_title || profile.company) && (
                      <p className="mt-1 text-slate-400">
                        {[profile.job_title, profile.company]
                          .filter(Boolean)
                          .join(" · ")}
                      </p>
                    )}
                    {profile.location && (
                      <p className="mt-1 text-sm text-slate-500">
                        {profile.location}
                      </p>
                    )}
                  </div>
                </div>
                <div className="sm:flex-shrink-0 sm:w-52">
                  <RequestMentorshipButton recipientId={id} />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                {profile.faculty && (
                  <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-4">
                    <p className="text-xs uppercase tracking-wider text-slate-500">
                      Faculty
                    </p>
                    <p className="mt-2 text-sm text-slate-200">
                      {profile.faculty}
                    </p>
                  </div>
                )}
                {profile.department && (
                  <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-4">
                    <p className="text-xs uppercase tracking-wider text-slate-500">
                      Department
                    </p>
                    <p className="mt-2 text-sm text-slate-200">
                      {profile.department}
                    </p>
                  </div>
                )}
                {profile.graduation_year && (
                  <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-4">
                    <p className="text-xs uppercase tracking-wider text-slate-500">
                      Class of
                    </p>
                    <p className="mt-2 text-sm text-slate-200">
                      {profile.graduation_year}
                    </p>
                  </div>
                )}
              </div>

              {profile.bio && (
                <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-6">
                  <h2 className="font-semibold">About</h2>
                  <p className="mt-3 text-sm leading-relaxed text-slate-400">
                    {profile.bio}
                  </p>
                </div>
              )}

              {Array.isArray(profile.skills) && profile.skills.length > 0 && (
                <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-6">
                  <h2 className="font-semibold">Skills & expertise</h2>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {profile.skills.map((skill: string) => (
                      <span
                        key={skill}
                        className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-sm text-slate-300"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <aside className="space-y-4">
              {(profile.company || profile.job_title) && (
                <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-6">
                  {profile.company && (
                    <>
                      <p className="text-xs uppercase tracking-wider text-slate-500">
                        Company
                      </p>
                      <p className="mt-2 text-slate-200">{profile.company}</p>
                    </>
                  )}
                  {profile.job_title && (
                    <>
                      <p className="mt-4 text-xs uppercase tracking-wider text-slate-500">
                        Title
                      </p>
                      <p className="mt-2 text-slate-200">{profile.job_title}</p>
                    </>
                  )}
                </div>
              )}
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}
