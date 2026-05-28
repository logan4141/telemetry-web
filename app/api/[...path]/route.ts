import { type NextRequest, NextResponse } from "next/server";

const API_BASE =
  process.env.API_BASE_URL ?? "https://web-databaseurl-8601.up.railway.app";

async function handler(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  const targetUrl = `${API_BASE}/api/${params.path.join("/")}${req.nextUrl.search}`;

  const headers = new Headers(req.headers);
  headers.delete("host");

  const init: RequestInit = { method: req.method, headers };
  if (req.method !== "GET" && req.method !== "HEAD") {
    (init as any).duplex = "half";
    init.body = req.body;
  }

  const upstream = await fetch(targetUrl, init);

  const resHeaders = new Headers(upstream.headers);
  resHeaders.delete("content-encoding");

  return new NextResponse(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: resHeaders,
  });
}

export {
  handler as GET,
  handler as POST,
  handler as PUT,
  handler as PATCH,
  handler as DELETE,
  handler as OPTIONS,
};
