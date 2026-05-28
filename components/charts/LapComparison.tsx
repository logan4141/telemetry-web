"use client";
import dynamic from "next/dynamic";
import type { ComparisonSeries } from "@/lib/types";
import type { Data, Layout } from "plotly.js";
import { formatLapTime } from "@/lib/utils";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

const COLORS = ["#f97316", "#3b82f6", "#22c55e", "#a855f7", "#ec4899"];

interface Props {
  title: string;
  series: ComparisonSeries[];
}

export function LapComparison({ title, series }: Props) {
  const traces: Data[] = series.map((s, i) => ({
    type: "scatter",
    mode: "lines",
    name: `${s.session_name} — L${s.lap_number} (${formatLapTime(s.lap_time ?? undefined)})`,
    x: s.timestamps,
    y: s.values,
    line: { color: COLORS[i % COLORS.length], width: 1.5 },
  }));

  const layout: Partial<Layout> = {
    title: { text: title, font: { color: "#e5e7eb", size: 14 } },
    paper_bgcolor: "transparent",
    plot_bgcolor: "#111827",
    font: { color: "#9ca3af", size: 12 },
    xaxis: { title: { text: "Time (s)" }, gridcolor: "#1f2937", zerolinecolor: "#374151" },
    yaxis: {
      title: { text: series[0]?.unit ?? "" },
      gridcolor: "#1f2937",
      zerolinecolor: "#374151",
    },
    legend: { font: { color: "#e5e7eb" }, orientation: "h", y: -0.2 },
    margin: { t: 40, r: 16, b: 80, l: 56 },
    hovermode: "x unified",
  };

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800">
      <Plot
        data={traces}
        layout={layout}
        config={{ responsive: true, displayModeBar: false }}
        style={{ width: "100%", height: "420px" }}
      />
    </div>
  );
}
