import { notFound } from "next/navigation";
import type { NewsArticle } from "@/types";
import { createClient } from "@/lib/supabase/server";

type NewsArticleRow = {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  content: string | null;
  image_url: string | null;
  category: string | null;
  published_at: string | null;
};

export type NewsArticleWithSlug = NewsArticle & {
  slug: string;
};

function mapNewsArticle(row: NewsArticleRow): NewsArticleWithSlug {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    summary: row.summary ?? "",
    content: row.content ?? "",
    imageUrl: row.image_url ?? undefined,
    category: row.category ?? "Announcements",
    publishedAt: row.published_at ?? "",
  };
}

export async function getNewsArticles() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("news")
    .select("id,title,slug,summary,content,image_url,category,published_at")
    .order("published_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((article) => mapNewsArticle(article as NewsArticleRow));
}

export async function getNewsArticleBySlug(slug: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("news")
    .select("id,title,slug,summary,content,image_url,category,published_at")
    .eq("slug", slug)
    .single();

  if (error) {
    notFound();
  }

  return mapNewsArticle(data as NewsArticleRow);
}
