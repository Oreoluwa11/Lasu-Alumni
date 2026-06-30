import Image from "next/image";
import Link from "next/link";
import type { User } from "@/types";

export default function AlumniCard({ profile }: { profile: User }) {
  const initials = profile.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Link
      href={`/alumni/${profile.id}`}
      className="block rounded-3xl border border-slate-800 bg-slate-950/90 p-5 transition hover:border-sky-500"
    >
      <div className="flex items-center gap-4">
        <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-2xl border border-slate-700 bg-slate-800">
          {profile.profileImage ? (
            <Image src={profile.profileImage} alt={profile.fullName} fill className="object-cover" unoptimized />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-base font-semibold text-slate-400">
              {initials}
            </span>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate font-semibold">{profile.fullName}</p>
            {profile.status && (
              <span className={`flex-shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                profile.status === 'Alumni'
                  ? 'bg-sky-500/20 text-sky-400'
                  : 'bg-emerald-500/20 text-emerald-400'
              }`}>
                {profile.status}
              </span>
            )}
          </div>
          {(profile.jobTitle || profile.company) && (
            <p className="mt-0.5 truncate text-sm text-slate-400">
              {[profile.jobTitle, profile.company].filter(Boolean).join(' · ')}
            </p>
          )}
        </div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-1.5 text-xs text-slate-500">
        {profile.faculty && <span className="truncate">Faculty: {profile.faculty}</span>}
        {profile.department && <span className="truncate">Dept: {profile.department}</span>}
        {profile.graduationYear > 0 && <span>Class of {profile.graduationYear}</span>}
        {profile.location && <span className="truncate">{profile.location}</span>}
      </div>
    </Link>
  );
}
