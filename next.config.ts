import type { NextConfig } from "next";
import { execSync } from "child_process";

function git(cmd: string): string {
  try {
    return execSync(`git ${cmd}`, { encoding: "utf-8" }).trim();
  } catch {
    return "unknown";
  }
}

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [{ protocol: "http", hostname: "localhost" }],
  },
  env: {
    BUILD_COMMIT: git("rev-parse HEAD"),
    BUILD_COMMIT_SHORT: git("rev-parse --short HEAD"),
    BUILD_TIME: new Date().toISOString(),
  },
};

export default nextConfig;
