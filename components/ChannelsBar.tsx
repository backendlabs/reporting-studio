import type { ChannelRow } from "@/lib/mock-data";

export default function ChannelsBar({ rows }: { rows: ChannelRow[] }) {
  const max = Math.max(...rows.map((r) => r.sessions), 1);

  return (
    <div className="rounded-2xl border border-line bg-card p-5">
      <h3 className="mb-4 font-display text-lg text-ink">
        Traffic Acquisition
      </h3>
      <div className="space-y-3">
        {rows.map((row) => (
          <div key={row.channel}>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="font-medium text-ink">{row.channel}</span>
              <span className="tabular text-ink-soft">
                {row.sessions.toLocaleString("en-US")}
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-brand-tint">
              <div
                className="h-full rounded-full bg-brand"
                style={{ width: `${Math.max(4, (row.sessions / max) * 100)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
