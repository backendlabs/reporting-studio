"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import type { SeriesPoint } from "@/lib/mock-data";

export default function TrendChart({
  data,
  compareLabel,
}: {
  data: SeriesPoint[];
  compareLabel: string;
}) {
  return (
    <div className="rounded-2xl border border-line bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-display text-lg text-ink">
          Sessions Over Time
        </h3>
        <div className="flex items-center gap-4 text-xs text-ink-soft">
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-brand" /> Current
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-ink-soft/40" />{" "}
            {compareLabel.replace("vs. ", "")}
          </span>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="sessionsFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#006894" stopOpacity={0.28} />
              <stop offset="100%" stopColor="#006894" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="#dde3e2" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: "#4d6470" }}
            axisLine={false}
            tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#4d6470" }}
            axisLine={false}
            tickLine={false}
            width={40}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: "1px solid #dde3e2",
              fontSize: 12,
              fontFamily: "var(--font-body)",
            }}
          />
          <Area
            type="monotone"
            dataKey="prevSessions"
            stroke="#a8b5bb"
            strokeWidth={1.5}
            strokeDasharray="4 3"
            fill="none"
          />
          <Area
            type="monotone"
            dataKey="sessions"
            stroke="#006894"
            strokeWidth={2.25}
            fill="url(#sessionsFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
