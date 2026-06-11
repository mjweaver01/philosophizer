import type { ComponentProps, ReactNode } from 'react';
import { useCallback, useEffect } from 'react';
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

function ScrollToBottomTrigger({ trigger }: { trigger?: number }) {
  const { scrollToBottom, state } = useStickToBottomContext();

  useEffect(() => {
    if (trigger) {
      // use-stick-to-bottom sets `escapedFromLock` when it detects a scroll-up
      // (real scroll, trackpad/wheel momentum, or text selection mid-stream) and
      // never clears it on its own — only a remount does. `scrollToBottom()`
      // re-pins via `isAtBottom` but leaves `escapedFromLock` set, so a single
      // escape leaks across turns and stops the view from following subsequent
      // streamed responses until the page is refreshed. Clear it here so each new
      // turn starts from a clean, locked-to-bottom state.
      state.escapedFromLock = false;
      scrollToBottom();
    }
  }, [trigger]);

  return null;
}

export function Conversation({
  className,
  showScrollButton = true,
  scrollToBottomTrigger,
  children,
  ...props
}: Omit<ComponentProps<typeof StickToBottom>, 'children'> & {
  showScrollButton?: boolean;
  scrollToBottomTrigger?: number;
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
      <ScrollToBottomTrigger trigger={scrollToBottomTrigger} />
      {showScrollButton && <ScrollButton />}
    </StickToBottom>
  );
}

export function ConversationContent({
  className,
  scrollClassName,
  ...props
}: ComponentProps<typeof StickToBottom.Content>) {
  // `overflow-anchor: none` disables the browser's native scroll anchoring on
  // the scroll container. use-stick-to-bottom pins to the bottom by writing
  // scrollTop manually; without this, native anchoring corrects the same height
  // delta during streaming and the two fight, causing the scroll to jump/lurch.
  const mergedScrollClassName = scrollClassName
    ? `[overflow-anchor:none] ${scrollClassName}`
    : '[overflow-anchor:none]';

  return (
    <StickToBottom.Content
      className={className}
      scrollClassName={mergedScrollClassName}
      {...props}
    />
  );
}
