import type { GA4PageRow } from "@/lib/mock-data";

export default function AnalyticsPageTable({ rows }: { rows: GA4PageRow[] }) {
  return (
    <div className="rounded-2xl border border-line bg-card p-5">
      <h3 className="mb-4 font-display text-lg text-ink">Top Pages</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs font-semibold uppercase tracking-wide text-ink-soft">
              <th className="pb-2 pr-4 font-semibold">Page</th>
              <th className="pb-2 pr-4 font-semibold tabular text-right">
                Sessions
              </th>
              <th className="pb-2 pr-4 font-semibold tabular text-right">
                Views
              </th>
              <th className="pb-2 font-semibold tabular text-right">
                Engagement
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.slice(0, 8).map((row) => (
              <tr
                key={row.path}
                className="border-b border-line/70 last:border-0"
              >
                <td className="max-w-[220px] truncate py-2.5 pr-4 text-ink">
                  {row.path}
                </td>
                <td className="py-2.5 pr-4 text-right tabular text-ink-soft">
                  {row.sessions.toLocaleString("en-US")}
                </td>
                <td className="py-2.5 pr-4 text-right tabular text-ink-soft">
                  {row.pageviews.toLocaleString("en-US")}
                </td>
                <td className="py-2.5 text-right tabular text-ink-soft">
                  {row.engagementRate}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
