import { MarkdownRenderer } from "@/components/file/markdown-renderer";
import { encodeFilePath } from "@/lib/utils";

interface FileEntry {
  path: string;
  name: string;
  size: number;
  mime_type: string;
  short_url?: string | null;
  created_at: string;
  updated_at: string;
}

interface ReadmeSectionProps {
  bucketId: string;
  files: FileEntry[];
}

export async function ReadmeSection({ bucketId, files }: ReadmeSectionProps) {
  const readmeFile = files.find((f) => f.name.toLowerCase() === "readme.md");

  if (!readmeFile) return null;

  const apiUrl = process.env.API_URL;
  const res = await fetch(
    `${apiUrl}/api/buckets/${bucketId}/files/${encodeFilePath(readmeFile.path)}/content`,
  );

  if (!res.ok) return null;

  const content = await res.text();
  const basePath = readmeFile.path.includes("/")
    ? readmeFile.path.split("/").slice(0, -1).join("/")
    : "";

  return (
    <div>
      <h2 className="mb-4 font-brand text-lg font-semibold">README.md</h2>
      <MarkdownRenderer content={content} bucketId={bucketId} basePath={basePath} />
    </div>
  );
}
