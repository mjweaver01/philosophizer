import { memo } from 'react';
import { Streamdown } from 'streamdown';

interface MarkdownRendererProps {
  content: string;
  className?: string;
  variant?: 'default' | 'compact';
}

export const MarkdownRenderer = memo(
  ({
    content,
    className = 'text-text',
    variant = 'default',
  }: MarkdownRendererProps) => {
    const isCompact = variant === 'compact';

    return (
      <div
        className={`${className} [&>*:first-child]:mt-0 [&>*:last-child]:mb-0`}
      >
        <Streamdown
          className={`size-full markdown-content ${isCompact ? 'compact' : 'default'}`}
        >
          {content}
        </Streamdown>
      </div>
    );
  }
);
