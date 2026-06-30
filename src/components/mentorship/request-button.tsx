'use client';

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/components/auth/auth-provider";
import { ensureConversationForRequest } from "@/lib/chat";

type Status = "loading" | "idle" | "pending" | "accepted" | "rejected" | "own";
type RequestRole = "sender" | "recipient" | null;

function normalizeStatus(rawStatus: string | null | undefined): Status {
  switch (rawStatus) {
    case "pending":
    case "pending approval":
      return "pending";
    case "accepted":
      return "accepted";
    case "rejected":
      return "rejected";
    default:
      return "idle";
  }
}

interface Props {
  recipientId: string;
}

export default function RequestMentorshipButton({ recipientId }: Props) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [status, setStatus] = useState<Status>("loading");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [feedbackTone, setFeedbackTone] = useState<"success" | "error" | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [requestId, setRequestId] = useState<string | null>(null);
  const [requestStudentId, setRequestStudentId] = useState<string | null>(null);
  const [requestAlumniId, setRequestAlumniId] = useState<string | null>(null);
  const [requestRole, setRequestRole] = useState<RequestRole>(null);

  const refreshRequestStatus = useCallback(async () => {
    if (authLoading) return;
    if (!user) {
      setStatus("idle");
      setConversationId(null);
      setRequestId(null);
      setRequestRole(null);
      return;
    }
    if (user.id === recipientId) {
      setStatus("own");
      setConversationId(null);
      setRequestId(null);
      setRequestStudentId(null);
      setRequestAlumniId(null);
      setRequestRole(null);
      setFeedbackMsg(null);
      setFeedbackTone(null);
      return;
    }

    setStatus("loading");
    setErrorMsg(null);
    setFeedbackMsg(null);
    setFeedbackTone(null);

    const supabase = createClient();

    try {
      const { data: request, error: requestError } = await supabase
        .from("mentorship_requests")
        .select("id,status,student_id,alumni_id")
        .or(
          `and(student_id.eq.${user.id},alumni_id.eq.${recipientId}),` +
          `and(student_id.eq.${recipientId},alumni_id.eq.${user.id})`
        )
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (requestError) throw requestError;

      if (request) {
        const normalizedStatus = normalizeStatus(request.status);
        const role = request.student_id === user.id ? "sender" : "recipient";
        setRequestId(request.id);
        setRequestStudentId(request.student_id ?? null);
        setRequestAlumniId(request.alumni_id ?? null);
        setRequestRole(role);
        setStatus(normalizedStatus);

        if (normalizedStatus === "accepted") {
          const { data: conv } = await supabase
            .from("conversations")
            .select("id")
            .or(
              `and(student_id.eq.${user.id},alumni_id.eq.${recipientId}),` +
              `and(student_id.eq.${recipientId},alumni_id.eq.${user.id})`
            )
            .maybeSingle();
          if (conv) {
            setConversationId(conv.id);
          } else {
            setConversationId(null);
          }
        } else {
          setConversationId(null);
        }
        return;
      }

      setRequestId(null);
      setRequestStudentId(null);
      setRequestAlumniId(null);
      setRequestRole(null);
      setStatus("idle");
      setConversationId(null);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Unable to load mentorship status.");
      setStatus("idle");
      setConversationId(null);
      setRequestId(null);
      setRequestRole(null);
    }
  }, [authLoading, recipientId, user]);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void refreshRequestStatus();
    }, 0);

    return () => window.clearTimeout(timeoutId);
  }, [refreshRequestStatus]);

  const handleOpenChat = async () => {
    if (!user || !requestId) return;

    setSubmitting(true);
    setErrorMsg(null);
    setFeedbackMsg(null);
    setFeedbackTone(null);

    try {
      const supabase = createClient();
      const nextConversationId = conversationId ?? await ensureConversationForRequest(supabase, {
        studentId: requestStudentId ?? user.id,
        alumniId: requestAlumniId ?? recipientId,
        requestId,
      });

      if (!nextConversationId) {
        throw new Error("Unable to open the chat right now.");
      }

      setConversationId(nextConversationId);
      router.push(`/chat/${nextConversationId}`);
    } catch (err) {
      setFeedbackTone("error");
      setFeedbackMsg(err instanceof Error ? err.message : "Unable to open the chat right now.");
    } finally {
      setSubmitting(false);
    }
  };

  if (status === "own") return null;

  if (status === "loading") {
    return <div className="h-12 animate-pulse rounded-2xl bg-slate-800" />;
  }

  if (status === "accepted") {
    return (
      <div className="space-y-2">
        <button
          type="button"
          disabled={submitting}
          onClick={handleOpenChat}
          className="w-full rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? "Opening…" : "Open chat"}
        </button>
        {feedbackMsg && (
          <p className={`text-xs ${feedbackTone === "success" ? "text-emerald-400" : "text-rose-400"}`}>
            {feedbackMsg}
          </p>
        )}
        {errorMsg && <p className="text-xs text-rose-400">{errorMsg}</p>}
      </div>
    );
  }

  if (status === "pending") {
    if (requestRole === "recipient") {
      return (
        <div className="space-y-2">
          <button
            type="button"
            disabled={submitting}
            onClick={async () => {
              if (!user || !requestId) return;
              setSubmitting(true);
              setErrorMsg(null);
              setFeedbackMsg(null);
              setFeedbackTone(null);
              const supabase = createClient();

              try {
                const requestLookup = await supabase
                  .from("mentorship_requests")
                  .select("id")
                  .eq("student_id", requestStudentId ?? user.id)
                  .eq("alumni_id", requestAlumniId ?? recipientId)
                  .order("created_at", { ascending: false })
                  .limit(1)
                  .maybeSingle();

                const targetRequestId = requestLookup.data?.id ?? requestId;
                const { data: updatedRequest, error: updateError } = await supabase
                  .from("mentorship_requests")
                  .update({ status: "accepted" })
                  .eq("id", targetRequestId)
                  .select("id,status")
                  .single();

                if (updateError || !updatedRequest) {
                  setFeedbackTone("error");
                  setFeedbackMsg(updateError?.message ?? "Unable to accept the request right now.");
                  return;
                }

                const conversationId = await ensureConversationForRequest(supabase, {
                  studentId: requestStudentId ?? user.id,
                  alumniId: requestAlumniId ?? recipientId,
                  requestId: targetRequestId,
                });

                setFeedbackTone("success");
                setFeedbackMsg("Request accepted. Opening chat...");
                if (conversationId) router.push(`/chat/${conversationId}`);
                await refreshRequestStatus();
              } catch (conversationError) {
                setFeedbackTone("error");
                setFeedbackMsg(conversationError instanceof Error ? conversationError.message : "Unable to open chat.");
              } finally {
                setSubmitting(false);
              }
            }}
            className="w-full rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting ? "Updating…" : "Accept Request"}
          </button>
          {feedbackMsg && (
            <p className={`text-xs ${feedbackTone === "success" ? "text-emerald-400" : "text-rose-400"}`}>
              {feedbackMsg}
            </p>
          )}
          {errorMsg && <p className="text-xs text-rose-400">{errorMsg}</p>}
        </div>
      );
    }

    return (
      <div className="flex items-center gap-2 rounded-2xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm font-medium text-amber-400">
        <svg className="h-4 w-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
        </svg>
        Pending Approval
      </div>
    );
  }

  if (status === "rejected") {
    return (
      <div className="flex items-center gap-2 rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm font-medium text-rose-400">
        <svg className="h-4 w-4 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
        Request not accepted
      </div>
    );
  }

  // idle — no active request
  return (
    <div className="space-y-2">
      <button
        type="button"
        disabled={submitting}
        onClick={async () => {
          if (!user) return;
          setSubmitting(true);
          setErrorMsg(null);
          const supabase = createClient();
          const { error } = await supabase
            .from("mentorship_requests")
            .insert({ student_id: user.id, alumni_id: recipientId, status: "pending" });
          if (error) {
            setErrorMsg(error.message);
            setSubmitting(false);
          } else {
            await refreshRequestStatus();
            setSubmitting(false);
          }
        }}
        className="w-full rounded-2xl bg-sky-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Sending…" : "Request mentorship"}
      </button>
      {errorMsg && <p className="text-xs text-rose-400">{errorMsg}</p>}
    </div>
  );
}
