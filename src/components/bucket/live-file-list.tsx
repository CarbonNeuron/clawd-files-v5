"use client";

import Link from "next/link";
import { ChevronRight, Folder } from "lucide-react";
import { useBucketEvents } from "@/hooks/use-bucket-events";
import { FileList } from "./file-list";
import { FileGrid } from "./file-grid";

interface FileEntry {
  path: string;
  name: string;
  size: number;
  mime_type: string;
  short_code?: string | null;
  short_url?: string | null;
  created_at: string;
  updated_at: string;
}

interface LiveFileListProps {
  bucketId: string;
  initialFiles: FileEntry[];
  viewMode: "list" | "grid";
  currentPath: string;
}

function groupFilesAtPath(files: FileEntry[], currentPath: string) {
  const prefix = currentPath ? currentPath + "/" : "";
  const folderSet = new Set<string>();
  const directFiles: FileEntry[] = [];

  for (const file of files) {
    if (prefix && !file.path.startsWith(prefix)) continue;

    const relativePath = prefix ? file.path.slice(prefix.length) : file.path;
    const slashIndex = relativePath.indexOf("/");

    if (slashIndex === -1) {
      directFiles.push(file);
    } else {
      folderSet.add(relativePath.slice(0, slashIndex));
    }
  }

  return { folders: [...folderSet].sort(), directFiles };
}

function Breadcrumbs({ bucketId, currentPath }: { bucketId: string; currentPath: string }) {
  const segments = currentPath.split("/").filter(Boolean);

  return (
    <nav className="flex items-center gap-1 text-sm text-text-muted mb-3">
      <Link href={`/buckets/${bucketId}`} className="hover:text-text transition-colors">
        root
      </Link>
      {segments.map((segment, i) => {
        const path = segments.slice(0, i + 1).join("/");
        const isLast = i === segments.length - 1;
        return (
          <span key={path} className="flex items-center gap-1">
            <ChevronRight size={14} />
            {isLast ? (
              <span className="text-text font-medium">{segment}</span>
            ) : (
              <Link
                href={`/buckets/${bucketId}?path=${encodeURIComponent(path)}`}
                className="hover:text-text transition-colors"
              >
                {segment}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}

export function LiveFileList({ bucketId, initialFiles, viewMode, currentPath }: LiveFileListProps) {
  const files = useBucketEvents(bucketId, initialFiles);
  const { folders, directFiles } = groupFilesAtPath(files, currentPath);

  return (
    <div>
      {currentPath && <Breadcrumbs bucketId={bucketId} currentPath={currentPath} />}
      {viewMode === "grid" ? (
        <FileGrid bucketId={bucketId} files={directFiles} folders={folders} currentPath={currentPath} />
      ) : (
        <FileList bucketId={bucketId} files={directFiles} folders={folders} currentPath={currentPath} />
      )}
    </div>
  );
}
