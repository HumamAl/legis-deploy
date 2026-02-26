// proposal.ts — Tab 3 "Work With Me" content data
// All portfolio outcomes sourced directly from developer-profile.md — never inflated.
// Project URLs: only include if URL exists in developer-profile.md.

export const proposalData = {
  hero: {
    name: "Humam",
    // One tailored sentence: leads with what I'll do for them, references the demo in Tab 1
    valueProp:
      "Full-stack developer who deploys Node.js applications to Railway and verifies them end-to-end — including Claude API integrations, SQLite persistence, and session-based auth. The verification dashboard in Tab 1 shows exactly how I'd confirm your 4-point acceptance checklist before handoff.",
    badge: "Built this demo for your project",
    stats: [
      { value: "24+", label: "Projects Shipped" },
      { value: "< 48hr", label: "Demo Turnaround" },
      { value: "15+", label: "Industries" },
    ],
  },

  portfolioProjects: [
    {
      id: "wmf-agent",
      name: "WMF Agent Dashboard",
      description:
        "AI-powered customer service agent with Anthropic Claude API integration, email classification pipeline, RFQ data extraction, and human-in-the-loop approval workflow — deployed to production on Vercel with full env var configuration.",
      outcome:
        "Replaced a 4-hour manual quote review process with a 20-minute structured extraction and approval flow",
      tech: ["Node.js", "Next.js", "Claude API", "n8n", "Microsoft Graph"],
      url: "https://wmf-agent-dashboard.vercel.app",
      relevance:
        "Direct Claude API deployment experience — same ANTHROPIC_API_KEY configuration your app requires.",
    },
    {
      id: "ebay-monitor",
      name: "eBay Pokemon Monitor",
      description:
        "eBay Browse API monitoring tool with real-time listing detection, Discord webhook alerts, and price trend tracking. Demonstrates production API monitoring with persistent health checks and alert delivery.",
      outcome:
        "Real-time listing monitor with webhook-based Discord alerts and price trend tracking",
      tech: ["Next.js", "TypeScript", "REST APIs", "Discord Webhooks"],
      url: "https://ebay-pokemon-monitor.vercel.app",
      relevance:
        "Same monitoring-and-verify pattern as your deployment acceptance checklist — API call fires, status is confirmed, alert goes out.",
    },
    {
      id: "auction-violations",
      name: "Auction Violations Monitor",
      description:
        "Compliance monitoring dashboard tracking violations, seller behavior, and enforcement actions. Status-grid layout with verification workflows mirrors the deployment acceptance dashboard structure.",
      outcome:
        "Compliance dashboard with violation detection, seller flagging, and enforcement action tracking",
      tech: ["Next.js", "TypeScript", "Tailwind", "shadcn/ui"],
      url: "https://auction-violations.vercel.app",
      relevance:
        "Monitoring + status verification workflow — compositionally identical to a 4-point deployment acceptance suite.",
    },
    {
      id: "data-intelligence",
      name: "Data Intelligence Platform",
      description:
        "Multi-source data analytics dashboard with aggregated insights, interactive charts, and filterable reporting. Demonstrates deployment-ready SaaS architecture built to production standards.",
      outcome:
        "Unified analytics dashboard pulling data from multiple sources with interactive charts and filterable insights",
      tech: ["Next.js", "TypeScript", "Tailwind", "Recharts"],
      url: "https://data-intelligence-platform-sandy.vercel.app",
      relevance:
        "Shows architectural maturity on production deployments — clean env var config, no hardcoded secrets, Vercel-ready.",
    },
  ],

  // Step names adapted for a deployment/DevOps job — not generic Understand/Build/Ship/Iterate
  approach: [
    {
      step: "01",
      title: "Receive Access",
      description:
        "Sign NDA and non-compete before receiving anything. Review repo, railway.toml, and .env.example to map every required environment variable before touching a single config.",
      timeline: "Day 1",
    },
    {
      step: "02",
      title: "Configure & Deploy",
      description:
        "Set all environment variables in Railway dashboard — ANTHROPIC_API_KEY, SESSION_SECRET, SITE_PASSWORD, DATABASE_PATH with persistent volume mount. Run npm install + npm run setup. Trigger deployment.",
      timeline: "Day 1–2",
    },
    {
      step: "03",
      title: "Verify Checklist",
      description:
        "Execute the 4-point acceptance test: (1) site password gate at /, (2) login page authenticates, (3) one AI generation call completes, (4) DOCX export downloads. All four must pass before handoff.",
      timeline: "Day 2",
    },
    {
      step: "04",
      title: "Document & Handoff",
      description:
        "Write deployment notes covering all env vars, Railway service config, and DATABASE_PATH volume path. Share Railway dashboard access. Delete all local copies and confirm in writing.",
      timeline: "Day 2–3",
    },
  ],

  // Filtered to deployment/DevOps-relevant tech only — no frontend skills
  skills: [
    {
      category: "Platform",
      items: ["Node.js", "Express.js", "Railway", "Render", "Vercel"],
    },
    {
      category: "Infrastructure",
      items: ["Linux", "Docker", "SQLite", "better-sqlite3", "Persistent Volumes"],
    },
    {
      category: "Integration",
      items: ["Anthropic Claude API", "REST APIs", "Webhooks", "npm scripts"],
    },
    {
      category: "Security",
      items: ["Environment Variables", "Session Management", "scrypt Auth", "NDA / Non-Compete"],
    },
  ],

  cta: {
    // Tailored to this specific job — not generic
    headline: "Ready to deploy, verify, and hand off your platform in under 72 hours.",
    // References the demo already in Tab 1 — specific to this job
    body: "The verification dashboard in Tab 1 shows exactly the 4-point checklist I'll run: password gate, login, AI generation, DOCX export. All four confirmed live before I hand over and delete local copies.",
    action: "Reply on Upwork to start",
    availability: "Currently available for new projects",
  },
};

