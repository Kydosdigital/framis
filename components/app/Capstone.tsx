"use client";

import { useEffect, useState } from "react";
import { useFramis } from "@/lib/store";
import { CAPSTONES, CAPSTONE_TEMPLATES, CAPSTONE_CHECKLIST, CAPSTONE_RUBRIC } from "@/lib/data";
import { createClient } from "@/lib/supabase/client";
import { Check } from "../ui";
import { Icon } from "../Icon";

function CollapsibleSection({ title, children }: { title: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mb-[18px] overflow-hidden rounded-[12px] border border-line bg-card">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 border-none bg-transparent px-[26px] py-[18px] text-left"
      >
        <span className="flex-1 font-inter text-[14px] font-semibold">{title}</span>
        <span className="flex-none font-mono text-[12px] text-blue">{open ? "▼" : "▶"}</span>
      </button>
      {open && <div className="border-t border-line px-[26px] py-[20px]">{children}</div>}
    </div>
  );
}

type GalleryRow = {
  project_title: string;
  project_slug: string;
  github_url: string | null;
  deployed_url: string | null;
  submitted_at: string | null;
  author_name: string | null;
  portfolio_slug: string;
};

function Gallery() {
  const [rows, setRows] = useState<GalleryRow[] | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.rpc("get_capstone_gallery").then(({ data }) => {
      setRows((data as GalleryRow[] | null) ?? []);
    }, () => setRows([]));
  }, []);

  if (rows === null) {
    return <p className="text-[13.5px] text-ink-500">Loading…</p>;
  }
  if (rows.length === 0) {
    return (
      <p className="text-[13.5px]/[1.6] text-ink-500">
        Nothing here yet — shipped, passed capstones from learners with a
        public portfolio will show up here. Be the first.
      </p>
    );
  }
  return (
    <div className="flex flex-col gap-3">
      {rows.map((r, i) => (
        <div key={i} className="rounded-lg border border-line bg-card px-4 py-3.5">
          <div className="mb-0.5 font-inter text-[13.5px] font-semibold">{r.project_title}</div>
          <div className="mb-2 text-[12.5px] text-ink-500">by {r.author_name ?? "a Framis learner"}</div>
          <div className="flex flex-wrap gap-3 font-mono text-[12px] text-blue">
            {r.github_url && <span>{r.github_url}</span>}
            {r.deployed_url && <span>{r.deployed_url}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}

function TemplatePicker({ onPick }: { onPick: (slug: string) => void }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-4">
      {CAPSTONE_TEMPLATES.map((t) => (
        <button
          key={t.slug}
          onClick={() => onPick(t.slug)}
          className="flex flex-col gap-2 rounded-[12px] border border-line bg-card px-5 py-[18px] text-left transition-[border-color,box-shadow] duration-200 hover:border-blue hover:shadow-[0_10px_24px_rgba(10,20,40,.08)]"
        >
          <div className="flex items-center gap-2.5">
            <Icon name={t.icon} size={20} className="text-blue" />
            <span className="font-inter text-[15px] font-semibold">{t.name}</span>
          </div>
          <div className="font-mono text-[11.5px] font-medium text-ink-400">
            {t.difficulty.toUpperCase()} · {t.timeEstimate.toUpperCase()}
          </div>
          <p className="text-[13px]/[1.5] text-ink-500">{t.overview}</p>
        </button>
      ))}
    </div>
  );
}

export default function Capstone() {
  const s = useFramis();
  const userId = useFramis((st) => st.userId);
  const slug = useFramis((st) => st.activeCapstoneSlug);
  const data = CAPSTONES.find((c) => c.slug === slug) ?? CAPSTONES[0];
  const templateSlug = s.capstoneTemplateChoice[data.slug];
  const template = CAPSTONE_TEMPLATES.find((t) => t.slug === templateSlug);

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

      {data.templates && !template && !submitted ? (
        <>
          <h2 className="mb-4 font-inter text-[18px] font-semibold">Pick a domain</h2>
          <TemplatePicker onPick={(t) => s.chooseCapstoneTemplate(data.slug, t)} />
        </>
      ) : (
        <>
      {template && !submitted && (
        <div className="mb-[18px] rounded-[12px] border border-line bg-card px-[26px] py-[22px]">
          <div className="mb-1 flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 font-inter text-[14px] font-semibold">
              <Icon name={template.icon} size={16} className="text-blue" />
              {template.name}
            </span>
            <button
              onClick={() => s.chooseCapstoneTemplate(data.slug, "")}
              className="font-mono text-[11.5px] font-medium text-blue"
            >
              change domain
            </button>
          </div>
          <p className="mb-3.5 text-[13.5px]/[1.6] text-ink-500">{template.overview}</p>
          <div className="mb-3.5 grid grid-cols-2 gap-x-4 gap-y-1.5 text-[12.5px] text-ink-500 sm:grid-cols-3">
            <div><span className="text-ink-400">Backend</span> {template.stack.backend}</div>
            <div><span className="text-ink-400">Frontend</span> {template.stack.frontend}</div>
            <div><span className="text-ink-400">Database</span> {template.stack.database}</div>
            <div><span className="text-ink-400">AI</span> {template.stack.aiComponent}</div>
            <div><span className="text-ink-400">Deploy</span> {template.stack.deployment}</div>
          </div>
          <CollapsibleSection title="Architecture, starter code &amp; key decisions">
            <div className="mb-4">
              <div className="mb-1.5 font-inter text-[13px] font-semibold">How it works</div>
              <ol className="list-decimal pl-5 text-[13px]/[1.6] text-ink-500">
                {template.architecture.map((step, i) => <li key={i}>{step}</li>)}
              </ol>
            </div>
            <div className="mb-4">
              <div className="mb-1.5 font-inter text-[13px] font-semibold">Starter folder structure</div>
              <pre className="overflow-x-auto rounded-lg bg-[#0A1428] px-4 py-3 font-mono text-[12px]/[1.6] text-slateink-200">
                {template.starterFolderStructure}
              </pre>
            </div>
            {template.starterCode.map((f) => (
              <div key={f.filename} className="mb-4">
                <div className="mb-1.5 font-mono text-[12px] font-semibold text-ink-500">{f.filename}</div>
                <pre className="overflow-x-auto rounded-lg bg-[#0A1428] px-4 py-3 font-mono text-[12px]/[1.6] text-slateink-200">
                  {f.code}
                </pre>
              </div>
            ))}
            <div>
              <div className="mb-1.5 font-inter text-[13px] font-semibold">Key decisions</div>
              <ul className="list-disc pl-5 text-[13px]/[1.6] text-ink-500">
                {template.keyDecisions.map((k, i) => <li key={i} className="mb-1.5">{k}</li>)}
              </ul>
            </div>
          </CollapsibleSection>
        </div>
      )}

      {!submitted && (
        <>
          <CollapsibleSection title="What does “production-ready” actually mean?">
            <div className="flex flex-col gap-4">
              {CAPSTONE_CHECKLIST.map((sec) => (
                <div key={sec.section}>
                  <div className="mb-1.5 font-inter text-[13px] font-semibold">{sec.section}</div>
                  <ul className="list-disc pl-5 text-[13px]/[1.6] text-ink-500">
                    {sec.items.map((item, i) => <li key={i} className="mb-1">{item}</li>)}
                  </ul>
                </div>
              ))}
            </div>
          </CollapsibleSection>
          <CollapsibleSection title="How this gets scored">
            <div className="flex flex-col gap-3">
              {CAPSTONE_RUBRIC.map((r) => (
                <div key={r.category} className="rounded-lg bg-[#F4F6F9] px-4 py-3 dark:bg-[#1B2536]">
                  <div className="mb-1 flex items-baseline justify-between">
                    <span className="font-inter text-[13px] font-semibold">{r.category}</span>
                    <span className="font-mono text-[11.5px] font-medium text-blue">{r.weight}</span>
                  </div>
                  <div className="text-[12.5px]/[1.5] text-ink-500">
                    <span className="font-medium text-teal">Excellent: </span>{r.excellent}
                  </div>
                  <div className="text-[12.5px]/[1.5] text-ink-500">
                    <span className="font-medium text-danger">Poor: </span>{r.poor}
                  </div>
                </div>
              ))}
            </div>
          </CollapsibleSection>
          <CollapsibleSection title="See what others have shipped">
            <Gallery />
          </CollapsibleSection>
        </>
      )}

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
        </>
      )}
    </div>
  );
}
