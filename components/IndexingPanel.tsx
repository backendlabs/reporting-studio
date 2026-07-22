"use client";

import { useState } from "react";
import { Search, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import type { PageRow, QueryRow, SitemapRow } from "@/lib/mock-data";
import PageTable from "./PageTable";
import QueryTable from "./QueryTable";

interface InspectionResult {
  url: string;
  verdict?: string | null;
  coverageState?: string | null;
  lastCrawlTime?: string | null;
}

export default function IndexingPanel({
  sitemaps,
  topPages,
  topQueries,
  liveInspection,
}: {
  sitemaps: SitemapRow[];
  topPages: PageRow[];
  topQueries: QueryRow[];
  liveInspection: boolean;
}) {
  const [url, setUrl] = useState("");
  const [checking, setChecking] = useState(false);
  const [result, setResult] = useState<InspectionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function checkUrl() {
    if (!url) return;
    setChecking(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(
        `/api/inspect-url?url=${encodeURIComponent(url)}`
      );
      const json = await res.json();
      if (json.error) {
        setError(json.message ?? "Couldn't check that URL.");
      } else {
        setResult(json);
      }
    } catch {
      setError("Couldn't reach the inspection API.");
    } finally {
      setChecking(false);
    }
  }

  const totalSubmitted = sitemaps.reduce((a, s) => a + s.submitted, 0);
  const totalIndexed = sitemaps.reduce((a, s) => a + s.indexed, 0);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl border border-line bg-card p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
            Pages Submitted
          </p>
          <p className="mt-2 font-display text-3xl tabular text-ink">
            {totalSubmitted.toLocaleString("en-US")}
          </p>
        </div>
        <div className="rounded-2xl border border-line bg-card p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
            Pages Indexed
          </p>
          <p className="mt-2 font-display text-3xl tabular text-ink">
            {totalIndexed.toLocaleString("en-US")}
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-card p-5">
        <h3 className="mb-1 font-display text-lg text-ink">
          Check a Specific URL
        </h3>
        <p className="mb-4 text-xs text-ink-soft">
          {liveInspection
            ? "Live check against Search Console — one URL at a time (Google rate-limits this)."
            : "Sample only — connect Search Console to check real URLs."}
        </p>
        <div className="flex gap-2">
          <div className="flex flex-1 items-center gap-2 rounded-lg border border-line bg-paper px-3 py-2">
            <Search className="h-4 w-4 text-ink-soft" strokeWidth={1.75} />
            <input
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://pinnaclepursuitseo.com/blog/..."
              className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-soft/60"
            />
          </div>
          <button
            onClick={checkUrl}
            disabled={checking || !liveInspection}
            className="flex items-center gap-1.5 rounded-lg bg-brand px-4 py-2 text-xs font-semibold text-white hover:bg-brand-deep disabled:opacity-50"
          >
            {checking && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            Check
          </button>
        </div>

        {error && <p className="mt-3 text-xs font-medium text-down">{error}</p>}

        {result && (
          <div className="mt-4 flex items-start gap-2 rounded-lg border border-line bg-paper p-3 text-sm">
            {result.verdict === "PASS" ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-up" />
            ) : (
              <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-down" />
            )}
            <div>
              <p className="font-medium text-ink">
                {result.verdict === "PASS" ? "Indexed" : "Not indexed"}
                {result.coverageState ? ` — ${result.coverageState}` : ""}
              </p>
              {result.lastCrawlTime && (
                <p className="text-xs text-ink-soft">
                  Last crawled {new Date(result.lastCrawlTime).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      <PageTable rows={topPages} title="Pages Getting Clicks" />
      <QueryTable rows={topQueries} />
    </div>
  );
}
