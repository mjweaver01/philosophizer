import type { ComponentProps } from 'react';
import { memo } from 'react';
import type { Components } from 'streamdown';
import { Streamdown } from 'streamdown';

interface MarkdownRendererProps {
  content: string;
  className?: string;
  variant?: 'default' | 'compact';
}

// Streamdown renders markdown links as <button> elements and images with a
// <button> download overlay. When a link wraps an image ([![alt](img)](url)),
// that produces a <button> nested inside a <button>, which is invalid HTML and
// triggers a React hydration error. Render links as real anchors to avoid the
// nesting while keeping safe external-link behavior.
function MarkdownLink({
  node: _node,
  href,
  children,
  ...props
}: ComponentProps<'a'> & { node?: unknown }) {
  return (
    <a
      {...props}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      data-streamdown="link"
      className="wrap-anywhere font-medium text-primary underline"
    >
      {children}
    </a>
  );
}

const markdownComponents: Components = {
  a: MarkdownLink,
};

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
          components={markdownComponents}
        >
          {content}
        </Streamdown>
      </div>
    );
  }
);
