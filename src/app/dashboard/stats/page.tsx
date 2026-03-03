import { FolderOpen, FileText, HardDrive, Key, Download } from "lucide-react";
import { getAuthToken } from "@/lib/auth/cookies";
import { StatsCard } from "@/components/dashboard/stats-card";
import { Card } from "@/components/ui/card";
import { formatBytes } from "@/lib/utils";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import type { StatsResponse } from "@/lib/api/client";

export default async function StatsPage() {
  const token = await getAuthToken();
  const res = await fetch(`${process.env.API_URL}/api/stats`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!res.ok) {
    return (
      <div>
        <h1 className="mb-6 text-2xl font-bold">Stats</h1>
        <p className="text-text-muted">Failed to load statistics.</p>
      </div>
    );
  }

  const stats: StatsResponse = await res.json();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">System Statistics</h1>

      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <StatsCard
          icon={FolderOpen}
          label="Total Buckets"
          value={Number(stats.total_buckets ?? 0)}
        />
        <StatsCard icon={FileText} label="Total Files" value={Number(stats.total_files ?? 0)} />
        <StatsCard
          icon={HardDrive}
          label="Total Storage"
          value={formatBytes(Number(stats.total_size ?? 0))}
        />
        <StatsCard icon={Key} label="Total API Keys" value={Number(stats.total_keys ?? 0)} />
        <StatsCard
          icon={Download}
          label="Total Downloads"
          value={Number(stats.total_downloads ?? 0)}
        />
      </div>

      <Card>
        <h2 className="mb-4 text-lg font-semibold">Storage by Owner</h2>
        {stats.storage_by_owner.length === 0 ? (
          <p className="text-text-muted">No data available.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Owner</TableHead>
                <TableHead>Buckets</TableHead>
                <TableHead>Files</TableHead>
                <TableHead>Storage</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stats.storage_by_owner.map((owner) => (
                <TableRow key={owner.owner}>
                  <TableCell className="font-medium">{owner.owner}</TableCell>
                  <TableCell className="text-text-muted">
                    {Number(owner.bucket_count ?? 0)}
                  </TableCell>
                  <TableCell className="text-text-muted">{Number(owner.file_count ?? 0)}</TableCell>
                  <TableCell className="text-text-muted">
                    {formatBytes(Number(owner.total_size ?? 0))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}
