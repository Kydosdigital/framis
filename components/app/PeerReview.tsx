"use client";

import { useEffect, useState } from "react";
import { useFramis } from "@/lib/store";
import { REVIEW_ROWS, FEEDBACK_FIELDS } from "@/lib/data";
import { createClient } from "@/lib/supabase/client";

type SubmissionInfo = { id: number; title: string | null } | null;

export default function PeerReview() {
  const s = useFramis();
  const userId = useFramis((st) => st.userId);
  const [assignmentId, setAssignmentId] = useState<number | null>(null);
  const [submission, setSubmission] = useState<SubmissionInfo>(null);
  const [checkedAssignment, setCheckedAssignment] = useState(false);

  useEffect(() => {
    if (!userId) return;
    const supabase = createClient();
    supabase
      .from("review_assignments")
      .select("id, project_submissions(id, projects(title))")
      .eq("reviewer_id", userId)
      .eq("status", "pending")
      .limit(1)
      .maybeSingle()
      .then(({ data }) => {
        if (data) {
          const sub = Array.isArray(data.project_submissions)
            ? data.project_submissions[0]
            : data.project_submissions;
          const project = sub && (Array.isArray(sub.projects) ? sub.projects[0] : sub.projects);
          setAssignmentId(data.id);
          setSubmission({ id: sub?.id ?? 0, title: project?.title ?? null });
        }
        setCheckedAssignment(true);
      }, () => setCheckedAssignment(true));
  }, [userId]);

  const scoresDone = Object.values(s.scores).every((v) => v > 0);
  const reviewReady =
    scoresDone && s.feedback.well.trim() && s.feedback.improve.trim();

  const submitReview = () => {
    s.submitReview();
    if (reviewReady && assignmentId) {
      const supabase = createClient();
      supabase
        .from("code_reviews")
        .insert({ assignment_id: assignmentId, scores: s.scores, feedback: s.feedback })
        .then(() => {}, () => {});
    }
  };

  const reviewTitle = submission?.title ?? "Notes App";
  const reviewLabel = submission ? `learner #${submission.id}` : "learner #4127";

  return (
    <div className="max-w-[780px]">
      <div className="mb-2.5 font-mono text-[12.5px] font-medium text-ink-500">
        PEER REVIEW · ANONYMISED · DUE IN {checkedAssignment && assignmentId ? "3" : "2"} DAYS
      </div>
      <h1 className="mb-3.5 font-inter text-[30px] font-bold tracking-[-0.02em]">
        Review: {reviewTitle}{" "}
        <span className="font-mono text-[16px] font-medium text-ink-500">
          by {reviewLabel}
        </span>
      </h1>

      {!s.reviewSent ? (
        <>
          <div className="mb-5 flex flex-wrap gap-2.5">
            <span className="rounded-full bg-[#EAF2FB] px-[15px] py-[7px] font-mono text-[12.5px] font-medium text-blue">
              github.com/•••/notes-app
            </span>
            <span className="rounded-full bg-[#E7F5F1] px-[15px] py-[7px] font-mono text-[12.5px] font-medium text-success">
              notes-app.vercel.app ✓ live
            </span>
            <span className="rounded-full bg-[#F4F6F9] px-[15px] py-[7px] font-mono text-[12.5px] font-medium text-ink-500 dark:bg-[#1B2536]">
              coverage 74%
            </span>
          </div>

          {/* code with planted bug */}
          <div className="mb-5 rounded-[12px] bg-navy px-6 py-5">
            <div className="mb-3 font-mono text-[11.5px] font-medium text-slateink-300">
              auth.py · does anything look off?
            </div>
            <pre className="m-0 whitespace-pre-wrap font-mono text-[13.5px]/[1.75] text-[#E8EAF0]">
              {`def login(email, password):
    user = db.get_user(email)
    `}
              <span className="rounded bg-[rgba(220,38,38,.22)] px-1 py-px">
                if user.password == password:
              </span>
              {"  "}
              <span className="text-slateink-400"># ← plain-text compare?</span>
              {`
        return make_token(user)
    return None`}
            </pre>
          </div>

          {/* scorecard */}
          <div className="mb-[18px] rounded-[12px] border border-line bg-card px-[26px] py-[22px]">
            <div className="mb-4 font-inter text-[14px] font-semibold">Scorecard</div>
            <div className="flex flex-col gap-3.5">
              {REVIEW_ROWS.map((r) => (
                <div key={r.key} className="flex flex-wrap items-center gap-3.5">
                  <span className="min-w-[220px] flex-1 text-[14px]">
                    {r.label}{" "}
                    <span className="text-[12px] text-[#9AA3AF]">({r.weight})</span>
                  </span>
                  <span className="flex gap-1.5">
                    {[1, 2, 3, 4, 5].map((n) => {
                      const on = s.scores[r.key] >= n;
                      return (
                        <button
                          key={n}
                          onClick={() => s.setScore(r.key, n)}
                          className="h-[26px] w-[26px] rounded-full p-0 font-inter text-[11.5px] font-semibold"
                          style={{
                            border: `1.5px solid ${on ? "#0066CC" : "var(--color-border-input)"}`,
                            background: on ? "#0066CC" : "var(--color-card)",
                            color: on ? "#fff" : "var(--color-ink-500)",
                          }}
                        >
                          {n}
                        </button>
                      );
                    })}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* feedback */}
          <div className="mb-5 rounded-[12px] border border-line bg-card px-[26px] py-[22px]">
            <div className="mb-1 font-inter text-[14px] font-semibold">Feedback</div>
            <p className="mb-4 text-[12.5px] text-ink-500">
              Guided template — vague feedback helps no one.
            </p>
            <div className="flex flex-col gap-3">
              {FEEDBACK_FIELDS.map((f) => (
                <div key={f.key}>
                  <div className="mb-1.5 font-inter text-[12.5px] font-semibold text-ink-700">
                    {f.label}
                  </div>
                  <textarea
                    value={s.feedback[f.key]}
                    onChange={(e) => s.setFeedback(f.key, e.target.value)}
                    placeholder={f.ph}
                    className="min-h-[54px] w-full resize-y rounded-lg border border-line-input bg-transparent px-3 py-2.5 text-[13.5px]/[1.5] text-ink-900"
                  />
                </div>
              ))}
            </div>
            <button
              onClick={submitReview}
              className="mt-4 rounded-[9px] px-[26px] py-3.5 font-inter text-[15px] font-semibold text-white"
              style={{ background: reviewReady ? "#0066CC" : "#B9C2CE" }}
            >
              Submit review
            </button>
          </div>
        </>
      ) : (
        <div className="rounded-[12px] border border-[#B7E3D4] bg-card px-8 py-[34px] text-center">
          <h2 className="mb-2 font-inter text-[22px] font-bold">
            Review sent — nicely spotted.
          </h2>
          <p className="mb-2 text-[14.5px]/[1.6] text-ink-500">
            You flagged the plain-text password compare. That’s exactly the
            judgment Framis is built to train.
          </p>
          <p className="mb-[22px] text-[13px] font-medium text-amber">
            +1 toward your Peer Reviewer Star badge · 1 of 2 reviews done this
            week
          </p>
          <button
            onClick={() => s.goTab("dashboard")}
            className="rounded-lg bg-blue px-[22px] py-3 font-inter text-[14px] font-semibold text-white"
          >
            Back to dashboard
          </button>
        </div>
      )}
    </div>
  );
}
