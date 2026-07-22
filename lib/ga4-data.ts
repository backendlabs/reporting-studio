import { getAnalyticsClient } from "./google-clients";
import type { DateWindow } from "./date-ranges";

export interface GA4Summary {
  sessions: number;
  pageviews: number;
  conversions: number; // key events / form completions
}

export interface GA4SeriesPoint {
  date: string;
  sessions: number;
}

export interface GA4TopPage {
  path: string;
  pageviews: number;
  sessions: number;
}

export interface GA4Channel {
  channel: string;
  sessions: number;
}

const PROPERTY_ID = process.env.GA4_PROPERTY_ID; // e.g. "438083518"

function propertyName(): string {
  if (!PROPERTY_ID) throw new Error("GA4_PROPERTY_ID is not set");
  return `properties/${PROPERTY_ID}`;
}

export async function getGA4Summary(window: DateWindow): Promise<GA4Summary> {
  const client = getAnalyticsClient();
  const [response] = await client.runReport({
    property: propertyName(),
    dateRanges: [window],
    metrics: [
      { name: "sessions" },
      { name: "screenPageViews" },
      { name: "keyEvents" },
    ],
  });
  const row = response.rows?.[0];
  return {
    sessions: Number(row?.metricValues?.[0]?.value ?? 0),
    pageviews: Number(row?.metricValues?.[1]?.value ?? 0),
    conversions: Number(row?.metricValues?.[2]?.value ?? 0),
  };
}

export async function getGA4Series(
  window: DateWindow
): Promise<GA4SeriesPoint[]> {
  const client = getAnalyticsClient();
  const [response] = await client.runReport({
    property: propertyName(),
    dateRanges: [window],
    dimensions: [{ name: "date" }],
    metrics: [{ name: "sessions" }],
    orderBys: [{ dimension: { dimensionName: "date" } }],
  });
  return (response.rows ?? []).map((row) => {
    const raw = row.dimensionValues?.[0]?.value ?? "";
    const date = `${raw.slice(4, 6)}-${raw.slice(6, 8)}`; // MM-DD
    return { date, sessions: Number(row.metricValues?.[0]?.value ?? 0) };
  });
}

export async function getGA4TopPages(
  window: DateWindow,
  limit = 10
): Promise<GA4TopPage[]> {
  const client = getAnalyticsClient();
  const [response] = await client.runReport({
    property: propertyName(),
    dateRanges: [window],
    dimensions: [{ name: "pagePath" }],
    metrics: [{ name: "screenPageViews" }, { name: "sessions" }],
    orderBys: [
      { metric: { metricName: "screenPageViews" }, desc: true },
    ],
    limit,
  });
  return (response.rows ?? []).map((row) => ({
    path: row.dimensionValues?.[0]?.value ?? "",
    pageviews: Number(row.metricValues?.[0]?.value ?? 0),
    sessions: Number(row.metricValues?.[1]?.value ?? 0),
  }));
}

export async function getGA4Channels(
  window: DateWindow
): Promise<GA4Channel[]> {
  const client = getAnalyticsClient();
  const [response] = await client.runReport({
    property: propertyName(),
    dateRanges: [window],
    dimensions: [{ name: "sessionDefaultChannelGroup" }],
    metrics: [{ name: "sessions" }],
    orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
  });
  return (response.rows ?? []).map((row) => ({
    channel: row.dimensionValues?.[0]?.value ?? "Unknown",
    sessions: Number(row.metricValues?.[0]?.value ?? 0),
  }));
}
