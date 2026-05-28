export interface Session {
  id: string;
  name: string;
  date: string;
  track: string | null;
  car: string | null;
  driver: string | null;
  conditions: string | null;
  source_format: string;
  is_benchmark: boolean;
  parse_status: "pending" | "done" | "error";
  created_at: string;
}

export interface Lap {
  id: string;
  session_id: string;
  lap_number: number;
  lap_time: number | null;
  is_valid: boolean;
  start_ts: number | null;
  end_ts: number | null;
}

export interface ChannelMeta {
  name: string;
  unit: string | null;
  sample_rate: number | null;
  category: string | null;
}

export interface ChannelData {
  channel_name: string;
  unit: string | null;
  sample_rate: number | null;
  timestamps: number[];
  values: number[];
}

export interface VitalChannel {
  unit: string | null;
  timestamps: number[];
  values: number[];
  min: number | null;
  max: number | null;
  avg: number | null;
}

export interface VitalsResponse {
  engine: Record<string, VitalChannel>;
  tires: Record<string, VitalChannel>;
  brakes: Record<string, VitalChannel>;
  suspension: Record<string, VitalChannel>;
  driver: Record<string, VitalChannel>;
  chassis: Record<string, VitalChannel>;
}

export interface ComparisonSeries {
  session_id: string;
  session_name: string;
  lap_number: number;
  lap_time: number | null;
  channel_name: string;
  unit: string | null;
  timestamps: number[];
  values: number[];
}
