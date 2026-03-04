"use client";

import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/video.css";
import "@vidstack/react/player/styles/default/layouts/audio.css";
import { MediaPlayer, MediaProvider } from "@vidstack/react";
import {
  defaultLayoutIcons,
  DefaultVideoLayout,
  DefaultAudioLayout,
} from "@vidstack/react/player/layouts/default";

interface VidstackPlayerProps {
  src: string;
  title: string;
  type: "video" | "audio";
}

export default function VidstackPlayerInner({ src, title, type }: VidstackPlayerProps) {
  return (
    <MediaPlayer
      title={title}
      src={src}
      crossOrigin
      playsInline
      className="vidstack-player"
    >
      <MediaProvider />
      {type === "video" ? (
        <DefaultVideoLayout icons={defaultLayoutIcons} />
      ) : (
        <DefaultAudioLayout icons={defaultLayoutIcons} />
      )}
    </MediaPlayer>
  );
}
