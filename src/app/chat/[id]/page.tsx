'use client';

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import ProtectedRoute from "@/components/auth/protected-route";
import { useAuth } from "@/components/auth/auth-provider";
import { createClient } from "@/lib/supabase/client";
import { loadConversationMessages, sendConversationMessage, subscribeToConversationMessages } from "@/lib/chat";
import type { Message } from "@/types";

type Participant = {
  id: string;
  full_name: string;
  profile_image: string | null;
};

function Avatar({ name, image }: { name: string; image?: string | null }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  return (
    <div className="relative h-8 w-8 flex-shrink-0 overflow-hidden rounded-xl border border-slate-700 bg-slate-800">
      {image ? (
        <Image src={image} alt={name} fill className="object-cover" unoptimized />
      ) : (
        <span className="flex h-full w-full items-center justify-center text-xs font-semibold text-slate-400">
          {initials}
        </span>
      )}
    </div>
  );
}

export default function ChatRoomPage() {
  const { id: conversationId } = useParams<{ id: string }>();
  const { user } = useAuth();
  const router = useRouter();

  const [messages, setMessages] = useState<Message[]>([]);
  const [otherUser, setOtherUser] = useState<Participant | null>(null);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!user || !conversationId) return;
    const supabase = createClient();

    let isActive = true;

    const loadConversation = async () => {
      try {
        const { data } = await supabase
          .from("conversations")
          .select(
            `id, student_id, alumni_id,
             student:profiles!student_id(id, full_name, profile_image),
             alumni:profiles!alumni_id(id, full_name, profile_image)`
          )
          .eq("id", conversationId)
          .single();

        if (!isActive) return;
        if (!data) {
          router.push("/chat");
          return;
        }

        const conv = data as unknown as {
          id: string;
          student_id: string;
          alumni_id: string;
          student: Participant | null;
          alumni: Participant | null;
        };
        const other = user.id === conv.student_id ? conv.alumni : conv.student;
        setOtherUser(other ?? null);
      } catch {
        if (isActive) router.push("/chat");
      }
    };

    const loadMessages = async () => {
      try {
        const nextMessages = await loadConversationMessages(supabase, conversationId);
        if (isActive) {
          setMessages(nextMessages);
          setLoading(false);
        }
      } catch {
        if (isActive) {
          setMessages([]);
          setLoading(false);
        }
      }
    };

    void loadConversation();
    void loadMessages();

    const unsubscribe = subscribeToConversationMessages(supabase, conversationId, (message) => {
      if (!isActive) return;
      setMessages((prev) => (prev.some((item) => item.id === message.id) ? prev : [...prev, message]));
    });

    return () => {
      isActive = false;
      unsubscribe();
    };
  }, [user, conversationId, router]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || !user || sending) return;
    setSending(true);
    setInput("");
    const supabase = createClient();
    try {
      await sendConversationMessage(supabase, {
        conversationId,
        senderId: user.id,
        content: text,
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <ProtectedRoute>
      <main className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
        <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-6 sm:px-6">
          <div className="flex flex-col flex-1 rounded-3xl border border-slate-800 bg-slate-900/80 shadow-2xl shadow-slate-950/20 backdrop-blur-xl overflow-hidden">
            <div className="flex items-center gap-4 border-b border-slate-800 px-5 py-4">
              <button
                type="button"
                onClick={() => router.push("/chat")}
                className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-800 hover:text-slate-200"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 18l-6-6 6-6" />
                </svg>
              </button>
              {otherUser && (
                <>
                  <Avatar
                    name={otherUser.full_name}
                    image={otherUser.profile_image}
                  />
                  <p className="font-semibold">{otherUser.full_name}</p>
                </>
              )}
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {loading && (
                <p className="py-8 text-center text-sm text-slate-500">
                  Loading messages…
                </p>
              )}
              {!loading && messages.length === 0 && (
                <p className="py-8 text-center text-sm text-slate-500">
                  No messages yet. Say hello!
                </p>
              )}
              {messages.map((msg) => {
                const isOwn = msg.senderId === user?.id;
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm ${
                        isOwn
                          ? "bg-sky-500 text-slate-950 rounded-br-sm"
                          : "bg-slate-800 text-slate-100 rounded-bl-sm"
                      }`}
                    >
                      <p>{msg.content}</p>
                      <p
                        className={`mt-1 text-right text-xs ${
                          isOwn ? "text-sky-900" : "text-slate-500"
                        }`}
                      >
                        {new Date(msg.createdAt).toLocaleTimeString("en-NG", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            <form
              onSubmit={handleSend}
              className="flex flex-col gap-3 border-t border-slate-800 px-5 py-4 sm:flex-row sm:items-center"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message…"
                className="w-full flex-1 rounded-2xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-100 outline-none transition focus:border-sky-500"
              />
              <button
                type="submit"
                disabled={!input.trim() || sending}
                className="rounded-2xl bg-sky-500 p-3 text-slate-950 transition hover:bg-sky-400 disabled:opacity-40 sm:self-auto"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </main>
    </ProtectedRoute>
  );
}
