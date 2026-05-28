"use client";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { sessions as sessionsApi } from "@/lib/api";
import { formatLapTime, formatSourceFormat } from "@/lib/utils";
import type { Session } from "@/lib/types";

const STATUS: Record<string, { bg: string; fg: string; bd: string; label: string }> = {
  pending: { bg: "var(--warn-soft)",  fg: "var(--warn)", bd: "var(--warn)",  label: "Parsing" },
  done:    { bg: "transparent",       fg: "transparent", bd: "transparent",  label: "" },
  error:   { bg: "var(--bad-soft)",   fg: "var(--bad)",  bd: "var(--bad)",   label: "Error" },
};

function Badge({ session }: { session: Session }) {
  if (session.is_benchmark) {
    return (
      <span style={{
        display: "inline-flex", alignItems: "center",
        padding: "1px 7px", borderRadius: "var(--radius-sm)",
        fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase" as const,
        fontWeight: 600, background: "var(--accent-soft)",
        color: "var(--accent-fg)", border: "1px solid var(--accent)",
      }}>Bench</span>
    );
  }
  const s = STATUS[session.parse_status];
  if (!s || !s.label) return null;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center",
      padding: "1px 7px", borderRadius: "var(--radius-sm)",
      fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase" as const,
      fontWeight: 600, background: s.bg, color: s.fg, border: `1px solid ${s.bd}`,
    }}>{s.label}</span>
  );
}

export function SessionTable() {
  const router = useRouter();
  const [filter, setFilter] = useState<"all" | "bench">("all");

  const { data, isLoading, error } = useQuery({
    queryKey: ["sessions"],
    queryFn: sessionsApi.list,
  });

  const filtered = filter === "bench" ? (data ?? []).filter((s) => s.is_benchmark) : (data ?? []);

  const colGrid = "1.4fr 1fr 1fr 0.9fr 0.6fr 0.5fr";

  return (
    <div style={{
      background: "var(--surface)",
      border: "1px solid var(--border)",
      borderRadius: "var(--radius-lg)",
      overflow: "hidden",
    }}>
      {/* Card header */}
      <div style={{
        padding: "14px 18px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        borderBottom: "1px solid var(--border)",
      }}>
        <div>
          <div className="eyebrow">Recent</div>
          <div style={{ fontSize: 15, fontWeight: 600, marginTop: 2 }}>Sessions</div>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {(["all", "bench"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} style={{
              height: 26, padding: "0 10px", borderRadius: "var(--radius-sm)",
              fontSize: 12, fontWeight: 500,
              border: `1px solid ${filter === f ? "var(--accent)" : "var(--border-strong)"}`,
              background: filter === f ? "var(--accent-soft)" : "transparent",
              color: filter === f ? "var(--accent-fg)" : "var(--fg-3)",
              cursor: "pointer",
            }}>
              {f === "all" ? "All" : "Benchmarks"}
            </button>
          ))}
        </div>
      </div>

      {/* Column headers */}
      <div style={{
        display: "grid", gridTemplateColumns: colGrid,
        padding: "10px 18px", borderBottom: "1px solid var(--border)",
        fontSize: 10, letterSpacing: "0.08em", color: "var(--fg-3)",
        fontWeight: 600, textTransform: "uppercase" as const,
      }}>
        <span>Session</span>
        <span>Track · Car · Driver</span>
        <span>Date</span>
        <span>Best lap</span>
        <span style={{ textAlign: "right" }}>Laps</span>
        <span />
      </div>

      {/* Rows */}
      {isLoading && (
        <div style={{ padding: "32px 18px", color: "var(--fg-4)", fontSize: 13 }}>Loading…</div>
      )}
      {error && (
        <div style={{ padding: "32px 18px", color: "var(--bad)", fontSize: 13 }}>
          Could not load sessions.
        </div>
      )}
      {filtered.map((session) => (
        <div key={session.id} onClick={() => router.push(`/sessions/${session.id}`)} style={{
          display: "grid", gridTemplateColumns: colGrid, alignItems: "center",
          padding: "13px 18px", borderBottom: "1px solid var(--border)",
          cursor: "pointer", transition: "background 150ms var(--ease-out)",
        }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--surface-2)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "")}
        >
          {/* Name + format */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{
              width: 8, height: 8, borderRadius: "50%",
              background: session.is_benchmark ? "var(--accent)" : "var(--fg-5)",
              flexShrink: 0,
            }} />
            <div>
              <div style={{ fontSize: 14, fontWeight: 500, color: "var(--fg)" }}>{session.name}</div>
              <div className="num" style={{ fontSize: 11, color: "var(--fg-4)", marginTop: 1 }}>
                {formatSourceFormat(session.source_format)}
              </div>
            </div>
          </div>

          {/* Track / car / driver */}
          <div style={{ fontSize: 13, color: "var(--fg-2)" }}>
            {[session.track, session.car, session.driver].filter(Boolean).join(" · ") || "—"}
          </div>

          {/* Date */}
          <div className="num" style={{ fontSize: 13, color: "var(--fg-2)" }}>
            {session.date.slice(0, 10)}
          </div>

          {/* Best lap (empty until we add aggregation) */}
          <div className="num" style={{ fontSize: 14, color: "var(--fg)" }}>—</div>

          {/* Lap count */}
          <div className="num" style={{ fontSize: 13, color: "var(--fg-3)", textAlign: "right" }}>—</div>

          {/* Badge */}
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Badge session={session} />
          </div>
        </div>
      ))}

      {!isLoading && filtered.length === 0 && (
        <div style={{ padding: "48px 18px", textAlign: "center", color: "var(--fg-4)", fontSize: 13 }}>
          No sessions yet. Drop a <code>.ld</code>, <code>.xdrk</code>, <code>.fit</code>, or <code>.csv</code> to begin.
        </div>
      )}
    </div>
  );
}
