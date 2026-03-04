import { codeToHtml } from "shiki";
import { CodeViewer } from "./code-viewer";

interface CodeBlockProps {
  code: string;
  language?: string;
  maxLines?: number;
}

function formatContent(code: string, language?: string): string {
  if (language === "json") {
    try {
      return JSON.stringify(JSON.parse(code), null, 2);
    } catch {
      return code;
    }
  }
  return code;
}

export async function CodeBlock({ code, language, maxLines = 50 }: CodeBlockProps) {
  const formatted = formatContent(code, language);
  const lines = formatted.split("\n");
  const truncated = lines.slice(0, maxLines).join("\n");
  const truncatedCount = lines.length > maxLines ? lines.length - maxLines : 0;

  const rawLines = code.split("\n");
  const rawTruncated = rawLines.slice(0, maxLines).join("\n");

  const html = await codeToHtml(truncated, {
    lang: language ?? "text",
    theme: "github-dark-default",
  });

  return (
    <CodeViewer highlightedHtml={html} rawContent={rawTruncated} truncatedCount={truncatedCount} />
  );
}
