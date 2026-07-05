import type { LessonData } from "../types";

const content: LessonData = {
  num: 28,
  orderIndex: 2,
  phaseLabel: "AI PRODUCT DESIGN + EDGE CASES",
  title: "Show your work: why citations beat confidence",
  minutes: 18,
  concept:
    "A model sounds exactly as confident when it's right as when it's fabricating something from thin air — fluent, assured, grammatically perfect either way — which means a user has no built-in way to tell a correct answer from a plausible-sounding wrong one just by how it reads. The fix isn't making the model sound less confident; it's redesigning the output so the user (or a reviewer) can check the claim themselves, cheaply, without having to take the model's word for it. That means attaching real citations — a link to the actual passage the answer is based on, not just a source name in parentheses — so a claim can be verified in one click instead of a separate search. It also means letting the interface reflect uncertainty honestly: an answer built on one thin, outdated source should look and read differently from one backed by several current, corroborating ones, instead of both getting the same flat, confident tone. Products that skip this treat \"the model said so\" as sufficient evidence on its own, and that assumption is exactly what breaks trust the first time it turns out to be wrong.",
  conceptSimpler:
    "It's the difference between a student who just says \"the answer is 42\" and one who shows the worksheet — one asks you to trust them, the other lets you check the work yourself.",
  vizStages: [
    {
      label: "1. Confidence isn't accuracy",
      body:
        "A correct answer and a hallucinated one can be worded identically — same tone, same fluency, same lack of hedging. Nothing about how the sentence sounds tells you which one it is.",
      code: 'assistant: "Your plan includes 3 free reschedules per year."   // true\nassistant: "Your plan includes unlimited free reschedules."     // fabricated\n// both delivered in exactly the same confident voice',
    },
    {
      label: "2. Answer-only vs. sourced answer",
      body:
        "A naive product prints the model's sentence and stops there. A designed product attaches the actual passage the claim came from, with a link straight to it, so the user isn't just being told — they're being shown.",
      code: '// naive\n{ text: "You get 3 free reschedules per year." }\n\n// designed\n{\n  text: "You get 3 free reschedules per year.",\n  source: { doc: "Membership Terms §4.2", url: "/terms#4.2", quote: "Members may reschedule up to three (3) times annually at no charge." }\n}',
    },
    {
      label: "3. Let the interface reflect uncertainty",
      body:
        "One old support ticket and three current policy documents shouldn't produce the same confident sentence. A designed product varies the phrasing and visual weight based on how strong the underlying evidence actually is.",
      code: 'strong: "According to the current Membership Terms (3 sources agree): ..."\nweak:   "Based on a single older support note, this might be: ... (unconfirmed — worth double-checking)"',
    },
    {
      label: "4. A citation must itself be checkable",
      body:
        "A citation only builds trust if it resolves to something real. A link that 404s, or a case name and quote that don't exist, is worse than no citation at all — it looks verified while being completely unverifiable.",
      code: '// looks trustworthy, is not:\nsource: { doc: "Support Policy v4", url: "/policies/v4" }  // page was deleted 8 months ago, link 404s',
    },
  ],
  realWorldIntro:
    "In the 2023 case Mata v. Avianca, a lawyer used ChatGPT to help draft a federal court filing, and the model invented six court cases — complete with plausible case names, docket numbers, and quoted excerpts — none of which existed; nothing in that workflow made the citations checkable before they went in front of a judge, and the attorney was sanctioned.",
  realWorldCode:
    '// what the model produced (fabricated, but formatted exactly like a real citation):\n"Varghese v. China Southern Airlines Co., Ltd., 925 F.3d 1339 (11th Cir. 2019)"\n// correct format, plausible court, plausible year — and it does not exist\n\n// what a designed product would have added before this reached a filing:\n// a verification step that checks the citation against an actual case database\n// and refuses to render it as a source if it can\'t be confirmed',
  sandbox: {
    kind: "explore",
    instructions:
      "Click through five stages to see how a product turns a bare AI answer into something a user can actually verify, rather than just something they have to believe.",
    stages: [
      {
        label: "Stage 1: the bare answer",
        body:
          'A support bot says "Your policy covers water damage under section 4.2" with no link and no quote. The user either takes it on faith or has to go dig through a policy PDF themselves to check — the product has handed the verification work back to the person who came to it for an answer.',
      },
      {
        label: "Stage 2: a clickable citation",
        body:
          'The same answer now comes with a link to section 4.2 and the exact sentence highlighted: "Water damage from a covered peril is included; damage from gradual leaks is excluded." One click confirms it, and the user can also see the part the bot didn\'t mention — the exclusion — instead of only getting the flattering half of the section.',
      },
      {
        label: "Stage 3: confidence reflected in the UI, not just claimed in words",
        body:
          'Two answers, two different treatments: one cites three current internal docs that all agree and renders with a solid "verified" badge; the other is based on a single support ticket from two years ago and renders with a muted "unconfirmed, worth double-checking with a human" note. Same product, different visual and verbal weight based on actual evidence strength.',
      },
      {
        label: "Stage 4: verifying the citation before showing it",
        body:
          "Before any source is rendered to the user, a separate check confirms the linked document still exists and actually contains the quoted text — not just that the model generated something citation-shaped. A citation that fails this check gets dropped, and the answer is shown as unsourced rather than fake-sourced.",
      },
      {
        label: "Stage 5: when there's no good source",
        body:
          'For a question with no solid backing in any document, the product says so directly: "I don\'t have a verified source for this — here\'s my best understanding, but please confirm with a human before relying on it." That sentence is less satisfying than a confident answer, and it\'s the one that keeps the product trustworthy the next hundred times.',
      },
    ],
  },
  quizQuestion:
    "A support bot answers a billing question and includes a citation like \"(Billing Policy §4.2)\", but that section doesn't actually exist in the linked document. What's the real risk this creates?",
  quizCode: 'assistant: "Refunds within 60 days are covered. (Billing Policy §4.2)"\n// §4.2 does not exist in the linked document',
  quizOptions: [
    {
      key: "a",
      label: "It's strictly better than no citation, since it at least gives the user something to click on",
      correct: false,
    },
    {
      key: "b",
      label:
        "It's worse than no citation, because it looks verified while being unverifiable, which increases false trust in a claim that was never actually checked",
      correct: true,
    },
    {
      key: "c",
      label: "There's no real risk, as long as the underlying refund claim happens to be true",
      correct: false,
    },
  ],
  quizFeedbackCorrect:
    "Right — a citation's whole value is signaling \"you can check this,\" so one that doesn't resolve to anything real removes the safety net while keeping the appearance of one, which is more dangerous than admitting no source exists.",
  quizFeedbackIncorrect:
    "Not quite — a fake citation isn't neutral or harmless just because the answer happens to be correct this time; it trains users to trust citations that were never actually verified, which fails badly the next time the underlying claim is wrong.",
  takeaway:
    "Trust isn't earned by sounding confident — it's earned by making your claims cheap to check. Every citation, confidence cue, and source link you show is a promise that the user doesn't have to just believe you, and that promise only holds if it's actually true.",
};

export default content;
