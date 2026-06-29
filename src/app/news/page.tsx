import Image from "next/image";
import Link from "next/link";
import { getNewsArticles } from "@/lib/news";

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

export default async function NewsPage() {
  const articles = await getNewsArticles();
  const featuredArticles = articles.slice(0, 2);

  return (
    <main className="min-h-screen text-slate-100 px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
      <div className="mx-auto max-w-7xl space-y-6 sm:space-y-8">
        <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-3 sm:p-8 shadow-2xl shadow-slate-950/20 backdrop-blur-xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-lg font-semibold md:text-3xl">News and announcements</h1>
              <p className="mt-2 text-xs text-slate-400 sm:text-base">Stay updated with the latest campus news and alumni announcements.</p>
            </div>
            <input
              type="search"
              placeholder="Search news articles"
              className="w-full rounded-2xl border border-slate-800 bg-slate-950 px-2 md:px-4 py-2 md:py-3 text-slate-100 outline-none transition focus:border-sky-500 md:max-w-xs"
            />
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-3">
          <section className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 sm:p-8 shadow-2xl shadow-slate-950/20 backdrop-blur-xl lg:col-span-2">
            <div className="space-y-4">
              {articles.map((article) => (
                <Link
                  key={article.id}
                  href={`/news/${article.slug}`}
                  className="block rounded-3xl border border-slate-800 bg-slate-950/90 p-4 transition hover:border-sky-500 sm:p-6"
                >
                  {article.imageUrl && (
                    <div className="relative mb-4 aspect-[16/9] overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
                      <Image src={article.imageUrl} alt="" fill sizes="(min-width: 1024px) 55vw, 100vw" className="object-cover" unoptimized />
                    </div>
                  )}
                  <h2 className="text-lg font-semibold sm:text-xl">{article.title}</h2>
                  <p className="mt-2 text-sm text-slate-400 sm:mt-3 sm:text-base">{article.summary}</p>
                  <p className="mt-3 text-xs text-slate-500 sm:mt-4 sm:text-sm">{formatDate(article.publishedAt)} · {article.category}</p>
                </Link>
              ))}
              {articles.length === 0 && (
                <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-5 text-slate-400">
                  No news articles have been published yet.
                </div>
              )}
            </div>
          </section>

          <aside className="rounded-3xl border border-slate-800 bg-slate-900/80 p-5 sm:p-8 shadow-2xl shadow-slate-950/20 backdrop-blur-xl">
            <h2 className="text-lg font-semibold sm:text-xl">Featured announcements</h2>
            <div className="mt-5 space-y-4 sm:mt-6">
              {featuredArticles.map((article) => (
                <Link
                  key={article.id}
                  href={`/news/${article.slug}`}
                  className="block rounded-3xl bg-slate-950/90 p-4 border border-slate-800 transition hover:border-sky-500"
                >
                  {article.imageUrl && (
                    <div className="relative mb-3 aspect-[16/9] overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
                      <Image src={article.imageUrl} alt="" fill sizes="(min-width: 1024px) 25vw, 100vw" className="object-cover" unoptimized />
                    </div>
                  )}
                  <p className="text-sm font-semibold text-slate-200">{article.title}</p>
                  <p className="mt-2 text-sm text-slate-400">{article.summary}</p>
                </Link>
              ))}
              {featuredArticles.length === 0 && (
                <p className="text-sm text-slate-400">No featured announcements yet.</p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
