"use client";

import Reveal from "./Reveal";

/** Mono "// eyebrow" that ties the light sections to the hero/roadmap voice. */
function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 flex items-center gap-2 font-mono text-[11.5px] font-medium uppercase tracking-[0.14em] text-teal before:h-px before:w-4 before:bg-teal before:content-['']">
      {children}
    </p>
  );
}

/**
 * "Not another learn-to-code course" — three pillars (See / Verify / Ship),
 * each with a real proof instead of an empty card. The Verify pillar shows the
 * actual planted peer-review bug; the See pillar keeps a live (looping) motion
 * cue. Hairline dividers, no floating cards — matches the technical voice.
 */
export default function WhyFramis() {
  return (
    <Reveal id="how" className="flex justify-center px-6 py-16 sm:px-12 sm:py-20">
      <div className="w-full max-w-[960px]">
        <Eyebrow>Why Framis</Eyebrow>
        <h2 className="mb-2 font-inter text-[26px] font-bold tracking-[-0.02em] sm:text-[30px]">
          Not another “learn to code” course.
        </h2>
        <p className="mb-9 max-w-[56ch] text-[15px]/[1.6] text-ink-500">
          Bootcamps teach syntax. Framis teaches the thinking that matters when AI writes the code — three
          habits, drilled on real work.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3">
          {/* See it */}
          <div
            data-stagger="1"
            className="border-t border-line py-6 md:border-l md:border-t-0 md:px-7 md:py-1 md:first:border-l-0 md:first:pl-0"
            style={{ animationDelay: "0.05s" }}
          >
            <div className="mb-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-blue">See it</div>
            <div className="mb-1.5 font-inter text-[17px] font-semibold tracking-[-0.01em]">Motion-guided lessons</div>
            <p className="mb-3.5 text-[14px]/[1.6] text-ink-500">
              Every concept — variables to RAG — explained as an interactive animation, not a wall of text.
            </p>
            <div className="flex items-center justify-between gap-3 rounded-[10px] bg-navy p-4">
              <div className="font-mono text-[12.5px]/[1.7] text-[#E8EAF0]">
                name = <span className="text-teal">&quot;Alex&quot;</span>
                <br />
                print(name)
                <span className="ml-0.5 inline-block h-[13px] w-[7px] translate-y-[2px] bg-teal align-middle [animation:framisCaret_1s_infinite] motion-reduce:animate-none" />
              </div>
              <div className="w-[74px] flex-none text-center">
                <div className="flex h-12 items-center justify-center rounded-[10px] border-2 border-dashed border-teal bg-teal/10 font-mono text-[12px] text-teal [animation:framisPulse_2.6s_ease-out_infinite] motion-reduce:animate-none">
                  &quot;Alex&quot;
                </div>
                <div className="mt-1.5 font-mono text-[11px] text-slateink-300">name</div>
              </div>
            </div>
          </div>

          {/* Verify it — the real planted bug */}
          <div
            data-stagger="1"
            className="border-t border-line py-6 md:border-l md:border-t-0 md:px-7 md:py-1"
            style={{ animationDelay: "0.14s" }}
          >
            <div className="mb-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-teal">Verify it</div>
            <div className="mb-1.5 font-inter text-[17px] font-semibold tracking-[-0.01em]">Judgment over prompting</div>
            <p className="mb-3.5 text-[14px]/[1.6] text-ink-500">
              Testing, security and evals are core — so you catch AI-written mistakes before production does.
            </p>
            <div className="overflow-x-auto rounded-[10px] bg-navy p-4 font-mono text-[12.5px]/[1.85] text-[#E8EAF0]">
              <div className="text-[#5B6B82]">def login(email, password):</div>
              <div>&nbsp;&nbsp;user = db.get_user(email)</div>
              <div className="-mx-4 border-l-2 border-danger bg-danger/20 py-px pl-[14px] pr-4">
                &nbsp;&nbsp;if user.password == password:&nbsp;&nbsp;
                <span className="text-[#e0908f]"># plain-text?</span>
              </div>
              <div>&nbsp;&nbsp;&nbsp;&nbsp;return make_token(user)</div>
            </div>
          </div>

          {/* Ship it */}
          <div
            data-stagger="1"
            className="border-t border-line py-6 md:border-l md:border-t-0 md:px-7 md:py-1 md:last:pr-0"
            style={{ animationDelay: "0.23s" }}
          >
            <div className="mb-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-success">Ship it</div>
            <div className="mb-1.5 font-inter text-[17px] font-semibold tracking-[-0.01em]">Portfolio, not certificates</div>
            <p className="mb-3.5 text-[14px]/[1.6] text-ink-500">
              Seven capstones, all deployed and public on GitHub — proof of capability employers can inspect.
            </p>
            <div className="flex flex-col gap-2">
              <span className="inline-flex items-center gap-2 rounded-[8px] bg-[#EAF2FB] px-3 py-2 font-mono text-[12px] text-blue">
                <span className="h-[7px] w-[7px] flex-none rounded-full bg-blue" />
                github.com/•••/notes-app
              </span>
              <span className="inline-flex items-center gap-2 rounded-[8px] bg-[#E7F5F1] px-3 py-2 font-mono text-[12px] text-success">
                <span className="h-[7px] w-[7px] flex-none rounded-full bg-success [animation:framisPulse_2s_ease-out_infinite] motion-reduce:animate-none" />
                notes-app.vercel.app ✓ live
              </span>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  );
}
