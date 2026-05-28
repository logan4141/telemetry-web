import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import Providers from "./providers";

export const metadata: Metadata = {
  title: "Race Telemetry",
  description: "Race car vitals and telemetry analysis",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-gray-100 min-h-screen">
        <Providers>
          <Navbar />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
