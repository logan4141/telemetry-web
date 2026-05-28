"use client";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadFile } from "@/lib/api";
import { useRouter } from "next/navigation";

const ACCEPT = {
  "application/octet-stream": [".ld", ".ldx", ".xdrk", ".drk", ".fit"],
  "text/csv": [".csv"],
};

const FIELDS = [
  { key: "name", label: "Session Name", required: true, full: true },
  { key: "track", label: "Track" },
  { key: "car",   label: "Car" },
  { key: "driver", label: "Driver" },
  { key: "conditions", label: "Conditions", full: true },
];

export function FileDropzone() {
  const router = useRouter();
  const qc = useQueryClient();
  const [file, setFile] = useState<File | null>(null);
  const [meta, setMeta] = useState({ name: "", track: "", car: "", driver: "", conditions: "" });

  const { mutate, isPending, error } = useMutation({
    mutationFn: uploadFile,
    onSuccess: (session) => {
      qc.invalidateQueries({ queryKey: ["sessions"] });
      router.push(`/sessions/${session.id}`);
    },
  });

  const onDrop = useCallback(
    (accepted: File[]) => {
      if (accepted[0]) {
        setFile(accepted[0]);
        if (!meta.name)
          setMeta(m => ({ ...m, name: accepted[0].name.replace(/\.[^.]+$/, "") }));
      }
    },
    [meta.name]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPT,
    maxFiles: 1,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !meta.name) return;
    const fd = new FormData();
    fd.append("file", file);
    Object.entries(meta).forEach(([k, v]) => { if (v) fd.append(k, v); });
    mutate(fd);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition ${
          isDragActive ? "border-orange-500 bg-orange-500/5" : "border-gray-700 hover:border-gray-500"
        }`}
      >
        <input {...getInputProps()} />
        {file ? (
          <>
            <p className="text-orange-400 font-medium">{file.name}</p>
            <p className="text-gray-500 text-sm mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
          </>
        ) : (
          <>
            <p className="text-gray-300 font-medium">Drop telemetry file here</p>
            <p className="text-gray-500 text-sm mt-1">.ld .xdrk .drk .fit .csv</p>
          </>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        {FIELDS.map(({ key, label, required, full }) => (
          <div key={key} className={full ? "col-span-2" : ""}>
            <label className="block text-xs text-gray-400 mb-1">
              {label}{required && " *"}
            </label>
            <input
              type="text"
              value={meta[key as keyof typeof meta]}
              onChange={e => setMeta(m => ({ ...m, [key]: e.target.value }))}
              required={required}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-orange-500 transition"
            />
          </div>
        ))}
      </div>

      {error && (
        <p className="text-red-400 text-sm">{(error as Error).message}</p>
      )}

      <button
        type="submit"
        disabled={!file || !meta.name || isPending}
        className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed text-white py-2.5 rounded-lg text-sm font-medium transition"
      >
        {isPending ? "Uploading & parsing..." : "Upload Session"}
      </button>
    </form>
  );
}
