import { Logo } from '../Logo';

interface EmptyStateProps {
  isInConversation: boolean;
  starterQuestions: string[];
  onStarterQuestion: (question: string) => void;
  selectedPhilosophers?: string[];
  philosopherNames?: string[];
}

export function EmptyState({
  isInConversation,
  starterQuestions,
  onStarterQuestion,
  philosopherNames = [],
}: EmptyStateProps) {
  const getTitle = () => {
    if (philosopherNames.length === 0) {
      return 'Ask anything about philosophy or theology';
    }
    if (philosopherNames.length === 1) {
      return `Ask ${philosopherNames[0]}`;
    }
    if (philosopherNames.length === 2) {
      return `Ask ${philosopherNames[0]} and ${philosopherNames[1]}`;
    }
    // For 3 or more
    const lastPhil = philosopherNames[philosopherNames.length - 1];
    const others = philosopherNames.slice(0, -1).join(', ');
    return `Ask ${others}, and ${lastPhil}`;
  };

  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center py-8">
        <Logo />
        {!isInConversation && (
          <>
            <h2 className="text-3xl font-semibold text-text">{getTitle()}</h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 mt-8 mx-auto">
              {starterQuestions.map(question => (
                <button
                  key={question}
                  onClick={() => onStarterQuestion(question)}
                  className="cursor-pointer p-4 py-3 bg-surface border border-border hover:bg-surface-secondary text-text-secondary hover:text-text rounded-lg text-sm text-left transition-all"
                >
                  {question}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
