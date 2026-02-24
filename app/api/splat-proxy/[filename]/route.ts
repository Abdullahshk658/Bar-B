import { NextResponse } from "next/server";

const FORWARDED_HEADERS = [
  "content-type",
  "content-length",
  "content-range",
  "accept-ranges",
  "etag",
  "cache-control",
  "last-modified"
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sourceUrl = searchParams.get("url");

  if (!sourceUrl) {
    return NextResponse.json({ error: "url is required" }, { status: 400 });
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(sourceUrl);
  } catch {
    return NextResponse.json({ error: "Invalid model URL" }, { status: 400 });
  }

  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    return NextResponse.json({ error: "Only http/https URLs are allowed" }, { status: 400 });
  }

  try {
    const range = request.headers.get("range");
    const upstream = await fetch(parsedUrl.toString(), {
      headers: range ? { Range: range } : undefined
    });

    if (!upstream.ok && upstream.status !== 206) {
      return NextResponse.json(
        { error: "Failed to fetch upstream model", status: upstream.status },
        { status: 502 }
      );
    }

    const headers = new Headers();
    for (const header of FORWARDED_HEADERS) {
      const value = upstream.headers.get(header);
      if (value) {
        headers.set(header, value);
      }
    }
    headers.set("x-model-proxy", "bridal3d");

    return new Response(upstream.body, {
      status: upstream.status,
      headers
    });
  } catch {
    return NextResponse.json({ error: "Unable to proxy model URL" }, { status: 500 });
  }
}
