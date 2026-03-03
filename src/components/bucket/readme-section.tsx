import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
    `${apiUrl}/api/buckets/${bucketId}/files/${encodeURIComponent(readmeFile.path)}/content`,
  );

  if (!res.ok) return null;

  const content = await res.text();

  return (
    <section className="rounded-lg border border-border bg-surface p-6">
      <h2 className="mb-4 font-brand text-lg font-semibold">README.md</h2>
      <div className="prose prose-invert max-w-none text-sm leading-relaxed text-text [&_a]:text-link [&_a:hover]:underline [&_h1]:text-xl [&_h1]:font-bold [&_h1]:mt-6 [&_h1]:mb-3 [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:mt-5 [&_h2]:mb-2 [&_h3]:text-base [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-2 [&_p]:mb-3 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-3 [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-3 [&_li]:mb-1 [&_code]:rounded [&_code]:bg-surface-2 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-xs [&_pre]:rounded-lg [&_pre]:bg-surface-2 [&_pre]:p-4 [&_pre]:overflow-x-auto [&_pre]:mb-3 [&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-4 [&_blockquote]:text-text-muted [&_blockquote]:mb-3 [&_table]:w-full [&_table]:border-collapse [&_th]:border [&_th]:border-border [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_td]:border [&_td]:border-border [&_td]:px-3 [&_td]:py-2 [&_hr]:border-border [&_hr]:my-4 [&_img]:max-w-full [&_img]:rounded">
        <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
      </div>
    </section>
  );
}
