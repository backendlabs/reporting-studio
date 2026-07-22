"use client";

import { RANGE_LABELS, type RangeKey } from "@/lib/mock-data";

const ORDER: RangeKey[] = [
  "7d",
  "28d",
  "90d",
  "thisMonth",
  "lastMonth",
  "lastYear",
];

export default function DateRangeSelector({
  value,
  onChange,
  compareToLastYear,
  onCompareChange,
}: {
  value: RangeKey;
  onChange: (r: RangeKey) => void;
  compareToLastYear: boolean;
  onCompareChange: (v: boolean) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex flex-wrap gap-1 rounded-full border border-line bg-card p-1">
        {ORDER.map((key) => (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
              value === key
                ? "bg-brand text-white"
                : "text-ink-soft hover:bg-brand-tint hover:text-brand-deep"
            }`}
          >
            {RANGE_LABELS[key]}
          </button>
        ))}
      </div>

      <label className="flex cursor-pointer items-center gap-2 text-xs font-medium text-ink-soft">
        <span>Compare vs.</span>
        <select
          value={compareToLastYear ? "year" : "period"}
          onChange={(e) => onCompareChange(e.target.value === "year")}
          className="rounded-full border border-line bg-card px-2.5 py-1.5 text-xs font-semibold text-ink outline-none focus:border-brand"
        >
          <option value="period">Previous period</option>
          <option value="year">Same period last year</option>
        </select>
      </label>
    </div>
  );
}
