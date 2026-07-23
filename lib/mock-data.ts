// Deterministic mock data generator — stands in for the real GA4 / GSC / Ads
// pull. In production this same shape would be populated by scheduled API
// syncs into Supabase, cached, and read by these same components.

export type RangeKey =
  | "7d"
  | "28d"
  | "90d"
  | "thisMonth"
  | "lastMonth"
  | "lastYear";

export const RANGE_LABELS: Record<RangeKey, string> = {
  "7d": "7 Days",
  "28d": "28 Days",
  "90d": "90 Days",
  thisMonth: "This Month",
  lastMonth: "Last Month",
  lastYear: "Last Year",
};

const RANGE_DAYS: Record<RangeKey, number> = {
  "7d": 7,
  "28d": 28,
  "90d": 90,
  thisMonth: 30,
  lastMonth: 30,
  lastYear: 365,
};

// simple seeded PRNG so numbers are stable across renders/exports
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export interface MetricSummary {
  label: string;
  value: number;
  previousValue: number;
  format: "number" | "percent";
}

export interface SeriesPoint {
  date: string;
  sessions: number;
  prevSessions: number;
}

export interface QueryRow {
  query: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface PageRow {
  page: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface GA4PageRow {
  path: string;
  sessions: number;
  pageviews: number;
  engagementRate: number;
}

export interface ChannelRow {
  channel: string;
  sessions: number;
}

export interface SitemapRow {
  path: string;
  submitted: number;
  indexed: number;
  type: string;
}

export interface DashboardData {
  range: RangeKey;
  periodLabel: string;
  compareLabel: string;
  metrics: MetricSummary[];
  series: SeriesPoint[];
  topQueries: QueryRow[];
  topSearchPages: PageRow[];
  topAnalyticsPages: GA4PageRow[];
  channels: ChannelRow[];
  sitemaps: SitemapRow[];
}

const SAMPLE_QUERIES = [
  "seo audit services",
  "local seo agency",
  "technical seo consultant",
  "keyword research tool",
  "content strategy for saas",
  "link building services",
  "site speed optimization",
  "google search console help",
  "ecommerce seo checklist",
  "on page seo guide",
];

const SAMPLE_PAGES = [
  "/",
  "/services/seo-audit",
  "/blog/seo-vs-social-media",
  "/services/local-seo",
  "/blog/keyword-research-guide",
  "/case-studies",
  "/contact",
  "/blog/site-speed-checklist",
  "/services/link-building",
  "/about",
];

const SAMPLE_CHANNELS = [
  "Organic Search",
  "Direct",
  "Referral",
  "Organic Social",
  "Paid Search",
];

export function getDashboardData(
  range: RangeKey,
  compareToLastYear: boolean
): DashboardData {
  const days = RANGE_DAYS[range];
  const rand = seededRandom(days * (compareToLastYear ? 7 : 3) + 42);

  const baseSessions = 480 + rand() * 220;
  const series: SeriesPoint[] = Array.from({ length: Math.min(days, 90) }).map(
    (_, i) => {
      const wobble = Math.sin(i / 4) * 40 + (rand() - 0.5) * 60;
      const trend = i * (2.2 + rand());
      const sessions = Math.max(20, Math.round(baseSessions + wobble + trend));
      const prevSessions = Math.max(
        15,
        Math.round(sessions * (0.72 + rand() * 0.2))
      );
      const d = new Date();
      d.setDate(d.getDate() - (Math.min(days, 90) - i));
      return {
        date: d.toISOString().slice(5, 10),
        sessions,
        prevSessions,
      };
    }
  );

  const totalSessions = series.reduce((a, p) => a + p.sessions, 0);
  const totalPrevSessions = series.reduce((a, p) => a + p.prevSessions, 0);
  const pageviews = Math.round(totalSessions * (2.1 + rand() * 0.4));
  const prevPageviews = Math.round(totalPrevSessions * (2.0 + rand() * 0.4));
  const conversions = Math.round(totalSessions * 0.021);
  const prevConversions = Math.round(totalPrevSessions * 0.017);
  const impressions = Math.round(totalSessions * 46 + rand() * 4000);
  const prevImpressions = Math.round(totalPrevSessions * 41 + rand() * 4000);
  const clicks = Math.round(impressions * (0.02 + rand() * 0.015));
  const prevClicks = Math.round(prevImpressions * (0.018 + rand() * 0.015));
  const avgPosition = 9.4 - rand() * 1.8;
  const prevAvgPosition = avgPosition + (rand() - 0.3) * 1.5;
  const ctr = Math.round((clicks / Math.max(1, impressions)) * 1000) / 10;
  const prevCtr =
    Math.round((prevClicks / Math.max(1, prevImpressions)) * 1000) / 10;

  const metrics: MetricSummary[] = [
    {
      label: "Sessions",
      value: totalSessions,
      previousValue: totalPrevSessions,
      format: "number",
    },
    {
      label: "Pageviews",
      value: pageviews,
      previousValue: prevPageviews,
      format: "number",
    },
    {
      label: "Conversions",
      value: conversions,
      previousValue: prevConversions,
      format: "number",
    },
    {
      label: "Search Clicks",
      value: clicks,
      previousValue: prevClicks,
      format: "number",
    },
    {
      label: "Search Impressions",
      value: impressions,
      previousValue: prevImpressions,
      format: "number",
    },
    {
      label: "Avg. Search Position",
      value: Math.round(avgPosition * 10) / 10,
      previousValue: Math.round(prevAvgPosition * 10) / 10,
      format: "number",
    },
    {
      label: "Search CTR",
      value: ctr,
      previousValue: prevCtr,
      format: "percent",
    },
  ];

  const topQueries: QueryRow[] = SAMPLE_QUERIES.map((q, i) => {
    const impr = Math.round(200 + rand() * 3200 - i * 120);
    const clicks = Math.max(0, Math.round(impr * (0.01 + rand() * 0.06)));
    return {
      query: q,
      clicks,
      impressions: Math.max(40, impr),
      ctr: Math.round((clicks / Math.max(40, impr)) * 1000) / 10,
      position: Math.round((3 + rand() * 14) * 10) / 10,
    };
  }).sort((a, b) => b.impressions - a.impressions);

  const topSearchPages: PageRow[] = SAMPLE_PAGES.map((p, i) => {
    const impr = Math.round(300 + rand() * 4200 - i * 150);
    const clicks = Math.max(0, Math.round(impr * (0.015 + rand() * 0.05)));
    return {
      page: p,
      clicks,
      impressions: Math.max(60, impr),
      ctr: Math.round((clicks / Math.max(60, impr)) * 1000) / 10,
      position: Math.round((2 + rand() * 12) * 10) / 10,
    };
  }).sort((a, b) => b.clicks - a.clicks);

  const topAnalyticsPages: GA4PageRow[] = SAMPLE_PAGES.map((p) => {
    const pageviews = Math.round(80 + rand() * 900);
    const sessions = Math.round(pageviews * (0.55 + rand() * 0.3));
    return {
      path: p,
      sessions,
      pageviews,
      engagementRate: Math.round((45 + rand() * 40) * 10) / 10,
    };
  }).sort((a, b) => b.sessions - a.sessions);

  const channels: ChannelRow[] = SAMPLE_CHANNELS.map((c) => ({
    channel: c,
    sessions: Math.round(totalSessions * (0.05 + rand() * 0.32)),
  })).sort((a, b) => b.sessions - a.sessions);

  const sitemaps: SitemapRow[] = [
    {
      path: "/sitemap.xml",
      submitted: 62,
      indexed: Math.round(48 + rand() * 10),
      type: "Web page",
    },
  ];

  return {
    range,
    periodLabel: RANGE_LABELS[range],
    compareLabel: compareToLastYear
      ? "vs. same period last year"
      : "vs. previous period",
    metrics,
    series,
    topQueries,
    topSearchPages,
    topAnalyticsPages,
    channels,
    sitemaps,
  };
}

export function pctChange(current: number, previous: number): number {
  if (previous === 0) return current === 0 ? 0 : 100;
  return Math.round(((current - previous) / previous) * 1000) / 10;
}
