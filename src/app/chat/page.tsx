'use client';

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import ProtectedRoute from "@/components/auth/protected-route";
import { useAuth } from "@/components/auth/auth-provider";
import { createClient } from "@/lib/supabase/client";

type Participant = {
  id: string;
  full_name: string;
  profile_image: string | null;
};

type ConvRow = {
  id: string;
  student_id: string;
  alumni_id: string;
  created_at: string;
  student: Participant | null;
  alumni: Participant | null;
};

type ConversationItem = {
  id: string;
  otherUser: Participant;
  lastMessage: string;
  lastMessageAt: string;
};

function Avatar({ name, image }: { name: string; image?: string | null }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  return (
    <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-2xl border border-slate-700 bg-slate-800">
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

export default function ChatListPage() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const supabase = createClient();

    supabase
      .from("conversations")
      .select(
        `id, student_id, alumni_id, created_at,
         student:profiles!student_id(id, full_name, profile_image),
         alumni:profiles!alumni_id(id, full_name, profile_image)`
      )
      .or(`student_id.eq.${user.id},alumni_id.eq.${user.id}`)
      .order("created_at", { ascending: false })
      .then(async ({ data }) => {
        if (!data) { setLoading(false); return; }

        const rows = data as unknown as ConvRow[];
        const ids = rows.map((r) => r.id);

        const { data: lastMsgs } = await supabase
          .from("messages")
          .select("conversation_id, content, created_at")
          .in("conversation_id", ids)
          .order("created_at", { ascending: false });

        const lastByConv = new Map<string, { content: string; created_at: string }>();
        for (const m of lastMsgs ?? []) {
          if (!lastByConv.has(m.conversation_id)) {
            lastByConv.set(m.conversation_id, m);
          }
        }

        setConversations(
          rows.map((r) => {
            const other = user.id === r.student_id ? r.alumni : r.student;
            const last = lastByConv.get(r.id);
            return {
              id: r.id,
              otherUser: other ?? {
                id: "",
                full_name: "Unknown",
                profile_image: null,
              },
              lastMessage: last?.content ?? "No messages yet",
              lastMessageAt: last?.created_at ?? r.created_at,
            };
          })
        );
        setLoading(false);
      });
  }, [user]);

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-slate-950 text-slate-100 px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
        <div className="mx-auto max-w-2xl space-y-6">
          <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-slate-950/20 backdrop-blur-xl">
            <h1 className="text-2xl font-semibold">Messages</h1>
            <p className="mt-1 text-sm text-slate-400">
              Your mentorship conversations.
            </p>
          </section>

          {loading && (
            <p className="py-16 text-center text-sm text-slate-500">
              Loading…
            </p>
          )}

          {!loading && conversations.length === 0 && (
            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-10 text-center">
              <p className="text-slate-400">No conversations yet.</p>
              <Link
                href="/alumni"
                className="mt-4 inline-block rounded-2xl bg-sky-500 px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-sky-400"
              >
                Find a mentor
              </Link>
            </div>
          )}

          <div className="space-y-3">
            {conversations.map((conv) => (
              <Link
                key={conv.id}
                href={`/chat/${conv.id}`}
                className="flex items-center gap-4 rounded-3xl border border-slate-800 bg-slate-900/80 p-5 transition hover:border-sky-500"
              >
                <Avatar
                  name={conv.otherUser.full_name}
                  image={conv.otherUser.profile_image}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate font-semibold">
                      {conv.otherUser.full_name}
                    </p>
                    <time className="flex-shrink-0 text-xs text-slate-600">
                      {new Date(conv.lastMessageAt).toLocaleDateString("en-NG", {
                        month: "short",
                        day: "numeric",
                      })}
                    </time>
                  </div>
                  <p className="mt-1 truncate text-sm text-slate-500">
                    {conv.lastMessage}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
