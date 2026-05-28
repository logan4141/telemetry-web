import { FileDropzone } from "@/components/upload/FileDropzone";

export default function UploadPage() {
  return (
    <div className="max-w-xl mx-auto">
      <h1 className="text-xl font-bold mb-1">Upload Telemetry</h1>
      <p className="text-gray-400 text-sm mb-8">
        Supports MoTeC (.ld/.ldx), AiM (.xdrk/.drk), Garmin (.fit), and CSV exports.
      </p>
      <FileDropzone />
    </div>
  );
}
