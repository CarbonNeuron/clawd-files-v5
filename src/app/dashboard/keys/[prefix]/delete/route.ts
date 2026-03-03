import { NextRequest, NextResponse } from "next/server";
import { getAuthToken } from "@/lib/auth/cookies";

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ prefix: string }> },
) {
  const token = await getAuthToken();
  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { prefix } = await params;
  const res = await fetch(`${process.env.API_URL}/api/keys/${prefix}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  if (res.status === 204) {
    return new NextResponse(null, { status: 204 });
  }

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
