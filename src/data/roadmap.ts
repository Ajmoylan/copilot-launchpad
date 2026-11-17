/** The 30/60/90-day customer enablement programme. Guidance, not an official GitHub methodology. */

export interface Activity {
  id: string;
  title: string;
  detail: string;
}

export interface Phase {
  id: string;
  days: string;
  title: string;
  goal: string;
  activities: Activity[];
}

export const ROADMAP: readonly Phase[] = [
  {
    id: "discover",
    days: "Days 1–30",
    title: "Discover and Prepare",
    goal: "Agree why, where and how Copilot will be piloted, and how success will be judged.",
    activities: [
      {
        id: "requirements",
        title: "Assess customer requirements",
        detail:
          "Understand the business goals, current development workflow, IDEs and languages in use, and which Copilot plan and features fit (for example, Copilot Business or Copilot Enterprise).",
      },
      {
        id: "teams",
        title: "Identify developer teams and use cases",
        detail:
          "Shortlist teams with representative work, such as writing tests, explaining unfamiliar code or routine refactoring, and the use cases each team will try.",
      },
      {
        id: "governance",
        title: "Establish security and governance considerations",
        detail:
          "Review organisation policies: which features are enabled, public code suggestion settings, content exclusions, IDE and network requirements, and how seats will be assigned and reviewed.",
      },
      {
        id: "criteria",
        title: "Agree on success criteria",
        detail:
          "Define measurable, agreed criteria before the pilot starts, such as active usage, developer satisfaction from surveys, and team-level delivery measures the customer already tracks.",
      },
      {
        id: "participants",
        title: "Identify pilot participants",
        detail:
          "Name the pilot group, champions in each team and an executive sponsor, and confirm licence assignment for the pilot period.",
      },
    ],
  },
  {
    id: "pilot",
    days: "Days 31–60",
    title: "Pilot and Enable",
    goal: "Run a controlled pilot that produces evidence, not anecdotes.",
    activities: [
      {
        id: "launch",
        title: "Launch a controlled pilot",
        detail:
          "Assign seats to the pilot group, confirm IDE extensions and policies work, and share the timeline, success criteria and support channels.",
      },
      {
        id: "onboarding",
        title: "Provide onboarding and enablement",
        detail:
          "Run hands-on sessions on code completion, Copilot Chat and prompt practices, using the customer's own code and use cases, and share GitHub's documentation.",
      },
      {
        id: "feedback",
        title: "Gather developer feedback",
        detail:
          "Collect structured feedback through short surveys and champion check-ins: what helps, what doesn't, and where developers need more guidance.",
      },
      {
        id: "monitor",
        title: "Monitor adoption and usage",
        detail:
          "Track seat activity and usage with GitHub's Copilot usage metrics and seat management, alongside the agreed success criteria.",
      },
      {
        id: "barriers",
        title: "Address barriers",
        detail:
          "Resolve blockers quickly: access or network issues, policy questions, low engagement in specific teams, or gaps in enablement.",
      },
    ],
  },
  {
    id: "expand",
    days: "Days 61–90",
    title: "Evaluate and Expand",
    goal: "Turn pilot evidence into a decision and a plan.",
    activities: [
      {
        id: "evaluate",
        title: "Evaluate results against agreed success criteria",
        detail:
          "Compare usage data, survey results and the customer's own delivery measures with the criteria agreed in the first 30 days, including what didn't work.",
      },
      {
        id: "commercial",
        title: "Review commercial opportunities",
        detail:
          "Size the rollout with the customer's own numbers: eligible developers, realistic adoption, licence pricing as quoted, and the partner services that support it.",
      },
      {
        id: "expansion",
        title: "Develop an expansion plan",
        detail:
          "Plan the next waves of teams, enablement, governance changes and seat management, with owners and dates.",
      },
      {
        id: "recommendations",
        title: "Present recommendations to stakeholders",
        detail:
          "Share an evidence-based recommendation with the sponsor and stakeholders, covering results, risks, costs and the proposed plan.",
      },
      {
        id: "next-steps",
        title: "Agree on next steps",
        detail:
          "Confirm the decision, commercial next steps, timeline and the success criteria for the next phase.",
      },
    ],
  },
];

export const TOTAL_ACTIVITIES = ROADMAP.reduce((n, phase) => n + phase.activities.length, 0);
