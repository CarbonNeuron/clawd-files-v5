interface CodeBlockProps {
  code: string;
  language?: string;
  maxLines?: number;
}

export function CodeBlock({ code, language, maxLines = 50 }: CodeBlockProps) {
  const lines = code.split("\n");
  const truncated = lines.slice(0, maxLines);
  const hasMore = lines.length > maxLines;

  return (
    <div className="overflow-x-auto rounded-lg border border-border bg-surface">
      <pre className="p-4 text-sm leading-relaxed">
        <code className="font-mono" data-language={language}>
          {truncated.map((line, i) => (
            <span key={i} className="flex">
              <span className="mr-4 inline-block w-8 text-right text-text-muted select-none">
                {i + 1}
              </span>
              <span>{line}</span>
            </span>
          ))}
        </code>
      </pre>
      {hasMore && (
        <div className="border-t border-border bg-surface-2 px-4 py-2 text-center text-sm text-text-muted">
          {lines.length - maxLines} more lines
        </div>
      )}
    </div>
  );
}
