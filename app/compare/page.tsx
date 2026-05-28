"use client";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { sessions as sessionsApi, channels as channelsApi } from "@/lib/api";
import { LapComparison } from "@/components/charts/LapComparison";
import { formatLapTime } from "@/lib/utils";

const COMMON_CHANNELS = [
  "Oil Temperature", "Water Temperature", "Brake Temp FL", "Brake Temp FR",
  "Tire Pressure FL", "Tire Temp Core FL",
  "Ground Speed", "Engine RPM", "Throttle Pos", "Brake Pos",
  "Steering Angle", "CG Accel Lateral", "Ride Height Front",
];

export default function ComparePage() {
  const [selected, setSelected] = useState<string[]>([]);
  const [channel, setChannel] = useState("Ground Speed");

  const { data: allSessions } = useQuery({ queryKey: ["sessions"], queryFn: sessionsApi.list });

  const { data: comparison, isLoading } = useQuery({
    queryKey: ["compare", selected, channel],
    queryFn: () => channelsApi.compare(selected, channel),
    enabled: selected.length >= 2,
  });

  const toggle = (id: string) =>
    setSelected(p => (p.includes(id) ? p.filter(s => s !== id) : [...p, id]));

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">Compare Sessions</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Session picker */}
        <div className="lg:col-span-2">
          <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-3">
            Sessions � select 2 or more
          </p>
          <div className="grid gap-2">
            {allSessions?.map(s => (
              <button
                key={s.id}
                onClick={() => toggle(s.id)}
                className={`p-3 rounded-lg border text-left text-sm transition ${
                  selected.includes(s.id)
                    ? "border-orange-500 bg-orange-500/10"
                    : "border-gray-800 hover:border-gray-600"
                }`}
              >
                <div className="font-medium">{s.name}</div>
                <div className="text-xs text-gray-500 mt-0.5">
                  {s.track} � {s.date.slice(0, 10)}
                  {s.is_benchmark && " � Benchmark"}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Channel picker */}
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wide font-semibold mb-3">Channel</p>
          <div className="flex flex-col gap-1">
            {COMMON_CHANNELS.map(ch => (
              <button
                key={ch}
                onClick={() => setChannel(ch)}
                className={`px-3 py-2 rounded text-sm text-left transition ${
                  channel === ch ? "bg-orange-500 text-white" : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
              >
                {ch}
              </button>
            ))}
          </div>
        </div>
      </div>

      {selected.length < 2 && (
        <div className="h-72 bg-gray-900 rounded-xl border border-gray-800 flex items-center justify-center text-gray-500 text-sm">
          Select at least 2 sessions to compare
        </div>
      )}
      {isLoading && selected.length >= 2 && (
        <div className="h-72 bg-gray-900 rounded-xl border border-gray-800 flex items-center justify-center text-gray-500 text-sm">
          Loading...
        </div>
      )}
      {comparison && !isLoading && <LapComparison title={`${channel} � Best Laps`} series={comparison} />}
    </div>
  );
}
