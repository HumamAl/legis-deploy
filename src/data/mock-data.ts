/**
 * mock-data.ts — legis-deploy
 * Deployment verification dashboard for a Node.js/Express legislative
 * document generation platform deployed to Railway.
 *
 * Domain: DevOps/PaaS monitoring + GovTech legislative document generation
 * Status vocabulary: Railway's exact status strings (not generic terms)
 * Date anchor: Feb 25, 2026 (today)
 */

import type {
  Deployment,
  Service,
  EnvVariable,
  LogEntry,
  HealthCheck,
  MetricPoint,
  DeploymentFrequency,
  LegislativeDocument,
  DashboardStats,
  DeploymentFrequencyChartPoint,
  DocumentVolumeChartPoint,
} from "@/lib/types";

// ---------------------------------------------------------------------------
// Date helpers — all timestamps relative to Feb 25, 2026
// ---------------------------------------------------------------------------

const BASE = new Date("2026-02-25T00:00:00Z");

/** Returns an ISO string N days before the base date */
function daysAgo(n: number, hour = 12, minute = 0): string {
  const d = new Date(BASE);
  d.setDate(d.getDate() - n);
  d.setUTCHours(hour, minute, 0, 0);
  return d.toISOString();
}

/** Returns an ISO string with explicit hour/minute offset from base */
function hoursAgo(n: number): string {
  const d = new Date(BASE);
  d.setTime(d.getTime() - n * 60 * 60 * 1000);
  return d.toISOString();
}

// ---------------------------------------------------------------------------
// Services (4 items — the Railway project canvas)
// ---------------------------------------------------------------------------

export const services: Service[] = [
  {
    id: "svc-a9f3b1c",
    name: "legis-api",
    healthStatus: "Healthy",
    replicaCount: 2,
    uptime: 99.87,
    lastDeploymentId: "dep-c4e71a2",
    environment: "production",
    p50ResponseTime: 84,
    p95ResponseTime: 247,
    p99ResponseTime: 612,
  },
  {
    // Edge case: Degraded service with p99 spike — caused by a document batch
    id: "svc-b2d8e4f",
    name: "legis-worker",
    healthStatus: "Degraded",
    replicaCount: 1,
    uptime: 98.34,
    lastDeploymentId: "dep-f1b83c9",
    environment: "production",
    p50ResponseTime: 118,
    p95ResponseTime: 890,
    p99ResponseTime: 2847, // outlier — document generation burst saturated CPU
  },
  {
    id: "svc-c7a12d5",
    name: "document-renderer",
    healthStatus: "Healthy",
    replicaCount: 1,
    uptime: 99.61,
    lastDeploymentId: "dep-e2c94b7",
    environment: "production",
    p50ResponseTime: 96,
    p95ResponseTime: 380,
    p99ResponseTime: 1140,
  },
  {
    id: "svc-d3f56e8",
    name: "template-engine",
    healthStatus: "Healthy",
    replicaCount: 1,
    uptime: 99.72,
    lastDeploymentId: "dep-a8d23f6",
    environment: "production",
    p50ResponseTime: 62,
    p95ResponseTime: 198,
    p99ResponseTime: 487,
  },
];

// ---------------------------------------------------------------------------
// Deployments (18 items — last 30 days)
// Distribution: 12 Active/Completed, 2 Failed, 1 Crashed, 1 Removed (rolled back),
//               1 Active in pr-142, 1 Building in staging
// ---------------------------------------------------------------------------

export const deployments: Deployment[] = [
  // Most recent production deploy — Active
  {
    id: "dep-c4e71a2",
    serviceId: "svc-a9f3b1c",
    serviceName: "legis-api",
    status: "Active",
    environment: "production",
    triggeredBy: "Sarah Okonkwo",
    commitMessage: "feat: add DOCX export metadata headers",
    commitSha: "c4e71a2",
    buildDuration: 89,
    deployedAt: daysAgo(1, 11, 34),
    failureReason: null,
  },
  {
    id: "dep-f1b83c9",
    serviceId: "svc-b2d8e4f",
    serviceName: "legis-worker",
    status: "Active",
    environment: "production",
    triggeredBy: "James Thornton",
    commitMessage: "perf: reduce document render time by 40%",
    commitSha: "f1b83c9",
    buildDuration: 102,
    deployedAt: daysAgo(2, 14, 17),
    failureReason: null,
  },
  {
    id: "dep-e2c94b7",
    serviceId: "svc-c7a12d5",
    serviceName: "document-renderer",
    status: "Active",
    environment: "production",
    triggeredBy: "Marcus Webb",
    commitMessage: "fix: resolve healthcheck timeout on cold start",
    commitSha: "e2c94b7",
    buildDuration: 97,
    deployedAt: daysAgo(3, 10, 48),
    failureReason: null,
  },
  {
    id: "dep-a8d23f6",
    serviceId: "svc-d3f56e8",
    serviceName: "template-engine",
    status: "Active",
    environment: "production",
    triggeredBy: "Priya Nair",
    commitMessage: "feat: support amendment stacking in template engine",
    commitSha: "a8d23f6",
    buildDuration: 74,
    deployedAt: daysAgo(4, 13, 22),
    failureReason: null,
  },
  {
    // Edge case: Failed deployment — WEBHOOK_SECRET missing caused Express startup crash
    id: "dep-7c3d91e",
    serviceId: "svc-a9f3b1c",
    serviceName: "legis-api",
    status: "Failed",
    environment: "production",
    triggeredBy: "Daniel Hoffmann",
    commitMessage: "feat: add webhook endpoint for document status updates",
    commitSha: "7c3d91e",
    buildDuration: 81,
    deployedAt: daysAgo(5, 15, 9),
    failureReason:
      "Service crashed on startup: Error: WEBHOOK_SECRET is not defined in environment. Set this variable before deploying.",
  },
  {
    // Previous successful deploy before the failed one
    id: "dep-b9f14a3",
    serviceId: "svc-a9f3b1c",
    serviceName: "legis-api",
    status: "Removed",
    environment: "production",
    triggeredBy: "Sarah Okonkwo",
    commitMessage: "chore: update railway.toml with memory limits",
    commitSha: "b9f14a3",
    buildDuration: 91,
    deployedAt: daysAgo(6, 11, 5),
    failureReason: null,
  },
  {
    // Edge case: Crashed deployment — OOM during document generation batch
    id: "dep-d5e28b1",
    serviceId: "svc-b2d8e4f",
    serviceName: "legis-worker",
    status: "Crashed",
    environment: "production",
    triggeredBy: "James Thornton",
    commitMessage: "feat: support concurrent bill generation for batch export",
    commitSha: "d5e28b1",
    buildDuration: 108,
    deployedAt: daysAgo(7, 9, 41),
    failureReason:
      "OOM Killed: process exceeded 512 MB memory limit during concurrent document generation. Container terminated by Railway. Increase memory limit or add batch size cap.",
  },
  {
    // Edge case: Failed deployment — healthcheck timeout (not missing env var, different failure mode)
    id: "dep-8a1f3c7",
    serviceId: "svc-c7a12d5",
    serviceName: "document-renderer",
    status: "Failed",
    environment: "production",
    triggeredBy: "Amara Diallo",
    commitMessage: "feat: add PDF/A archive format support",
    commitSha: "8a1f3c7",
    buildDuration: 114,
    deployedAt: daysAgo(9, 16, 33),
    failureReason:
      "Healthcheck timeout after 300s: GET /health returned no response. Endpoint is behind session auth middleware — Railway's probe is being redirected to login page. Exclude /health from auth.",
  },
  {
    id: "dep-c9b47d2",
    serviceId: "svc-a9f3b1c",
    serviceName: "legis-api",
    status: "Removed",
    environment: "production",
    triggeredBy: "Sarah Okonkwo",
    commitMessage: "fix: correct DATABASE_PATH reference for persistent volume",
    commitSha: "c9b47d2",
    buildDuration: 86,
    deployedAt: daysAgo(10, 14, 2),
    failureReason: null,
  },
  {
    // Edge case: Friday 4:47 PM deploy — the classic risky deployment timing
    id: "dep-e7f92a4",
    serviceId: "svc-a9f3b1c",
    serviceName: "legis-api",
    status: "Removed",
    environment: "production",
    triggeredBy: "Daniel Hoffmann",
    commitMessage: "fix: session cookie SameSite attribute for cross-origin auth",
    commitSha: "e7f92a4",
    buildDuration: 92,
    deployedAt: daysAgo(13, 16, 47), // Friday 4:47 PM
    failureReason: null,
  },
  {
    id: "dep-2d8b5f9",
    serviceId: "svc-d3f56e8",
    serviceName: "template-engine",
    status: "Removed",
    environment: "production",
    triggeredBy: "Priya Nair",
    commitMessage: "feat: add HJR and SCR document type templates",
    commitSha: "2d8b5f9",
    buildDuration: 79,
    deployedAt: daysAgo(14, 11, 18),
    failureReason: null,
  },
  {
    id: "dep-f4a63e1",
    serviceId: "svc-c7a12d5",
    serviceName: "document-renderer",
    status: "Removed",
    environment: "production",
    triggeredBy: "Marcus Webb",
    commitMessage: "fix: resolve font embedding issue in PDF export",
    commitSha: "f4a63e1",
    buildDuration: 103,
    deployedAt: daysAgo(16, 10, 31),
    failureReason: null,
  },
  {
    // Edge case: Unusually long build — full cache rebuild after package.json change
    id: "dep-3c7e18b",
    serviceId: "svc-a9f3b1c",
    serviceName: "legis-api",
    status: "Removed",
    environment: "production",
    triggeredBy: "Kevin Park",
    commitMessage: "chore: upgrade better-sqlite3 to 9.4.3",
    commitSha: "3c7e18b",
    buildDuration: 454, // 7m 34s — full npm reinstall, cache busted by package.json change
    deployedAt: daysAgo(18, 13, 55),
    failureReason: null,
  },
  {
    id: "dep-a1d74f3",
    serviceId: "svc-b2d8e4f",
    serviceName: "legis-worker",
    status: "Removed",
    environment: "production",
    triggeredBy: "Amara Diallo",
    commitMessage: "fix: prevent worker queue memory leak on large document batches",
    commitSha: "a1d74f3",
    buildDuration: 97,
    deployedAt: daysAgo(21, 9, 14),
    failureReason: null,
  },
  {
    id: "dep-6b2c9f7",
    serviceId: "svc-a9f3b1c",
    serviceName: "legis-api",
    status: "Removed",
    environment: "production",
    triggeredBy: "Sarah Okonkwo",
    commitMessage: "feat: add Anthropic Claude model version toggle via env var",
    commitSha: "6b2c9f7",
    buildDuration: 88,
    deployedAt: daysAgo(24, 14, 7),
    failureReason: null,
  },
  {
    // PR environment — Active, different from production
    id: "dep-9e4a1d8",
    serviceId: "svc-a9f3b1c",
    serviceName: "legis-api",
    status: "Active",
    environment: "pr-142",
    triggeredBy: "Lena Voronova",
    commitMessage: "feat: fiscal note attachment support for HB documents",
    commitSha: "9e4a1d8",
    buildDuration: 95,
    deployedAt: daysAgo(2, 15, 43),
    failureReason: null,
  },
  {
    id: "dep-4f7b2e6",
    serviceId: "svc-a9f3b1c",
    serviceName: "legis-api",
    status: "Removed",
    environment: "staging",
    triggeredBy: "Kevin Park",
    commitMessage: "test: integration test for scrypt password verification",
    commitSha: "4f7b2e6",
    buildDuration: 84,
    deployedAt: daysAgo(8, 10, 22),
    failureReason: null,
  },
  {
    id: "dep-7d3c8a5",
    serviceId: "svc-d3f56e8",
    serviceName: "template-engine",
    status: "Removed",
    environment: "production",
    triggeredBy: "James Thornton",
    commitMessage: "refactor: extract template validation into standalone module",
    commitSha: "7d3c8a5",
    buildDuration: 76,
    deployedAt: daysAgo(28, 12, 39),
    failureReason: null,
  },
];

// ---------------------------------------------------------------------------
// Environment variables (12 items — mirrors .env.example)
// ---------------------------------------------------------------------------

export const envVariables: EnvVariable[] = [
  {
    key: "ANTHROPIC_API_KEY",
    value: "sk-ant-api03-••••••••••••••••••••••••••••••••••••••••••••••••••••••",
    status: "Active",
    scope: "service",
    environment: "production",
    lastUpdated: daysAgo(14, 10, 0),
    note: "Claude claude-3-5-sonnet model for legislative document generation",
  },
  {
    key: "SESSION_SECRET",
    value: "••••••••••••••••••••••••••••••••",
    status: "Active",
    scope: "service",
    environment: "production",
    lastUpdated: daysAgo(30, 9, 0),
    note: "Must be a random 32+ char string — never use the placeholder value",
  },
  {
    key: "SITE_PASSWORD",
    value: "••••••••••••",
    status: "Active",
    scope: "service",
    environment: "production",
    lastUpdated: daysAgo(30, 9, 0),
    note: "Site-wide password gate — all routes return 401 until this is set",
  },
  {
    key: "DATABASE_PATH",
    value: "/data/legis.db",
    status: "Active",
    scope: "service",
    environment: "production",
    lastUpdated: daysAgo(18, 13, 55),
    note: "Must point to persistent volume mount path — ephemeral paths wipe DB on restart",
  },
  {
    key: "NODE_ENV",
    value: "production",
    status: "Active",
    scope: "shared",
    environment: "production",
    lastUpdated: daysAgo(30, 9, 0),
  },
  {
    key: "PORT",
    value: "3000",
    status: "Active",
    scope: "shared",
    environment: "production",
    lastUpdated: daysAgo(30, 9, 0),
    note: "Railway also injects $PORT — ensure app.listen uses process.env.PORT",
  },
  {
    key: "LOG_LEVEL",
    value: "info",
    status: "Active",
    scope: "service",
    environment: "production",
    lastUpdated: daysAgo(21, 9, 0),
    note: "Use 'debug' in staging only — 'info' or 'warn' for production",
  },
  {
    key: "TEMPLATE_CACHE_TTL",
    value: "3600",
    status: "Active",
    scope: "service",
    environment: "production",
    lastUpdated: daysAgo(14, 10, 0),
    note: "Template cache TTL in seconds — requires redeploy to take effect",
  },
  {
    key: "CORS_ORIGIN",
    value: "https://legis-api.up.railway.app",
    status: "Active",
    scope: "service",
    environment: "production",
    lastUpdated: daysAgo(14, 10, 0),
    note: "Set to RAILWAY_PUBLIC_DOMAIN or specific origin — wildcard (*) not recommended",
  },
  {
    key: "RATE_LIMIT_MAX",
    value: "100",
    status: "Active",
    scope: "service",
    environment: "production",
    lastUpdated: daysAgo(30, 9, 0),
    note: "Max requests per 15-minute window per IP — adjust for expected client volume",
  },
  {
    key: "BACKUP_PATH",
    value: "/data/backups",
    status: "Using Default",
    scope: "service",
    environment: "production",
    lastUpdated: daysAgo(30, 9, 0),
    note: "Falls back to /tmp/backups if not set — ephemeral, not persistent",
  },
  {
    // Edge case: Missing variable — caused the dep-7c3d91e webhook failure
    key: "WEBHOOK_SECRET",
    value: "—",
    status: "Missing",
    scope: "service",
    environment: "production",
    lastUpdated: daysAgo(30, 9, 0),
    note: "REQUIRED for webhook endpoint introduced in commit 7c3d91e. Caused deployment failure on Feb 20.",
  },
];

// ---------------------------------------------------------------------------
// Log entries (25 items — 24-hour rolling window, business-hours heavy)
// Mix of build logs and deploy logs from multiple services
// ---------------------------------------------------------------------------

export const logEntries: LogEntry[] = [
  // Deploy logs — legis-api runtime (most recent first)
  {
    timestamp: hoursAgo(0),
    severity: "info",
    message: "GET / 200 12ms - Mozilla/5.0 (site password gate)",
    serviceId: "svc-a9f3b1c",
    deploymentId: "dep-c4e71a2",
    stream: "deploy",
  },
  {
    timestamp: hoursAgo(0),
    severity: "info",
    message: "POST /api/generate 200 1847ms - document=HB-2847 format=docx template=tpl-hb-standard-v2",
    serviceId: "svc-a9f3b1c",
    deploymentId: "dep-c4e71a2",
    stream: "deploy",
  },
  {
    timestamp: hoursAgo(1),
    severity: "warn",
    message: "slow query detected: SELECT * FROM documents WHERE session_id=? took 847ms (threshold: 500ms)",
    serviceId: "svc-a9f3b1c",
    deploymentId: "dep-c4e71a2",
    stream: "deploy",
  },
  {
    timestamp: hoursAgo(1),
    severity: "info",
    message: "GET /auth/login 200 38ms",
    serviceId: "svc-a9f3b1c",
    deploymentId: "dep-c4e71a2",
    stream: "deploy",
  },
  {
    timestamp: hoursAgo(2),
    severity: "info",
    message: "document-renderer: DOCX generation complete doc=SB-1193 elapsed=2340ms pages=14",
    serviceId: "svc-c7a12d5",
    deploymentId: "dep-e2c94b7",
    stream: "deploy",
  },
  {
    timestamp: hoursAgo(2),
    severity: "debug",
    message: "db: pragma journal_mode=WAL applied — concurrent read performance enabled",
    serviceId: "svc-a9f3b1c",
    deploymentId: "dep-c4e71a2",
    stream: "deploy",
  },
  {
    timestamp: hoursAgo(3),
    severity: "warn",
    message: "memory usage at 387 MB — approaching 80% of 512 MB limit (threshold: 410 MB)",
    serviceId: "svc-b2d8e4f",
    deploymentId: "dep-f1b83c9",
    stream: "deploy",
  },
  {
    timestamp: hoursAgo(3),
    severity: "info",
    message: "worker: bill generation queue processed 12 documents in 34.2s",
    serviceId: "svc-b2d8e4f",
    deploymentId: "dep-f1b83c9",
    stream: "deploy",
  },
  {
    timestamp: hoursAgo(4),
    severity: "info",
    message: "GET /api/export/docx 200 2180ms - doc=HJR-44 attachment=true",
    serviceId: "svc-a9f3b1c",
    deploymentId: "dep-c4e71a2",
    stream: "deploy",
  },
  {
    timestamp: hoursAgo(5),
    severity: "error",
    message: "POST /api/generate 500 - Anthropic API rate limit exceeded: 429 Too Many Requests. Retry after 60s.",
    serviceId: "svc-a9f3b1c",
    deploymentId: "dep-c4e71a2",
    stream: "deploy",
  },
  {
    timestamp: hoursAgo(6),
    severity: "info",
    message: "template-engine: cache hit ratio 94.2% — 847 cache hits, 52 misses in last hour",
    serviceId: "svc-d3f56e8",
    deploymentId: "dep-a8d23f6",
    stream: "deploy",
  },
  {
    timestamp: hoursAgo(7),
    severity: "info",
    message: "healthcheck: GET /health 200 8ms",
    serviceId: "svc-a9f3b1c",
    deploymentId: "dep-c4e71a2",
    stream: "deploy",
  },
  {
    timestamp: hoursAgo(8),
    severity: "warn",
    message: "p99 response time spike: /api/generate 2847ms (SLA threshold: 2000ms) — worker queue backlog detected",
    serviceId: "svc-b2d8e4f",
    deploymentId: "dep-f1b83c9",
    stream: "deploy",
  },
  {
    timestamp: hoursAgo(9),
    severity: "info",
    message: "express: server listening on port 3000 [NODE_ENV=production]",
    serviceId: "svc-a9f3b1c",
    deploymentId: "dep-c4e71a2",
    stream: "deploy",
  },
  {
    // Build log — most recent successful deploy (dep-c4e71a2)
    timestamp: daysAgo(1, 11, 14),
    severity: "info",
    message: "==> Railpack: detected Node.js 20.x project",
    serviceId: "svc-a9f3b1c",
    deploymentId: "dep-c4e71a2",
    stream: "build",
  },
  {
    timestamp: daysAgo(1, 11, 15),
    severity: "info",
    message: "==> npm install: resolving 847 packages from lockfile",
    serviceId: "svc-a9f3b1c",
    deploymentId: "dep-c4e71a2",
    stream: "build",
  },
  {
    timestamp: daysAgo(1, 11, 15),
    severity: "info",
    message: "==> npm install: added 847 packages in 41s (cache HIT — using layer cache)",
    serviceId: "svc-a9f3b1c",
    deploymentId: "dep-c4e71a2",
    stream: "build",
  },
  {
    timestamp: daysAgo(1, 11, 16),
    severity: "info",
    message: "==> npm run setup: running database migrations",
    serviceId: "svc-a9f3b1c",
    deploymentId: "dep-c4e71a2",
    stream: "build",
  },
  {
    timestamp: daysAgo(1, 11, 16),
    severity: "info",
    message: "==> migration: applied 3 pending migrations [v1.0.0 → v1.2.0]",
    serviceId: "svc-a9f3b1c",
    deploymentId: "dep-c4e71a2",
    stream: "build",
  },
  {
    timestamp: daysAgo(1, 11, 16),
    severity: "info",
    message: "==> seeder: inserted 24 default bill templates into template table",
    serviceId: "svc-a9f3b1c",
    deploymentId: "dep-c4e71a2",
    stream: "build",
  },
  {
    timestamp: daysAgo(1, 11, 17),
    severity: "info",
    message: "==> Build complete. Image size: 387 MB. Pushing to registry.",
    serviceId: "svc-a9f3b1c",
    deploymentId: "dep-c4e71a2",
    stream: "build",
  },
  // Build log — the failed deploy (dep-7c3d91e)
  {
    timestamp: daysAgo(5, 15, 9),
    severity: "info",
    message: "==> npm install: added 849 packages in 43s (cache HIT)",
    serviceId: "svc-a9f3b1c",
    deploymentId: "dep-7c3d91e",
    stream: "build",
  },
  {
    timestamp: daysAgo(5, 15, 11),
    severity: "error",
    message:
      "Error: WEBHOOK_SECRET is not defined in environment. Add this variable to your Railway service before deploying.",
    serviceId: "svc-a9f3b1c",
    deploymentId: "dep-7c3d91e",
    stream: "deploy",
  },
  // OOM crash log for dep-d5e28b1
  {
    timestamp: daysAgo(7, 9, 41),
    severity: "error",
    message:
      "FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory. Memory: 512 MB used / 512 MB limit.",
    serviceId: "svc-b2d8e4f",
    deploymentId: "dep-d5e28b1",
    stream: "deploy",
  },
  {
    timestamp: daysAgo(7, 9, 41),
    severity: "error",
    message:
      "Process killed by Railway: OOM. Container exceeded 512 MB memory limit during concurrent document batch (18 documents). Consider adding --max-old-space-size or reducing batch concurrency.",
    serviceId: "svc-b2d8e4f",
    deploymentId: "dep-d5e28b1",
    stream: "deploy",
  },
];

// ---------------------------------------------------------------------------
// Health checks (4 items — the client's 4-point acceptance checklist)
// ---------------------------------------------------------------------------

export const healthChecks: HealthCheck[] = [
  {
    id: "hc-01",
    name: "Site Password Gate",
    endpoint: "/",
    status: "Passing",
    responseTime: 12,
    lastChecked: hoursAgo(0),
    httpStatus: 200,
    description:
      "Verifies the site-wide password gate is active and returning 200 with the auth form. A missing SITE_PASSWORD env var causes this to bypass auth entirely.",
  },
  {
    id: "hc-02",
    name: "Login Page",
    endpoint: "/auth/login",
    status: "Passing",
    responseTime: 38,
    lastChecked: hoursAgo(0),
    httpStatus: 200,
    description:
      "Confirms the login page renders and the scrypt-based authentication endpoint is reachable. SESSION_SECRET must be set for cookies to be signed.",
  },
  {
    id: "hc-03",
    name: "AI Generation (Anthropic Claude)",
    endpoint: "/api/generate",
    status: "Passing",
    responseTime: 1847,
    lastChecked: hoursAgo(1),
    httpStatus: 200,
    description:
      "End-to-end smoke test: POST a minimal HB document request and verify the Anthropic Claude API responds with a draft. Validates ANTHROPIC_API_KEY is propagated and the model endpoint is reachable.",
  },
  {
    // Edge case: intermittent slow response but still Passing — signals the degraded worker
    id: "hc-04",
    name: "DOCX Export",
    endpoint: "/api/export/docx",
    status: "Passing",
    responseTime: 2340,
    lastChecked: hoursAgo(1),
    httpStatus: 200,
    description:
      "Confirms the document-renderer service generates a valid DOCX binary and returns it with correct Content-Disposition headers for download. Response time above 2000ms indicates worker queue pressure.",
  },
];

// ---------------------------------------------------------------------------
// Metric time series (24 hourly data points — last 24 hours)
// Baseline: CPU 2-8%, Memory 280-340 MB, Response 60-120ms, Error 0-0.5%
// Spikes during document generation bursts around business hours
// Deployment marker at hour 13 (dep-c4e71a2 went live ~13h ago)
// ---------------------------------------------------------------------------

export const metricTimeSeries: MetricPoint[] = [
  { timestamp: hoursAgo(23), cpu: 3.2, memory: 287, responseTime: 74, errorRate: 0.1 },
  { timestamp: hoursAgo(22), cpu: 2.8, memory: 281, responseTime: 68, errorRate: 0.0 },
  { timestamp: hoursAgo(21), cpu: 3.1, memory: 284, responseTime: 71, errorRate: 0.1 },
  { timestamp: hoursAgo(20), cpu: 2.4, memory: 279, responseTime: 63, errorRate: 0.0 },
  { timestamp: hoursAgo(19), cpu: 4.7, memory: 298, responseTime: 88, errorRate: 0.2 },
  { timestamp: hoursAgo(18), cpu: 6.2, memory: 312, responseTime: 97, errorRate: 0.3 },
  // Business hours start — document generation activity picks up
  { timestamp: hoursAgo(17), cpu: 12.4, memory: 334, responseTime: 124, errorRate: 0.4 },
  { timestamp: hoursAgo(16), cpu: 18.7, memory: 358, responseTime: 187, errorRate: 0.8 },
  // Document generation burst — CPU/Memory spike
  { timestamp: hoursAgo(15), cpu: 44.8, memory: 412, responseTime: 380, errorRate: 2.1 },
  { timestamp: hoursAgo(14), cpu: 31.2, memory: 387, responseTime: 247, errorRate: 1.4 },
  // Deployment marker — dep-c4e71a2 went Active ~13h ago
  {
    timestamp: hoursAgo(13),
    cpu: 8.9,
    memory: 318,
    responseTime: 112,
    errorRate: 0.3,
    deploymentMarker: true,
  },
  // Post-deploy recovery
  { timestamp: hoursAgo(12), cpu: 5.4, memory: 302, responseTime: 89, errorRate: 0.2 },
  { timestamp: hoursAgo(11), cpu: 4.8, memory: 295, responseTime: 82, errorRate: 0.1 },
  { timestamp: hoursAgo(10), cpu: 7.3, memory: 308, responseTime: 94, errorRate: 0.1 },
  // Lunchtime lull
  { timestamp: hoursAgo(9), cpu: 3.4, memory: 283, responseTime: 71, errorRate: 0.0 },
  { timestamp: hoursAgo(8), cpu: 3.1, memory: 281, responseTime: 69, errorRate: 0.1 },
  // Afternoon generation burst
  { timestamp: hoursAgo(7), cpu: 22.1, memory: 361, responseTime: 214, errorRate: 0.7 },
  { timestamp: hoursAgo(6), cpu: 38.4, memory: 398, responseTime: 312, errorRate: 1.2 },
  { timestamp: hoursAgo(5), cpu: 27.6, memory: 374, responseTime: 268, errorRate: 0.9 },
  { timestamp: hoursAgo(4), cpu: 9.2, memory: 322, responseTime: 118, errorRate: 0.3 },
  { timestamp: hoursAgo(3), cpu: 6.7, memory: 307, responseTime: 97, errorRate: 0.2 },
  { timestamp: hoursAgo(2), cpu: 5.1, memory: 294, responseTime: 84, errorRate: 0.1 },
  // Evening wind-down
  { timestamp: hoursAgo(1), cpu: 4.2, memory: 288, responseTime: 76, errorRate: 0.1 },
  { timestamp: hoursAgo(0), cpu: 3.8, memory: 284, responseTime: 72, errorRate: 0.0 },
];

// ---------------------------------------------------------------------------
// Deployment frequency — 30 days (DORA metric, daily bar chart)
// Pattern: 0-4 deploys/day, weekday-heavy, realistic failure scatter
// ---------------------------------------------------------------------------

export const deploymentFrequency: DeploymentFrequency[] = [
  { date: "2026-01-26", total: 0, succeeded: 0, failed: 0 }, // Monday — low start
  { date: "2026-01-27", total: 2, succeeded: 2, failed: 0 },
  { date: "2026-01-28", total: 3, succeeded: 3, failed: 0 },
  { date: "2026-01-29", total: 1, succeeded: 1, failed: 0 },
  { date: "2026-01-30", total: 4, succeeded: 3, failed: 1 }, // Friday: 1 failure
  { date: "2026-01-31", total: 0, succeeded: 0, failed: 0 }, // Saturday
  { date: "2026-02-01", total: 0, succeeded: 0, failed: 0 }, // Sunday
  { date: "2026-02-02", total: 2, succeeded: 2, failed: 0 },
  { date: "2026-02-03", total: 3, succeeded: 2, failed: 1 },
  { date: "2026-02-04", total: 4, succeeded: 4, failed: 0 }, // active sprint day
  { date: "2026-02-05", total: 2, succeeded: 2, failed: 0 },
  { date: "2026-02-06", total: 3, succeeded: 3, failed: 0 },
  { date: "2026-02-07", total: 0, succeeded: 0, failed: 0 }, // Saturday
  { date: "2026-02-08", total: 0, succeeded: 0, failed: 0 }, // Sunday
  { date: "2026-02-09", total: 1, succeeded: 1, failed: 0 },
  { date: "2026-02-10", total: 2, succeeded: 1, failed: 1 }, // OOM crash day
  { date: "2026-02-11", total: 3, succeeded: 3, failed: 0 }, // recovery deploys
  { date: "2026-02-12", total: 4, succeeded: 4, failed: 0 },
  { date: "2026-02-13", total: 3, succeeded: 2, failed: 1 }, // Friday failure
  { date: "2026-02-14", total: 0, succeeded: 0, failed: 0 }, // Saturday
  { date: "2026-02-15", total: 0, succeeded: 0, failed: 0 }, // Sunday
  { date: "2026-02-16", total: 2, succeeded: 2, failed: 0 },
  { date: "2026-02-17", total: 1, succeeded: 0, failed: 1 }, // healthcheck timeout failure
  { date: "2026-02-18", total: 3, succeeded: 3, failed: 0 }, // hotfix + 2 features
  { date: "2026-02-19", total: 2, succeeded: 2, failed: 0 },
  { date: "2026-02-20", total: 3, succeeded: 2, failed: 1 }, // WEBHOOK_SECRET failure
  { date: "2026-02-21", total: 0, succeeded: 0, failed: 0 }, // Saturday
  { date: "2026-02-22", total: 0, succeeded: 0, failed: 0 }, // Sunday
  { date: "2026-02-23", total: 2, succeeded: 2, failed: 0 },
  { date: "2026-02-24", total: 3, succeeded: 3, failed: 0 }, // yesterday
];

// ---------------------------------------------------------------------------
// Recent legislative documents (10 items — the business layer output)
// These are documents the deployed platform generated — demonstrates the
// dual DevOps+GovTech domain authenticity
// ---------------------------------------------------------------------------

export const recentDocuments: LegislativeDocument[] = [
  {
    documentId: "HB-2847",
    type: "House Bill",
    title: "An Act Relating to Broadband Infrastructure Funding for Rural Communities",
    status: "In Committee",
    generatedAt: hoursAgo(2),
    format: "DOCX",
    templateId: "tpl-hb-standard-v2",
    generationMs: 1847,
    session: "2025 Regular Session",
  },
  {
    documentId: "SB-1193",
    type: "Senate Bill",
    title: "Comprehensive Public Records Modernization and Digital Access Act",
    status: "Engrossed",
    generatedAt: hoursAgo(4),
    format: "DOCX",
    templateId: "tpl-sb-standard-v1",
    generationMs: 2340,
    session: "2025 Regular Session",
  },
  {
    documentId: "HJR-44",
    type: "House Joint Resolution",
    title: "A Joint Resolution Urging Congress to Reauthorize the Farm and Ranch Lands Protection Program",
    status: "Introduced",
    generatedAt: hoursAgo(7),
    format: "PDF",
    templateId: "tpl-hjr-v1",
    generationMs: 1124,
    session: "2025 Regular Session",
  },
  {
    documentId: "AM-2847-01",
    type: "Amendment",
    title: "Amendment to HB-2847: Add Tribal Nation Broadband Access Provisions",
    status: "Draft",
    generatedAt: daysAgo(1, 14, 22),
    format: "DOCX",
    templateId: "tpl-amendment-v2",
    generationMs: 984,
    session: "2025 Regular Session",
  },
  {
    documentId: "PB-ENV-2025-03",
    type: "Policy Brief",
    title: "Environmental Impact of Distributed Solar Generation Incentive Programs: A Fiscal Analysis",
    status: "Draft",
    generatedAt: daysAgo(2, 11, 8),
    format: "PDF",
    templateId: "tpl-policy-brief-v3",
    generationMs: 2847,
    session: "2025 Regular Session",
  },
  {
    documentId: "SCR-112",
    type: "Senate Concurrent Resolution",
    title: "A Concurrent Resolution Recognizing the Contributions of Community Health Workers",
    status: "Signed",
    generatedAt: daysAgo(3, 9, 47),
    format: "DOCX",
    templateId: "tpl-scr-v1",
    generationMs: 876,
    session: "2025 Regular Session",
  },
  {
    documentId: "FAR-2847",
    type: "Fiscal Analysis Report",
    title: "Fiscal Note: HB-2847 Broadband Infrastructure — 5-Year Cost Projection",
    status: "In Committee",
    generatedAt: daysAgo(4, 13, 31),
    format: "DOCX",
    templateId: "tpl-fiscal-note-v2",
    generationMs: 1392,
    session: "2025 Regular Session",
  },
  {
    // Edge case: Vetoed document — legislative failure state
    documentId: "HB-2791",
    type: "House Bill",
    title: "An Act Establishing the Office of Artificial Intelligence Governance and Regulatory Oversight",
    status: "Vetoed",
    generatedAt: daysAgo(8, 10, 14),
    format: "XML",
    templateId: "tpl-hb-standard-v2",
    generationMs: 2108,
    session: "2025 Regular Session",
  },
  {
    documentId: "SB-1087",
    type: "Senate Bill",
    title: "Mental Health Parity Enforcement and Insurance Compliance Act",
    status: "Enrolled",
    generatedAt: daysAgo(11, 15, 52),
    format: "DOCX",
    templateId: "tpl-sb-standard-v1",
    generationMs: 1673,
    session: "2025 Regular Session",
  },
  {
    // Edge case: high generation time — template complexity or LLM timeout
    documentId: "COM-REPORT-117",
    type: "Committee Report",
    title: "Judiciary Committee Report on SB-1193 Public Records Modernization — Findings and Recommendations",
    status: "Draft",
    generatedAt: daysAgo(14, 11, 3),
    format: "DOCX",
    templateId: "tpl-committee-report-v1",
    generationMs: 8847, // slow — large document, complex template rendering
    session: "2025 Regular Session",
  },
];

// ---------------------------------------------------------------------------
// Dashboard stats (KPI cards)
// ---------------------------------------------------------------------------

export const dashboardStats: DashboardStats = {
  primaryServiceUptime: 99.87,
  uptimeChange: 0.12,               // up 0.12 percentage points vs prior 30d
  activeDeployments: 4,             // legis-api prod, legis-worker prod, document-renderer prod, pr-142
  activeDeploymentsChange: 1,       // +1 vs prior period (pr-142 environment added)
  p95ResponseTime: 247,             // ms, legis-api production last 24h
  p95Change: -31,                   // -31ms improvement (negative = better)
  errorRate: 0.34,
  errorRateChange: -0.18,           // -0.18 percentage points improvement
  documentsGenerated: 1284,
  documentsChange: 147,             // +147 vs prior 30 days
  envVarIssues: 1,                  // WEBHOOK_SECRET is Missing
  healthChecksPassing: 4,           // all 4 checks currently Passing
};

// ---------------------------------------------------------------------------
// Chart data — deployment frequency (30-day bar chart)
// Derived from deploymentFrequency array, formatted for Recharts
// ---------------------------------------------------------------------------

export const deploymentFrequencyChart: DeploymentFrequencyChartPoint[] = [
  { date: "Jan 26", succeeded: 0, failed: 0 },
  { date: "Jan 27", succeeded: 2, failed: 0 },
  { date: "Jan 28", succeeded: 3, failed: 0 },
  { date: "Jan 29", succeeded: 1, failed: 0 },
  { date: "Jan 30", succeeded: 3, failed: 1 },
  { date: "Feb 02", succeeded: 2, failed: 0 },
  { date: "Feb 03", succeeded: 2, failed: 1 },
  { date: "Feb 04", succeeded: 4, failed: 0 },
  { date: "Feb 05", succeeded: 2, failed: 0 },
  { date: "Feb 06", succeeded: 3, failed: 0 },
  { date: "Feb 09", succeeded: 1, failed: 0 },
  { date: "Feb 10", succeeded: 1, failed: 1 },
  { date: "Feb 11", succeeded: 3, failed: 0 },
  { date: "Feb 12", succeeded: 4, failed: 0 },
  { date: "Feb 13", succeeded: 2, failed: 1 },
  { date: "Feb 16", succeeded: 2, failed: 0 },
  { date: "Feb 17", succeeded: 0, failed: 1 },
  { date: "Feb 18", succeeded: 3, failed: 0 },
  { date: "Feb 19", succeeded: 2, failed: 0 },
  { date: "Feb 20", succeeded: 2, failed: 1 },
  { date: "Feb 23", succeeded: 2, failed: 0 },
  { date: "Feb 24", succeeded: 3, failed: 0 },
];

// ---------------------------------------------------------------------------
// Chart data — document generation volume by month
// Pattern: steady ramp with a spike in February (legislative session peak)
// State legislatures are most active Jan-April; volume reflects that seasonality
// ---------------------------------------------------------------------------

export const documentVolumeChart: DocumentVolumeChartPoint[] = [
  { month: "Aug",  total: 284,  docx: 212, pdf: 72  },
  { month: "Sep",  total: 318,  docx: 241, pdf: 77  },
  { month: "Oct",  total: 347,  docx: 268, pdf: 79  },
  { month: "Nov",  total: 312,  docx: 234, pdf: 78  }, // recess — slight dip
  { month: "Dec",  total: 274,  docx: 201, pdf: 73  }, // holiday/recess low
  { month: "Jan",  total: 748,  docx: 594, pdf: 154 }, // session starts — volume surge
  { month: "Feb",  total: 1284, docx: 1021, pdf: 263 }, // peak session activity (current month, partial)
];

// ---------------------------------------------------------------------------
// Lookup helpers
// ---------------------------------------------------------------------------

export const getServiceById = (id: string): Service | undefined =>
  services.find((s) => s.id === id);

export const getDeploymentById = (id: string): Deployment | undefined =>
  deployments.find((d) => d.id === id);

export const getDeploymentsByService = (serviceId: string): Deployment[] =>
  deployments.filter((d) => d.serviceId === serviceId);

export const getDeploymentsByEnvironment = (env: string): Deployment[] =>
  deployments.filter((d) => d.environment === env);

export const getActiveDeployments = (): Deployment[] =>
  deployments.filter((d) => d.status === "Active");

export const getFailedDeployments = (): Deployment[] =>
  deployments.filter((d) => d.status === "Failed" || d.status === "Crashed");

export const getLogsByDeployment = (deploymentId: string): LogEntry[] =>
  logEntries.filter((l) => l.deploymentId === deploymentId);

export const getLogsByService = (serviceId: string): LogEntry[] =>
  logEntries.filter((l) => l.serviceId === serviceId);

export const getLogsByStream = (stream: "build" | "deploy"): LogEntry[] =>
  logEntries.filter((l) => l.stream === stream);

export const getMissingEnvVars = (): EnvVariable[] =>
  envVariables.filter((v) => v.status === "Missing" || v.status === "Invalid");

export const getEnvVarsByScope = (scope: "shared" | "service"): EnvVariable[] =>
  envVariables.filter((v) => v.scope === scope);
