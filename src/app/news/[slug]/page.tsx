import Image from "next/image";
import Link from "next/link";
import { getNewsArticleBySlug } from "@/lib/news";

interface PageParams {
  params: Promise<{
    slug: string;
  }>;
}

function formatDate(date: string) {
  if (!date) {
    return "Unpublished";
  }

  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export default async function NewsArticlePage({ params }: Readonly<PageParams>) {
  const { slug } = await params;
  const article = await getNewsArticleBySlug(slug);
  const paragraphs = article.content.split("\n").filter(Boolean);

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-5xl space-y-8">
        <Link href="/news" className="text-sky-400 hover:text-sky-300">
          Back to news
        </Link>
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-10 shadow-2xl shadow-slate-950/20 backdrop-blur-xl">
          {article.imageUrl && (
            <div className="relative mb-8 aspect-[16/9] overflow-hidden rounded-2xl border border-slate-800 bg-slate-950">
              <Image src={article.imageUrl} alt="" fill sizes="(min-width: 1024px) 896px, 100vw" className="object-cover" unoptimized />
            </div>
          )}
          <p className="text-sm uppercase tracking-[0.35em] text-sky-400">{article.category}</p>
          <h1 className="mt-4 text-4xl font-semibold">{article.title}</h1>
          <p className="mt-4 text-sm text-slate-500">{formatDate(article.publishedAt)}</p>
          <p className="mt-4 text-slate-400">{article.summary}</p>
          <div className="mt-8 space-y-6 text-slate-300">
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            {paragraphs.length === 0 && <p>{article.summary}</p>}
          </div>
        </div>
      </div>
    </main>
  );
}
