"use client";
import Link from "next/link";
import type { Session } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";

const FORMAT_LABELS: Record<string, string> = {
  motec: "MoTeC", aim: "AiM", garmin: "Garmin", csv: "CSV",
};

const STATUS_STYLES: Record<string, string> = {
  done: "text-green-400",
  pending: "text-yellow-400",
  error: "text-red-400",
};

export function SessionCard({ session }: { session: Session }) {
  const meta = [session.track, session.car, session.driver].filter(Boolean).join(" · ");
  return (
    <Link
      href={`/sessions/${session.id}`}
      className="flex items-center justify-between p-4 bg-gray-900 rounded-lg border border-gray-800 hover:border-gray-600 transition group"
    >
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-medium group-hover:text-white transition">{session.name}</span>
          {session.is_benchmark && (
            <span className="text-xs px-2 py-0.5 bg-orange-500/20 text-orange-400 rounded-full">
              Benchmark
            </span>
          )}
          {session.parse_status !== "done" && (
            <span className={`text-xs ${STATUS_STYLES[session.parse_status]}`}>
              {session.parse_status}
            </span>
          )}
        </div>
        {meta && <p className="text-sm text-gray-400 mt-0.5 truncate">{meta}</p>}
      </div>
      <div className="text-right text-sm text-gray-500 ml-4 shrink-0">
        <div>{FORMAT_LABELS[session.source_format] ?? session.source_format}</div>
        <div className="text-xs mt-0.5">
          {formatDistanceToNow(new Date(session.created_at), { addSuffix: true })}
        </div>
      </div>
    </Link>
  );
}
