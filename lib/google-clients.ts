// Server-side only. Authenticates a Google service account and returns
// clients for the GA4 Data API and the Search Console API.
//
// Setup (done once, in Google Cloud Console):
//  1. Create a project, enable "Google Analytics Data API" and
//     "Google Search Console API".
//  2. Create a service account, generate a JSON key.
//  3. Add the service account's email as a Viewer on the GA4 property,
//     and as a "Full user" on the Search Console property.
//  4. Put the service account email + private key in env vars (below).

import { google } from "googleapis";
import { BetaAnalyticsDataClient } from "@google-analytics/data";

function getCredentials() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
  if (!email || !rawKey) return null;
  // Vercel env vars store literal "\n" — convert back to real newlines.
  const privateKey = rawKey.replace(/\\n/g, "\n");
  return { email, privateKey };
}

export function isGoogleConfigured(): boolean {
  return getCredentials() !== null;
}

let analyticsClient: BetaAnalyticsDataClient | null = null;
export function getAnalyticsClient(): BetaAnalyticsDataClient {
  if (analyticsClient) return analyticsClient;
  const creds = getCredentials();
  if (!creds) throw new Error("Google service account not configured");
  analyticsClient = new BetaAnalyticsDataClient({
    credentials: {
      client_email: creds.email,
      private_key: creds.privateKey,
    },
  });
  return analyticsClient;
}

export function getSearchConsoleClient() {
  const creds = getCredentials();
  if (!creds) throw new Error("Google service account not configured");
  const auth = new google.auth.JWT({
    email: creds.email,
    key: creds.privateKey,
    scopes: ["https://www.googleapis.com/auth/webmasters.readonly"],
  });
  return google.searchconsole({ version: "v1", auth });
}
