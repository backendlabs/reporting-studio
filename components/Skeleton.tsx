export function MetricCardSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-line bg-card p-5">
      <div className="h-3 w-20 rounded bg-line" />
      <div className="mt-3 h-8 w-24 rounded bg-line" />
      <div className="mt-3 h-5 w-14 rounded-full bg-line" />
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="animate-pulse rounded-2xl border border-line bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="h-5 w-40 rounded bg-line" />
        <div className="h-4 w-24 rounded bg-line" />
      </div>
      <div className="h-[260px] rounded-lg bg-line/60" />
    </div>
  );
}

export function TableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="animate-pulse rounded-2xl border border-line bg-card p-5">
      <div className="mb-4 h-5 w-32 rounded bg-line" />
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="h-4 w-full rounded bg-line/60" />
        ))}
      </div>
    </div>
  );
}

export function BarListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="animate-pulse rounded-2xl border border-line bg-card p-5">
      <div className="mb-4 h-5 w-36 rounded bg-line" />
      <div className="space-y-4">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i}>
            <div className="mb-1.5 h-3 w-24 rounded bg-line/70" />
            <div className="h-2 w-full rounded-full bg-line/50" />
          </div>
        ))}
      </div>
    </div>
  );
}
