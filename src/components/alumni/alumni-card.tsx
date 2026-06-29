import Link from "next/link";
import type { AlumniProfile } from "@/types";

export default function AlumniCard({ alumni }: Readonly<{ alumni: AlumniProfile }>) {
  return (
    <Link
      href={`/alumni/${alumni.id}`}
      className="block rounded-3xl border border-slate-800 bg-slate-950/90 p-6 transition hover:border-sky-500"
    >
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded-3xl bg-slate-800" />
        <div>
          <h2 className="text-xl font-semibold">{alumni.fullName}</h2>
          <p className="mt-1 text-slate-400">{alumni.occupation} · {alumni.company}</p>
        </div>
      </div>
      <div className="mt-4 grid gap-2 text-sm text-slate-400 sm:grid-cols-2">
        <span>Graduation year: {alumni.graduationYear}</span>
        <span>Location: {alumni.location}</span>
      </div>
    </Link>
  );
}
