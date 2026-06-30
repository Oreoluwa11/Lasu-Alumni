'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { User } from "@/types";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (profile: Partial<User>) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (profile: Partial<User>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

type ProfileRow = {
  id: string;
  full_name: string | null;
  email: string | null;
  role: "student" | "alumni" | null;
  status: string | null;
  faculty: string | null;
  department: string | null;
  graduation_year: number | null;
  company: string | null;
  job_title: string | null;
  location: string | null;
  bio: string | null;
  skills: string[] | null;
  profile_image: string | null;
};

function mapProfile(profile: ProfileRow): User {
  return {
    id: profile.id,
    fullName: profile.full_name ?? "LASU member",
    email: profile.email ?? "",
    role: profile.role ?? "student",
    status: profile.status ?? undefined,
    faculty: profile.faculty ?? "",
    department: profile.department ?? "",
    graduationYear: profile.graduation_year ?? new Date().getFullYear(),
    company: profile.company ?? undefined,
    jobTitle: profile.job_title ?? undefined,
    location: profile.location ?? "",
    bio: profile.bio ?? "",
    skills: profile.skills ?? [],
    profileImage: profile.profile_image ?? undefined,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const supabase = useMemo<SupabaseClient | null>(() => {
    if (!isSupabaseConfigured()) {
      return null;
    }

    return createClient();
  }, []);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async (userId?: string) => {
    if (!userId || !supabase) {
      setUser(null);
      return;
    }

    const { data } = await supabase.from("profiles").select("*").eq("id", userId).single();
    setUser(data ? mapProfile(data as ProfileRow) : null);
  }, [supabase]);

  useEffect(() => {
    let mounted = true;

    const initializeSession = async () => {
      if (!supabase) {
        setLoading(false);
        return;
      }

      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();

      if (mounted) {
        await loadProfile(authUser?.id);
        setLoading(false);
      }
    };

    initializeSession();

    if (!supabase) {
      return () => {
        mounted = false;
      };
    }

    const subscription = supabase.auth.onAuthStateChange((_event, session) => {
      loadProfile(session?.user.id);
    }).data.subscription;

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [loadProfile, supabase]);

  const login = async (email: string, password: string) => {
    if (!supabase) {
      return false;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error) {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      await loadProfile(authUser?.id);
      return true;
    }

    return false;
  };

  const signup = async (profile: Partial<User>) => {
    if (!supabase) {
      return false;
    }

    if (!profile.email) {
      return false;
    }

    return false;
  };

  const logout = async () => {
    if (!supabase) {
      setUser(null);
      return;
    }

    await supabase.auth.signOut();
    setUser(null);
  };

  const updateProfile = async (profile: Partial<User>) => {
    if (!user) {
      return false;
    }

    const nextUser: User = { ...user, ...profile };
    if (!supabase) {
      return false;
    }

    const { error } = await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        full_name: nextUser.fullName,
        email: nextUser.email,
        role: nextUser.role,
        faculty: nextUser.faculty,
        department: nextUser.department,
        graduation_year: nextUser.graduationYear,
        company: nextUser.company,
        job_title: nextUser.jobTitle,
        location: nextUser.location,
        bio: nextUser.bio,
        skills: nextUser.skills,
        profile_image: nextUser.profileImage,
      });

    if (error) {
      return false;
    }

    setUser(nextUser);
    return true;
  };

  const value = { user, loading, login, signup, logout, updateProfile };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
