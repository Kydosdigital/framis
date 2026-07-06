import { Resend } from "resend";

let client: Resend | null = null;

/** Server-only. Reads RESEND_API_KEY at call time so a missing key fails
 * loudly inside the API route rather than at module load / build time. */
export function getResendClient() {
  if (!client) {
    const key = process.env.RESEND_API_KEY;
    if (!key) throw new Error("RESEND_API_KEY is not set");
    client = new Resend(key);
  }
  return client;
}

// Must be a sender on a domain verified in the Resend dashboard before
// this will actually deliver — update once a real sending domain exists.
export const EMAIL_FROM = process.env.RESEND_FROM_EMAIL || "Framis <onboarding@framis.dev>";
