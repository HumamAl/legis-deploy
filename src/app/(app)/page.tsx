"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  Clock,
  FileText,
  Server,
  TrendingDown,
  TrendingUp,
  Minus,
  CircleDot,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useCountUp } from "@/hooks/useCountUp";
import {
  dashboardStats,
  deployments,
  metricTimeSeries,
  deploymentFrequencyChart,
} from "@/data/mock-data";
import type { Deployment, DeploymentStatus } from "@/lib/types";
import { APP_CONFIG } from "@/lib/config";

// ---------------------------------------------------------------------------
// Dynamic chart imports — SSR disabled to prevent Recharts width(-1) artifact
// ---------------------------------------------------------------------------

const ServiceMetricsChart = dynamic(
  () =>
    import("@/components/dashboard/service-metrics-chart").then(
      (m) => m.ServiceMetricsChart
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-[220px] bg-muted/30 animate-pulse rounded" />
    ),
  }
);

const DeploymentFrequencyChart = dynamic(
  () =>
    import("@/components/dashboard/deployment-frequency-chart").then(
      (m) => m.DeploymentFrequencyChart
    ),
  {
    ssr: false,
    loading: () => (
      <div className="h-[220px] bg-muted/30 animate-pulse rounded" />
    ),
  }
);

// ---------------------------------------------------------------------------
// Status badge helpers
// ---------------------------------------------------------------------------

function deploymentStatusColor(status: DeploymentStatus): string {
  switch (status) {
    case "Active":
      return "bg-success/10 text-success border-success/30";
    case "Building":
    case "Deploying":
    case "Initializing":
      return "bg-warning/10 text-warning border-warning/30";
    case "Failed":
    case "Crashed":
      return "bg-destructive/10 text-destructive border-destructive/30";
    case "Removed":
    case "Removing":
    case "Completed":
      return "bg-muted text-muted-foreground border-border";
    default:
      return "bg-muted text-muted-foreground border-border";
  }
}

function deploymentStatusIcon(status: DeploymentStatus) {
  switch (status) {
    case "Active":
      return <CheckCircle2 className="w-3 h-3" />;
    case "Failed":
    case "Crashed":
      return <AlertTriangle className="w-3 h-3" />;
    case "Building":
    case "Deploying":
      return <CircleDot className="w-3 h-3" />;
    default:
      return <Minus className="w-3 h-3" />;
  }
}

/** Format build duration (seconds) to "1m 34s" or "89s" */
function formatDuration(seconds: number): string {
  if (seconds >= 60) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m ${s}s`;
  }
  return `${seconds}s`;
}

/** Format ISO timestamp to a compact relative label */
function formatRelative(iso: string): string {
  const now = new Date("2026-02-25T00:00:00Z");
  const then = new Date(iso);
  const diffMs = now.getTime() - then.getTime();
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHrs / 24);

  if (diffHrs < 1) return "< 1h ago";
  if (diffHrs < 24) return `${diffHrs}h ago`;
  return `${diffDays}d ago`;
}

// ---------------------------------------------------------------------------
// Animated KPI stat card
// ---------------------------------------------------------------------------

interface StatCardProps {
  label: string;
  value: number;
  /** Format: "percent" | "ms" | "count" | "percent-2dp" */
  format: "percent" | "ms" | "count" | "percent-2dp";
  /** Positive value = improvement direction matters; negative = bad direction */
  delta?: number;
  deltaLabel?: string;
  /** Override status color: "success" | "warning" | "destructive" */
  statusColor?: "success" | "warning" | "destructive" | "default";
  icon: React.ReactNode;
  index: number;
}

function StatCard({
  label,
  value,
  format,
  delta,
  deltaLabel,
  statusColor = "default",
  icon,
  index,
}: StatCardProps) {
  const { count, ref } = useCountUp(value, 1000);

  function formatValue(v: number): string {
    switch (format) {
      case "percent":
        return `${Math.round(v)}%`;
      case "percent-2dp":
        return `${v.toFixed(2)}%`;
      case "ms":
        return `${Math.round(v)}ms`;
      case "count":
        return `${Math.round(v)}`;
    }
  }

  const valueColorClass =
    statusColor === "success"
      ? "text-success"
      : statusColor === "warning"
      ? "text-warning"
      : statusColor === "destructive"
      ? "text-destructive"
      : "text-foreground";

  const deltaIsGood =
    delta !== undefined
      ? statusColor === "destructive" || label.includes("Error") || label.includes("p95")
        ? delta < 0
        : delta > 0
      : true;

  return (
    <div
      ref={ref}
      className="aesthetic-card animate-fade-up-in"
      style={{
        padding: "var(--card-padding)",
        animationDelay: `${index * 50}ms`,
        animationDuration: "150ms",
      }}
    >
      {/* Label row */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          {label}
        </span>
        <span className="text-muted-foreground/60">{icon}</span>
      </div>

      {/* Value */}
      <div
        className={cn(
          "text-2xl font-semibold font-mono tabular-nums leading-none",
          valueColorClass
        )}
      >
        {format === "percent-2dp" ? count.toFixed(2) + "%" : formatValue(count)}
      </div>

      {/* Delta */}
      {delta !== undefined && deltaLabel && (
        <div className="flex items-center gap-1 mt-1.5">
          {deltaIsGood ? (
            <TrendingDown className="w-3 h-3 text-success shrink-0" />
          ) : delta === 0 ? (
            <Minus className="w-3 h-3 text-muted-foreground shrink-0" />
          ) : (
            <TrendingUp className="w-3 h-3 text-destructive shrink-0" />
          )}
          <span className="text-xs text-muted-foreground font-mono">
            {deltaLabel}
          </span>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Period filter type
// ---------------------------------------------------------------------------

type MetricPeriod = "6h" | "12h" | "24h";

// ---------------------------------------------------------------------------
// Main dashboard page
// ---------------------------------------------------------------------------

export default function DeploymentOverviewPage() {
  const [metricPeriod, setMetricPeriod] = useState<MetricPeriod>("24h");

  // Filter metric series by selected period
  const filteredMetrics = useMemo(() => {
    switch (metricPeriod) {
      case "6h":
        return metricTimeSeries.slice(-6);
      case "12h":
        return metricTimeSeries.slice(-12);
      case "24h":
      default:
        return metricTimeSeries;
    }
  }, [metricPeriod]);

  // Last 8 deployments for the activity table
  const recentDeployments: Deployment[] = deployments.slice(0, 8);

  // Stats
  const stats = dashboardStats;

  return (
    <div className="space-y-3">
      {/* ── Page Header ──────────────────────────────────────── */}
      <div>
        <h1
          className="text-lg font-semibold tracking-tight"
          style={{ letterSpacing: "var(--heading-tracking)" }}
        >
          Deployment Overview
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          legis-api production &middot; Railway &middot; 4 services &middot;{" "}
          <span className="font-mono">pr-142</span> active
        </p>
      </div>

      {/* ── Row 1: 6 KPI stat cards ──────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        <StatCard
          index={0}
          label="Uptime"
          value={stats.primaryServiceUptime}
          format="percent-2dp"
          delta={stats.uptimeChange}
          deltaLabel={`+${stats.uptimeChange}pp vs prior 30d`}
          statusColor="success"
          icon={<Activity className="w-3.5 h-3.5" />}
        />
        <StatCard
          index={1}
          label="Active Deploys"
          value={stats.activeDeployments}
          format="count"
          delta={stats.activeDeploymentsChange}
          deltaLabel={`+${stats.activeDeploymentsChange} incl. pr-142`}
          statusColor="default"
          icon={<Server className="w-3.5 h-3.5" />}
        />
        <StatCard
          index={2}
          label="p95 Response"
          value={stats.p95ResponseTime}
          format="ms"
          delta={stats.p95Change}
          deltaLabel={`${stats.p95Change}ms vs 24h prior`}
          statusColor="success"
          icon={<Clock className="w-3.5 h-3.5" />}
        />
        <StatCard
          index={3}
          label="Error Rate"
          value={stats.errorRate}
          format="percent-2dp"
          delta={stats.errorRateChange}
          deltaLabel={`${stats.errorRateChange}pp &lt;1% SLA`}
          statusColor="success"
          icon={<AlertTriangle className="w-3.5 h-3.5" />}
        />
        <StatCard
          index={4}
          label="Docs Generated"
          value={stats.documentsGenerated}
          format="count"
          delta={stats.documentsChange}
          deltaLabel={`+${stats.documentsChange} vs prior 30d`}
          statusColor="default"
          icon={<FileText className="w-3.5 h-3.5" />}
        />
        {/* Env Issues + Health Checks combined card */}
        <div
          className="aesthetic-card animate-fade-up-in"
          style={{
            padding: "var(--card-padding)",
            animationDelay: "250ms",
            animationDuration: "150ms",
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
              Health
            </span>
            <CheckCircle2 className="w-3.5 h-3.5 text-muted-foreground/60" />
          </div>
          <div className="text-2xl font-semibold font-mono tabular-nums leading-none text-success">
            {stats.healthChecksPassing}/4
          </div>
          <div className="flex items-center gap-1 mt-1.5">
            <AlertTriangle className="w-3 h-3 text-destructive shrink-0" />
            <span className="text-xs text-muted-foreground font-mono">
              {stats.envVarIssues} env var missing
            </span>
          </div>
        </div>
      </div>

      {/* ── Row 2: Two charts side by side ───────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-2">
        {/* Service Metrics — spans 3 columns */}
        <div
          className="aesthetic-card lg:col-span-3"
          style={{ padding: "var(--card-padding)" }}
        >
          {/* Chart header with period filter */}
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-xs font-semibold text-foreground">
                Service Metrics <span className="font-mono text-muted-foreground ml-1">legis-api</span>
              </p>
              <p className="text-xs text-muted-foreground">
                CPU &middot; Memory &middot; p50 Response &middot; deploy marker
              </p>
            </div>
            <div className="flex items-center gap-1">
              {(["6h", "12h", "24h"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setMetricPeriod(p)}
                  className={cn(
                    "px-2 py-0.5 text-xs rounded border font-mono",
                    "transition-colors",
                    metricPeriod === p
                      ? "bg-primary text-primary-foreground border-primary"
                      : "border-border text-muted-foreground hover:bg-muted/50"
                  )}
                  style={{ transitionDuration: "var(--dur-fast)" }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
          <ServiceMetricsChart data={filteredMetrics} />
        </div>

        {/* Deployment Frequency — spans 2 columns */}
        <div
          className="aesthetic-card lg:col-span-2"
          style={{ padding: "var(--card-padding)" }}
        >
          <div className="mb-2">
            <p className="text-xs font-semibold text-foreground">
              Deployment Frequency
            </p>
            <p className="text-xs text-muted-foreground">
              30-day history &middot; DORA metric
            </p>
          </div>
          <DeploymentFrequencyChart data={deploymentFrequencyChart} />
        </div>
      </div>

      {/* ── Row 3: Recent Deployment Activity ────────────────── */}
      <div
        className="aesthetic-card"
        style={{ padding: 0, overflow: "hidden" }}
      >
        <div
          className="flex items-center justify-between border-b border-border"
          style={{ padding: "0.5rem var(--card-padding)" }}
        >
          <div>
            <p className="text-xs font-semibold text-foreground">
              Recent Deployment Activity
            </p>
            <p className="text-xs text-muted-foreground">
              All services &middot; All environments &middot; Last 30 days
            </p>
          </div>
          <a
            href="/deployments"
            className="text-xs text-primary hover:text-primary/80 font-mono"
            style={{ transitionDuration: "var(--dur-fast)" }}
          >
            View all →
          </a>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent border-border">
              <TableHead className="text-xs font-medium uppercase tracking-wide text-muted-foreground w-[90px]">
                Service
              </TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Commit
              </TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wide text-muted-foreground hidden md:table-cell">
                Triggered By
              </TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wide text-muted-foreground w-[72px] text-right">
                Build
              </TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wide text-muted-foreground w-[100px]">
                Status
              </TableHead>
              <TableHead className="text-xs font-medium uppercase tracking-wide text-muted-foreground w-[72px] text-right hidden sm:table-cell">
                Time
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentDeployments.map((dep) => (
              <TableRow
                key={dep.id}
                className="aesthetic-hover border-border/60 h-9"
              >
                {/* Service name */}
                <TableCell className="py-1.5">
                  <span className="text-xs font-mono text-foreground">
                    {dep.serviceName}
                  </span>
                  {dep.environment !== "production" && (
                    <span className="ml-1 text-xs font-mono text-primary/70">
                      [{dep.environment}]
                    </span>
                  )}
                </TableCell>

                {/* Commit */}
                <TableCell className="py-1.5">
                  <div className="flex flex-col gap-0.5">
                    <span
                      className="text-xs text-foreground truncate max-w-[200px]"
                      title={dep.commitMessage}
                    >
                      {dep.commitMessage}
                    </span>
                    <span className="text-xs font-mono text-muted-foreground">
                      {dep.commitSha}
                    </span>
                  </div>
                </TableCell>

                {/* Triggered by */}
                <TableCell className="py-1.5 hidden md:table-cell">
                  <span className="text-xs text-muted-foreground">
                    {dep.triggeredBy}
                  </span>
                </TableCell>

                {/* Build duration */}
                <TableCell className="py-1.5 text-right">
                  <span
                    className={cn(
                      "text-xs font-mono",
                      dep.buildDuration > 300
                        ? "text-warning"
                        : "text-muted-foreground"
                    )}
                  >
                    {formatDuration(dep.buildDuration)}
                  </span>
                </TableCell>

                {/* Status badge */}
                <TableCell className="py-1.5">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-mono border",
                      deploymentStatusColor(dep.status)
                    )}
                  >
                    {deploymentStatusIcon(dep.status)}
                    {dep.status}
                  </span>
                </TableCell>

                {/* Relative time */}
                <TableCell className="py-1.5 text-right hidden sm:table-cell">
                  <span className="text-xs font-mono text-muted-foreground">
                    {formatRelative(dep.deployedAt)}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Failure reason preview for failed deployments */}
        {recentDeployments.some(
          (d) => d.status === "Failed" || d.status === "Crashed"
        ) && (
          <div
            className="border-t border-border px-3 py-2 bg-destructive/5"
          >
            {recentDeployments
              .filter((d) => d.failureReason && (d.status === "Failed" || d.status === "Crashed"))
              .slice(0, 2)
              .map((d) => (
                <div key={d.id} className="flex items-start gap-2 mb-1 last:mb-0">
                  <AlertTriangle className="w-3 h-3 text-destructive mt-0.5 shrink-0" />
                  <p className="text-xs font-mono text-destructive/80 truncate">
                    <span className="font-semibold">{d.commitSha}:</span>{" "}
                    {d.failureReason}
                  </p>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* ── Row 4: Bottom proposal banner ────────────────────── */}
      <div
        className="aesthetic-card border-primary/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
        style={{
          padding: "0.75rem var(--card-padding)",
          background:
            "linear-gradient(to right, color-mix(in oklch, var(--primary), transparent 95%), transparent)",
        }}
      >
        <div>
          <p className="text-xs font-medium text-foreground">
            This is a live demo built for{" "}
            {APP_CONFIG.clientName ?? APP_CONFIG.projectName}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Humam &middot; Full-Stack / DevOps &middot; Available now
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <a
            href="/challenges"
            className="text-xs text-muted-foreground hover:text-foreground font-mono"
            style={{ transitionDuration: "var(--dur-fast)" }}
          >
            My approach →
          </a>
          <a
            href="/proposal"
            className="inline-flex items-center gap-1.5 text-xs font-medium bg-primary text-primary-foreground px-2.5 py-1 rounded hover:bg-primary/90"
            style={{ transitionDuration: "var(--dur-fast)" }}
          >
            Work with me
          </a>
        </div>
      </div>
    </div>
  );
}
