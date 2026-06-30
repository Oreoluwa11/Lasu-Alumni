'use client';

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ProtectedRoute from "@/components/auth/protected-route";
import { useAuth } from "@/components/auth/auth-provider";
import { createClient } from "@/lib/supabase/client";

type PersonStub = {
  id: string;
  fullName: string;
  profileImage?: string;
  department: string;
  faculty: string;
  graduationYear: number;
};

type Request = {
  id: string;
  studentId: string;
  alumniId: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
  sender: PersonStub;
  recipient: PersonStub;
};

type RawPerson = {
  id: string;
  full_name: string | null;
  profile_image: string | null;
  department: string | null;
  faculty: string | null;
  graduation_year: number | null;
} | null;

type RawRow = {
  id: string;
  student_id: string;
  alumni_id: string;
  status: "pending" | "accepted" | "rejected";
  created_at: string;
  sender: RawPerson;
  recipient: RawPerson;
};

function mapPerson(p: RawPerson, fallbackId: string): PersonStub {
  return {
    id: p?.id ?? fallbackId,
    fullName: p?.full_name ?? "Unknown",
    profileImage: p?.profile_image ?? undefined,
    department: p?.department ?? "",
    faculty: p?.faculty ?? "",
    graduationYear: p?.graduation_year ?? 0,
  };
}

function Avatar({ name, image }: { name: string; image?: string }) {
  const initials = name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  return (
    <div className="relative flex-shrink-0 overflow-hidden rounded-2xl border border-slate-700 bg-slate-800" style={{ width: 48, height: 48 }}>
      {image ? (
        <Image src={image} alt={name} fill className="object-cover" unoptimized />
      ) : (
        <span className="flex h-full w-full items-center justify-center text-sm font-semibold text-slate-400">
          {initials}
        </span>
      )}
    </div>
  );
}

const statusBadge: Record<string, string> = {
  pending: "bg-amber-500/20 text-amber-400",
  accepted: "bg-emerald-500/20 text-emerald-400",
  rejected: "bg-rose-500/20 text-rose-400",
};

export default function MentorshipPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    const supabase = createClient();

    supabase
      .from("mentorship_requests")
      .select(
        `id, student_id, alumni_id, status, created_at,
         sender:profiles!student_id(id, full_name, profile_image, department, faculty, graduation_year),
         recipient:profiles!alumni_id(id, full_name, profile_image, department, faculty, graduation_year)`
      )
      .or(`student_id.eq.${user.id},alumni_id.eq.${user.id}`)
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (data) {
          setRequests(
            (data as unknown as RawRow[]).map((r) => ({
              id: r.id,
              studentId: r.student_id,
              alumniId: r.alumni_id,
              status: r.status,
              createdAt: r.created_at,
              sender: mapPerson(r.sender, r.student_id),
              recipient: mapPerson(r.recipient, r.alumni_id),
            }))
          );
        }
        if (error) console.error("mentorship fetch:", error.message);
        setLoading(false);
      });
  }, [user]);

  const handleAccept = async (req: Request) => {
    if (!user) return;
    setActionId(req.id);
    const supabase = createClient();

    await supabase.from("mentorship_requests").update({ status: "accepted" }).eq("id", req.id);

    const { data: conv } = await supabase
      .from("conversations")
      .upsert(
        { student_id: req.studentId, alumni_id: req.alumniId, mentorship_request_id: req.id },
        { onConflict: "student_id,alumni_id" }
      )
      .select("id")
      .single();

    setRequests((prev) => prev.map((r) => (r.id === req.id ? { ...r, status: "accepted" } : r)));
    setActionId(null);
    if (conv) router.push(`/chat/${conv.id}`);
  };

  const handleReject = async (reqId: string) => {
    setActionId(reqId);
    const supabase = createClient();
    await supabase.from("mentorship_requests").update({ status: "rejected" }).eq("id", reqId);
    setRequests((prev) => prev.map((r) => (r.id === reqId ? { ...r, status: "rejected" } : r)));
    setActionId(null);
  };

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-slate-950 text-slate-100 px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
        <div className="mx-auto max-w-4xl space-y-6">
          <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/20 backdrop-blur-xl sm:p-8">
            <h1 className="text-2xl font-semibold sm:text-3xl">Mentorship requests</h1>
            <p className="mt-2 text-sm text-slate-400">
              View and manage all your mentorship requests.
            </p>
          </section>

          {loading && (
            <p className="py-16 text-center text-sm text-slate-500">Loading…</p>
          )}

          {!loading && requests.length === 0 && (
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-10 text-center">
              <p className="text-slate-400">No mentorship requests yet.</p>
              <Link
                href="/alumni"
                className="mt-4 inline-block rounded-2xl bg-sky-500 px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
              >
                Browse profiles
              </Link>
            </div>
          )}

          <div className="space-y-4">
            {requests.map((req) => {
              const isRecipient = user?.id === req.alumniId;
              const otherPerson = isRecipient ? req.sender : req.recipient;

              return (
                <div
                  key={req.id}
                  className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 shadow-xl shadow-slate-950/10 backdrop-blur-xl sm:p-6"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar name={otherPerson.fullName} image={otherPerson.profileImage} />
                      <div>
                        <div className="flex items-center gap-2">
                          <Link
                            href={`/alumni/${otherPerson.id}`}
                            className="font-semibold transition hover:text-sky-400"
                          >
                            {otherPerson.fullName}
                          </Link>
                          <span className="text-xs text-slate-500">
                            {isRecipient ? "sent you a request" : "you sent a request"}
                          </span>
                        </div>
                        <div className="mt-0.5 flex flex-wrap gap-2 text-xs text-slate-500">
                          {otherPerson.department && <span>{otherPerson.department}</span>}
                          {otherPerson.faculty && <span>· {otherPerson.faculty}</span>}
                          {otherPerson.graduationYear > 0 && <span>· Class of {otherPerson.graduationYear}</span>}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${statusBadge[req.status]}`}>
                        {req.status}
                      </span>

                      {isRecipient && req.status === "pending" && (
                        <>
                          <button
                            type="button"
                            disabled={actionId === req.id}
                            onClick={() => handleAccept(req)}
                            className="rounded-2xl bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:opacity-50"
                          >
                            {actionId === req.id ? "…" : "Accept"}
                          </button>
                          <button
                            type="button"
                            disabled={actionId === req.id}
                            onClick={() => handleReject(req.id)}
                            className="rounded-2xl border border-slate-700 px-4 py-2 text-sm text-slate-400 transition hover:border-slate-500 hover:text-slate-200 disabled:opacity-50"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  <p className="mt-3 text-xs text-slate-600">
                    {new Date(req.createdAt).toLocaleDateString("en-NG", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
