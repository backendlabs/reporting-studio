"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getDashboardData,
  type DashboardData,
  type RangeKey,
} from "./mock-data";

interface LiveApiSummary {
  sessions: number;
  pageviews: number;
  conversions: number;
}

interface LiveApiGscSummary {
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

interface LiveApiResponse {
  configured: boolean;
  error?: boolean;
  message?: string;
  compareLabel?: string;
  ga4?: {
    current: LiveApiSummary;
    previous: LiveApiSummary;
    series: { date: string; sessions: number }[];
    prevSeries: { date: string; sessions: number }[];
    topPages: DashboardData["topPages"];
    channels: DashboardData["channels"];
  };
  gsc?: {
    current: LiveApiGscSummary;
    previous: LiveApiGscSummary;
    topQueries: DashboardData["topQueries"];
    topPages: DashboardData["topPages"];
  };
  indexing?: { path: string; submitted: number; indexed: number; type: string }[];
}

interface LiveState {
  source: "mock" | "live";
  loading: boolean;
  error: string | null;
  data: DashboardData;
  forRange: RangeKey | null;
  forCompare: boolean | null;
}

function mapLiveResponse(
  json: LiveApiResponse,
  range: RangeKey,
  fallback: DashboardData
): DashboardData {
  const ga4 = json.ga4!;
  const gsc = json.gsc!;

  return {
    range,
    periodLabel: fallback.periodLabel,
    compareLabel: json.compareLabel ?? fallback.compareLabel,
    metrics: [
      {
        label: "Sessions",
        value: ga4.current.sessions,
        previousValue: ga4.previous.sessions,
        format: "number",
      },
      {
        label: "Pageviews",
        value: ga4.current.pageviews,
        previousValue: ga4.previous.pageviews,
        format: "number",
      },
      {
        label: "Conversions",
        value: ga4.current.conversions,
        previousValue: ga4.previous.conversions,
        format: "number",
      },
      {
        label: "Search Clicks",
        value: gsc.current.clicks,
        previousValue: gsc.previous.clicks,
        format: "number",
      },
      {
        label: "Avg. Search Position",
        value: gsc.current.position,
        previousValue: gsc.previous.position,
        format: "number",
      },
    ],
    series: ga4.series.map((p, i) => ({
      date: p.date,
      sessions: p.sessions,
      prevSessions: ga4.prevSeries?.[i]?.sessions ?? 0,
    })),
    topQueries: gsc.topQueries,
    topPages: gsc.topPages,
    channels: ga4.channels,
    sitemaps: (json.indexing ?? []).map((s) => ({
      path: s.path,
      submitted: s.submitted,
      indexed: s.indexed,
      type: s.type,
    })),
  };
}

export function useDashboardData(
  range: RangeKey,
  compareToLastYear: boolean
): {
  source: "mock" | "live";
  loading: boolean;
  error: string | null;
  data: DashboardData;
} {
  const fallback = useMemo(
    () => getDashboardData(range, compareToLastYear),
    [range, compareToLastYear]
  );

  const [state, setState] = useState<LiveState>({
    source: "mock",
    loading: true,
    error: null,
    data: fallback,
    forRange: null,
    forCompare: null,
  });

  useEffect(() => {
    let cancelled = false;

    fetch(
      `/api/dashboard-data?range=${range}&compareToLastYear=${compareToLastYear}`
    )
      .then((res) => res.json())
      .then((json: LiveApiResponse) => {
        if (cancelled) return;
        if (json.configured && !json.error) {
          setState({
            source: "live",
            loading: false,
            error: null,
            data: mapLiveResponse(json, range, fallback),
            forRange: range,
            forCompare: compareToLastYear,
          });
        } else {
          setState({
            source: "mock",
            loading: false,
            error: json.error ? json.message ?? null : null,
            data: fallback,
            forRange: range,
            forCompare: compareToLastYear,
          });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setState({
            source: "mock",
            loading: false,
            error: "Couldn't reach the reporting API — showing sample data.",
            data: fallback,
            forRange: range,
            forCompare: compareToLastYear,
          });
        }
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [range, compareToLastYear]);

  // If the in-flight/last-completed fetch doesn't match the currently
  // selected range yet, show the fallback (with loading=true) instead of
  // stale data from a previous selection.
  const isCurrent = state.forRange === range && state.forCompare === compareToLastYear;

  return {
    source: isCurrent ? state.source : "mock",
    loading: !isCurrent || state.loading,
    error: isCurrent ? state.error : null,
    data: isCurrent ? state.data : fallback,
  };
}
