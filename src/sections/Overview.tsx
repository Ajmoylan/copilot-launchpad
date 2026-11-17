import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import type { SectionId } from "../navigation";
import { DemoBadge, Panel, SectionHeader, StatCard } from "../components/ui";
import { formatNumber } from "../lib/format";
import { STAGES, STAGE_INFO } from "../data/demo";
import { opportunityRows } from "../lib/opportunities";
import { DEFAULT_INPUTS, formatMoney } from "../lib/revenue";

const STAGE_COLOURS: Record<string, string> = {
  Discover: "#4c8dff",
  Pilot: "#22d3ee",
  Rollout: "#34d399",
  Expand: "#a3e635",
};

export function Overview({ onNavigate }: { onNavigate: (id: SectionId) => void }) {
  const rows = opportunityRows();
  const eligible = rows.reduce((n, r) => n + r.eligibleDevelopers, 0);
  const licences = rows.reduce((n, r) => n + r.adoptedLicences, 0);
  const annual = rows.reduce((n, r) => n + r.annualCustomerSpend, 0);
  const margin = rows.reduce((n, r) => n + r.annualPartnerMargin, 0);
  const byStage = STAGES.map((stage) => ({
    stage,
    count: rows.filter((r) => r.stage === stage).length,
    licences: rows.filter((r) => r.stage === stage).reduce((n, r) => n + r.adoptedLicences, 0),
  }));

  return (
    <div className="section">
      <SectionHeader
        eyebrow="01 · Overview"
        title="GitHub Copilot partner enablement"
        badge={<DemoBadge />}
      >
        <p>
          A working view for a solutions specialist or channel partner: which customers could
          adopt GitHub Copilot, how many licences that could mean, what it could be worth to the
          customer and partner, and how each customer moves from pilot to rollout.
        </p>
      </SectionHeader>

      <div className="stat-grid">
        <StatCard
          label="Eligible developers"
          value={formatNumber(eligible)}
          hint="Developers across the pipeline who could be offered a licence."
        />
        <StatCard
          label="Potential licences"
          value={formatNumber(licences)}
          hint="Eligible developers × each customer's planned adoption."
          tone="cyan"
        />
        <StatCard
          label="Illustrative annual customer spend"
          value={formatMoney(annual)}
          hint={`At the calculator's default assumption of ${formatMoney(DEFAULT_INPUTS.monthlyCostPerUser)} per user per month.`}
          tone="green"
        />
        <StatCard
          label="Illustrative annual partner margin"
          value={formatMoney(margin)}
          hint={`At an assumed ${DEFAULT_INPUTS.partnerMarginPercent}% margin: an example, not a programme term.`}
          tone="amber"
        />
      </div>

      <div className="grid-2">
        <Panel title="Potential licences by customer" aside={<DemoBadge>Fictional customers</DemoBadge>}>
          <p className="panel-note">
            Where adoption volume sits in the pipeline. Colour shows each customer's stage.
          </p>
          <div className="chart" role="img" aria-label="Bar chart of potential licences per fictional customer">
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={rows} layout="vertical" margin={{ left: 8, right: 16 }}>
                <CartesianGrid stroke="#1f2a3d" horizontal={false} />
                <XAxis type="number" stroke="#8b9bb4" fontSize={12} />
                <YAxis type="category" dataKey="organisation" width={128} stroke="#8b9bb4" fontSize={12} />
                <Tooltip
                  cursor={{ fill: "rgba(76,141,255,0.08)" }}
                  contentStyle={{ background: "#0f1726", border: "1px solid #24324a", borderRadius: 8 }}
                  formatter={(value) => [formatNumber(Number(value)), "Potential licences"]}
                />
                <Bar dataKey="adoptedLicences" radius={[0, 6, 6, 0]} isAnimationActive={false}>
                  {rows.map((r) => (
                    <Cell key={r.organisation} fill={STAGE_COLOURS[r.stage]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <ul className="legend">
            {STAGES.map((s) => (
              <li key={s}>
                <span className="swatch" style={{ background: STAGE_COLOURS[s] }} aria-hidden="true" />
                {s}
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Pilot-to-rollout progression">
          <p className="panel-note">
            Customers move left to right. Each stage has a clear exit: agreed criteria, pilot
            evidence, then a planned rollout.
          </p>
          <ol className="funnel">
            {byStage.map((s, index) => (
              <li key={s.stage} className="funnel-step" style={{ borderColor: STAGE_COLOURS[s.stage] }}>
                <span className="funnel-index">{index + 1}</span>
                <div>
                  <p className="funnel-title">
                    {s.stage}{" "}
                    <span className="muted">
                      · {s.count} {s.count === 1 ? "customer" : "customers"} · {formatNumber(s.licences)} licences
                    </span>
                  </p>
                  <p className="funnel-text">{STAGE_INFO[s.stage]}</p>
                </div>
              </li>
            ))}
          </ol>
        </Panel>
      </div>

      <Panel title="Illustrative customer opportunities" aside={<DemoBadge>Fictional customers</DemoBadge>}>
        <div className="table-wrap" tabIndex={0} role="region" aria-label="Opportunities table">
          <table>
            <thead>
              <tr>
                <th scope="col">Organisation</th>
                <th scope="col">Industry</th>
                <th scope="col" className="num">Eligible devs</th>
                <th scope="col" className="num">Planned adoption</th>
                <th scope="col" className="num">Potential licences</th>
                <th scope="col" className="num">Illustrative annual spend</th>
                <th scope="col">Stage</th>
                <th scope="col">Next step</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.organisation}>
                  <th scope="row">{r.organisation}</th>
                  <td>{r.industry}</td>
                  <td className="num">{formatNumber(r.eligibleDevelopers)}</td>
                  <td className="num">{r.plannedAdoptionPercent}%</td>
                  <td className="num">{formatNumber(r.adoptedLicences)}</td>
                  <td className="num">{formatMoney(r.annualCustomerSpend)}</td>
                  <td>
                    <span className="stage-pill" style={{ borderColor: STAGE_COLOURS[r.stage], color: STAGE_COLOURS[r.stage] }}>
                      {r.stage}
                    </span>
                  </td>
                  <td>{r.nextStep}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="panel-note">
          <strong>What this means:</strong> for a reseller, potential licences and spend size the
          opportunity and prioritise effort; for the customer, the same numbers frame budget and
          rollout scope. Change the assumptions in the{" "}
          <button type="button" className="link-button" onClick={() => onNavigate("calculator")}>
            Revenue Calculator
          </button>
          .
        </p>
      </Panel>

      <div className="grid-3">
        {[
          { id: "calculator" as const, title: "Revenue Calculator", text: "Model licences, customer spend and partner margin from your own assumptions." },
          { id: "adoption" as const, title: "Adoption Dashboard", text: "Track pilot and rollout adoption against target for an example customer." },
          { id: "roadmap" as const, title: "30/60/90 Roadmap", text: "Run a structured discover, pilot and expand programme with the customer." },
        ].map((card) => (
          <button key={card.id} type="button" className="jump-card" onClick={() => onNavigate(card.id)}>
            <span className="jump-title">{card.title} →</span>
            <span className="jump-text">{card.text}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
