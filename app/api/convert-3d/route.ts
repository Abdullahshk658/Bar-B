import { NextResponse } from "next/server";

const mockModels = [
  "https://huggingface.co/datasets/dylanebert/3dgs/resolve/main/bonsai/bonsai-7k-mini.splat",
  "https://huggingface.co/datasets/dylanebert/3dgs/resolve/main/bicycle/bicycle-7k-mini.splat",
  "https://huggingface.co/datasets/dylanebert/3dgs/resolve/main/stump/input.ply",
  "https://huggingface.co/datasets/dylanebert/3dgs/resolve/main/luigi/luigi.ply"
];

export async function POST(request: Request) {
  const body = (await request.json()) as { videoName?: string };

  if (!body.videoName) {
    return NextResponse.json({ error: "videoName is required" }, { status: 400 });
  }

  await new Promise((resolve) => setTimeout(resolve, 2200));

  const selected = mockModels[Math.floor(Math.random() * mockModels.length)];
  const separator = selected.includes("?") ? "&" : "?";

  return NextResponse.json({
    status: "completed",
    modelUrl: `${selected}${separator}source=${encodeURIComponent(body.videoName)}`
  });
}
