import { Actions, Action } from '../ui/Action';

interface MessageActionsProps {
  onRegenerate?: () => void;
  textContent: string;
}

export function MessageActions({
  onRegenerate,
  textContent,
}: MessageActionsProps) {
  return (
    <Actions>
      <Action
        className="cursor-pointer"
        onClick={() => onRegenerate?.()}
        label="Retry"
      >
        <svg
          className="size-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 2v6h-6" />
          <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
          <path d="M3 22v-6h6" />
          <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
        </svg>
      </Action>
      <Action
        className="cursor-pointer"
        onClick={() => navigator.clipboard.writeText(textContent)}
        label="Copy"
      >
        <svg
          className="size-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      </Action>
    </Actions>
  );
}
