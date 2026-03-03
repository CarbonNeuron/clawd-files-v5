import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ code: string }> },
) {
  const { code } = await params;
  return NextResponse.redirect(`${process.env.API_URL}/s/${code}`, { status: 302 });
}
