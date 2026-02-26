import type { Challenge } from "@/lib/types";

export interface ExecutiveSummaryData {
  commonApproach: string;
  differentApproach: string;
  accentWord?: string;
}

export const executiveSummary: ExecutiveSummaryData = {
  commonApproach:
    "Most developers deploying a Node.js/Express app to Railway set env vars manually through the dashboard, assume SQLite will persist between redeploys, and consider the job done once the process starts. Then the client reports a broken password gate or missing database on the next container restart.",
  differentApproach:
    "I deploy with a systematic verification checklist: env vars propagated and validated before the first healthcheck, SQLite mounted to a Railway persistent volume at the correct absolute path, and all four acceptance checkpoints — password gate, login, AI generation, DOCX export — confirmed live before handoff.",
  accentWord: "systematic verification checklist",
};

export const challenges: Challenge[] = [
  {
    id: "challenge-env-vars",
    title: "Environment Variable Propagation Across Deployment Layers",
    description:
      "Railway injects env vars at container runtime — not at build time. A variable set correctly in the dashboard can still be undefined in the running process if it references another variable incorrectly, is scoped to the wrong environment, or is missing entirely. For this app, ANTHROPIC_API_KEY, SESSION_SECRET, SITE_PASSWORD, and DATABASE_PATH are all critical-path variables that will silently break specific features if absent.",
    visualizationType: "flow",
    outcome:
      "Could eliminate the most common Railway deployment failure mode — missing or misconfigured env vars that prevent app startup, reducing debug cycles from hours to minutes.",
  },
  {
    id: "challenge-sqlite-persistence",
    title: "SQLite Persistence Across Railway Container Restarts",
    description:
      "Railway containers use ephemeral storage by default — any file written inside the container is destroyed when the deployment is replaced or when the service restarts. Without a persistent volume mounted at the exact path the app writes its SQLite database to (DATABASE_PATH in .env.example), every redeploy wipes the database, requiring a full npm run setup again.",
    visualizationType: "before-after",
    outcome:
      "Could prevent database loss on container redeploy by configuring a Railway persistent volume mount at the correct path — ensuring the database survives the full Railway deployment lifecycle.",
  },
  {
    id: "challenge-verification-checklist",
    title: "Site-Wide Verification Before Handoff",
    description:
      "A deployment that reaches Active status in Railway does not guarantee all four core functionalities are working. The healthcheck confirms the process is alive — it does not confirm that SITE_PASSWORD protects the root route, that login auth is functional, that the Anthropic API key is wired correctly for document generation, or that DOCX export succeeds. Each checkpoint requires a separate targeted request.",
    visualizationType: "metrics",
    outcome:
      "Could verify all four core functionality checkpoints — password gate, login auth, AI generation, DOCX export — are live and responding before handoff, giving the client a verifiable acceptance checklist.",
  },
];
