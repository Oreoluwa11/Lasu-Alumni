import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  const next = requestUrl.searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.exchangeCodeForSession(code);

    if (session?.user) {
      const { user } = session;
      const meta = user.user_metadata ?? {};

      const statusValue = String(meta.status ?? "");
      const role = statusValue.toLowerCase() === "alumni" ? "alumni" : "student";

      await supabase.from("profiles").upsert({
        id: user.id,
        full_name: meta.full_name ?? "",
        email: user.email ?? "",
        role,
        status: statusValue,
        faculty: meta.faculty ?? "",
        department: meta.department ?? "",
        graduation_year: meta.graduation_year ?? new Date().getFullYear(),
        location: "",
        bio: "",
        skills: [],
      }, { onConflict: "id", ignoreDuplicates: true });
    }
  }

  return NextResponse.redirect(new URL(next, request.url));
}
