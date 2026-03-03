import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

interface MarkdownRendererProps {
  content: string;
  bucketId: string;
  basePath?: string;
}

function resolvePath(href: string, basePath: string): string {
  if (href.startsWith("/") || href.startsWith("http://") || href.startsWith("https://")) {
    return href;
  }
  // Resolve relative path against basePath
  const parts = basePath.replace(/\/$/, "").split("/").filter(Boolean);
  const hrefParts = href.split("/");
  for (const part of hrefParts) {
    if (part === "..") {
      parts.pop();
    } else if (part !== ".") {
      parts.push(part);
    }
  }
  return parts.join("/");
}

export function MarkdownRenderer({ content, bucketId, basePath = "" }: MarkdownRendererProps) {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "";

  const components: Components = {
    a: ({ href, children, ...props }) => {
      if (href && !href.startsWith("http://") && !href.startsWith("https://") && !href.startsWith("#")) {
        const resolved = resolvePath(href, basePath);
        return (
          <a href={`/buckets/${bucketId}/files/${resolved}`} className="text-accent hover:underline" {...props}>
            {children}
          </a>
        );
      }
      return (
        <a href={href} className="text-accent hover:underline" target="_blank" rel="noopener noreferrer" {...props}>
          {children}
        </a>
      );
    },
    img: ({ src, alt, ...props }) => {
      let imgSrc: string | undefined = typeof src === "string" ? src : undefined;
      if (imgSrc && !imgSrc.startsWith("http://") && !imgSrc.startsWith("https://") && !imgSrc.startsWith("data:")) {
        const resolved = resolvePath(imgSrc, basePath);
        imgSrc = `${apiUrl}/api/buckets/${bucketId}/files/${encodeURIComponent(resolved)}/content`;
      }
      // eslint-disable-next-line @next/next/no-img-element
      return <img src={imgSrc} alt={alt ?? ""} className="max-w-full rounded" {...props} />;
    },
    code: ({ className, children, ...props }) => {
      const isInline = !className;
      if (isInline) {
        return (
          <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-sm text-accent" {...props}>
            {children}
          </code>
        );
      }
      return (
        <code className={`block overflow-x-auto rounded-lg bg-surface p-4 font-mono text-sm ${className ?? ""}`} {...props}>
          {children}
        </code>
      );
    },
    pre: ({ children, ...props }) => {
      return (
        <pre className="overflow-x-auto rounded-lg border border-border bg-surface" {...props}>
          {children}
        </pre>
      );
    },
  };

  return (
    <div className="prose prose-invert max-w-none space-y-4 text-text [&_h1]:text-2xl [&_h1]:font-bold [&_h1]:text-text [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:text-text [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-text [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_li]:my-1 [&_blockquote]:border-l-4 [&_blockquote]:border-accent [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-text-muted [&_table]:w-full [&_table]:border-collapse [&_th]:border [&_th]:border-border [&_th]:bg-surface-2 [&_th]:px-3 [&_th]:py-2 [&_th]:text-left [&_td]:border [&_td]:border-border [&_td]:px-3 [&_td]:py-2 [&_hr]:border-border">
      <Markdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </Markdown>
    </div>
  );
}
