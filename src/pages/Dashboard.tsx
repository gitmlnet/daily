import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, BookOpen, Plus, CheckCircle2, Clock3, Target, AlertCircle } from "lucide-react";
import type { AppData, StudyPlan, StudySession } from "../types";
import { addDays, formatDuration, localDate } from "../lib/storage";
import { getChapter } from "../data/syllabus";
import { Metric, studyLabel } from "../components/UI";

type Props = { data: AppData; go: (page: any) => void };
const dayNames = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
type TargetKey = { date: string; subjectId: string; paperId: string; chapterId: string };
const keyOf = (item: TargetKey) => [item.date, item.subjectId, item.paperId, item.chapterId].join("|");

function weekStart(date: string) {
  const day = new Date(date + "T12:00:00").getDay();
  return addDays(date, -((day + 1) % 7));
}
function prettyDate(date: string) {
  return new Date(date + "T12:00:00").toLocaleDateString(undefined, { day: "numeric", month: "short" });
}
function TargetCard({ plan, sessions }: { plan: StudyPlan; sessions: StudySession[] }) {
  const chapter = getChapter(plan.subjectId, plan.paperId, plan.chapterId);
  const completion = sessions.reduce((max, session) => Math.max(max, session.progress ?? 0), 0);
  const minutes = sessions.reduce((sum, session) => sum + session.duration, 0);
  const done = completion >= 100;
  const status = done ? "Completed" : completion > 0 || sessions.length > 0 ? "In progress" : "Not started";
  const statusClass = done ? "complete" : completion > 0 || sessions.length > 0 ? "active" : "pending";
  return (
    <div className={"week-target " + (done ? "is-done" : "")}>
      <div className="week-target-top">
        <div className="week-target-title">
          <b>{studyLabel(plan.subjectId, plan.paperId)}</b>
          <span>{chapter?.name || "Chapter"}{plan.topic ? " · " + plan.topic : ""}</span>
        </div>
        <span className={"target-status " + statusClass}>{status}</span>
      </div>
      <div className="week-target-bottom">
        <div className="target-track"><i style={{ width: completion + "%" }} /></div>
        <strong>{completion}%</strong>
        <small>{minutes > 0 ? formatDuration(minutes) + " studied" : "No study logged"}</small>
      </div>
    </div>
  );
}
function DayCard({ date, index, plans, sessions, today, onPlan, onLog }: {
  date: string; index: number; plans: StudyPlan[]; sessions: StudySession[];
  today: boolean; onPlan: () => void; onLog: () => void;
}) {
  const plannedKeys = new Set(plans.map(keyOf));
  const unplanned = sessions.filter(session => !plannedKeys.has(keyOf(session)));
  const minutes = sessions.reduce((sum, session) => sum + session.duration, 0);
  const completed = plans.filter(plan =>
    sessions.some(session => keyOf(session) === keyOf(plan) && (session.progress ?? 0) >= 100)
  ).length;
  const allDone = plans.length > 0 && completed === plans.length;
  return (
    <article className={"week-day " + (today ? "is-today" : "")}>
      <div className="week-day-heading">
        <div className="week-day-date">
          <span>{dayNames[index]}</span><b>{prettyDate(date)}</b>{today && <em>Today</em>}
        </div>
        <div className="week-day-summary">
          <strong>{completed}/{plans.length}</strong><small>targets done</small>
          <strong>{formatDuration(minutes)}</strong><small>studied</small>
        </div>
      </div>
      {plans.length > 0 ? (
        <div className="week-targets">
          {plans.map(plan => (
            <TargetCard key={plan.id} plan={plan} sessions={sessions.filter(session => keyOf(session) === keyOf(plan))} />
          ))}
        </div>
      ) : (
        <div className="week-empty">{today ? "No targets planned for today. Set your commitments now." : "No targets planned."}</div>
      )}
      {unplanned.length > 0 && (
        <div className="unplanned-block">
          <b>Additional study</b>
          {unplanned.map(session => (
            <div className="unplanned-item" key={session.id}>
              <span>{studyLabel(session.subjectId, session.paperId)} · {getChapter(session.subjectId, session.paperId, session.chapterId)?.name}</span>
              <strong>{formatDuration(session.duration)}</strong>
            </div>
          ))}
        </div>
      )}
      <div className="day-actions">
        <button className="text-btn" onClick={onPlan}><Plus size={14} /> Add target</button>
        <button className="text-btn" onClick={onLog}><Clock3 size={14} /> Log study</button>
        {allDone && <span className="day-done"><CheckCircle2 size={14} /> All targets complete</span>}
      </div>
    </article>
  );
}
export default function Dashboard({ data, go }: Props) {
  const [today] = useState(localDate());
  const [anchor, setAnchor] = useState(localDate());
  const start = weekStart(anchor);
  const dates = useMemo(() => Array.from({ length: 7 }, (_, index) => addDays(start, index)), [start]);
  const weekPlans = data.plans.filter(plan => dates.includes(plan.date));
  const weekSessions = data.sessions.filter(session => dates.includes(session.date));
  const totalMinutes = weekSessions.reduce((sum, session) => sum + session.duration, 0);
  const completed = weekPlans.filter(plan =>
    weekSessions.some(session => keyOf(session) === keyOf(plan) && (session.progress ?? 0) >= 100)
  ).length;
  const pending = Math.max(0, weekPlans.length - completed);
  const completionRate = weekPlans.length ? Math.round((completed / weekPlans.length) * 100) : 0;
  const title = prettyDate(dates[0]) + " – " + prettyDate(dates[6]);
  return (
    <div className="stack">
      <section className="week-hero">
        <div>
          <span className="eyebrow">YOUR WEEKLY COMMITMENT</span>
          <h2>Make this week count.</h2>
          <p>Every target is a promise to yourself. Keep today's priorities visible and finish them one by one.</p>
        </div>
        <button className="primary" onClick={() => go("planning")}><Plus size={17} /> Plan study</button>
      </section>
      <section className="week-toolbar">
        <div>
          <span className="eyebrow">WEEKLY PLAN</span><h2>{title}</h2><small>Saturday – Friday · 7 days</small>
        </div>
        <div className="week-nav">
          <button className="icon-btn" onClick={() => setAnchor(addDays(start, -7))} aria-label="Previous week"><ArrowLeft /></button>
          <button className="secondary this-week" onClick={() => setAnchor(today)}>This week</button>
          <button className="icon-btn" onClick={() => setAnchor(addDays(start, 7))} aria-label="Next week"><ArrowRight /></button>
        </div>
      </section>
      <div className="metrics">
        <Metric icon={Target} label="Planned targets" value={String(weekPlans.length)} />
        <Metric icon={CheckCircle2} label="Completed" value={String(completed)} />
        <Metric icon={AlertCircle} label="Still to finish" value={String(pending)} />
        <Metric icon={Clock3} label="Study time" value={formatDuration(totalMinutes)} />
      </div>
      <section className="week-board">
        <div className="week-board-heading">
          <div><span className="eyebrow">DAY BY DAY</span><h2>Your commitments</h2></div>
          <span className="week-progress-label">{completionRate}% of weekly targets complete</span>
        </div>
        <div className="week-overall-track"><i style={{ width: completionRate + "%" }} /></div>
        <div className="week-days">
          {dates.map((date, index) => (
            <DayCard key={date} date={date} index={index}
              plans={data.plans.filter(plan => plan.date === date)}
              sessions={data.sessions.filter(session => session.date === date)}
              today={date === today} onPlan={() => go("planning")} onLog={() => go("daily")} />
          ))}
        </div>
      </section>
      <div className="week-footer">
        <BookOpen size={17} />
        <span>Plan more than one subject each day. Each chapter or topic has its own daily completion, independent of the same subject on other days.</span>
      </div>
    </div>
  );
}
