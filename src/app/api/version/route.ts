import { NextResponse } from "next/server";

export function GET() {
  return NextResponse.json({
    commit: process.env.BUILD_COMMIT ?? "unknown",
    commit_short: process.env.BUILD_COMMIT_SHORT ?? "unknown",
    built_at: process.env.BUILD_TIME ?? "unknown",
  });
}
