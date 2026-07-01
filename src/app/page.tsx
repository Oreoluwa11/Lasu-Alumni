
import Link from "next/link";
import { getNewsArticles } from "@/lib/news";

export default async function Home() {
  const upcomingEvents = (await getNewsArticles()).slice(0, 3);
  return (
    <div>
      <main
        className="relative -mt-20 min-h-screen pt-18 text-white bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/hero.png')" }}
      >
        <section className="mx-auto grid min-h-screen max-w-7xl gap-12 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-10">
          <div className="flex flex-col justify-center gap-8">
            <div className="space-y-4">
              <p className="text-base md:text-lg uppercase md:tracking-[0.35em] tracking-[0.15em] font-bold text-[#242E58]">LASU Alumni Connect</p>
              <h1 className="max-w-3xl text-2xl md:text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
                Mentor with alumni, stay informed, and grow your professional network.
              </h1>
              <p className="max-w-2xl text-sm md:text-base leading-5 sm:text-lg sm:leading-8">
                A modern student-alumni mentorship platform built for Lagos State University—find mentors, follow campus news, and track your profile progress.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Link href="/auth/signup" className="rounded-3xl bg-[#242E58] px-8 py-4 text-center text-sm font-semibold text-white shadow-xs shadow-sky-100 transition hover:bg-sky-700">
                Get started
              </Link>
              <Link href="/dashboard" className="rounded-3xl border border-slate-200 bg-white px-8 py-4 text-center text-sm font-semibold text-slate-950 shadow-sm transition hover:border-slate-300">
                View dashboard
              </Link>
            </div>

            {/* <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <p className="text-sm uppercase tracking-[0.25em] text-sky-600">Featured mentor</p>
                <p className="mt-3 text-xl font-semibold text-slate-950">Aisha Bello</p>
                <p className="mt-2 text-slate-600">Product Manager · Tech Spring</p>
              </div>
              <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                <p className="text-sm uppercase tracking-[0.25em] text-sky-600">Latest announcement</p>
                <p className="mt-3 text-xl font-semibold text-slate-950">Alumni networking night</p>
                <p className="mt-2 text-slate-600">Reserve your seat for mentorship sessions with top industry professionals.</p>
              </div>
            </div> */}
          </div>

          <div className="relative overflow-hidden rounded-[2.5rem] mt-10 h-fit py-16 bg-gradient-to-br from-[#242E58] to-blue-700 p-8 text-white shadow-2xl shadow-slate-300/20">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle,_#ffffff_0%,_transparent_55%)]" />
            <div className="relative flex h-full flex-col justify-between gap-6">
              <div className="space-y-4">
                <p className="text-sm uppercase tracking-[0.35em] text-sky-200">Welcome to LASU Alumni</p>
                <h2 className="text-4xl font-semibold leading-tight">Connect with mentors and discover opportunities.</h2>
                <p className="max-w-xl text-slate-100/90">
                  A clean, university-style experience designed for students who want to build career relationships and keep up with LASU updates.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <section className="bg-[#242E58] py-18 px-6 sm:px-10">
        <div>
          <p className="text-2xl font-bold text-white text-center">THE MISSION OF LAGOS STATE UNIVERSITY</p>
          <hr className="mt-2 w-70 text-white font-bold mx-auto"/>
          <p className="mt-8 text-lg text-white text-center">
            Lagos State University (LASU) is committed to providing quality education, fostering research and innovation, and contributing to the socio-economic development of Lagos State and Nigeria as a whole. The university aims to produce graduates who are not only academically competent but also socially responsible and equipped with the skills necessary to thrive in a rapidly changing world.
          </p>
        </div>
      </section>

      <section className="bg-[#242E58] py-5 px-6 sm:px-10">
        <div>
          <p className="text-2xl font-bold text-white text-center">OUR VISION</p>
          <hr className="mt-2 w-70 text-white font-bold mx-auto"/>
          <p className="mt-8 text-base leading-7 text-white text-center sm:text-lg mb-10">
            To be a leading institution of higher learning that nurtures intellectual growth, promotes ethical values, and prepares students for leadership roles in society.
          </p>
        </div>
      </section>

      <section className="bg-[#EDEFF8] py-20 px-6 text-black sm:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#242E58]">Upcoming Events</p>
              <h2 className="text-2xl font-bold text-slate-950">Stay connected with what is coming up</h2>
            </div>
            <Link href="/news" className="text-sm font-semibold text-[#242E58] transition hover:text-sky-700">
              View all news
            </Link>
          </div>

          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {upcomingEvents.map((event) => (
              <article key={event.id} className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/70">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#242E58]">
                    {event.category}
                  </span>
                  <span className="text-sm text-slate-500">
                    {new Date(event.publishedAt).toLocaleDateString("en-NG", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </div>
                <h3 className="mt-4 text-xl font-semibold text-slate-950">{event.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-6 text-slate-600">{event.summary}</p>
                <Link href={`/news/${event.id}`} className="mt-6 inline-flex text-sm font-semibold text-[#242E58] transition hover:text-sky-700">
                  Read more →
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
