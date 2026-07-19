"use client";

import { useEffect, useState } from "react";
import { useFramis } from "@/lib/store";
import {
  fetchDiary,
  savePlan,
  addGoal,
  setGoalProgress,
  deleteGoal,
  addDiaryEntry,
  type DiaryData,
  type StudentPlan,
} from "@/lib/mentor/studentDiary";

export default function Diary() {
  const userId = useFramis((st) => st.userId);
  const [data, setData] = useState<DiaryData | null>(null);
  const [plan, setPlan] = useState<StudentPlan>({ mission: "", vision: "", howToAchieve: "" });
  const [savingPlan, setSavingPlan] = useState(false);
  const [planSaved, setPlanSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [goalTitle, setGoalTitle] = useState("");
  const [goalDetail, setGoalDetail] = useState("");
  const [goalDate, setGoalDate] = useState("");

  const [learnt, setLearnt] = useState("");
  const [stuckOn, setStuckOn] = useState("");
  const [note, setNote] = useState("");

  const load = () => {
    if (!userId) return;
    fetchDiary(userId).then((d) => {
      setData(d);
      setPlan(d.plan);
    });
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const doSavePlan = async () => {
    if (!userId) return;
    setSavingPlan(true);
    setError(null);
    const res = await savePlan(userId, plan);
    setSavingPlan(false);
    if (res.ok) {
      setPlanSaved(true);
      setTimeout(() => setPlanSaved(false), 2000);
    } else setError(res.error);
  };

  const doAddGoal = async () => {
    if (!userId || !goalTitle.trim()) return;
    const res = await addGoal(userId, goalTitle, goalDetail, goalDate);
    if (res.ok) {
      setGoalTitle("");
      setGoalDetail("");
      setGoalDate("");
      load();
    } else setError(res.error);
  };

  const doAddEntry = async () => {
    if (!userId || (!learnt.trim() && !stuckOn.trim() && !note.trim())) return;
    const res = await addDiaryEntry(userId, learnt, stuckOn, note);
    if (res.ok) {
      setLearnt("");
      setStuckOn("");
      setNote("");
      load();
    } else setError(res.error);
  };

  if (data === null) return <div className="text-[14px] text-ink-500">Loading your diary…</div>;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="mb-1 font-mono text-[12px] font-medium text-ink-500">DIARY</div>
        <h1 className="font-inter text-[24px] font-bold tracking-[-0.02em]">Your goals and progress</h1>
        <p className="mt-1 text-[13.5px] text-ink-500">
          This is yours to write. Your mentor can read it so they know what you&apos;re working toward and where
          you&apos;re stuck — they can&apos;t edit it.
        </p>
      </div>

      {error && <div className="rounded-[8px] bg-[#FDF0F0] px-3.5 py-2.5 text-[13px] font-medium text-[#DC2626]">{error}</div>}

      {/* mission / vision */}
      <div className="rounded-[12px] border border-line bg-card px-6 py-5">
        <div className="mb-3 font-mono text-[12px] font-semibold text-ink-500">MISSION &amp; VISION</div>
        <div className="flex flex-col gap-3">
          <label className="text-[13px] font-medium">
            My mission — why I&apos;m doing this
            <textarea
              value={plan.mission}
              onChange={(e) => setPlan({ ...plan, mission: e.target.value })}
              rows={2}
              className="mt-1 block w-full rounded-[8px] border border-line bg-transparent px-3 py-2 text-[13.5px]"
            />
          </label>
          <label className="text-[13px] font-medium">
            My vision — where I want to end up
            <textarea
              value={plan.vision}
              onChange={(e) => setPlan({ ...plan, vision: e.target.value })}
              rows={2}
              className="mt-1 block w-full rounded-[8px] border border-line bg-transparent px-3 py-2 text-[13.5px]"
            />
          </label>
          <label className="text-[13px] font-medium">
            How I&apos;m going to get there
            <textarea
              value={plan.howToAchieve}
              onChange={(e) => setPlan({ ...plan, howToAchieve: e.target.value })}
              rows={3}
              className="mt-1 block w-full rounded-[8px] border border-line bg-transparent px-3 py-2 text-[13.5px]"
            />
          </label>
          <div className="flex items-center gap-3">
            <button onClick={doSavePlan} disabled={savingPlan} className="w-fit rounded-[8px] bg-blue px-4 py-2 text-[13px] font-semibold text-white disabled:opacity-60">
              {savingPlan ? "Saving…" : "Save"}
            </button>
            {planSaved && <span className="text-[13px] font-medium text-success">Saved</span>}
          </div>
        </div>
      </div>

      {/* goals */}
      <div className="rounded-[12px] border border-line bg-card px-6 py-5">
        <div className="mb-3 font-mono text-[12px] font-semibold text-ink-500">MY GOALS</div>

        {data.goals.length === 0 ? (
          <p className="text-[14px] text-ink-500">No goals yet. Add the first one below.</p>
        ) : (
          <ul className="mb-5 flex flex-col gap-4">
            {data.goals.map((g) => (
              <li key={g.id}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="font-inter text-[14px] font-semibold">
                    {g.title}
                    {g.achievedAt && <span className="ml-2 text-[12px] font-medium text-success">achieved</span>}
                  </div>
                  <button
                    onClick={async () => {
                      await deleteGoal(g.id);
                      load();
                    }}
                    className="text-[12px] font-medium text-ink-500 hover:text-[#DC2626]"
                  >
                    remove
                  </button>
                </div>
                {g.detail && <p className="mt-0.5 text-[13px] text-ink-500">{g.detail}</p>}
                {g.targetDate && <p className="mt-0.5 text-[12px] text-ink-500">Target: {g.targetDate}</p>}
                <div className="mt-2 flex items-center gap-3">
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    defaultValue={g.progressPct}
                    onMouseUp={async (e) => {
                      await setGoalProgress(g.id, Number((e.target as HTMLInputElement).value));
                      load();
                    }}
                    onTouchEnd={async (e) => {
                      await setGoalProgress(g.id, Number((e.target as HTMLInputElement).value));
                      load();
                    }}
                    className="h-1.5 flex-1 accent-blue"
                  />
                  <span className="w-12 flex-none text-right font-mono text-[12.5px] text-ink-500">{g.progressPct}%</span>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="flex flex-col gap-2 border-t border-line pt-4">
          <input
            value={goalTitle}
            onChange={(e) => setGoalTitle(e.target.value)}
            placeholder="New goal — e.g. Deploy my first app"
            className="rounded-[8px] border border-line bg-transparent px-3 py-2 text-[13.5px]"
          />
          <input
            value={goalDetail}
            onChange={(e) => setGoalDetail(e.target.value)}
            placeholder="Any detail (optional)"
            className="rounded-[8px] border border-line bg-transparent px-3 py-2 text-[13.5px]"
          />
          <div className="flex flex-wrap items-center gap-2">
            <label className="text-[12.5px] text-ink-500">
              Target date
              <input
                type="date"
                value={goalDate}
                onChange={(e) => setGoalDate(e.target.value)}
                className="ml-2 rounded-[8px] border border-line bg-transparent px-2 py-1.5 text-[13px]"
              />
            </label>
            <button onClick={doAddGoal} disabled={!goalTitle.trim()} className="rounded-[8px] bg-blue px-4 py-2 text-[13px] font-semibold text-white disabled:opacity-60">
              Add goal
            </button>
          </div>
        </div>
      </div>

      {/* diary log */}
      <div className="rounded-[12px] border border-line bg-card px-6 py-5">
        <div className="mb-3 font-mono text-[12px] font-semibold text-ink-500">LOG AN ENTRY</div>
        <div className="flex flex-col gap-2">
          <label className="text-[13px] font-medium">
            What I learnt
            <textarea value={learnt} onChange={(e) => setLearnt(e.target.value)} rows={2} className="mt-1 block w-full rounded-[8px] border border-line bg-transparent px-3 py-2 text-[13.5px]" />
          </label>
          <label className="text-[13px] font-medium">
            What I don&apos;t understand yet
            <textarea value={stuckOn} onChange={(e) => setStuckOn(e.target.value)} rows={2} className="mt-1 block w-full rounded-[8px] border border-line bg-transparent px-3 py-2 text-[13.5px]" />
          </label>
          <label className="text-[13px] font-medium">
            Anything else
            <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={2} className="mt-1 block w-full rounded-[8px] border border-line bg-transparent px-3 py-2 text-[13.5px]" />
          </label>
          <button
            onClick={doAddEntry}
            disabled={!learnt.trim() && !stuckOn.trim() && !note.trim()}
            className="w-fit rounded-[8px] bg-blue px-4 py-2 text-[13px] font-semibold text-white disabled:opacity-60"
          >
            Add entry
          </button>
        </div>

        {data.entries.length > 0 && (
          <ul className="mt-5 flex flex-col gap-3 border-t border-line pt-4">
            {data.entries.map((e) => (
              <li key={e.id} className="text-[13.5px]">
                <div className="font-mono text-[11.5px] font-semibold text-ink-500">{e.entryDate}</div>
                {e.learnt && <p className="mt-1"><span className="font-medium">Learnt:</span> {e.learnt}</p>}
                {e.stuckOn && <p className="mt-0.5"><span className="font-medium">Stuck on:</span> {e.stuckOn}</p>}
                {e.note && <p className="mt-0.5 text-ink-500">{e.note}</p>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
