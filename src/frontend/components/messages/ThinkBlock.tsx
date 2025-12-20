import { useEffect, useRef } from 'react';

interface ThinkBlockProps {
  content: string;
  isStreaming?: boolean;
}

export function ThinkBlock({ content, isStreaming = false }: ThinkBlockProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isStreaming && contentRef.current) {
      contentRef.current.scrollTop = contentRef.current.scrollHeight;
    }
  }, [content, isStreaming]);

  return (
    <details
      className="my-3 first:mt-0 group bg-surface-secondary border border-border rounded-lg"
      open={isStreaming}
    >
      <summary className="cursor-pointer text-sm text-text-muted hover:text-text flex items-center gap-2 px-3 py-2 transition-colors">
        <svg
          className="w-4 h-4 transition-transform group-open:rotate-90"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
        <span className="font-medium">Reasoning</span>
      </summary>
      <div
        ref={contentRef}
        className="px-3 pb-2 text-sm text-text-secondary whitespace-pre-wrap border-t border-border pt-2 overflow-x-auto max-h-56 overflow-y-auto"
      >
        {content}
      </div>
    </details>
  );
}
