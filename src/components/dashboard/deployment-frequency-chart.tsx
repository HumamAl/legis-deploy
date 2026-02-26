"use client";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import type { DeploymentFrequencyChartPoint } from "@/lib/types";

interface DeploymentFrequencyChartProps {
  data: DeploymentFrequencyChartPoint[];
}

interface TooltipEntry {
  dataKey?: string;
  value?: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string;
}

const CustomTooltip = ({
  active,
  payload,
  label,
}: CustomTooltipProps) => {
  if (!active || !payload?.length) return null;

  const succeeded = payload.find((p) => p.dataKey === "succeeded")?.value ?? 0;
  const failed = payload.find((p) => p.dataKey === "failed")?.value ?? 0;
  const total = (succeeded as number) + (failed as number);

  return (
    <div
      className="rounded border border-border bg-card p-2 text-xs shadow-sm"
      style={{ minWidth: 140 }}
    >
      <p className="font-medium text-foreground font-sans mb-1.5">{label}</p>
      <p className="font-mono flex items-center gap-2 text-foreground">
        <span className="inline-block w-2 h-2 rounded-sm shrink-0 bg-success" />
        <span className="text-muted-foreground">Succeeded:</span>
        <span className="font-semibold">{succeeded}</span>
      </p>
      {(failed as number) > 0 && (
        <p className="font-mono flex items-center gap-2 text-foreground">
          <span className="inline-block w-2 h-2 rounded-sm shrink-0 bg-destructive" />
          <span className="text-muted-foreground">Failed:</span>
          <span className="font-semibold">{failed}</span>
        </p>
      )}
      <p className="font-mono flex items-center gap-2 text-muted-foreground mt-1 border-t border-border pt-1">
        <span className="text-muted-foreground">Total:</span>
        <span className="font-semibold text-foreground">{total}</span>
      </p>
    </div>
  );
};

export function DeploymentFrequencyChart({
  data,
}: DeploymentFrequencyChartProps) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart
        data={data}
        margin={{ top: 4, right: 8, bottom: 0, left: -12 }}
        barCategoryGap="30%"
      >
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="var(--border)"
          strokeOpacity={0.6}
          vertical={false}
        />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 10, fill: "var(--muted-foreground)", fontFamily: "var(--font-mono)" }}
          axisLine={false}
          tickLine={false}
          interval={4}
        />
        <YAxis
          domain={[0, 6]}
          tick={{ fontSize: 10, fill: "var(--muted-foreground)", fontFamily: "var(--font-mono)" }}
          axisLine={false}
          tickLine={false}
          width={24}
          allowDecimals={false}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--surface-hover)" }} />
        <Legend
          wrapperStyle={{ fontSize: 11, fontFamily: "var(--font-sans)" }}
          iconType="square"
          iconSize={8}
        />
        <Bar
          dataKey="succeeded"
          name="Succeeded"
          stackId="a"
          fill="var(--success)"
          radius={[0, 0, 0, 0]}
          fillOpacity={0.85}
        />
        <Bar
          dataKey="failed"
          name="Failed"
          stackId="a"
          fill="var(--destructive)"
          radius={[2, 2, 0, 0]}
          fillOpacity={0.85}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
