import { NextRequest, NextResponse } from "next/server";

export function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  if (!id) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return NextResponse.redirect(new URL(`/buckets/${id}`, request.url));
}
