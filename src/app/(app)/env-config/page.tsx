"use client";

import { useState, useMemo } from "react";
import { Search, Eye, EyeOff, AlertCircle, CheckCircle2, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { envVariables } from "@/data/mock-data";
import type { EnvVariableStatus } from "@/lib/types";

// Fake revealed values for the toggle — never the real value
const REVEALED_VALUES: Record<string, string> = {
  ANTHROPIC_API_KEY: "sk-ant-api03-xK7mN2pQrL9vBwD4jYcH8sF1tZ3eA6uG",
  SESSION_SECRET: "j8K2mN7pQrL4vBwD9jYcH3sF1tZ5eA2u",
  SITE_PASSWORD: "L3g!5DeP!oy#2026",
};

function StatusBadge({ status }: { status: EnvVariableStatus }) {
  const config: Record<EnvVariableStatus, { label: string; colorClass: string; icon: React.ReactNode }> = {
    Active: {
      label: "Active",
      colorClass: "text-[color:var(--success)] bg-[color:var(--success)]/10 border-[color:var(--success)]/20",
      icon: <CheckCircle2 className="w-2.5 h-2.5" />,
    },
    Missing: {
      label: "Missing",
      colorClass: "text-destructive bg-destructive/10 border-destructive/20",
      icon: <AlertCircle className="w-2.5 h-2.5" />,
    },
    "Using Default": {
      label: "Using Default",
      colorClass: "text-[color:var(--warning)] bg-[color:var(--warning)]/10 border-[color:var(--warning)]/20",
      icon: <Info className="w-2.5 h-2.5" />,
    },
    Invalid: {
      label: "Invalid",
      colorClass: "text-destructive bg-destructive/10 border-destructive/20",
      icon: <AlertCircle className="w-2.5 h-2.5" />,
    },
  };

  const c = config[status] ?? { label: status, colorClass: "text-muted-foreground bg-muted border-border", icon: null };

  return (
    <Badge
      variant="outline"
      className={cn("text-[10px] font-medium flex items-center gap-1 w-fit px-1.5 py-0.5 rounded-sm border", c.colorClass)}
    >
      {c.icon}
      {c.label}
    </Badge>
  );
}

// Secrets — these keys have their values masked by default
const SECRET_KEYS = new Set(["ANTHROPIC_API_KEY", "SESSION_SECRET", "SITE_PASSWORD"]);

export default function EnvConfigPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | EnvVariableStatus>("all");
  const [revealedKeys, setRevealedKeys] = useState<Set<string>>(new Set());

  const displayed = useMemo(() => {
    return envVariables.filter((v) => {
      const matchesSearch =
        search === "" ||
        v.key.toLowerCase().includes(search.toLowerCase()) ||
        v.value.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = statusFilter === "all" || v.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  function toggleReveal(key: string) {
    setRevealedKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  }

  function getDisplayValue(key: string, maskedValue: string): string {
    if (!SECRET_KEYS.has(key)) return maskedValue;
    if (revealedKeys.has(key)) {
      return REVEALED_VALUES[key] ?? maskedValue;
    }
    return maskedValue;
  }

  const issueCount = envVariables.filter(
    (v) => v.status === "Missing" || v.status === "Invalid"
  ).length;

  function formatDate(iso: string): string {
    const d = new Date(iso);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }

  return (
    <div className="page-container space-y-3">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-base font-semibold tracking-tight">Environment Variables</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Service configuration — <code className="font-mono text-[10px]">legis-api</code> · production
          </p>
        </div>
        <div className="flex items-center gap-2">
          {issueCount > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-destructive font-mono bg-destructive/8 border border-destructive/20 px-2 py-1 rounded-sm">
              <AlertCircle className="w-3 h-3" />
              {issueCount} variable{issueCount > 1 ? "s" : ""} require attention
            </div>
          )}
          <Button variant="outline" size="sm" className="h-7 text-xs font-mono">
            Add Variable
          </Button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="flex items-center gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
          <Input
            placeholder="Search variables..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-7 h-7 text-xs font-mono"
          />
        </div>
        <Select
          value={statusFilter}
          onValueChange={(v) => setStatusFilter(v as "all" | EnvVariableStatus)}
        >
          <SelectTrigger className="h-7 w-36 text-xs font-mono">
            <SelectValue placeholder="All statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className="text-xs font-mono">All statuses</SelectItem>
            <SelectItem value="Active" className="text-xs font-mono">Active</SelectItem>
            <SelectItem value="Missing" className="text-xs font-mono">Missing</SelectItem>
            <SelectItem value="Using Default" className="text-xs font-mono">Using Default</SelectItem>
            <SelectItem value="Invalid" className="text-xs font-mono">Invalid</SelectItem>
          </SelectContent>
        </Select>
        <span className="text-[11px] text-muted-foreground font-mono shrink-0">
          {displayed.length}/{envVariables.length} variables
        </span>
      </div>

      {/* Variables table */}
      <div className="aesthetic-card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border">
                <TableHead className="bg-muted/60 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide h-7 py-0 px-3 w-56">
                  Key
                </TableHead>
                <TableHead className="bg-muted/60 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide h-7 py-0 px-3">
                  Value
                </TableHead>
                <TableHead className="bg-muted/60 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide h-7 py-0 px-3 w-28">
                  Status
                </TableHead>
                <TableHead className="bg-muted/60 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide h-7 py-0 px-3 w-20">
                  Scope
                </TableHead>
                <TableHead className="bg-muted/60 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide h-7 py-0 px-3 w-24">
                  Updated
                </TableHead>
                <TableHead className="bg-muted/60 text-[10px] font-semibold text-muted-foreground uppercase tracking-wide h-7 py-0 px-3 w-8">
                  {/* reveal toggle column */}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {displayed.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center text-xs text-muted-foreground font-mono"
                  >
                    No variables match this filter.
                  </TableCell>
                </TableRow>
              ) : (
                displayed.map((v) => {
                  const isRevealed = revealedKeys.has(v.key);
                  const isSecret = SECRET_KEYS.has(v.key);
                  const displayVal = getDisplayValue(v.key, v.value);

                  return (
                    <>
                      <TableRow
                        key={v.key}
                        className={cn(
                          "hover:bg-[color:var(--surface-hover)] transition-colors duration-75 border-b border-border/50",
                          v.status === "Missing" && "bg-destructive/4"
                        )}
                      >
                        {/* Key */}
                        <TableCell className="py-1.5 px-3">
                          <span className="font-mono text-[11px] font-medium text-foreground">
                            {v.key}
                          </span>
                        </TableCell>

                        {/* Value */}
                        <TableCell className="py-1.5 px-3 max-w-xs">
                          <div className="flex flex-col gap-0.5">
                            <span
                              className={cn(
                                "font-mono text-[11px] truncate block max-w-xs",
                                v.status === "Missing"
                                  ? "text-muted-foreground/60 italic"
                                  : "text-foreground/80"
                              )}
                            >
                              {v.status === "Missing" ? "—" : displayVal}
                            </span>
                            {v.note && (
                              <span className="text-[10px] text-muted-foreground leading-tight line-clamp-1">
                                {v.note}
                              </span>
                            )}
                          </div>
                        </TableCell>

                        {/* Status */}
                        <TableCell className="py-1.5 px-3">
                          <StatusBadge status={v.status} />
                        </TableCell>

                        {/* Scope */}
                        <TableCell className="py-1.5 px-3">
                          <span
                            className={cn(
                              "font-mono text-[10px] px-1.5 py-0.5 rounded-sm border",
                              v.scope === "shared"
                                ? "text-primary/80 bg-primary/6 border-primary/15"
                                : "text-muted-foreground bg-muted border-border"
                            )}
                          >
                            {v.scope}
                          </span>
                        </TableCell>

                        {/* Last updated */}
                        <TableCell className="py-1.5 px-3">
                          <span className="font-mono text-[10px] text-muted-foreground">
                            {formatDate(v.lastUpdated)}
                          </span>
                        </TableCell>

                        {/* Reveal toggle */}
                        <TableCell className="py-1.5 px-2">
                          {isSecret && v.status !== "Missing" && (
                            <button
                              onClick={() => toggleReveal(v.key)}
                              className="text-muted-foreground hover:text-foreground transition-colors duration-75 p-0.5"
                              aria-label={isRevealed ? "Hide value" : "Reveal value"}
                              title={isRevealed ? "Hide value" : "Reveal value"}
                            >
                              {isRevealed ? (
                                <EyeOff className="w-3 h-3" />
                              ) : (
                                <Eye className="w-3 h-3" />
                              )}
                            </button>
                          )}
                        </TableCell>
                      </TableRow>
                    </>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Info footer */}
      <div className="flex items-start gap-1.5 text-[10px] text-muted-foreground">
        <Info className="w-3 h-3 mt-0.5 shrink-0" />
        <span>
          Variables with <span className="font-mono font-medium text-[color:var(--warning)]">Using Default</span> scope may use ephemeral paths — verify <code className="font-mono">BACKUP_PATH</code> points to a persistent volume before production handoff.
          Variables marked <span className="font-mono font-medium text-destructive">Missing</span> will cause service startup failures.
        </span>
      </div>
    </div>
  );
}
