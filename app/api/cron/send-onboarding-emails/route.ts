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

  // TEMP diagnostic: which project the runtime resolved, whether a service key
  // is present (length only, never the key), and how many rows the RPC returned.
  console.log(
    `[onboarding-cron-debug] url=${process.env.NEXT_PUBLIC_SUPABASE_URL} keyLen=${(process.env.SUPABASE_SERVICE_ROLE_KEY || "").length} dueCount=${due?.length ?? 0}`,
  );

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
      const { data, error: sendError } = await resend.emails.send({
        from: EMAIL_FROM,
        to: row.email,
        subject: template.subject,
        html: template.html,
      });
      // Resend returns 4xx (e.g. an unverified sender/domain) as `{ error }`,
      // NOT a thrown exception. If we don't check it, a failed send silently
      // advances the learner's day counter and that email is skipped forever.
      if (sendError) {
        console.error(
          `[onboarding-email] Resend rejected day=${row.next_day} from="${EMAIL_FROM}" to=${row.email}: ${JSON.stringify(sendError)}`,
        );
        failures.push(`${row.id}: ${sendError.name ?? "resend_error"}: ${sendError.message ?? JSON.stringify(sendError)}`);
        continue;
      }
      console.log(`[onboarding-email] sent day=${row.next_day} id=${data?.id} from="${EMAIL_FROM}" to=${row.email}`);
      await supabase.from("profiles").update({ welcome_email_day: row.next_day }).eq("id", row.id);
      sent++;
    } catch (err) {
      failures.push(`${row.id}: ${(err as Error).message}`);
    }
  }

  return NextResponse.json({ due: due?.length ?? 0, sent, from: EMAIL_FROM, failures });
}
