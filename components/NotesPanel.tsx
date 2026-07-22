"use client";

import { useState } from "react";

const FIELDS = [
  {
    key: "completed",
    label: "Completed This Month",
    placeholder: "e.g. Published 4 blog posts targeting long-tail keywords, fixed 12 crawl errors, refreshed title tags on 8 service pages...",
  },
  {
    key: "planned",
    label: "Planned Next Month",
    placeholder: "e.g. Begin local citation cleanup, launch link building outreach for the pricing page, A/B test homepage CTA...",
  },
  {
    key: "summary",
    label: "TL;DR Summary",
    placeholder: "e.g. Organic sessions up 18% this month, driven mostly by the blog. On track for Q3 traffic goal.",
  },
] as const;

type NotesState = Record<(typeof FIELDS)[number]["key"], string>;

const DEFAULT_NOTES: NotesState = {
  completed:
    "Published 3 new blog posts targeting non-branded keywords, fixed 9 broken internal links flagged by the crawl audit, and rewrote meta descriptions on the top 10 landing pages by impressions.",
  planned:
    "Kick off a local citation cleanup pass, start outreach for 3 relevant guest post placements, and test a shorter form on the /contact page to lift completion rate.",
  summary:
    "Organic sessions are up this period and search impressions are trending well ahead of last year. Form completions still lag slightly — the shorter contact form test next month should help.",
};

export default function NotesPanel() {
  const [notes, setNotes] = useState<NotesState>(DEFAULT_NOTES);
  const [saved, setSaved] = useState(true);

  function update(key: keyof NotesState, value: string) {
    setNotes((n) => ({ ...n, [key]: value }));
    setSaved(false);
  }

  return (
    <div className="space-y-5">
      {FIELDS.map((field) => (
        <div
          key={field.key}
          className="rounded-2xl border border-line bg-card p-5"
        >
          <label className="mb-2 block font-display text-base text-ink">
            {field.label}
          </label>
          <textarea
            value={notes[field.key]}
            onChange={(e) => update(field.key, e.target.value)}
            placeholder={field.placeholder}
            rows={field.key === "summary" ? 3 : 4}
            className="w-full resize-none rounded-lg border border-line bg-paper px-3 py-2.5 text-sm text-ink outline-none placeholder:text-ink-soft/60 focus:border-brand"
          />
        </div>
      ))}

      <div className="flex items-center justify-between">
        <p className="text-xs text-ink-soft">
          {saved
            ? "Autosaves to Supabase as you type."
            : "Unsaved changes — sample data isn't persisted."}
        </p>
        <button
          onClick={() => setSaved(true)}
          className="rounded-full bg-brand px-4 py-2 text-xs font-semibold text-white hover:bg-brand-deep"
        >
          Save Notes
        </button>
      </div>
    </div>
  );
}
