'use client';

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/auth-provider";

type RequestStatus = "idle" | "loading" | "pending" | "accepted" | "rejected" | "own";

interface Props {
  recipientId: string;
}

export default function RequestMentorshipButton({ recipientId }: Props) {
  const { user } = useAuth();
  const router = useRouter();
  const [status, setStatus] = useState<RequestStatus>("loading");
  const [submitting, setSubmitting] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [justSent, setJustSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    if (user.id === recipientId) { setStatus("own"); return; }

    const supabase = createClient();
    supabase
      .from("mentorship_requests")
      .select("status, id")
      .eq("student_id", user.id)
      .eq("alumni_id", recipientId)
      .maybeSingle()
      .then(async ({ data }) => {
        if (!data) { setStatus("idle"); return; }
        setStatus(data.status as RequestStatus);
        if (data.status === "accepted") {
          const { data: conv } = await supabase
            .from("conversations")
            .select("id")
            .or(`and(student_id.eq.${user.id},alumni_id.eq.${recipientId}),and(student_id.eq.${recipientId},alumni_id.eq.${user.id})`)
            .maybeSingle();
          if (conv) setConversationId(conv.id);
        }
      });
  }, [user, recipientId]);

  if (status === "own") {
    return null;
  }

  const handleRequest = async () => {
    if (!user) return;
    setSubmitting(true);
    setErrorMsg(null);
    const supabase = createClient();
    const { error } = await supabase
      .from("mentorship_requests")
      .insert({ student_id: user.id, alumni_id: recipientId });
    if (error) {
      setErrorMsg(error.message);
    } else {
      setStatus("pending");
      setJustSent(true);
      setTimeout(() => setJustSent(false), 3000);
    }
    setSubmitting(false);
  };

  if (status === "loading") {
    return (
      <div className="h-12 animate-pulse rounded-2xl bg-slate-800" />
    );
  }

  if (status === "accepted") {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
          <svg className="h-4 w-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Mentorship accepted
        </div>
        {conversationId && (
          <button
            type="button"
            onClick={() => router.push(`/chat/${conversationId}`)}
            className="w-full rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
          >
            Open chat
          </button>
        )}
      </div>
    );
  }

  if (status === "pending") {
    if (justSent) {
      return (
        <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
          <svg className="h-4 w-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Request sent successfully!
        </div>
      );
    }
    return (
      <div className="flex items-center gap-2 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-400">
        <svg className="h-4 w-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
        </svg>
        Request pending
      </div>
    );
  }

  if (status === "rejected") {
    return (
      <div className="flex items-center gap-2 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-400">
        <svg className="h-4 w-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
        Request not accepted
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        disabled={submitting}
        onClick={handleRequest}
        className="w-full rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Sending request…" : "Request mentorship"}
      </button>
      {errorMsg && (
        <p className="text-xs text-rose-400">{errorMsg}</p>
      )}
    </div>
  );
}
