"use client";

import { lazy, Suspense } from "react";

interface VidstackPlayerProps {
  src: string;
  title: string;
  type: "video" | "audio";
}

const Player = lazy(() => import("./media-player-inner"));

function LoadingSpinner() {
  return (
    <div className="flex h-64 items-center justify-center rounded-lg bg-surface">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
    </div>
  );
}

export function VidstackPlayer(props: VidstackPlayerProps) {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Player {...props} />
    </Suspense>
  );
}
