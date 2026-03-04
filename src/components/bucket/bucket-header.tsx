import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatBytes, formatExpiry } from "@/lib/utils";

interface BucketHeaderProps {
  id: string;
  name: string;
  description?: string | null;
  fileCount: number;
  totalSize: number;
  expiresAt?: string | null;
}

export function BucketHeader({
  id,
  name,
  description,
  fileCount,
  totalSize,
  expiresAt,
}: BucketHeaderProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div className="space-y-2">
        <h1 className="font-brand text-2xl font-bold">{name}</h1>
        {description && <p className="text-text-muted">{description}</p>}
        <div className="flex flex-wrap items-center gap-2 text-sm text-text-muted">
          <Badge>
            {fileCount} {fileCount === 1 ? "file" : "files"}
          </Badge>
          <Badge>{formatBytes(totalSize)}</Badge>
          {expiresAt && (
            <Badge
              variant={
                new Date(expiresAt).getTime() - Date.now() < 1000 * 60 * 60 * 24
                  ? "danger"
                  : "default"
              }
            >
              {formatExpiry(expiresAt)}
            </Badge>
          )}
        </div>
      </div>
      <a href={`/buckets/${id}/zip`} download>
        <Button variant="primary">
          <Download size={16} />
          Download ZIP
        </Button>
      </a>
    </div>
  );
}
