import axios from "axios";
import type { Session, Lap, ChannelData, ChannelMeta, ComparisonSeries, VitalsResponse } from "./types";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
});

export const sessions = {
  list: () => api.get<Session[]>("/api/sessions").then(r => r.data),
  get:  (id: string) => api.get<Session>(`/api/sessions/${id}`).then(r => r.data),
  benchmarks: () => api.get<Session[]>("/api/sessions/benchmarks").then(r => r.data),
  update: (id: string, data: Partial<Session>) =>
    api.patch<Session>(`/api/sessions/${id}`, data).then(r => r.data),
  delete: (id: string) => api.delete(`/api/sessions/${id}`),
};

export const laps = {
  forSession: (sessionId: string) =>
    api.get<Lap[]>(`/api/laps/session/${sessionId}`).then(r => r.data),
  channels: (lapId: string) =>
    api.get<ChannelMeta[]>(`/api/laps/${lapId}/channels`).then(r => r.data),
  channel: (lapId: string, channelName: string, maxPoints = 2000) =>
    api.get<ChannelData>(`/api/laps/${lapId}/channels/${encodeURIComponent(channelName)}`, {
      params: { max_points: maxPoints },
    }).then(r => r.data),
  vitals: (lapId: string) =>
    api.get<VitalsResponse>(`/api/laps/${lapId}/vitals`).then(r => r.data),
};

export const channels = {
  forSession: (sessionId: string) =>
    api.get<ChannelMeta[]>(`/api/channels/session/${sessionId}`).then(r => r.data),
  compare: (sessionIds: string[], channelName: string, lapNumbers?: number[]) =>
    api.post<ComparisonSeries[]>("/api/channels/compare", {
      session_ids: sessionIds,
      channel_name: channelName,
      lap_numbers: lapNumbers,
    }).then(r => r.data),
};

export async function uploadFile(formData: FormData) {
  return api.post<Session>("/api/files/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  }).then(r => r.data);
}
