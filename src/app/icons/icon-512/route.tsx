import { ImageResponse } from "next/og";
import { AppIconImage } from "@/lib/pwa/app-icon-image";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(<AppIconImage size={512} fontSize={200} />, {
    width: 512,
    height: 512,
  });
}
