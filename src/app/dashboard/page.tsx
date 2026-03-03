import { FolderOpen, FileText, HardDrive, Key, Download } from "lucide-react";
import { getAuthToken } from "@/lib/auth/cookies";
import { StatsCard } from "@/components/dashboard/stats-card";
import { formatBytes } from "@/lib/utils";
import type { StatsResponse } from "@/lib/api/client";

export default async function DashboardPage() {
  const token = await getAuthToken();
  const res = await fetch(`${process.env.API_URL}/api/stats`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!res.ok) {
    return (
      <div>
        <h1 className="mb-6 text-2xl font-bold">Dashboard</h1>
        <p className="text-text-muted">Failed to load statistics.</p>
      </div>
    );
  }

  const stats: StatsResponse = await res.json();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <StatsCard icon={FolderOpen} label="Buckets" value={Number(stats.total_buckets ?? 0)} />
        <StatsCard icon={FileText} label="Files" value={Number(stats.total_files ?? 0)} />
        <StatsCard
          icon={HardDrive}
          label="Storage"
          value={formatBytes(Number(stats.total_size ?? 0))}
        />
        <StatsCard icon={Key} label="API Keys" value={Number(stats.total_keys ?? 0)} />
        <StatsCard icon={Download} label="Downloads" value={Number(stats.total_downloads ?? 0)} />
      </div>
    </div>
  );
}
