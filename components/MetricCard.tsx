import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { pctChange } from "@/lib/mock-data";

export default function MetricCard({
  label,
  value,
  previousValue,
  suffix,
}: {
  label: string;
  value: number;
  previousValue: number;
  suffix?: string;
}) {
  const change = pctChange(value, previousValue);
  const isUp = change >= 0;
  const display =
    value % 1 === 0 ? value.toLocaleString("en-US") : value.toFixed(1);

  return (
    <div className="rounded-2xl border border-line bg-card p-5 transition-shadow hover:shadow-[0_2px_10px_rgba(16,34,44,0.06)]">
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
        {label}
      </p>
      <div className="mt-2 flex items-baseline gap-1">
        <span className="font-display text-3xl tabular text-ink">
          {display}
        </span>
        {suffix && (
          <span className="text-sm text-ink-soft">{suffix}</span>
        )}
      </div>
      <div
        className={`mt-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-semibold ${
          isUp ? "bg-up/10 text-up" : "bg-down/10 text-down"
        }`}
      >
        {isUp ? (
          <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2.25} />
        ) : (
          <ArrowDownRight className="h-3.5 w-3.5" strokeWidth={2.25} />
        )}
        {Math.abs(change).toFixed(1)}%
      </div>
    </div>
  );
}
