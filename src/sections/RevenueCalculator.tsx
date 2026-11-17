import { useId, useState } from "react";
import { DemoBadge, Panel, SectionHeader, StatCard } from "../components/ui";
import { formatNumber } from "../lib/format";
import {
  DEFAULT_INPUTS,
  FORMULAS,
  LIMITS,
  calculateRevenue,
  formatMoney,
  parseInput,
  type InputField,
  type RevenueInputs,
} from "../lib/revenue";

const FIELDS: { field: InputField; label: string; help: string; suffix?: string; slider?: boolean }[] = [
  {
    field: "eligibleDevelopers",
    label: "Eligible developers",
    help: "Developers at the customer who could be offered a Copilot licence.",
  },
  {
    field: "adoptionPercent",
    label: "Expected adoption",
    help: "Share of eligible developers expected to take up a licence.",
    suffix: "%",
    slider: true,
  },
  {
    field: "monthlyCostPerUser",
    label: "Assumed monthly licence cost per user",
    help: "Use the price actually quoted for the customer's plan. The default is a placeholder.",
  },
  {
    field: "partnerMarginPercent",
    label: "Assumed partner margin",
    help: "Example gross margin on customer spend. Not a GitHub, Microsoft or Arrow programme term.",
    suffix: "%",
    slider: true,
  },
];

const CURRENCIES = ["USD", "EUR", "GBP", "NOK"] as const;

type RawInputs = Record<InputField, string>;

const toRaw = (inputs: RevenueInputs): RawInputs =>
  Object.fromEntries(Object.entries(inputs).map(([k, v]) => [k, String(v)])) as RawInputs;

export function RevenueCalculator() {
  const id = useId();
  const [raw, setRaw] = useState<RawInputs>(() => toRaw(DEFAULT_INPUTS));
  const [currency, setCurrency] = useState<(typeof CURRENCIES)[number]>("USD");

  const parsed = Object.fromEntries(
    (Object.keys(raw) as InputField[]).map((field) => [field, parseInput(field, raw[field])]),
  ) as Record<InputField, { value?: number; error?: string }>;
  const hasErrors = Object.values(parsed).some((p) => p.error);
  const inputs = hasErrors
    ? null
    : (Object.fromEntries(Object.entries(parsed).map(([k, p]) => [k, p.value])) as unknown as RevenueInputs);
  const result = inputs ? calculateRevenue(inputs) : null;
  const money = (value: number) => formatMoney(value, currency);

  return (
    <div className="section">
      <SectionHeader
        eyebrow="02 · Revenue Calculator"
        title="Illustrative revenue calculator"
        badge={<DemoBadge>Illustrative estimates</DemoBadge>}
      >
        <p>
          Size a Copilot opportunity from your own assumptions. Every input is adjustable and every
          result is an illustrative estimate: nothing here is an official GitHub, Microsoft or
          Arrow price, discount or margin.
        </p>
      </SectionHeader>

      <div className="calc-grid">
        <Panel title="Assumptions">
          <form className="calc-form" onSubmit={(event) => event.preventDefault()} noValidate>
            {FIELDS.map(({ field, label, help, suffix, slider }) => {
              const inputId = `${id}-${field}`;
              const helpId = `${inputId}-help`;
              const errorId = `${inputId}-error`;
              const { min, max, step } = LIMITS[field];
              const error = parsed[field].error;
              return (
                <div key={field} className={`field ${error ? "has-error" : ""}`}>
                  <label htmlFor={inputId}>{label}</label>
                  <div className="field-row">
                    <div className="input-wrap">
                      <input
                        id={inputId}
                        type="number"
                        inputMode="decimal"
                        min={min}
                        max={max}
                        step={step}
                        value={raw[field]}
                        aria-invalid={error ? true : undefined}
                        aria-describedby={error ? `${helpId} ${errorId}` : helpId}
                        onChange={(event) => setRaw({ ...raw, [field]: event.target.value })}
                      />
                      {suffix && <span className="input-suffix">{suffix}</span>}
                    </div>
                    {slider && (
                      <input
                        type="range"
                        aria-label={`${label} slider`}
                        min={min}
                        max={max}
                        step={field === "adoptionPercent" ? 1 : 0.5}
                        value={parsed[field].value ?? 0}
                        onChange={(event) => setRaw({ ...raw, [field]: event.target.value })}
                      />
                    )}
                  </div>
                  <p id={helpId} className="field-help">
                    {help}
                  </p>
                  {error && (
                    <p id={errorId} className="field-error" role="alert">
                      {error}
                    </p>
                  )}
                </div>
              );
            })}
            <div className="field">
              <label htmlFor={`${id}-currency`}>Currency (display only)</label>
              <select
                id={`${id}-currency`}
                value={currency}
                onChange={(event) => setCurrency(event.target.value as (typeof CURRENCIES)[number])}
              >
                {CURRENCIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <button type="button" className="button-secondary" onClick={() => setRaw(toRaw(DEFAULT_INPUTS))}>
              Reset to example values
            </button>
          </form>
        </Panel>

        <div className="calc-results">
          <div className="stat-grid stat-grid-2" aria-live="polite">
            {result ? (
              <>
                <StatCard label="Estimated adopted licences" value={formatNumber(result.adoptedLicences)} tone="cyan" />
                <StatCard label="Illustrative monthly customer spend" value={money(result.monthlyCustomerSpend)} />
                <StatCard label="Illustrative annual customer spend" value={money(result.annualCustomerSpend)} tone="green" />
                <StatCard label="Illustrative annual partner gross margin" value={money(result.annualPartnerMargin)} tone="amber" />
              </>
            ) : (
              <p className="calc-invalid" role="status">
                Fix the highlighted assumptions to see the estimate.
              </p>
            )}
          </div>

          <Panel title="How it's calculated">
            <ol className="formulas">
              {FORMULAS.map((formula) => (
                <li key={formula}>{formula}</li>
              ))}
            </ol>
            {result && inputs && (
              <dl className="worked">
                <div>
                  <dt>Licences</dt>
                  <dd>
                    ⌊{formatNumber(inputs.eligibleDevelopers)} × {inputs.adoptionPercent}%⌋ ={" "}
                    <strong>{formatNumber(result.adoptedLicences)}</strong>
                  </dd>
                </div>
                <div>
                  <dt>Monthly</dt>
                  <dd>
                    {formatNumber(result.adoptedLicences)} × {money(inputs.monthlyCostPerUser)} ={" "}
                    <strong>{money(result.monthlyCustomerSpend)}</strong>
                  </dd>
                </div>
                <div>
                  <dt>Annual</dt>
                  <dd>
                    {money(result.monthlyCustomerSpend)} × 12 = <strong>{money(result.annualCustomerSpend)}</strong>
                  </dd>
                </div>
                <div>
                  <dt>Partner margin</dt>
                  <dd>
                    {money(result.annualCustomerSpend)} × {inputs.partnerMarginPercent}% ={" "}
                    <strong>{money(result.annualPartnerMargin)}</strong>
                  </dd>
                </div>
              </dl>
            )}
            <p className="panel-note">
              Assumptions not modelled: discounts, taxes, currency conversion, contract terms,
              ramp-up timing and partner services revenue. Confirm current pricing with GitHub,
              Microsoft or your distributor before quoting.
            </p>
          </Panel>
        </div>
      </div>
    </div>
  );
}
