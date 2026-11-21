import { NextResponse } from "next/server";

export async function GET() {
  const downloadCdnUrl =
    process.env.OPENLOCK_DOWNLOAD_URL ||
    "https://download.alam-alsiana.com/OpenLock-PRO-Setup.exe";

  // Redirect cleanly with download intent or forward to dedicated CDN storage
  return NextResponse.redirect(downloadCdnUrl, {
    status: 307,
    headers: {
      "Content-Disposition": 'attachment; filename="OpenLock-PRO-Setup.exe"',
      "Cache-Control": "public, max-age=300, stale-while-revalidate=600",
      "X-Release-Version": "v1.0.0",
      "X-Product-Name": "OpenLock PRO Tool",
    },
  });
}
