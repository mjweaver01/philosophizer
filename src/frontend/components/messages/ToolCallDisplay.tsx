interface ToolCallDisplayProps {
  toolName: string;
  isCompleted: boolean;
  hasError: boolean;
  input?: any;
  output?: any;
}

export function ToolCallDisplay({
  toolName,
  isCompleted,
  hasError,
  input,
  output,
}: ToolCallDisplayProps) {
  const containerClass = hasError
    ? 'bg-error-bg border border-error-border'
    : isCompleted
      ? 'bg-success-bg border border-success-border'
      : 'bg-info-bg border border-info-border';

  const textColorClass = hasError
    ? 'text-error-text'
    : isCompleted
      ? 'text-success-text'
      : 'text-info-text';

  const iconColorClass = hasError
    ? 'text-error'
    : isCompleted
      ? 'text-success'
      : 'text-info';

  const statusText = hasError
    ? 'Tool failed'
    : isCompleted
      ? 'Tool completed'
      : 'Calling tool';

  return (
    <details
      className={`my-3 first:mt-0 group rounded-lg ${containerClass}`}
      open={!isCompleted}
    >
      <summary className="cursor-pointer flex items-center gap-2 px-3 py-2 text-sm transition-colors hover:opacity-80">
        <svg
          className={`w-4 h-4 ${iconColorClass} transition-transform group-open:rotate-90 shrink-0`}
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
        <div className="flex items-center gap-2 flex-1">
          {hasError ? (
            <svg
              className={`w-4 h-4 ${iconColorClass} shrink-0`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          ) : isCompleted ? (
            <svg
              className={`w-4 h-4 ${iconColorClass} shrink-0`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          ) : (
            <svg
              className={`w-4 h-4 ${iconColorClass} animate-spin shrink-0`}
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          )}
          <span className={`font-medium ${textColorClass}`}>
            {statusText}: {toolName}
          </span>
        </div>
      </summary>

      <div className="px-4 pb-3 border-t border-border pt-3">
        {/* Input parameters */}
        {input && (
          <div className="mb-3">
            <div className="text-xs text-text-muted mb-1">Input:</div>
            <div
              className={`text-xs font-mono px-2 py-1 rounded overflow-x-auto ${textColorClass} ${containerClass}`}
            >
              {typeof input === 'string'
                ? input
                : JSON.stringify(input, null, 2)}
            </div>
          </div>
        )}

        {/* Output/Result */}
        {output && output !== 'undefined ' && (
          <div>
            <div className="text-xs text-text-muted mb-1">Output:</div>
            <div
              className={`text-xs font-mono px-2 py-1 rounded overflow-x-auto max-h-48 overflow-y-auto ${textColorClass} ${containerClass}`}
            >
              {typeof output === 'string'
                ? output
                : JSON.stringify(output, null, 2)}
            </div>
          </div>
        )}
      </div>
    </details>
  );
}
