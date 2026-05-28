"use client";
import dynamic from "next/dynamic";
import type { Data, Layout } from "plotly.js";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false });

const COLORS = ["#f97316", "#3b82f6", "#22c55e", "#a855f7", "#ec4899", "#14b8a6"];

interface Series {
  name: string;
  timestamps: number[];
  values: number[];
  unit?: string | null;
}

interface Props {
  title?: string;
  data: Series[];
  height?: number;
}

export function ChannelChart({ title, data, height = 320 }: Props) {
  const traces: Data[] = data.map((s, i) => ({
    type: "scatter",
    mode: "lines",
    name: s.name,
    x: s.timestamps,
    y: s.values,
    line: { color: COLORS[i % COLORS.length], width: 1.5 },
  }));

  const layout: Partial<Layout> = {
    title: title ? { text: title, font: { color: "#e5e7eb", size: 14 } } : undefined,
    paper_bgcolor: "transparent",
    plot_bgcolor: "#111827",
    font: { color: "#9ca3af", size: 12 },
    xaxis: { title: { text: "Time (s)" }, gridcolor: "#1f2937", zerolinecolor: "#374151" },
    yaxis: {
      title: { text: data[0]?.unit ?? "" },
      gridcolor: "#1f2937",
      zerolinecolor: "#374151",
    },
    legend: { font: { color: "#e5e7eb" } },
    margin: { t: title ? 40 : 16, r: 16, b: 48, l: 56 },
    hovermode: "x unified",
  };

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800">
      <Plot
        data={traces}
        layout={layout}
        config={{ responsive: true, displayModeBar: false }}
        style={{ width: "100%", height: `${height}px` }}
      />
    </div>
  );
}
