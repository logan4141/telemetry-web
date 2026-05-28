"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { sessions, laps as lapsApi } from "@/lib/api";
import { VitalsPanel } from "@/components/vitals/VitalsPanel";
import { ChannelChart } from "@/components/charts/ChannelChart";
import type { Lap } from "@/lib/types";

function fmtLapTime(ms: number | null) {
  if (ms == null) return "--";
  const m = Math.floor(ms / 60000);
  const s = ((ms % 60000) / 1000).toFixed(3);
  return `${m}:${s.padStart(6, "0")}`;
}

export default function SessionPage() {
  const { id } = useParams<{ id: string }>();
  const [selectedLap, setSelectedLap] = useState<Lap | null>(null);
  const [tab, setTab] = useState<"vitals" | "channels">("vitals");

  const { data: session } = useQuery({
    queryKey: ["session", id],
    queryFn: () => sessions.get(id),
  });

  const { data: laps } = useQuery({
    queryKey: ["laps", id],
    queryFn: () => lapsApi.forSession(id),
    onSuccess: (data) => {
      if (data.length > 0 && !selectedLap) setSelectedLap(data[0]);
    },
  });

  const { data: channelList } = useQuery({
    queryKey: ["channels", selectedLap?.id],
    queryFn: () => lapsApi.channels(selectedLap!.id),
    enabled: !!selectedLap && tab === "channels",
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">{session?.name ?? "Session"}</h1>
        <div className="text-sm text-gray-400 mt-1 space-x-4">
          {session?.track && <span>{session.track}</span>}
          {session?.car && <span>{session.car}</span>}
          {session?.driver && <span>{session.driver}</span>}
          {session?.date && <span>{new Date(session.date).toLocaleDateString()}</span>}
        </div>
      </div>

      {/* Lap selector */}
      {laps && laps.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {laps.map((lap) => (
            <button
              key={lap.id}
              onClick={() => setSelectedLap(lap)}
              className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
                selectedLap?.id === lap.id
                  ? "bg-red-600 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
            >
              Lap {lap.lap_number} &nbsp;
              <span className="text-xs opacity-75">{fmtLapTime(lap.lap_time)}</span>
            </button>
          ))}
        </div>
      )}

      {/* Tabs */}
      {selectedLap && (
        <>
          <div className="flex gap-4 border-b border-gray-800">
            {(["vitals", "channels"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`pb-2 text-sm font-medium capitalize transition-colors ${
                  tab === t
                    ? "text-white border-b-2 border-red-500"
                    : "text-gray-500 hover:text-gray-300"
                }`}
              >
                {t === "vitals" ? "Vitals" : "All Channels"}
              </button>
            ))}
          </div>

          {tab === "vitals" && <VitalsPanel lapId={selectedLap.id} />}

          {tab === "channels" && (
            <div className="space-y-2">
              {channelList ? (
                <p className="text-sm text-gray-400">{channelList.length} channels available — select one to plot.</p>
              ) : (
                <p className="text-sm text-gray-500">Loading channels...</p>
              )}
            </div>
          )}
        </>
      )}

      {!laps?.length && (
        <p className="text-gray-500 text-sm">No laps found for this session.</p>
      )}
    </div>
  );
}
