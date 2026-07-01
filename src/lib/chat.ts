import type { Message } from "@/types";
import type { SupabaseClient } from "@supabase/supabase-js";

type ChatRow = {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
};

type ChatQueryResult = { data: ChatRow[] | null; error: Error | null };

type ChatQueryBuilder = {
  select: (columns: string) => ChatQueryBuilder;
  eq: (column: string, value: string) => ChatQueryBuilder;
  or: (filter: string) => ChatQueryBuilder;
  order: (column: string, options: { ascending: boolean }) => ChatQueryBuilder;
  limit: (value: number) => ChatQueryBuilder;
  maybeSingle: () => Promise<{ data: { id?: string } | null; error: Error | null }>;
  single: () => Promise<{ data: ChatRow | null; error: Error | null }>;
  insert: (values: Record<string, unknown>) => ChatQueryBuilder;
  upsert: (values: Record<string, unknown>, options: { onConflict: string }) => ChatQueryBuilder;
  then: <TResult1 = ChatQueryResult, TResult2 = never>(onfulfilled?: ((value: ChatQueryResult) => TResult1 | PromiseLike<TResult1>) | null, onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null) => PromiseLike<TResult1 | TResult2>;
};

type ChatChannel = {
  on: (
    event: string,
    opts: Record<string, unknown>,
    callback: (payload: Record<string, unknown> | { new: Record<string, unknown> }) => void
  ) => ChatChannel;
  subscribe: () => ChatChannel;
};

export async function ensureConversationForRequest(
  supabase: SupabaseClient,
  {
    studentId,
    alumniId,
    requestId,
  }: {
    studentId: string;
    alumniId: string;
    requestId: string;
  }
) {
  const builder = supabase.from("conversations") as unknown as ChatQueryBuilder;
  const { data: existing, error: existingError } = await builder
    .select("id")
    .or(
      `and(student_id.eq.${studentId},alumni_id.eq.${alumniId}),` +
      `and(student_id.eq.${alumniId},alumni_id.eq.${studentId})`
    )
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existingError) throw existingError;
  if (existing?.id) return existing.id;

  const insertBuilder = supabase.from("conversations") as unknown as ChatQueryBuilder;
  const { data, error } = await insertBuilder
    .insert({
      student_id: studentId,
      alumni_id: alumniId,
      mentorship_request_id: requestId,
    })
    .select("id")
    .single();

  if (error) throw error;
  return data?.id ?? null;
}

export async function loadConversationMessages(
  supabase: SupabaseClient,
  conversationId: string
): Promise<Message[]> {
  const builder = supabase.from("messages") as unknown as ChatQueryBuilder;
  const { data, error } = await builder
    .select("id, conversation_id, sender_id, content, created_at")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true });

  if (error) throw error;

  return (data ?? []).map((message: Record<string, unknown>) => ({
    id: message.id,
    conversationId: message.conversation_id,
    senderId: message.sender_id,
    content: message.content,
    createdAt: message.created_at,
  }));
}

export async function sendConversationMessage(
  supabase: SupabaseClient,
  {
    conversationId,
    senderId,
    content,
  }: {
    conversationId: string;
    senderId: string;
    content: string;
  }
): Promise<Message> {
  const builder = supabase.from("messages") as unknown as ChatQueryBuilder;
  const { data, error } = await builder
    .insert({
      conversation_id: conversationId,
      sender_id: senderId,
      content,
    })
    .select("id, conversation_id, sender_id, content, created_at")
    .single();

  if (error) throw error;
  if (!data) throw new Error("Failed to create message");

  return {
    id: data.id,
    conversationId: data.conversation_id,
    senderId: data.sender_id,
    content: data.content,
    createdAt: data.created_at,
  };
}

export function subscribeToConversationMessages(
  supabase: SupabaseClient,
  conversationId: string,
  onMessage: (message: Message) => void
) {
  const channel = (supabase.channel(`chat:${conversationId}`) as unknown as ChatChannel)
    .on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `conversation_id=eq.${conversationId}`,
      },
      (payload: { new: Record<string, unknown> }) => {
        const message = payload.new as {
          id: string;
          conversation_id: string;
          sender_id: string;
          content: string;
          created_at: string;
        };

        onMessage({
          id: message.id,
          conversationId: message.conversation_id,
          senderId: message.sender_id,
          content: message.content,
          createdAt: message.created_at,
        });
      }
    )
    .subscribe();

return () => {
  void supabase.removeChannel(channel);
};}
