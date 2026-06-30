'use client';

import Image from "next/image";
import Link from "next/link";
import ProtectedRoute from "@/components/auth/protected-route";
import { useAuth } from "@/components/auth/auth-provider";
import { MdOutlineArrowRightAlt } from "react-icons/md";

function Avatar({ src, name, size = 20 }: { src?: string; name: string; size?: number }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const px = size * 4;
  const style = { width: px, height: px, minWidth: px, minHeight: px };

  if (src) {
    return (
      <div style={style} className="relative overflow-hidden rounded-3xl border border-slate-700 bg-slate-800 flex-shrink-0">
        <Image src={src} alt={name} fill className="object-cover" unoptimized />
      </div>
    );
  }

  return (
    <div style={style} className="flex flex-shrink-0 items-center justify-center rounded-3xl border border-slate-700 bg-slate-800 text-lg font-semibold text-slate-400">
      {initials}
    </div>
  );
}

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-white text-slate-100 px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-3xl border border-slate-800 bg-slate-950 p-6 shadow-2xl shadow-slate-950/20 backdrop-blur-xl sm:p-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4 max-w-sm
              ">
                {user && <Avatar src={user.profileImage} name={user.fullName} size={24} />}
                <div>
                  <h1 className="text-2xl font-semibold sm:text-3xl">{user?.fullName}</h1>
                  <p className="mt-1 text-sm text-slate-400">{user?.email}</p>
                </div>
              </div>
              <Link
                href="/profile/edit"
                className="self-start rounded-2xl bg-sky-500 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400 sm:self-auto flex items-center gap-2"
              >
                Edit profile <MdOutlineArrowRightAlt />
              </Link>
            </div>

            <div className="mt-8 grid gap-6 md:grid-cols-2">
              <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-6">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Personal information</p>
                <div className="mt-6 space-y-3 text-slate-200">
                  <p><span className="font-semibold">Name:</span> {user?.fullName}</p>
                  <p><span className="font-semibold">Email:</span> {user?.email}</p>
                  <p><span className="font-semibold">Location:</span> {user?.location || <span className="text-slate-500">Not set</span>}</p>
                </div>
              </div>
              <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-6">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Academic information</p>
                <div className="mt-6 space-y-3 text-slate-200">
                  <p><span className="font-semibold">Faculty:</span> {user?.faculty || <span className="text-slate-500">Not set</span>}</p>
                  <p><span className="font-semibold">Department:</span> {user?.department || <span className="text-slate-500">Not set</span>}</p>
                  <p><span className="font-semibold">Graduation year:</span> {user?.graduationYear}</p>
                </div>
              </div>
              <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-6 md:col-span-2">
                <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Professional information</p>
                <div className="mt-6 space-y-3 text-slate-200">
                  <p><span className="font-semibold">Job title:</span> {user?.jobTitle || <span className="text-slate-500">Not set</span>}</p>
                  <p><span className="font-semibold">Company:</span> {user?.company || <span className="text-slate-500">Not set</span>}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-3xl border border-slate-800 bg-slate-950 p-6">
              <p className="text-sm uppercase tracking-[0.2em] text-slate-500">Bio</p>
              {user?.bio
                ? <p className="mt-4 text-slate-300">{user.bio}</p>
                : <p className="mt-4 text-slate-500">Not set</p>
              }
            </div>
          </section>

          <section className="rounded-3xl border border-slate-800 bg-slate-950 p-6  backdrop-blur-xl sm:p-8">
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                {user && <Avatar src={user.profileImage} name={user.fullName} size={16} />}
                <div>
                  <p className="text-lg font-semibold">Profile progress</p>
                  <p className="text-sm text-slate-400">Complete your profile to improve mentor matches.</p>
                </div>
              </div>
              {!user?.profileImage && (
                <div className="rounded-3xl bg-slate-950/90 p-4 border border-slate-800">
                  <p className="text-sm text-slate-400">
                    Add a profile picture and fill in your bio and skills to reach 100% completion.
                  </p>
                  <Link
                    href="/profile/edit"
                    className="mt-3 inline-block text-sm text-sky-400 hover:text-sky-300"
                  >
                    Complete your profile →
                  </Link>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </ProtectedRoute>
  );
}
