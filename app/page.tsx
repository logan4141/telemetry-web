import Link from "next/link";
import { SessionList } from "@/components/sessions/SessionList";

export default function Dashboard() {
  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold">Dashboard</h1>
          <p className="text-gray-400 text-sm mt-1">
            Upload telemetry files to analyse engine health, tire temps, brakes, and suspension.
          </p>
        </div>
        <Link
          href="/upload"
          className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition shrink-0"
        >
          Upload Session
        </Link>
      </div>
      <SessionList />
    </div>
  );
}
