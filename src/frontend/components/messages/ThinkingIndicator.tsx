import { MessageAvatar } from './MessageAvatar';

export function ThinkingIndicator() {
  return (
    <div className="pt-8 pb-12">
      <div className="max-w-3xl mx-auto">
        <div className="flex gap-4">
          <MessageAvatar role="assistant" />
          <div className="flex-1 min-w-0 mt-3">
            <div className="flex items-center gap-2 text-text-muted">
              <div className="flex gap-1">
                <span
                  className="w-2 h-2 bg-text-muted rounded-full animate-bounce"
                  style={{ animationDelay: '0ms' }}
                ></span>
                <span
                  className="w-2 h-2 bg-text-muted rounded-full animate-bounce"
                  style={{ animationDelay: '150ms' }}
                ></span>
                <span
                  className="w-2 h-2 bg-text-muted rounded-full animate-bounce"
                  style={{ animationDelay: '300ms' }}
                ></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
