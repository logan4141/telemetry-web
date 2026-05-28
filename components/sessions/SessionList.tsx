"use client";
import { useQuery } from "@tanstack/react-query";
import { sessions as sessionsApi } from "@/lib/api";
import { SessionCard } from "./SessionCard";

export function SessionList() {
  const { data, isLoading, error } = useQuery({ queryKey: ["sessions"], queryFn: sessionsApi.list });

  if (isLoading) return <div className="text-gray-500 text-sm">Loading sessions...</div>;
  if (error) return <div className="text-red-400 text-sm">Failed to load sessions.</div>;

  return (
    <div>
      <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-3">
        Recent Sessions
      </h2>
      <div className="grid gap-2">
        {data?.slice(0, 10).map(s => <SessionCard key={s.id} session={s} />)}
        {data?.length === 0 && (
          <p className="text-gray-500 text-center py-16 text-sm">
            No sessions yet. Upload your first telemetry file.
          </p>
        )}
      </div>
    </div>
  );
}
