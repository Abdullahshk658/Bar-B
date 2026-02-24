import { NextResponse } from "next/server";

const mockModels = [
  "https://huggingface.co/datasets/dylanebert/3dgs/resolve/main/bonsai/bonsai-7k.splat",
  "https://huggingface.co/datasets/dylanebert/3dgs/resolve/main/stump/stump-7k.splat",
  "https://huggingface.co/datasets/dylanebert/3dgs/resolve/main/bicycle/bicycle-7k.splat"
];

export async function POST(request: Request) {
  const body = (await request.json()) as { videoName?: string };

  if (!body.videoName) {
    return NextResponse.json({ error: "videoName is required" }, { status: 400 });
  }

  await new Promise((resolve) => setTimeout(resolve, 2200));

  const selected = mockModels[Math.floor(Math.random() * mockModels.length)];

  return NextResponse.json({
    status: "completed",
    modelUrl: `${selected}?source=${encodeURIComponent(body.videoName)}`
  });
}
