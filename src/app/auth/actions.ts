"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type AuthState = {
  error?: string;
  message?: string;
};

function getOrigin() {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3300";
}

export async function login(_: AuthState, formData: FormData): Promise<AuthState> {
  const supabase = await createClient();
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  return { message: "success" };
}

export async function signup(_: AuthState, formData: FormData): Promise<AuthState> {
  const supabase = await createClient();
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  const fullName = String(formData.get("fullName") ?? "");
  const faculty = String(formData.get("faculty") ?? "");
  const department = String(formData.get("department") ?? "");
  const graduationYear = Number(formData.get("graduationYear") ?? new Date().getFullYear());

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${getOrigin()}/auth/callback`,
      data: {
        full_name: fullName,
        faculty,
        department,
        graduation_year: graduationYear,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  // if (data.user) {
  //   const { error: profileError } = await supabase.from("profiles").upsert({
  //     id: data.user.id,
  //     full_name: fullName,
  //     email,
  //     role: "student",
  //     faculty,
  //     department,
  //     graduation_year: graduationYear,
  //     location: "Lagos",
  //     bio: "",
  //     skills: [],
  //   });

  //   if (profileError) {
  //     return { error: profileError.message };
  //   }
  // }
  
  if (!data.session) {
    return { message: "Check your email to confirm your account." };
  }

  return { message: "success" };
}

export async function resetPassword(_: AuthState, formData: FormData): Promise<AuthState> {
  const supabase = await createClient();
  const email = String(formData.get("email") ?? "");

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${getOrigin()}/auth/callback?next=/profile/edit`,
  });

  if (error) {
    return { error: error.message };
  }

  return { message: "Password reset link sent. Check your email." };
}
