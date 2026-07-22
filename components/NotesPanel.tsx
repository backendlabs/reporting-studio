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
  completed: "",
  planned: "",
  summary: "",
};

export default function NotesPanel() {
  const [notes, setNotes] = useState<NotesState>(DEFAULT_NOTES);

  function update(key: keyof NotesState, value: string) {
    setNotes((n) => ({ ...n, [key]: value }));
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
          Not saved anywhere yet — notes reset on refresh until this is
          connected to a database.
        </p>
        <button
          disabled
          title="Not wired up yet — notes aren't persisted"
          className="cursor-not-allowed rounded-full bg-brand/40 px-4 py-2 text-xs font-semibold text-white"
        >
          Save Notes
        </button>
      </div>
    </div>
  );
}
