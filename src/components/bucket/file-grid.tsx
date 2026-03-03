import Link from "next/link";
import { FileIcon } from "@/components/file/file-icon";
import { Card } from "@/components/ui/card";
import { formatBytes } from "@/lib/utils";

interface FileEntry {
  path: string;
  name: string;
  size: number;
  mime_type: string;
  short_url?: string | null;
  created_at: string;
  updated_at: string;
}

interface FileGridProps {
  bucketId: string;
  files: FileEntry[];
}

export function FileGrid({ bucketId, files }: FileGridProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {files.map((file) => (
        <Link key={file.path} href={`/buckets/${bucketId}/files/${file.path}`}>
          <Card className="h-32 flex flex-col items-center justify-center gap-2 text-center hover:border-accent transition-colors">
            <FileIcon mimeType={file.mime_type} size={28} />
            <span className="text-sm truncate w-full px-2">{file.name}</span>
            <span className="text-xs text-text-muted">{formatBytes(file.size)}</span>
          </Card>
        </Link>
      ))}
    </div>
  );
}
