import type { RangeKey } from "./mock-data";

export interface DateWindow {
  startDate: string; // YYYY-MM-DD
  endDate: string;
}

function fmt(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

/** Current period window for a given range key. */
export function getCurrentWindow(range: RangeKey): DateWindow {
  const today = new Date();

  switch (range) {
    case "7d":
      return { startDate: fmt(daysAgo(7)), endDate: fmt(daysAgo(1)) };
    case "28d":
      return { startDate: fmt(daysAgo(28)), endDate: fmt(daysAgo(1)) };
    case "90d":
      return { startDate: fmt(daysAgo(90)), endDate: fmt(daysAgo(1)) };
    case "thisMonth": {
      const start = new Date(today.getFullYear(), today.getMonth(), 1);
      return { startDate: fmt(start), endDate: fmt(daysAgo(1)) };
    }
    case "lastMonth": {
      const start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const end = new Date(today.getFullYear(), today.getMonth(), 0);
      return { startDate: fmt(start), endDate: fmt(end) };
    }
    case "lastYear": {
      const start = new Date(today.getFullYear() - 1, 0, 1);
      const end = new Date(today.getFullYear() - 1, 11, 31);
      return { startDate: fmt(start), endDate: fmt(end) };
    }
  }
}

/** Comparison window — either the immediately preceding period of equal
 * length, or the same calendar window one year earlier. */
export function getCompareWindow(
  range: RangeKey,
  compareToLastYear: boolean
): DateWindow {
  const current = getCurrentWindow(range);
  const start = new Date(current.startDate);
  const end = new Date(current.endDate);

  if (compareToLastYear) {
    const shift = (d: Date) => {
      const c = new Date(d);
      c.setFullYear(c.getFullYear() - 1);
      return c;
    };
    return { startDate: fmt(shift(start)), endDate: fmt(shift(end)) };
  }

  const lengthMs = end.getTime() - start.getTime();
  const prevEnd = new Date(start.getTime() - 24 * 60 * 60 * 1000);
  const prevStart = new Date(prevEnd.getTime() - lengthMs);
  return { startDate: fmt(prevStart), endDate: fmt(prevEnd) };
}
