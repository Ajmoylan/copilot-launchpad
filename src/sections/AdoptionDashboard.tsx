import { useId, useState } from "react";
import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { DemoBadge, Panel, SectionHeader, StatCard } from "../components/ui";
import { formatNumber } from "../lib/format";
import { ADOPTION_PROGRAMME } from "../data/demo";
import { progression, summarise } from "../lib/adoption";

const STATUS_TEXT = {
  ahead: "Ahead of plan",
  "on-track": "On track",
  behind: "Behind plan",
} as const;

const tooltipStyle = { background: "#0f1726", border: "1px solid #24324a", borderRadius: 8 };

export function AdoptionDashboard() {
  const id = useId();
  const { organisation, snapshots } = ADOPTION_PROGRAMME;
  const [index, setIndex] = useState(snapshots.length - 1);
  const current = snapshots[index];
  const summary = summarise(current);
  const rows = progression(snapshots.slice(0, index + 1));

  return (
    <div className="section">
      <SectionHeader
        eyebrow="03 · Adoption Dashboard"
        title={`Copilot adoption: ${organisation}`}
        badge={<DemoBadge>Example data · not real Copilot metrics</DemoBadge>}
      >
        <p>
          A 12-week programme for a fictional customer: a controlled pilot, then a staged
          rollout, tracked against the adoption target agreed at the start. This page doesn&apos;t
          connect to GitHub or retrieve real usage data.
        </p>
      </SectionHeader>

      <div className="week-picker">
        <label htmlFor={`${id}-week`}>
          Programme week: <strong>{current.period}</strong>
        </label>
        <input
          id={`${id}-week`}
          type="range"
          min={0}
          max={snapshots.length - 1}
          value={index}
          aria-valuetext={current.period}
          onChange={(event) => setIndex(Number(event.target.value))}
        />
      </div>

      <div className="stat-grid">
        <StatCard label="Eligible developers" value={formatNumber(summary.eligibleDevelopers)} hint="Developers in scope for the programme." />
        <StatCard label="Pilot participants" value={formatNumber(summary.pilotParticipants)} hint="Developers in the controlled pilot group." tone="cyan" />
        <StatCard label="Adopted licences" value={formatNumber(summary.adoptedLicences)} hint={`Target ${formatNumber(current.targetLicences)} (${summary.varianceLicences >= 0 ? "+" : ""}${summary.varianceLicences}).`} tone="green" />
        <StatCard
          label="Adoption"
          value={`${summary.adoptionPercent}%`}
          hint={`${STATUS_TEXT[summary.status]}: target ${summary.targetPercent}% of eligible developers.`}
          tone="amber"
        />
      </div>

      <div className="grid-2">
        <Panel title="Adoption progression" aside={<DemoBadge>Example data</DemoBadge>}>
          <p className="panel-note">Adopted licences against target, week by week. The shaded area is actual adoption.</p>
          <div className="chart" role="img" aria-label={`Adopted licences against target up to ${current.period}`}>
            <ResponsiveContainer width="100%" height={280}>
              <ComposedChart data={rows} margin={{ left: 0, right: 12, top: 8 }}>
                <defs>
                  <linearGradient id="adoptFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#1f2a3d" vertical={false} />
                <XAxis dataKey="period" stroke="#8b9bb4" fontSize={12} />
                <YAxis stroke="#8b9bb4" fontSize={12} width={40} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Area type="monotone" dataKey="adopted" name="Adopted licences" stroke="#22d3ee" strokeWidth={2} fill="url(#adoptFill)" isAnimationActive={false} />
                <Line type="monotone" dataKey="target" name="Target" stroke="#a3e635" strokeDasharray="6 4" strokeWidth={2} dot={false} isAnimationActive={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Target vs actual adoption (%)" aside={<DemoBadge>Example data</DemoBadge>}>
          <p className="panel-note">Share of eligible developers with an adopted licence, against the planned share.</p>
          <div className="chart" role="img" aria-label={`Adoption percentage against target up to ${current.period}`}>
            <ResponsiveContainer width="100%" height={280}>
              <ComposedChart data={rows} margin={{ left: 0, right: 12, top: 8 }}>
                <CartesianGrid stroke="#1f2a3d" vertical={false} />
                <XAxis dataKey="period" stroke="#8b9bb4" fontSize={12} />
                <YAxis stroke="#8b9bb4" fontSize={12} width={40} unit="%" domain={[0, 100]} />
                <Tooltip contentStyle={tooltipStyle} formatter={(value) => `${value}%`} />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="adoptionPercent" name="Actual %" fill="#4c8dff" radius={[4, 4, 0, 0]} isAnimationActive={false} />
                <Line type="monotone" dataKey="targetPercent" name="Target %" stroke="#34d399" strokeWidth={2} dot={false} isAnimationActive={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <Panel title="Measuring adoption in a real implementation">
        <div className="grid-2 measure">
          <div>
            <h3>Where real data would come from</h3>
            <ul>
              <li>
                <strong>Seat management:</strong> organisation owners can see which members have a
                Copilot seat assigned and when each seat was last active.
              </li>
              <li>
                <strong>Copilot usage metrics:</strong> GitHub provides usage metrics (in the
                product and through the REST API) such as active and engaged users and
                feature-level usage, for organisations and enterprises.
              </li>
              <li>
                <strong>Customer-owned measures:</strong> developer surveys and the delivery
                metrics the customer already tracks, compared with the success criteria agreed in
                the first 30 days.
              </li>
            </ul>
          </div>
          <div>
            <h3>What this MVP does and doesn&apos;t do</h3>
            <ul>
              <li>Shows how adoption against target could be presented to a customer.</li>
              <li>Uses fictional, hard-coded example data for one fictional organisation.</li>
              <li>
                Doesn&apos;t call GitHub&apos;s APIs, hold tokens or show real Copilot usage. A real
                implementation would read the customer&apos;s metrics with their permission, on a
                backend that keeps credentials out of the browser.
              </li>
            </ul>
            <p className="panel-note">
              See{" "}
              <a href="https://docs.github.com/en/copilot">GitHub&apos;s Copilot documentation</a> for
              the current metrics and seat management features.
            </p>
          </div>
        </div>
      </Panel>
    </div>
  );
}
