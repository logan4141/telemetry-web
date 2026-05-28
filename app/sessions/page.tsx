"use client";
import { useQuery } from "@tanstack/react-query";
import { sessions as sessionsApi } from "@/lib/api";
import { SessionCard } from "@/components/sessions/SessionCard";
import Link from "next/link";

export default function SessionsPage() {
  const { data, isLoading } = useQuery({ queryKey: ["sessions"], queryFn: sessionsApi.list });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-bold">Sessions</h1>
        <Link href="/upload" className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition">
          Upload
        </Link>
      </div>
      {isLoading && <p className="text-gray-500 text-sm">Loading...</p>}
      <div className="grid gap-2">
        {data?.map(s => <SessionCard key={s.id} session={s} />)}
        {data?.length === 0 && <p className="text-gray-500 text-sm text-center py-16">No sessions yet.</p>}
      </div>
    </div>
  );
}
