import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getResendClient, EMAIL_FROM } from "@/lib/resend";
import { getOnboardingEmail } from "@/lib/email/onboardingEmails";

export const dynamic = "force-dynamic";

/**
 * Runs daily via Vercel Cron (see vercel.json). Sends whichever Day 1-7
 * welcome email each learner is next due for, one day at a time — if a run
 * is missed, the next run only advances by one day, not by however many
 * days were skipped. For a 7-email onboarding sequence that's an acceptable
 * trade against the complexity of a full catch-up loop.
 */
export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  const { data: due, error } = await supabase.rpc("get_due_onboarding_emails");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const resend = getResendClient();
  let sent = 0;
  const failures: string[] = [];

  for (const row of due ?? []) {
    if (!row.email) {
      failures.push(`${row.id}: no email on file`);
      continue;
    }
    try {
      const template = getOnboardingEmail(row.next_day, row.full_name || "there");
      await resend.emails.send({
        from: EMAIL_FROM,
        to: row.email,
        subject: template.subject,
        html: template.html,
      });
      await supabase.from("profiles").update({ welcome_email_day: row.next_day }).eq("id", row.id);
      sent++;
    } catch (err) {
      failures.push(`${row.id}: ${(err as Error).message}`);
    }
  }

  return NextResponse.json({ due: due?.length ?? 0, sent, failures });
}
