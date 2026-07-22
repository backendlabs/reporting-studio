import { getSearchConsoleClient } from "./google-clients";
import type { DateWindow } from "./date-ranges";

const SITE_URL = process.env.GSC_SITE_URL; // e.g. "https://pinnaclepursuitseo.com/"

function siteUrl(): string {
  if (!SITE_URL) throw new Error("GSC_SITE_URL is not set");
  return SITE_URL;
}

export interface GSCSummary {
  clicks: number;
  impressions: number;
  ctr: number; // percent
  position: number;
}

export interface GSCQueryRow {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface GSCPageRow {
  page: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface GSCSitemapStatus {
  path: string;
  submitted: number;
  indexed: number;
  lastSubmitted: string | null;
  type: string;
}

export async function getGSCSummary(window: DateWindow): Promise<GSCSummary> {
  const sc = getSearchConsoleClient();
  const res = await sc.searchanalytics.query({
    siteUrl: siteUrl(),
    requestBody: {
      startDate: window.startDate,
      endDate: window.endDate,
    },
  });
  const row = res.data.rows?.[0];
  return {
    clicks: row?.clicks ?? 0,
    impressions: row?.impressions ?? 0,
    ctr: Math.round((row?.ctr ?? 0) * 1000) / 10,
    position: Math.round((row?.position ?? 0) * 10) / 10,
  };
}

export async function getGSCTopQueries(
  window: DateWindow,
  limit = 10
): Promise<GSCQueryRow[]> {
  const sc = getSearchConsoleClient();
  const res = await sc.searchanalytics.query({
    siteUrl: siteUrl(),
    requestBody: {
      startDate: window.startDate,
      endDate: window.endDate,
      dimensions: ["query"],
      rowLimit: limit,
    },
  });
  return (res.data.rows ?? []).map((row) => ({
    query: row.keys?.[0] ?? "",
    clicks: row.clicks ?? 0,
    impressions: row.impressions ?? 0,
    ctr: Math.round((row.ctr ?? 0) * 1000) / 10,
    position: Math.round((row.position ?? 0) * 10) / 10,
  }));
}

export async function getGSCTopPages(
  window: DateWindow,
  limit = 10
): Promise<GSCPageRow[]> {
  const sc = getSearchConsoleClient();
  const res = await sc.searchanalytics.query({
    siteUrl: siteUrl(),
    requestBody: {
      startDate: window.startDate,
      endDate: window.endDate,
      dimensions: ["page"],
      rowLimit: limit,
    },
  });
  return (res.data.rows ?? []).map((row) => ({
    page: row.keys?.[0] ?? "",
    clicks: row.clicks ?? 0,
    impressions: row.impressions ?? 0,
    ctr: Math.round((row.ctr ?? 0) * 1000) / 10,
    position: Math.round((row.position ?? 0) * 10) / 10,
  }));
}

/**
 * Indexing snapshot from submitted sitemaps: submitted vs. indexed counts
 * per content type. This is the only *bulk* indexing signal the public
 * Search Console API exposes — there is no API equivalent of the full
 * "Page Indexing" report in the GSC UI. Per-URL status (indexed / why not)
 * requires the URL Inspection API, which is one URL per call and rate
 * limited — see `inspectUrl` below for spot-checks.
 */
export async function getGSCIndexingSnapshot(): Promise<GSCSitemapStatus[]> {
  const sc = getSearchConsoleClient();
  const res = await sc.sitemaps.list({ siteUrl: siteUrl() });
  const sitemaps = res.data.sitemap ?? [];

  return sitemaps.flatMap((sitemap) => {
    const contents = sitemap.contents ?? [];
    if (contents.length === 0) {
      return [
        {
          path: sitemap.path ?? "",
          submitted: 0,
          indexed: 0,
          lastSubmitted: sitemap.lastSubmitted ?? null,
          type: "unknown",
        },
      ];
    }
    return contents.map((c) => ({
      path: sitemap.path ?? "",
      submitted: Number(c.submitted ?? 0),
      indexed: Number(c.indexed ?? 0),
      lastSubmitted: sitemap.lastSubmitted ?? null,
      type: c.type ?? "unknown",
    }));
  });
}

export interface UrlInspectionResult {
  url: string;
  verdict: string | null | undefined;
  coverageState: string | null | undefined;
  lastCrawlTime: string | null | undefined;
}

/** Spot-check a single URL's indexing status. Subject to Google's daily
 * URL Inspection API quota (a few hundred to a couple thousand/day
 * depending on the property) — not meant for bulk use. */
export async function inspectUrl(
  url: string
): Promise<UrlInspectionResult> {
  const sc = getSearchConsoleClient();
  const res = await sc.urlInspection.index.inspect({
    requestBody: {
      inspectionUrl: url,
      siteUrl: siteUrl(),
    },
  });
  const result = res.data.inspectionResult?.indexStatusResult;
  return {
    url,
    verdict: result?.verdict,
    coverageState: result?.coverageState,
    lastCrawlTime: result?.lastCrawlTime,
  };
}
