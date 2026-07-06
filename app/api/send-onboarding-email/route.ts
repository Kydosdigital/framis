import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getResendClient, EMAIL_FROM } from "@/lib/resend";
import { getOnboardingEmail } from "@/lib/email/onboardingEmails";

/**
 * Sends the Day 1 welcome email right after onboarding completes. Auth'd as
 * the caller's own session (not the service role) — this only ever sends to
 * the signed-in user, for their own Day 1, so there's no way to spam
 * arbitrary users through this endpoint. Days 2-7 are cron-only; see
 * app/api/cron/send-onboarding-emails.
 */
export async function POST(req: Request) {
  const { userId } = await req.json().catch(() => ({ userId: null }));
  if (!userId) return NextResponse.json({ error: "Missing userId" }, { status: 400 });

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user || user.id !== userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, welcome_email_day")
    .eq("id", userId)
    .maybeSingle();

  // Already sent (or past) Day 1 — nothing to do. Keeps this idempotent if
  // the client retries or fires twice.
  if (!profile || profile.welcome_email_day >= 1) {
    return NextResponse.json({ skipped: true });
  }

  const email = getOnboardingEmail(1, profile.full_name || user.email?.split("@")[0] || "there");

  try {
    await getResendClient().emails.send({
      from: EMAIL_FROM,
      to: user.email!,
      subject: email.subject,
      html: email.html,
    });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 502 });
  }

  await supabase.from("profiles").update({ welcome_email_day: 1 }).eq("id", userId);
  return NextResponse.json({ sent: true });
}
