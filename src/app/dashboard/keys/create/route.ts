import { NextRequest, NextResponse } from "next/server";
import { getAuthToken } from "@/lib/auth/cookies";

export async function POST(request: NextRequest) {
  const token = await getAuthToken();
  if (!token) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const body = await request.json();
  const res = await fetch(`${process.env.API_URL}/api/keys`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
