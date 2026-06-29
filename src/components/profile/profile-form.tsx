'use client';

import Image from "next/image";
import { FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@/types";

export default function ProfileForm() {
  const { user, updateProfile } = useAuth();
  if (!user) {
    return (
      <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-8">
        <p className="text-sm text-slate-400">Loading profile...</p>
      </div>
    );
  }

  return <ProfileFields key={user.id} user={user} updateProfile={updateProfile} />;
}

function ProfileFields({
  user,
  updateProfile,
}: {
  user: User;
  updateProfile: (profile: Partial<User>) => Promise<boolean>;
}) {
  const router = useRouter();
  const [fullName, setFullName] = useState(user.fullName ?? "");
  const [faculty, setFaculty] = useState(user.faculty ?? "");
  const [department, setDepartment] = useState(user.department ?? "");
  const [location, setLocation] = useState(user.location ?? "");
  const [bio, setBio] = useState(user.bio ?? "");
  const [profileImage, setProfileImage] = useState(user.profileImage ?? "");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initials = fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "?";

  const handleAvatarChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError("");

    const supabase = createClient();
    const ext = file.name.split(".").pop();
    const path = `${user.id}/avatar.${ext}`;

    const { error } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true });

    if (error) {
      const msg = error.message.toLowerCase().includes("bucket")
        ? "Storage bucket not found. Please create the 'avatars' bucket in your Supabase dashboard."
        : "Upload failed: " + error.message;
      setUploadError(msg);
      setUploading(false);
      return;
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    const url = data.publicUrl;

    await updateProfile({ profileImage: url });
    setProfileImage(url);
    setUploading(false);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await updateProfile({ fullName, faculty, department, location, bio });
    router.push("/profile");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 rounded-3xl border border-slate-800 bg-slate-950/90 p-8">
      <div className="flex items-center gap-5">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-3xl border border-slate-700 bg-slate-800 transition hover:border-sky-500 disabled:opacity-60"
          aria-label="Change profile picture"
        >
          {profileImage ? (
            <Image src={profileImage} alt="" fill className="object-cover" unoptimized />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-xl font-semibold text-slate-400">
              {initials}
            </span>
          )}
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/70">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-sky-400 border-t-transparent" />
            </div>
          )}
        </button>
        <div>
          <p className="font-semibold">{fullName || "Your name"}</p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="mt-1 text-sm text-sky-400 transition hover:text-sky-300 disabled:opacity-60"
          >
            {uploading ? "Uploading…" : "Change profile picture"}
          </button>
          {uploadError && <p className="mt-1 text-xs text-rose-400">{uploadError}</p>}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleAvatarChange}
        />
      </div>

      <label className="block">
        <span className="text-sm text-slate-300">Full name</span>
        <input
          type="text"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-500"
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm text-slate-300">Faculty</span>
          <input
            type="text"
            value={faculty}
            onChange={(e) => setFaculty(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-500"
          />
        </label>
        <label className="block">
          <span className="text-sm text-slate-300">Department</span>
          <input
            type="text"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-500"
          />
        </label>
      </div>

      <label className="block">
        <span className="text-sm text-slate-300">Location</span>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-500"
        />
      </label>

      <label className="block">
        <span className="text-sm text-slate-300">Bio</span>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          rows={5}
          className="mt-2 w-full rounded-2xl border border-slate-800 bg-slate-900 px-4 py-3 text-slate-100 outline-none transition focus:border-sky-500"
        />
      </label>

      <button
        type="submit"
        className="rounded-2xl bg-sky-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-sky-400"
      >
        Save profile
      </button>
    </form>
  );
}
