"use client";

import { useEffect, useState } from "react";
import { useFramis, useDisplayName } from "@/lib/store";
import { createClient } from "@/lib/supabase/client";
import { withTimeout } from "@/lib/timeout";

type ShippedProject = {
  id: number;
  title: string;
  description: string | null;
  githubUrl: string | null;
  deployedUrl: string | null;
  status: string;
};

type Testimonial = { id: number; content: string };

const SKILLS = [
  "Full-stack development",
  "Testing & CI/CD",
  "AI application engineering",
  "System design",
  "Debugging & production ops",
];

export default function Portfolio() {
  const userId = useFramis((s) => s.userId);
  const userEmail = useFramis((s) => s.userEmail);
  const displayName = useDisplayName();

  const [loading, setLoading] = useState(true);
  const [portfolioId, setPortfolioId] = useState<number | null>(null);
  const [slug, setSlug] = useState<string | null>(null);
  const [isPublic, setIsPublic] = useState(false);
  const [bio, setBio] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [projects, setProjects] = useState<ShippedProject[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }
    const supabase = createClient();
    let cancelled = false;

    (async () => {
      try {
        const [{ data: portfolio }, { data: subs }] = await withTimeout(
          Promise.all([
            supabase
              .from("portfolios")
              .select("id, slug, is_public, bio")
              .eq("user_id", userId)
              .maybeSingle(),
            supabase
              .from("project_submissions")
              .select("id, github_url, deployed_url, status, projects(title, description)")
              .eq("user_id", userId)
              .in("status", ["submitted", "under_review", "passed"]),
          ]),
          8000,
        );
        if (cancelled) return;

        setPortfolioId(portfolio?.id ?? null);
        setSlug(portfolio?.slug ?? null);
        setIsPublic(portfolio?.is_public ?? false);
        setBio(portfolio?.bio ?? "");
        setProjects(
          (subs ?? []).map((row) => {
            const project = Array.isArray(row.projects) ? row.projects[0] : row.projects;
            return {
              id: row.id,
              title: project?.title ?? "Capstone project",
              description: project?.description ?? null,
              githubUrl: row.github_url,
              deployedUrl: row.deployed_url,
              status: row.status,
            };
          }),
        );

        if (portfolio?.id) {
          const { data: t } = await withTimeout(
            supabase.from("portfolio_testimonials").select("id, content").eq("portfolio_id", portfolio.id),
            8000,
          );
          if (!cancelled) setTestimonials(t ?? []);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [userId]);

  const save = async (nextPublic: boolean) => {
    if (!userId) return;
    setSaving(true);
    const supabase = createClient();
    const nextSlug =
      slug ??
      `${(displayName || "learner").toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${userId.slice(0, 6)}`;
    const { data } = await supabase
      .from("portfolios")
      .upsert(
        { user_id: userId, slug: nextSlug, bio, is_public: nextPublic },
        { onConflict: "user_id" },
      )
      .select("id, slug")
      .single();
    setPortfolioId(data?.id ?? portfolioId);
    setSlug(data?.slug ?? nextSlug);
    setIsPublic(nextPublic);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (loading) {
    return <div className="max-w-[780px] text-[14px] text-ink-500">Loading your portfolio…</div>;
  }

  return (
    <div className="max-w-[780px]">
      <div className="mb-2.5 font-mono text-[12.5px] font-medium text-ink-500">
        YOUR PORTFOLIO
      </div>
      <h1 className="mb-3.5 font-inter text-[30px] font-bold tracking-[-0.02em]">
        {displayName}&apos;s AI Engineering Portfolio
      </h1>

      <div className="mb-[18px] rounded-[12px] border border-line bg-card px-[26px] py-[22px]">
        <div className="mb-2 font-inter text-[14px] font-semibold">Bio</div>
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Full-stack developer + AI engineer. Building production systems with AI, one capstone at a time."
          className="min-h-[90px] w-full resize-y rounded-lg border border-line-input bg-transparent px-3.5 py-3 text-[14px]/[1.6] text-ink-900"
        />
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            onClick={() => save(!isPublic)}
            disabled={saving}
            className="rounded-lg px-5 py-2.5 font-inter text-[13.5px] font-semibold text-white"
            style={{ background: isPublic ? "#059669" : "#0066CC" }}
          >
            {isPublic ? "Public — click to unpublish" : "Publish portfolio"}
          </button>
          <button
            onClick={() => save(isPublic)}
            disabled={saving}
            className="rounded-lg border border-line-input bg-transparent px-4 py-2.5 font-inter text-[13px] font-semibold text-ink-700"
          >
            Save bio
          </button>
          {saved && <span className="text-[13px] font-medium text-success">Saved.</span>}
          {slug && (
            <span className="ml-auto font-mono text-[12.5px] text-ink-500">
              framis.dev/portfolio/{slug}
            </span>
          )}
        </div>
      </div>

      <div className="mb-[18px] rounded-[12px] border border-line bg-card px-[26px] py-[22px]">
        <div className="mb-4 font-inter text-[14px] font-semibold">Shipped projects</div>
        {projects.length === 0 ? (
          <p className="text-[13.5px] text-ink-500">
            Nothing shipped yet — submit your first capstone and it&apos;ll show up here.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {projects.map((p) => (
              <div key={p.id} className="rounded-[9px] border border-line px-4 py-3">
                <div className="mb-1 flex items-center justify-between gap-3">
                  <span className="font-inter text-[14.5px] font-semibold">{p.title}</span>
                  <span className="font-mono text-[11px] font-medium uppercase text-teal">
                    {p.status}
                  </span>
                </div>
                {p.description && (
                  <p className="mb-2 text-[13px]/[1.5] text-ink-500">{p.description}</p>
                )}
                <div className="flex flex-wrap gap-2 font-mono text-[12px] text-blue">
                  {p.githubUrl && <span>{p.githubUrl}</span>}
                  {p.deployedUrl && <span>{p.deployedUrl}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mb-[18px] rounded-[12px] border border-line bg-card px-[26px] py-[22px]">
        <div className="mb-3 font-inter text-[14px] font-semibold">Skills verified</div>
        <div className="flex flex-wrap gap-2">
          {SKILLS.map((skill) => (
            <span
              key={skill}
              className="rounded-full bg-[#EAF2FB] px-[13px] py-1.5 text-[12px] font-medium text-blue dark:bg-[#1B2536]"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="mb-[18px] rounded-[12px] border border-line bg-card px-[26px] py-[22px]">
        <div className="mb-3 font-inter text-[14px] font-semibold">Testimonials</div>
        {testimonials.length === 0 ? (
          <p className="text-[13.5px] text-ink-500">
            Peer reviewers who read your code can leave a testimonial here.
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            {testimonials.map((t) => (
              <p key={t.id} className="text-[13.5px]/[1.6] text-ink-700">
                &ldquo;{t.content}&rdquo;
              </p>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-[12px] bg-navy px-7 py-6 text-center">
        <p className="mb-3 font-inter text-[16px] font-semibold text-white">
          Hire {displayName} →
        </p>
        {userEmail && (
          <a href={`mailto:${userEmail}`} className="font-mono text-[13px] text-teal">
            {userEmail}
          </a>
        )}
      </div>
    </div>
  );
}
