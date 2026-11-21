import { NextResponse } from "next/server";
import { readFileSync, existsSync } from "fs";
import { join } from "path";

export async function GET() {
  const filePath = join(process.cwd(), "public", "downloads", "OpenLock-PRO-Setup.exe");

  if (existsSync(filePath)) {
    const fileBuffer = readFileSync(filePath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Disposition": 'attachment; filename="OpenLock-PRO-Setup.exe"',
        "Content-Type": "application/octet-stream",
        "Content-Length": fileBuffer.length.toString(),
        "Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
        "X-Product-Name": "OpenLock PRO Tool",
        "X-Release-Version": "v1.0.0",
      },
    });
  }

  // Fallback to static route
  return NextResponse.redirect("/downloads/OpenLock-PRO-Setup.exe", {
    status: 302,
  });
}
