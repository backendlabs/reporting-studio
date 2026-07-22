import { NextRequest, NextResponse } from "next/server";
import { isGoogleConfigured } from "@/lib/google-clients";
import { inspectUrl } from "@/lib/gsc-data";

export async function GET(req: NextRequest) {
  if (!isGoogleConfigured()) {
    return NextResponse.json(
      { error: true, message: "Search Console isn't connected yet." },
      { status: 200 }
    );
  }

  const url = new URL(req.url).searchParams.get("url");
  if (!url) {
    return NextResponse.json(
      { error: true, message: "Missing url parameter." },
      { status: 400 }
    );
  }

  try {
    const result = await inspectUrl(url);
    return NextResponse.json(result);
  } catch (err) {
    console.error("inspect-url failed", err);
    return NextResponse.json(
      {
        error: true,
        message:
          err instanceof Error ? err.message : "URL inspection failed.",
      },
      { status: 200 }
    );
  }
}
