import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/env";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const studentId = typeof body?.studentId === "string" ? body.studentId : null;
  const alumniId = typeof body?.alumniId === "string" ? body.alumniId : null;
  const requestId = typeof body?.requestId === "string" ? body.requestId : null;

  if (!studentId || !alumniId || !requestId) {
    return NextResponse.json({ error: "Missing conversation payload." }, { status: 400 });
  }

  const supabase = createServerClient(
    getSupabaseUrl(),
    getSupabaseAnonKey(),
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll() {
          // no-op for this route
        },
      },
    },
  );

  const { data: existing, error: existingError } = await supabase
    .from("conversations")
    .select("id")
    .or(
      `and(student_id.eq.${studentId},alumni_id.eq.${alumniId}),` +
      `and(student_id.eq.${alumniId},alumni_id.eq.${studentId})`
    )
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (existingError) {
    return NextResponse.json({ error: existingError.message }, { status: 500 });
  }

  if (existing?.id) {
    return NextResponse.json({ id: existing.id });
  }

  const { data, error } = await supabase
    .from("conversations")
    .insert({
      student_id: studentId,
      alumni_id: alumniId,
      mentorship_request_id: requestId,
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ id: data?.id ?? null });
}
