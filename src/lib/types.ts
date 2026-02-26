import type { LucideIcon } from "lucide-react";

// ---------------------------------------------------------------------------
// Layout / Navigation
// ---------------------------------------------------------------------------

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

// ---------------------------------------------------------------------------
// Challenge visualization types (used by challenges page)
// ---------------------------------------------------------------------------

export type VisualizationType =
  | "flow"
  | "before-after"
  | "metrics"
  | "architecture"
  | "risk-matrix"
  | "timeline"
  | "dual-kpi"
  | "tech-stack"
  | "decision-flow";

export interface Challenge {
  id: string;
  title: string;
  description: string;
  visualizationType: VisualizationType;
  outcome?: string;
}

// ---------------------------------------------------------------------------
// Proposal types (used by proposal page)
// ---------------------------------------------------------------------------

export interface Profile {
  name: string;
  tagline: string;
  bio: string;
  approach: { title: string; description: string }[];
  skillCategories: { name: string; skills: string[] }[];
}

export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  tech: string[];
  relevance?: string;
  outcome?: string;
  liveUrl?: string;
}

// ---------------------------------------------------------------------------
// Deployment domain types
// Railway's exact lifecycle states:
//   Initializing → Building → Deploying → Active  (healthy terminal)
//   Failed   — error during build or deploy phase
//   Crashed  — was Active, then died unexpectedly (e.g. OOM)
//   Completed — process exited with code 0 (one-off tasks)
//   Removing → Removed — cleanup after superseded by new deployment
// ---------------------------------------------------------------------------

export type DeploymentStatus =
  | "Initializing"
  | "Building"
  | "Deploying"
  | "Active"
  | "Failed"
  | "Crashed"
  | "Completed"
  | "Removing"
  | "Removed";

export type ServiceHealthStatus =
  | "Healthy"
  | "Degraded"
  | "Unhealthy"
  | "Starting";

export type DeploymentEnvironment =
  | "production"
  | "staging"
  | "pr-142"
  | "pr-138"
  | "demo";

/** A single deployment event triggered by a git push or manual redeploy */
export interface Deployment {
  /** Format: dep-XXXXXXX (7 hex chars, e.g. dep-a3f29c1) */
  id: string;
  /** References Service.id */
  serviceId: string;
  /** Human-readable service name, e.g. "legis-api" */
  serviceName: string;
  status: DeploymentStatus;
  environment: DeploymentEnvironment;
  /** Display name of the person who triggered the deployment */
  triggeredBy: string;
  /** Short git commit message, e.g. "feat: add PDF export" */
  commitMessage: string;
  /** 7-char short SHA, e.g. "a1b2c3d" */
  commitSha: string;
  /** Build duration in seconds (42–454s typical range) */
  buildDuration: number;
  /** ISO 8601 datetime — when the deployment became Active or reached terminal state */
  deployedAt: string;
  /** Present when status is Failed or Crashed */
  failureReason?: string | null;
}

/** A running service within the Railway project */
export interface Service {
  /** Format: svc-XXXXXXX */
  id: string;
  /** Kebab-case service name, e.g. "legis-api" */
  name: string;
  healthStatus: ServiceHealthStatus;
  /** Number of running replicas */
  replicaCount: number;
  /** Uptime percentage over the last 30 days (0–100) */
  uptime: number;
  /** References Deployment.id for the most recent deployment */
  lastDeploymentId: string;
  environment: DeploymentEnvironment;
  /** p50 response time in milliseconds */
  p50ResponseTime: number;
  /** p95 response time in milliseconds — captures slow tail requests */
  p95ResponseTime: number;
  /** p99 response time in milliseconds — worst-case outliers */
  p99ResponseTime: number;
}

// ---------------------------------------------------------------------------
// Environment variable types
// ---------------------------------------------------------------------------

export type EnvVariableStatus =
  | "Active"
  | "Missing"
  | "Using Default"
  | "Invalid";

/** A single environment variable configured for a Railway service */
export interface EnvVariable {
  /** Variable key name, e.g. "ANTHROPIC_API_KEY" */
  key: string;
  /** Displayed value — secrets masked as "••••••••••••", plain values shown verbatim */
  value: string;
  status: EnvVariableStatus;
  /** "shared" = project-level; "service" = service-specific override */
  scope: "shared" | "service";
  environment: DeploymentEnvironment;
  /** ISO date string of last modification */
  lastUpdated: string;
  /** Optional note explaining purpose or active issue */
  note?: string;
}

// ---------------------------------------------------------------------------
// Log entry types
// ---------------------------------------------------------------------------

/** Railway log severity levels — exact lowercase strings Railway normalizes to */
export type LogSeverity = "info" | "warn" | "error" | "debug";

/**
 * A single line emitted by the build log or deploy log stream.
 * Build logs contain: npm install output, Railpack detection, image creation.
 * Deploy logs contain: running application stdout/stderr (Express.js request logs, etc.).
 */
export interface LogEntry {
  /** ISO 8601 datetime with milliseconds precision */
  timestamp: string;
  severity: LogSeverity;
  /** Raw log message text — rendered monospace in the UI */
  message: string;
  /** References Service.id */
  serviceId: string;
  /** References Deployment.id when log belongs to a specific deployment event */
  deploymentId?: string;
  /** "build" = Railpack/Docker build phase; "deploy" = runtime application output */
  stream: "build" | "deploy";
}

// ---------------------------------------------------------------------------
// Health check types
// ---------------------------------------------------------------------------

export type HealthCheckStatus =
  | "Passing"
  | "Failing"
  | "Timeout"
  | "Pending";

/**
 * A single endpoint check from the 4-point deployment acceptance checklist.
 * Directly mirrors the client's own verification criteria:
 * (1) Site password gate, (2) Login page, (3) AI generation, (4) DOCX export.
 */
export interface HealthCheck {
  /** Format: hc-XX */
  id: string;
  /** Human-readable label, e.g. "Site Password Gate" */
  name: string;
  /** HTTP endpoint path being polled, e.g. "/" or "/api/generate" */
  endpoint: string;
  status: HealthCheckStatus;
  /** Round-trip response time in milliseconds */
  responseTime: number;
  /** ISO datetime of the most recent check execution */
  lastChecked: string;
  /** HTTP status code returned (200 = pass, 401/403/503 = fail variants) */
  httpStatus: number;
  /** Human-readable description of what this check validates */
  description?: string;
}

// ---------------------------------------------------------------------------
// Metric time series
// ---------------------------------------------------------------------------

/** One hourly data point for the service metrics panel (last 24 hours) */
export interface MetricPoint {
  /** ISO datetime string — hourly granularity */
  timestamp: string;
  /** CPU utilization as percentage of allocated vCPU (0–100) */
  cpu: number;
  /** RAM consumed in MB */
  memory: number;
  /** p50 HTTP response time in milliseconds */
  responseTime: number;
  /** Percentage of HTTP requests returning 4xx or 5xx status (0–100) */
  errorRate: number;
  /** When true, a deployment event occurred at this timestamp (renders as chart marker) */
  deploymentMarker?: boolean;
}

// ---------------------------------------------------------------------------
// Deployment frequency (DORA metric)
// ---------------------------------------------------------------------------

/** One calendar day of deployment activity — drives the frequency bar chart */
export interface DeploymentFrequency {
  /** ISO date string, e.g. "2026-01-28" */
  date: string;
  /** Total deployments triggered that day */
  total: number;
  /** Deployments that reached Active status */
  succeeded: number;
  /** Deployments that ended in Failed or Crashed */
  failed: number;
}

// ---------------------------------------------------------------------------
// Legislative document types (the content layer the deployed platform serves)
// ---------------------------------------------------------------------------

export type LegislativeDocumentType =
  | "House Bill"
  | "Senate Bill"
  | "House Joint Resolution"
  | "Senate Concurrent Resolution"
  | "Amendment"
  | "Policy Brief"
  | "Fiscal Analysis Report"
  | "Committee Report";

export type LegislativeDocumentStatus =
  | "Draft"
  | "Introduced"
  | "In Committee"
  | "Engrossed"
  | "Enrolled"
  | "Signed"
  | "Vetoed"
  | "Failed";

export type DocumentFormat = "DOCX" | "PDF" | "XML";

/** A legislative document generated by the API the deployed platform serves */
export interface LegislativeDocument {
  /** US state legislative numbering: HB-2847, SB-1193, HJR-44, etc. */
  documentId: string;
  type: LegislativeDocumentType;
  /** Full legislative title */
  title: string;
  status: LegislativeDocumentStatus;
  /** ISO datetime when the platform's API generated this document */
  generatedAt: string;
  /** Export format delivered to the requester */
  format: DocumentFormat;
  /** Template ID used for generation, e.g. "tpl-hb-standard-v2" */
  templateId: string;
  /** End-to-end generation time in milliseconds — API performance signal */
  generationMs: number;
  /** Legislative session context, e.g. "2025 Regular Session" */
  session: string;
}

// ---------------------------------------------------------------------------
// Dashboard stats (KPI cards)
// ---------------------------------------------------------------------------

/** Aggregated KPI data for the deployment overview dashboard */
export interface DashboardStats {
  /** legis-api uptime % over last 30 days */
  primaryServiceUptime: number;
  /** Change vs prior 30-day period (percentage points; positive = improvement) */
  uptimeChange: number;
  /** Count of Active deployments across all services and environments */
  activeDeployments: number;
  /** Delta vs prior period */
  activeDeploymentsChange: number;
  /** p95 response time in ms over last 24 hours */
  p95ResponseTime: number;
  /** Delta vs prior 24 hours in ms (negative = improvement) */
  p95Change: number;
  /** Error rate % over last 24 hours */
  errorRate: number;
  /** Delta vs prior 24 hours (negative = improvement) */
  errorRateChange: number;
  /** Legislative documents generated in last 30 days */
  documentsGenerated: number;
  /** Delta vs prior 30 days */
  documentsChange: number;
  /** Env variables with status "Missing" or "Invalid" — critical path for deployment */
  envVarIssues: number;
  /** Health checks currently in "Passing" state (out of 4 total) */
  healthChecksPassing: number;
}

// ---------------------------------------------------------------------------
// Chart data shape interfaces
// ---------------------------------------------------------------------------

/** Bar chart segment for the 30-day deployment frequency chart */
export interface DeploymentFrequencyChartPoint {
  /** Short date label for the chart x-axis, e.g. "Jan 28" */
  date: string;
  succeeded: number;
  failed: number;
}

/** Monthly data point for the document generation volume chart */
export interface DocumentVolumeChartPoint {
  /** Month label, e.g. "Aug" */
  month: string;
  /** Total documents generated that month */
  total: number;
  /** Documents delivered as DOCX */
  docx: number;
  /** Documents delivered as PDF */
  pdf: number;
}
