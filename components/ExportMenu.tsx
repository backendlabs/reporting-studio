"use client";

import { useState, useRef, useEffect } from "react";
import { Download, FileSpreadsheet, FileText, ChevronDown } from "lucide-react";
import type { DashboardData } from "@/lib/mock-data";

export default function ExportMenu({
  data,
  disabled,
}: {
  data: DashboardData;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  async function exportCSV() {
    const Papa = (await import("papaparse")).default;
    const rows = [
      ["Metric", "Current", "Previous", "Period"],
      ...data.metrics.map((m) => [
        m.label,
        String(m.value),
        String(m.previousValue),
        data.periodLabel,
      ]),
      [],
      ["Query", "Clicks", "Impressions", "CTR %", "Avg Position"],
      ...data.topQueries.map((q) => [
        q.query,
        String(q.clicks),
        String(q.impressions),
        String(q.ctr),
        String(q.position),
      ]),
    ];
    const csv = Papa.unparse(rows);
    downloadBlob(csv, "text/csv", `report-${data.range}.csv`);
    setOpen(false);
  }

  async function exportPDF() {
    const { default: jsPDF } = await import("jspdf");
    const autoTable = (await import("jspdf-autotable")).default;
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Client Performance Report", 14, 18);
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`${data.periodLabel} — ${data.compareLabel}`, 14, 25);

    autoTable(doc, {
      startY: 32,
      head: [["Metric", "Current", "Previous"]],
      body: data.metrics.map((m) => [
        m.label,
        m.value.toLocaleString("en-US"),
        m.previousValue.toLocaleString("en-US"),
      ]),
      headStyles: { fillColor: [0, 104, 148] },
      styles: { fontSize: 9 },
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const finalY = (doc as any).lastAutoTable?.finalY ?? 60;

    autoTable(doc, {
      startY: finalY + 10,
      head: [["Query", "Clicks", "Impr.", "CTR", "Pos."]],
      body: data.topQueries
        .slice(0, 8)
        .map((q) => [
          q.query,
          String(q.clicks),
          String(q.impressions),
          `${q.ctr}%`,
          String(q.position),
        ]),
      headStyles: { fillColor: [0, 104, 148] },
      styles: { fontSize: 9 },
    });

    doc.save(`report-${data.range}.pdf`);
    setOpen(false);
  }

  function downloadBlob(content: string, type: string, filename: string) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="relative no-print" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        disabled={disabled}
        className="flex items-center gap-1.5 rounded-full border border-line bg-card px-3.5 py-2 text-xs font-semibold text-ink hover:border-brand hover:text-brand-deep disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-line disabled:hover:text-ink"
      >
        <Download className="h-3.5 w-3.5" strokeWidth={2} />
        Export
        <ChevronDown className="h-3.5 w-3.5" strokeWidth={2} />
      </button>
      {open && (
        <div className="absolute right-0 z-10 mt-2 w-44 overflow-hidden rounded-xl border border-line bg-card shadow-lg">
          <button
            onClick={exportCSV}
            className="flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-xs font-medium text-ink hover:bg-brand-tint"
          >
            <FileSpreadsheet className="h-4 w-4 text-brand" strokeWidth={1.75} />
            Export as CSV
          </button>
          <button
            onClick={exportPDF}
            className="flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-xs font-medium text-ink hover:bg-brand-tint"
          >
            <FileText className="h-4 w-4 text-brand" strokeWidth={1.75} />
            Export as PDF
          </button>
        </div>
      )}
    </div>
  );
}
