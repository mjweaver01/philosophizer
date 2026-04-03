import type { ComponentProps, ReactNode } from 'react';
import { useCallback } from 'react';
import { StickToBottom, useStickToBottomContext } from 'use-stick-to-bottom';

function ScrollButton() {
  const { isAtBottom, scrollToBottom } = useStickToBottomContext();

  const handleScrollToBottom = useCallback(() => {
    scrollToBottom();
  }, [scrollToBottom]);

  if (isAtBottom) return null;

  return (
    <button
      className="absolute bottom-4 left-[50%] translate-x-[-50%] rounded-full flex items-center justify-center w-9 h-9 bg-surface border border-border hover:bg-surface-secondary text-text-muted hover:text-text transition-all focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
      onClick={handleScrollToBottom}
      type="button"
      data-title="Scroll to bottom"
      aria-label="Scroll to bottom"
      data-tooltip-position="top"
    >
      <svg
        width="17"
        height="17"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 5v14" />
        <path d="m19 12-7 7-7-7" />
      </svg>
    </button>
  );
}

export function Conversation({
  className,
  showScrollButton = true,
  children,
  ...props
}: Omit<ComponentProps<typeof StickToBottom>, 'children'> & {
  showScrollButton?: boolean;
  children?: ReactNode;
}) {
  return (
    <StickToBottom
      className={`relative flex-1 overflow-hidden${className ? ` ${className}` : ''}`}
      initial="smooth"
      resize="smooth"
      role="log"
      {...props}
    >
      {children}
      {showScrollButton && <ScrollButton />}
    </StickToBottom>
  );
}

export function ConversationContent({
  className,
  ...props
}: ComponentProps<typeof StickToBottom.Content>) {
  return <StickToBottom.Content className={className} {...props} />;
}
