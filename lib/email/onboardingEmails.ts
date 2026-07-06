const NAVY = "#0A1428";
const BLUE = "#0066CC";
const TEAL = "#4B9E8F";
const INK_500 = "#6B7280";

function wrap(name: string, bodyHtml: string) {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#FAFBFC;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td align="center" style="padding:32px 16px;">
          <table width="100%" style="max-width:480px;" cellpadding="0" cellspacing="0" role="presentation">
            <tr>
              <td style="padding:0 0 24px;">
                <span style="font-size:15px;font-weight:700;color:${NAVY};">Framis</span>
              </td>
            </tr>
            <tr>
              <td style="background:#ffffff;border-radius:12px;padding:32px;color:#111827;font-size:15px;line-height:1.6;">
                ${bodyHtml}
              </td>
            </tr>
            <tr>
              <td style="padding:20px 4px 0;color:${INK_500};font-size:12px;line-height:1.5;">
                Sent because ${name} signed up at Framis. Free, forever.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function button(label: string, href: string) {
  return `<a href="${href}" style="display:inline-block;background:${BLUE};color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;padding:12px 20px;border-radius:8px;margin-top:8px;">${label}</a>`;
}

export type OnboardingEmail = { subject: string; html: string };

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://framis-delta.vercel.app";

export function getOnboardingEmail(day: number, name: string): OnboardingEmail {
  const first = name.split(" ")[0] || "there";

  switch (day) {
    case 1:
      return {
        subject: "You're in — here's where everything lives",
        html: wrap(first, `
          <p style="margin:0 0 16px;font-size:18px;font-weight:700;">Welcome to Framis, ${first}.</p>
          <p style="margin:0 0 16px;">You finished onboarding and you're placed in your first module. A few things worth bookmarking:</p>
          <ul style="margin:0 0 16px;padding-left:20px;">
            <li style="margin-bottom:8px;">Your dashboard always shows exactly what's next — no need to remember where you left off.</li>
            <li style="margin-bottom:8px;">Stuck on a term? Every lesson has a key-terms sidebar with plain-English definitions.</li>
            <li style="margin-bottom:8px;">Capstones get reviewed by another learner before they count as done.</li>
          </ul>
          <p style="margin:0 0 20px;">That's it — no extra setup, no waiting period. Go build something.</p>
          ${button("Open your dashboard", SITE_URL)}
        `),
      };
    case 2:
      return {
        subject: "How's Lesson 1 going?",
        html: wrap(first, `
          <p style="margin:0 0 16px;font-size:18px;font-weight:700;">One lesson down.</p>
          <p style="margin:0 0 16px;">Doesn't matter if it felt easy or if you had to re-read it twice — you started, and most people who sign up for something like this never open lesson one at all.</p>
          <p style="margin:0 0 20px;">Today's a good day for lesson two, while it's still fresh.</p>
          ${button("Continue where you left off", SITE_URL)}
        `),
      };
    case 3:
      return {
        subject: "If you want more accountability than a website can give you",
        html: wrap(first, `
          <p style="margin:0 0 16px;font-size:18px;font-weight:700;">The curriculum stays free either way.</p>
          <p style="margin:0 0 16px;">Some learners want more than self-paced — a real person checking their code and their progress. That's what the mentor track is: a dedicated mentor, one code review a week, and a monthly career check-in, for £150/month.</p>
          <p style="margin:0 0 16px;">It's optional, and it's not required to finish or to get hired — 1 in 5 self-paced learners get hired within 6 months; with a mentor, that's about 1 in 2.</p>
          <p style="margin:0;">Curious? Just reply to this email and we'll walk you through it.</p>
        `),
      };
    case 4:
      return {
        subject: "The part of Framis most people skip",
        html: wrap(first, `
          <p style="margin:0 0 16px;font-size:18px;font-weight:700;">Peer review isn't optional — and that's on purpose.</p>
          <p style="margin:0 0 16px;">Every capstone gets read by another learner before it counts as shipped. Not a linter, not an AI grader — an actual person reading your actual code.</p>
          <p style="margin:0 0 16px;">It's the closest thing to a real code review you'll get before your first job has you doing them for real. Take it seriously in both directions — the feedback you give someone else is often where you learn the most.</p>
          ${button("See your review queue", SITE_URL)}
        `),
      };
    case 5:
      return {
        subject: "A heads-up about Phase 3",
        html: wrap(first, `
          <p style="margin:0 0 16px;font-size:18px;font-weight:700;">This is the honest one.</p>
          <p style="margin:0 0 16px;">Right now things probably feel manageable. Phase 3 — Pandas, feature engineering, classical ML, model evaluation — is where that changes for most people. It's a real jump in difficulty, not a curriculum mistake.</p>
          <p style="margin:0 0 16px;">When you get there and it feels harder than everything before it: that's normal, not a sign you're behind. Most platforms skip this phase entirely. We don't, because it's where the real understanding happens.</p>
          <p style="margin:0;">You're not there yet — just don't be surprised when you are.</p>
        `),
      };
    case 6:
      return {
        subject: "The schedule matters more than the hours",
        html: wrap(first, `
          <p style="margin:0 0 16px;font-size:18px;font-weight:700;">Consistency beats intensity.</p>
          <p style="margin:0 0 16px;">Four hours once a week is worse than 45 minutes most days — you lose the thread between sessions and re-read more than you learn. If you've got a rhythm going, protect it. If you don't yet, today's as good a day as any to start one.</p>
          ${button("Pick up your next lesson", SITE_URL)}
        `),
      };
    case 7:
      return {
        subject: "One week in",
        html: wrap(first, `
          <p style="margin:0 0 16px;font-size:18px;font-weight:700;">A week ago you hadn't started. Now you have.</p>
          <p style="margin:0 0 16px;">That's the whole game from here — showing up again next week, and the week after. Sixty-four weeks sounds long written down; it mostly just looks like this week, repeated.</p>
          <p style="margin:0;">See you in Phase 1.</p>
        `),
      };
    default:
      throw new Error(`No onboarding email defined for day ${day}`);
  }
}
