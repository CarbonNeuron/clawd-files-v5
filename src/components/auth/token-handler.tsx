"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function TokenHandler() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) return;

    fetch("/auth/set-token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    }).then((res) => {
      if (res.ok) {
        router.replace("/dashboard");
      } else {
        router.replace("/");
      }
    });
  }, [searchParams, router]);

  return null;
}
