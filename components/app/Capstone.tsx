"use client";

import { useEffect, useState } from "react";
import { useFramis } from "@/lib/store";
import { CAPSTONES } from "@/lib/data";
import { createClient } from "@/lib/supabase/client";
import { Check } from "../ui";

export default function Capstone() {
  const s = useFramis();
  const userId = useFramis((st) => st.userId);
  const slug = useFramis((st) => st.activeCapstoneSlug);
  const data = CAPSTONES.find((c) => c.slug === slug) ?? CAPSTONES[0];

  const [projectId, setProjectId] = useState<number | null>(null);
  const [requirements, setRequirements] = useState<string[] | null>(null);
  const [hints, setHints] = useState<string[] | null>(null);

  useEffect(() => {
    setProjectId(null);
    setRequirements(null);
    setHints(null);
    const supabase = createClient();
    supabase
      .from("projects")
      .select("id, requirements, hints")
      .eq("slug", data.slug)
      .single()
      .then(({ data: row }) => {
        if (row) {
          setProjectId(row.id);
          if (Array.isArray(row.requirements) && row.requirements.length) {
            setRequirements(row.requirements as string[]);
          }
          if (Array.isArray(row.hints) && row.hints.length) {
            setHints(row.hints as string[]);
          }
        }
      }, () => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.slug]);

  const criteriaLabels = requirements ?? data.criteria;
  const hintTexts = hints ?? data.hints;
  const criteria = s.criteria[data.slug] ?? [];
  const hintsOpen = s.hintsOpen[data.slug] ?? [];
  const ghUrl = s.ghUrl[data.slug] ?? "";
  const depUrl = s.depUrl[data.slug] ?? "";
  const submitted = s.capstoneSubmitted[data.slug] ?? false;

  const critCount = criteria.filter(Boolean).length;
  const capReady =
    critCount === criteriaLabels.length && ghUrl.trim() && depUrl.trim();

  const submit = () => {
    s.submitCapstone(data.slug, criteriaLabels.length);
    if (capReady && userId && projectId) {
      const supabase = createClient();
      supabase
        .from("project_submissions")
        .upsert(
          {
            user_id: userId,
            project_id: projectId,
            github_url: ghUrl,
            deployed_url: depUrl,
            status: "submitted",
            submitted_at: new Date().toISOString(),
          },
          { onConflict: "user_id,project_id" },
        )
        .then(() => {}, () => {});
    }
  };

  return (
    <div className="max-w-[780px]">
      <div className="mb-2.5 font-mono text-[12.5px] font-medium text-ink-500">
        CAPSTONE · PHASE {data.phaseIndex + 1} · {data.metaTags}
      </div>
      <h1 className="mb-3.5 font-inter text-[30px] font-bold tracking-[-0.02em]">
        {data.title}
      </h1>
      <p className="mb-[26px] max-w-[640px] text-[15.5px]/[1.65] text-ink-700">
        {data.description}
      </p>

      {!submitted ? (
        <>
          {/* acceptance criteria */}
          <div className="mb-[18px] rounded-[12px] border border-line bg-card px-[26px] py-[22px]">
            <div className="mb-3.5 flex items-baseline justify-between">
              <span className="font-inter text-[14px] font-semibold">
                Acceptance criteria
              </span>
              <span
                className="font-mono text-[12.5px] font-medium"
                style={{ color: critCount === criteriaLabels.length ? "#059669" : "#6B7280" }}
              >
                {critCount} / {criteriaLabels.length}
              </span>
            </div>
            <div className="flex flex-col gap-2.5">
              {criteriaLabels.map((label, i) => {
                const on = criteria[i];
                return (
                  <button
                    key={i}
                    onClick={() => s.toggleCriterion(data.slug, i)}
                    className="flex items-center gap-3 border-none bg-transparent px-0 py-0.5 text-left"
                  >
                    <span
                      className="flex h-[19px] w-[19px] flex-none items-center justify-center rounded-md"
                      style={{
                        border: `1.5px solid ${on ? "#059669" : "#C4CBD6"}`,
                        background: on ? "#059669" : "var(--color-card)",
                      }}
                    >
                      <Check size={11} opacity={on ? 1 : 0} />
                    </span>
                    <span className="text-[14px] text-ink-900">{label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* hints */}
          <div className="mb-[18px] rounded-[12px] border border-line bg-card px-[26px] py-[22px]">
            <div className="mb-1.5 font-inter text-[14px] font-semibold">
              Stuck? Reveal hints one at a time
            </div>
            <p className="mb-3.5 text-[12.5px] text-ink-500">
              Struggling first is how it sticks. Hints don’t affect your score.
            </p>
            <div className="flex flex-col gap-[9px]">
              {hintTexts.map((text, i) =>
                hintsOpen[i] ? (
                  <div
                    key={i}
                    className="rounded-lg bg-[#F4F6F9] px-4 py-3 text-[13.5px]/[1.55] text-ink-900 dark:bg-[#1B2536]"
                  >
                    <span className="font-mono text-[12px] font-semibold text-blue">
                      HINT {i + 1} ·{" "}
                    </span>
                    {text}
                  </div>
                ) : (
                  <button
                    key={i}
                    onClick={() => s.revealHint(data.slug, i)}
                    className="rounded-lg border border-dashed border-[#C4CBD6] bg-card px-4 py-3 text-left font-inter text-[13px] font-semibold text-ink-500"
                  >
                    Reveal hint {i + 1}
                  </button>
                ),
              )}
            </div>
          </div>

          {/* submission */}
          <div className="rounded-[12px] border border-line bg-card px-[26px] py-[22px]">
            <div className="mb-4 font-inter text-[14px] font-semibold">
              Submit your project
            </div>
            <div className="flex flex-col gap-3">
              <input
                value={ghUrl}
                onChange={(e) => s.setGhUrl(data.slug, e.target.value)}
                placeholder="GitHub repo URL (must be public)"
                className="rounded-lg border border-line-input bg-transparent px-3.5 py-3 font-mono text-[14px] text-ink-900"
              />
              <input
                value={depUrl}
                onChange={(e) => s.setDepUrl(data.slug, e.target.value)}
                placeholder="Deployed URL"
                className="rounded-lg border border-line-input bg-transparent px-3.5 py-3 font-mono text-[14px] text-ink-900"
              />
              <div className="text-[12.5px] text-ink-500">
                On submit we auto-check: repo is public · README exists · no
                hardcoded secrets · tests pass. Then two peers review within 3
                days.
              </div>
              <button
                onClick={submit}
                className="rounded-[9px] p-[14px] font-inter text-[15px] font-semibold text-white"
                style={{ background: capReady ? "#059669" : "#B9C2CE" }}
              >
                Submit for peer review
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="rounded-[12px] border border-[#B7E3D4] bg-card px-8 py-[34px] text-center">
          <div className="mx-auto mb-[18px] flex h-[62px] w-[62px] items-center justify-center rounded-full bg-[#E7F5F1] [animation:framisPulse_1.4s_ease-out_2]">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 12.5l5 5L20 6.5"
                stroke="#059669"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2 className="mb-2 font-inter text-[22px] font-bold">
            {data.shippedHeadline}
          </h2>
          <p className="mb-1.5 text-[14.5px]/[1.6] text-ink-500">
            {data.autoCheckLine}
          </p>
          <p className="mb-[22px] text-[14.5px]/[1.6] text-ink-500">
            Two peers have been assigned. Reviews land within 3 days, then it
            goes on your portfolio.
          </p>
          <div className="flex flex-wrap justify-center gap-2.5">
            <button
              onClick={() => s.goTab("dashboard")}
              className="rounded-lg bg-blue px-[22px] py-3 font-inter text-[14px] font-semibold text-white"
            >
              Back to dashboard
            </button>
            <button
              onClick={() => s.goTab("review")}
              className="rounded-lg border border-[#C9DEF2] bg-card px-[22px] py-3 font-inter text-[14px] font-semibold text-blue"
            >
              Review a peer’s project now
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
