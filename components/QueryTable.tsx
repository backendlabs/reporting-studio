import type { QueryRow } from "@/lib/mock-data";

export default function QueryTable({ rows }: { rows: QueryRow[] }) {
  return (
    <div className="rounded-2xl border border-line bg-card p-5">
      <h3 className="mb-4 font-display text-lg text-ink">
        Top Search Queries
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs font-semibold uppercase tracking-wide text-ink-soft">
              <th className="pb-2 pr-4 font-semibold">Query</th>
              <th className="pb-2 pr-4 font-semibold tabular text-right">
                Clicks
              </th>
              <th className="pb-2 pr-4 font-semibold tabular text-right">
                Impr.
              </th>
              <th className="pb-2 pr-4 font-semibold tabular text-right">
                CTR
              </th>
              <th className="pb-2 font-semibold tabular text-right">Pos.</th>
            </tr>
          </thead>
          <tbody>
            {rows.slice(0, 8).map((row) => (
              <tr
                key={row.query}
                className="border-b border-line/70 last:border-0"
              >
                <td className="py-2.5 pr-4 text-ink">{row.query}</td>
                <td className="py-2.5 pr-4 text-right tabular text-ink-soft">
                  {row.clicks.toLocaleString("en-US")}
                </td>
                <td className="py-2.5 pr-4 text-right tabular text-ink-soft">
                  {row.impressions.toLocaleString("en-US")}
                </td>
                <td className="py-2.5 pr-4 text-right tabular text-ink-soft">
                  {row.ctr}%
                </td>
                <td className="py-2.5 text-right tabular text-ink-soft">
                  {row.position}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
