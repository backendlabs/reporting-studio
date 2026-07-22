"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { isUnlocked, lockSession, SAMPLE_CLIENT } from "@/lib/auth";
import type { RangeKey } from "@/lib/mock-data";
import { useDashboardData } from "@/lib/use-dashboard-data";
import DateRangeSelector from "@/components/DateRangeSelector";
import MetricCard from "@/components/MetricCard";
import TrendChart from "@/components/TrendChart";
import QueryTable from "@/components/QueryTable";
import PageTable from "@/components/PageTable";
import ChannelsBar from "@/components/ChannelsBar";
import IndexingPanel from "@/components/IndexingPanel";
import NotesPanel from "@/components/NotesPanel";
import ExportMenu from "@/components/ExportMenu";
import { LogOut, CircleDot } from "lucide-react";

type Tab = "analytics" | "search" | "indexing" | "notes";

const TAB_LABELS: Record<Tab, string> = {
  analytics: "Google Analytics",
  search: "Search Console",
  indexing: "Indexing",
  notes: "Monthly Notes",
};

export default function DashboardPage() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [range, setRange] = useState<RangeKey>("28d");
  const [compareToLastYear, setCompareToLastYear] = useState(false);
  const [tab, setTab] = useState<Tab>("analytics");

  useEffect(() => {
    if (!isUnlocked()) {
      router.replace("/");
      return;
    }
    const id = requestAnimationFrame(() => setChecked(true));
    return () => cancelAnimationFrame(id);
  }, [router]);

  const { data, source, loading } = useDashboardData(range, compareToLastYear);

  const gaMetrics = useMemo(
    () => data.metrics.filter((m) => ["Sessions", "Pageviews", "Conversions"].includes(m.label)),
    [data.metrics]
  );
  const gscMetrics = useMemo(
    () =>
      data.metrics.filter((m) =>
        ["Search Clicks", "Avg. Search Position"].includes(m.label)
      ),
    [data.metrics]
  );

  if (!checked) return null;

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 overflow-hidden rounded-full">
            <Image
              src="/logo.png"
              alt={`${SAMPLE_CLIENT.name} logo`}
              width={40}
              height={40}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-soft">
              Reporting Studio
            </p>
            <h1 className="font-display text-xl text-ink">
              {SAMPLE_CLIENT.name}
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-2 no-print">
          <span className="flex items-center gap-1.5 rounded-full border border-line bg-card px-3 py-1.5 text-[11px] font-medium text-ink-soft">
            <CircleDot
              className={`h-3 w-3 ${
                source === "live" ? "text-up" : "text-ink-soft"
              }`}
              strokeWidth={2.5}
            />
            {loading ? "Checking..." : source === "live" ? "Live data" : "Sample data"}
          </span>
          <ExportMenu data={data} />
          <button
            onClick={() => {
              lockSession();
              router.push("/");
            }}
            className="flex items-center gap-1.5 rounded-full border border-line bg-card px-3.5 py-2 text-xs font-semibold text-ink-soft hover:border-brand hover:text-brand-deep"
          >
            <LogOut className="h-3.5 w-3.5" strokeWidth={2} />
            Log out
          </button>
        </div>
      </header>

      <nav className="mb-6 flex flex-wrap gap-6 border-b border-line no-print">
        {(Object.keys(TAB_LABELS) as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`relative pb-3 text-sm font-semibold transition-colors ${
              tab === t ? "text-brand-deep" : "text-ink-soft hover:text-ink"
            }`}
          >
            {TAB_LABELS[t]}
            {tab === t && (
              <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-brand" />
            )}
          </button>
        ))}
      </nav>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-ink-soft">
          <span className="font-semibold text-ink">{data.periodLabel}</span>{" "}
          · {data.compareLabel}
        </p>
        <DateRangeSelector
          value={range}
          onChange={setRange}
          compareToLastYear={compareToLastYear}
          onCompareChange={setCompareToLastYear}
        />
      </div>

      {tab === "analytics" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {gaMetrics.map((m) => (
              <MetricCard
                key={m.label}
                label={m.label}
                value={m.value}
                previousValue={m.previousValue}
              />
            ))}
          </div>
          <TrendChart data={data.series} compareLabel={data.compareLabel} />
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <PageTable rows={data.topPages} title="Top Pages" />
            <ChannelsBar rows={data.channels} />
          </div>
        </div>
      )}

      {tab === "search" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {gscMetrics.map((m) => (
              <MetricCard
                key={m.label}
                label={m.label}
                value={m.value}
                previousValue={m.previousValue}
              />
            ))}
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <QueryTable rows={data.topQueries} />
            <PageTable rows={data.topPages} title="Top Pages by Clicks" />
          </div>
        </div>
      )}

      {tab === "indexing" && (
        <IndexingPanel
          sitemaps={data.sitemaps}
          topPages={data.topPages}
          topQueries={data.topQueries}
          liveInspection={source === "live"}
        />
      )}

      {tab === "notes" && <NotesPanel />}

      <footer className="mt-10 border-t border-line pt-5 text-center text-[11px] text-ink-soft no-print">
        {source === "live"
          ? "Live data from Google Analytics and Search Console."
          : "Sample data shown — connect Google Analytics and Search Console to see real numbers."}
      </footer>
    </main>
  );
}
