import { ImageResponse } from "next/og";
import { AppIconImage } from "@/lib/pwa/app-icon-image";

export const runtime = "edge";

export async function GET() {
  return new ImageResponse(<AppIconImage size={192} fontSize={76} />, {
    width: 192,
    height: 192,
  });
}
