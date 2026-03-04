"use client";

import { useState } from "react";

interface CodeViewerProps {
  highlightedHtml: string;
  rawContent: string;
  truncatedCount?: number;
}

export function CodeViewer({ highlightedHtml, rawContent, truncatedCount }: CodeViewerProps) {
  const [mode, setMode] = useState<"code" | "raw">("code");

  return (
    <div className="rounded-lg border border-border bg-surface">
      <div className="flex items-center justify-end border-b border-border px-3 py-1.5">
        <div className="flex gap-0.5 rounded-md bg-surface-2 p-0.5 text-xs">
          <button
            onClick={() => setMode("code")}
            className={`rounded px-2.5 py-1 transition-colors ${mode === "code" ? "bg-bg text-text" : "text-text-muted hover:text-text"}`}
          >
            Code
          </button>
          <button
            onClick={() => setMode("raw")}
            className={`rounded px-2.5 py-1 transition-colors ${mode === "raw" ? "bg-bg text-text" : "text-text-muted hover:text-text"}`}
          >
            Raw
          </button>
        </div>
      </div>

      {mode === "code" ? (
        <div
          className="[&_pre]:!bg-transparent [&_pre]:overflow-x-auto [&_pre]:p-4 [&_pre]:text-sm [&_pre]:leading-relaxed [&_code]:font-mono"
          dangerouslySetInnerHTML={{ __html: highlightedHtml }}
        />
      ) : (
        <pre className="overflow-x-auto p-4 text-sm leading-relaxed font-mono text-text-muted whitespace-pre">
          {rawContent}
        </pre>
      )}

      {truncatedCount != null && truncatedCount > 0 && (
        <div className="border-t border-border bg-surface-2 px-4 py-2 text-center text-sm text-text-muted">
          {truncatedCount} more lines
        </div>
      )}
    </div>
  );
}
