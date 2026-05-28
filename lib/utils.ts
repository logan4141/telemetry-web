export function formatLapTime(seconds: number | null | undefined): string {
  if (seconds == null) return "--:--.---";
  const mins = Math.floor(seconds / 60);
  const secs = (seconds % 60).toFixed(3).padStart(6, "0");
  return mins > 0 ? `${mins}:${secs}` : secs;
}

export function formatTemp(val: number | null | undefined, unit = "C"): string {
  if (val == null) return "--";
  return `${val.toFixed(1)}°${unit}`;
}

export function formatPressure(val: number | null | undefined): string {
  if (val == null) return "--";
  return `${val.toFixed(1)} psi`;
}

export function formatSourceFormat(fmt: string): string {
  const map: Record<string, string> = {
    motec: "MoTeC",
    aim: "AiM",
    fit: "Garmin .fit",
  };
  return map[fmt?.toLowerCase()] ?? fmt ?? "Unknown";
}

export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ");
}
