"use client";
import { useQuery } from "@tanstack/react-query";
import { laps as lapsApi } from "@/lib/api";
import { ChannelChart } from "@/components/charts/ChannelChart";
import type { VitalChannel, VitalsResponse } from "@/lib/types";
import { formatTemp, formatPressure } from "@/lib/utils";

interface Props { lapId: string; }

function StatBadge({ label, value, warn }: { label: string; value: string; warn?: boolean }) {
  return (
    <div className={`rounded-lg p-3 ${warn ? "bg-red-950/50 border border-red-800" : "bg-gray-800"}`}>
      <div className="text-xs text-gray-400 mb-1">{label}</div>
      <div className={`text-sm font-semibold ${warn ? "text-red-400" : "text-white"}`}>{value}</div>
    </div>
  );
}

function CornerGrid({ prefix, channels, formatter }: {
  prefix: string;
  channels: Record<string, VitalChannel>;
  formatter: (v: number | null) => string;
}) {
  const corners = ["FL", "FR", "RL", "RR"];
  return (
    <div className="grid grid-cols-2 gap-1.5">
      {corners.map(c => {
        const ch = channels[`${prefix} ${c}`];
        return (
          <StatBadge key={c} label={c} value={ch ? formatter(ch.avg) : "--"} />
        );
      })}
    </div>
  );
}

export function VitalsPanel({ lapId }: Props) {
  const { data, isLoading } = useQuery({
    queryKey: ["vitals", lapId],
    queryFn: () => lapsApi.vitals(lapId),
  });

  if (isLoading) {
    return <div className="text-gray-500 text-sm py-12 text-center">Loading vitals...</div>;
  }
  if (!data) return null;

  const eng = data.engine ?? {};
  const tires = data.tires ?? {};
  const brakes = data.brakes ?? {};
  const susp = data.suspension ?? {};
  const driver = data.driver ?? {};

  const speedCh = driver["Ground Speed"];

  return (
    <div className="space-y-8">
      {/* Engine */}
      <section>
        <h2 className="text-xs font-semibold text-red-400 uppercase tracking-wide mb-3">Engine</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
          <StatBadge label="Oil Temp avg" value={formatTemp(eng["Oil Temperature"]?.avg)} warn={(eng["Oil Temperature"]?.max ?? 0) > 130} />
          <StatBadge label="Water Temp avg" value={formatTemp(eng["Water Temperature"]?.avg)} warn={(eng["Water Temperature"]?.max ?? 0) > 105} />
          <StatBadge label="RPM max" value={eng["Engine RPM"] ? `${Math.round(eng["Engine RPM"].max ?? 0)} rpm` : "--"} />
          <StatBadge label="Fuel Level" value={eng["Fuel Level"] ? `${eng["Fuel Level"].avg?.toFixed(1)} L` : "--"} />
        </div>
        {eng["Oil Temperature"] && (
          <ChannelChart
            data={[
              { name: "Oil Temp", ...eng["Oil Temperature"], unit: eng["Oil Temperature"].unit },
              eng["Water Temperature"] ? { name: "Water Temp", ...eng["Water Temperature"], unit: eng["Water Temperature"].unit } : null,
            ].filter(Boolean) as any}
            height={220}
          />
        )}
      </section>

      {/* Tires */}
      <section>
        <h2 className="text-xs font-semibold text-blue-400 uppercase tracking-wide mb-3">Tire Temperatures (avg core)</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          {["FL", "FR", "RL", "RR"].map(c => {
            const core = tires[`Tire Temp Core ${c}`];
            const inner = tires[`Tire Temp Inner ${c}`];
            const outer = tires[`Tire Temp Outer ${c}`];
            return (
              <div key={c} className="bg-gray-900 border border-gray-800 rounded-lg p-3">
                <div className="text-xs text-gray-400 mb-2 font-semibold">{c}</div>
                <div className="text-xs space-y-1">
                  <div className="flex justify-between"><span className="text-gray-500">Inner</span><span>{formatTemp(inner?.avg)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Core</span><span className="text-white font-medium">{formatTemp(core?.avg)}</span></div>
                  <div className="flex justify-between"><span className="text-gray-500">Outer</span><span>{formatTemp(outer?.avg)}</span></div>
                </div>
              </div>
            );
          })}
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-2">Pressure (avg)</p>
          <CornerGrid prefix="Tire Pressure" channels={tires} formatter={formatPressure} />
        </div>
      </section>

      {/* Brakes */}
      <section>
        <h2 className="text-xs font-semibold text-orange-400 uppercase tracking-wide mb-3">Brake Temperatures</h2>
        <CornerGrid prefix="Brake Temp" channels={brakes} formatter={v => formatTemp(v)} />
      </section>

      {/* Suspension */}
      <section>
        <h2 className="text-xs font-semibold text-green-400 uppercase tracking-wide mb-3">Suspension</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <StatBadge label="Ride Height F" value={susp["Ride Height Front"] ? `${susp["Ride Height Front"].avg?.toFixed(1)} mm` : "--"} />
          <StatBadge label="Ride Height R" value={susp["Ride Height Rear"] ? `${susp["Ride Height Rear"].avg?.toFixed(1)} mm` : "--"} />
          <StatBadge label="CG Height" value={susp["CG Height"] ? `${susp["CG Height"].avg?.toFixed(1)} mm` : "--"} />
        </div>
        {susp["Suspension Travel FL"] && (
          <div className="mt-3">
            <ChannelChart
              data={["FL","FR","RL","RR"].map(c => ({
                name: c,
                timestamps: susp[`Suspension Travel ${c}`]?.timestamps ?? [],
                values: susp[`Suspension Travel ${c}`]?.values ?? [],
                unit: "mm",
              }))}
              height={200}
            />
          </div>
        )}
      </section>

      {/* Speed trace */}
      {speedCh && (
        <section>
          <h2 className="text-xs font-semibold text-purple-400 uppercase tracking-wide mb-3">Speed Trace</h2>
          <ChannelChart
            data={[{ name: "Speed", timestamps: speedCh.timestamps, values: speedCh.values, unit: speedCh.unit }]}
            height={200}
          />
        </section>
      )}
    </div>
  );
}
