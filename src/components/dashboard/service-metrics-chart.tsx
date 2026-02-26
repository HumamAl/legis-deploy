"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from "recharts";
import type { MetricPoint } from "@/lib/types";

interface ServiceMetricsChartProps {
  data: MetricPoint[];
}

/** Format the hour label for the X-axis from an ISO timestamp */
function formatHour(iso: string): string {
  const d = new Date(iso);
  const h = d.getUTCHours();
  if (h === 0) return "00:00";
  if (h % 4 === 0) return `${String(h).padStart(2, "0")}:00`;
  return "";
}

interface TooltipEntry {
  name?: string;
  value?: number;
  color?: string;
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

  const ts = new Date(label as string);
  const timeStr = `${String(ts.getUTCHours()).padStart(2, "0")}:${String(ts.getUTCMinutes()).padStart(2, "0")} UTC`;

  return (
    <div
      className="rounded border border-border bg-card p-2 text-xs shadow-sm font-mono"
      style={{ minWidth: 180 }}
    >
      <p className="text-muted-foreground mb-1.5 font-sans text-xs font-medium">
        {timeStr}
      </p>
      {payload.map((entry, i) => (
        <p key={i} className="flex items-center gap-2 text-foreground">
          <span
            className="inline-block w-2 h-2 rounded-full shrink-0"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-muted-foreground">{entry.name}:</span>
          <span className="font-semibold">
            {entry.name === "CPU"
              ? `${entry.value}%`
              : entry.name === "Memory"
              ? `${entry.value} MB`
              : `${entry.value}ms`}
          </span>
        </p>
      ))}
    </div>
  );
};

export function ServiceMetricsChart({ data }: ServiceMetricsChartProps) {
  // Find deployment marker timestamps for reference lines
  const deployMarkers = data.filter((d) => d.deploymentMarker);

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: -8 }}>
        <CartesianGrid
          strokeDasharray="3 3"
          stroke="var(--border)"
          strokeOpacity={0.6}
          vertical={false}
        />
        <XAxis
          dataKey="timestamp"
          tickFormatter={formatHour}
          tick={{ fontSize: 10, fill: "var(--muted-foreground)", fontFamily: "var(--font-mono)" }}
          axisLine={false}
          tickLine={false}
          interval={3}
        />
        {/* Left Y-axis: CPU % */}
        <YAxis
          yAxisId="cpu"
          domain={[0, 100]}
          tick={{ fontSize: 10, fill: "var(--muted-foreground)", fontFamily: "var(--font-mono)" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${v}%`}
          width={36}
        />
        {/* Right Y-axis: Memory MB */}
        <YAxis
          yAxisId="mem"
          orientation="right"
          domain={[200, 520]}
          tick={{ fontSize: 10, fill: "var(--muted-foreground)", fontFamily: "var(--font-mono)" }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${v}M`}
          width={42}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend
          wrapperStyle={{ fontSize: 11, fontFamily: "var(--font-sans)" }}
          iconType="circle"
          iconSize={8}
        />

        {/* Deployment marker reference lines */}
        {deployMarkers.map((m, i) => (
          <ReferenceLine
            key={i}
            x={m.timestamp}
            yAxisId="cpu"
            stroke="var(--primary)"
            strokeDasharray="4 3"
            strokeOpacity={0.7}
            label={{
              value: "deploy",
              position: "insideTopRight",
              fontSize: 9,
              fill: "var(--primary)",
              fontFamily: "var(--font-mono)",
            }}
          />
        ))}

        {/* CPU threshold warning line at 70% */}
        <ReferenceLine
          yAxisId="cpu"
          y={70}
          stroke="var(--warning)"
          strokeDasharray="3 4"
          strokeOpacity={0.5}
        />

        <Line
          yAxisId="cpu"
          type="monotone"
          dataKey="cpu"
          name="CPU"
          stroke="var(--chart-1)"
          strokeWidth={1.5}
          dot={false}
          activeDot={{ r: 3, fill: "var(--chart-1)" }}
        />
        <Line
          yAxisId="mem"
          type="monotone"
          dataKey="memory"
          name="Memory"
          stroke="var(--chart-4)"
          strokeWidth={1.5}
          dot={false}
          activeDot={{ r: 3, fill: "var(--chart-4)" }}
        />
        <Line
          yAxisId="cpu"
          type="monotone"
          dataKey="responseTime"
          name="p50 Resp"
          stroke="var(--chart-5)"
          strokeWidth={1.5}
          dot={false}
          strokeDasharray="4 2"
          activeDot={{ r: 3, fill: "var(--chart-5)" }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
