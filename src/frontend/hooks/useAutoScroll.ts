import { useRef, useEffect, useCallback } from 'react';

const AUTO_SCROLL_THRESHOLD = 50;

export function useAutoScroll<T>(dependency: T) {
  const scrollEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const shouldAutoScrollRef = useRef(true);
  const userScrollingRef = useRef(false);

  const scrollToBottom = useCallback(() => {
    if (shouldAutoScrollRef.current && !userScrollingRef.current) {
      scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  const handleScroll = useCallback(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;

    if (distanceFromBottom > AUTO_SCROLL_THRESHOLD) {
      shouldAutoScrollRef.current = false;
      userScrollingRef.current = true;
    } else {
      shouldAutoScrollRef.current = true;
      userScrollingRef.current = false;
    }
  }, []);

  const enableAutoScroll = useCallback(() => {
    shouldAutoScrollRef.current = true;
    userScrollingRef.current = false;
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [dependency, scrollToBottom]);

  return {
    scrollEndRef,
    scrollContainerRef,
    handleScroll,
    enableAutoScroll,
  };
}
