import { useState } from "react";
import { Panel, SectionHeader } from "../components/ui";
import { ROADMAP, TOTAL_ACTIVITIES } from "../data/roadmap";

const key = (phaseId: string, activityId: string) => `${phaseId}/${activityId}`;

export function Roadmap() {
  // Completion and expansion live in memory only: reloading the page starts afresh.
  const [done, setDone] = useState<ReadonlySet<string>>(new Set());
  const [open, setOpen] = useState<ReadonlySet<string>>(new Set());

  const toggle = (set: ReadonlySet<string>, update: (s: Set<string>) => void, k: string) => {
    const next = new Set(set);
    if (next.has(k)) next.delete(k);
    else next.add(k);
    update(next);
  };

  const allKeys = ROADMAP.flatMap((phase) => phase.activities.map((a) => key(phase.id, a.id)));
  const overall = Math.round((100 * done.size) / TOTAL_ACTIVITIES);

  return (
    <div className="section">
      <SectionHeader eyebrow="04 · 30/60/90 Roadmap" title="Customer enablement roadmap">
        <p>
          A structured 90-day programme a specialist can run with a customer: discover and
          prepare, pilot and enable, then evaluate and expand. Open an activity for guidance and
          tick it off as you go. Progress stays in this browser tab only.
        </p>
      </SectionHeader>

      <div className="roadmap-toolbar">
        <div className="progress-block">
          <p>
            <strong>{done.size}</strong> of {TOTAL_ACTIVITIES} activities complete
          </p>
          <div
            className="progress"
            role="progressbar"
            aria-label="Overall roadmap progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={overall}
          >
            <span style={{ width: `${overall}%` }} />
          </div>
        </div>
        <div className="toolbar-buttons">
          <button type="button" className="button-secondary" onClick={() => setOpen(new Set(allKeys))}>
            Expand all
          </button>
          <button type="button" className="button-secondary" onClick={() => setOpen(new Set())}>
            Collapse all
          </button>
          <button type="button" className="button-secondary" onClick={() => setDone(new Set())} disabled={done.size === 0}>
            Reset progress
          </button>
        </div>
      </div>

      <ol className="phases">
        {ROADMAP.map((phase, phaseIndex) => {
          const complete = phase.activities.filter((a) => done.has(key(phase.id, a.id))).length;
          const phasePercent = Math.round((100 * complete) / phase.activities.length);
          return (
            <li key={phase.id} className={`phase phase-${phaseIndex + 1}`}>
              <Panel>
                <div className="phase-head">
                  <p className="phase-days">{phase.days}</p>
                  <h2>{phase.title}</h2>
                  <p className="phase-goal">{phase.goal}</p>
                  <div className="phase-progress">
                    <div
                      className="progress"
                      role="progressbar"
                      aria-label={`${phase.title} progress`}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-valuenow={phasePercent}
                    >
                      <span style={{ width: `${phasePercent}%` }} />
                    </div>
                    <span className="muted small">
                      {complete}/{phase.activities.length}
                      {complete === phase.activities.length && " · Complete ✓"}
                    </span>
                  </div>
                </div>
                <ul className="activities">
                  {phase.activities.map((activity) => {
                    const k = key(phase.id, activity.id);
                    const isDone = done.has(k);
                    const isOpen = open.has(k);
                    const detailId = `detail-${phase.id}-${activity.id}`;
                    return (
                      <li key={activity.id} className={`activity ${isDone ? "is-done" : ""}`}>
                        <div className="activity-row">
                          <input
                            type="checkbox"
                            id={`check-${phase.id}-${activity.id}`}
                            checked={isDone}
                            onChange={() => toggle(done, setDone, k)}
                            aria-label={`Mark "${activity.title}" complete`}
                          />
                          <button
                            type="button"
                            className="activity-toggle"
                            aria-expanded={isOpen}
                            aria-controls={detailId}
                            onClick={() => toggle(open, setOpen, k)}
                          >
                            <span>{activity.title}</span>
                            <span className="chevron" aria-hidden="true">
                              ▾
                            </span>
                          </button>
                        </div>
                        <p id={detailId} className="activity-detail" hidden={!isOpen}>
                          {activity.detail}
                        </p>
                      </li>
                    );
                  })}
                </ul>
              </Panel>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
