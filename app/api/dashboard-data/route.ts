import { NextRequest, NextResponse } from "next/server";
import { isGoogleConfigured } from "@/lib/google-clients";
import { getCurrentWindow, getCompareWindow } from "@/lib/date-ranges";
import type { RangeKey } from "@/lib/mock-data";
import {
  getGA4Summary,
  getGA4Series,
  getGA4TopPages,
  getGA4Channels,
} from "@/lib/ga4-data";
import {
  getGSCSummary,
  getGSCTopQueries,
  getGSCTopPages,
  getGSCIndexingSnapshot,
} from "@/lib/gsc-data";

const VALID_RANGES: RangeKey[] = [
  "7d",
  "28d",
  "90d",
  "thisMonth",
  "lastMonth",
  "lastYear",
];

export async function GET(req: NextRequest) {
  if (!isGoogleConfigured()) {
    return NextResponse.json(
      {
        configured: false,
        message:
          "Google service account env vars are not set. Showing sample data instead.",
      },
      { status: 200 }
    );
  }

  const { searchParams } = new URL(req.url);
  const rangeParam = searchParams.get("range") ?? "28d";
  const range = VALID_RANGES.includes(rangeParam as RangeKey)
    ? (rangeParam as RangeKey)
    : "28d";
  const compareToLastYear = searchParams.get("compareToLastYear") === "true";

  const current = getCurrentWindow(range);
  const compare = getCompareWindow(range, compareToLastYear);

  try {
    const [
      ga4Current,
      ga4Previous,
      ga4Series,
      ga4PrevSeries,
      ga4TopPages,
      ga4Channels,
      gscCurrent,
      gscPrevious,
      gscTopQueries,
      gscTopPages,
      indexing,
    ] = await Promise.all([
      getGA4Summary(current),
      getGA4Summary(compare),
      getGA4Series(current),
      getGA4Series(compare),
      getGA4TopPages(current),
      getGA4Channels(current),
      getGSCSummary(current),
      getGSCSummary(compare),
      getGSCTopQueries(current),
      getGSCTopPages(current),
      getGSCIndexingSnapshot(),
    ]);

    return NextResponse.json({
      configured: true,
      range,
      compareLabel: compareToLastYear
        ? "vs. same period last year"
        : "vs. previous period",
      ga4: {
        current: ga4Current,
        previous: ga4Previous,
        series: ga4Series,
        prevSeries: ga4PrevSeries,
        topPages: ga4TopPages,
        channels: ga4Channels,
      },
      gsc: {
        current: gscCurrent,
        previous: gscPrevious,
        topQueries: gscTopQueries,
        topPages: gscTopPages,
      },
      indexing,
    });
  } catch (err) {
    console.error("dashboard-data fetch failed", err);
    return NextResponse.json(
      {
        configured: true,
        error: true,
        message:
          err instanceof Error ? err.message : "Failed to fetch Google data",
      },
      { status: 500 }
    );
  }
}
