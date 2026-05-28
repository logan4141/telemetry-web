"use client";
import { useQuery } from "@tanstack/react-query";
import { sessions as sessionsApi, laps as lapsApi } from "@/lib/api";
import { formatLapTime } from "@/lib/utils";

function StatTile({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div style={{
      background: "var(--surface)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius-lg)",
      padding: 16,
    }}>
      <div className="eyebrow" style={{ marginBottom: 6 }}>{label}</div>
      <div className="num" style={{ fontSize: 24, color: "var(--fg)" }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: "var(--fg-4)", marginTop: 3 }}>{sub}</div>}
    </div>
  );
}

export function StatStrip() {
  const { data: allSessions } = useQuery({
    queryKey: ["sessions"],
    queryFn: sessionsApi.list,
  });

  const benchmarks = allSessions?.filter((s) => s.is_benchmark) ?? [];
  const tracks = new Set(allSessions?.map((s) => s.track).filter(Boolean)).size;

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
      <StatTile
        label="Total sessions"
        value={String(allSessions?.length ?? "—")}
        sub={`${tracks} track${tracks !== 1 ? "s" : ""}`}
      />
      <StatTile
        label="Benchmarks"
        value={String(benchmarks.length || "—")}
        sub={benchmarks[0]?.track ?? "none set"}
      />
      <StatTile
        label="Formats"
        value={String(new Set(allSessions?.map((s) => s.source_format)).size || "—")}
        sub="MoTeC · AiM · Garmin · CSV"
      />
      <StatTile
        label="Latest"
        value={allSessions?.[0]?.name ?? "—"}
        sub={allSessions?.[0]?.track ?? ""}
      />
    </div>
  );
}
