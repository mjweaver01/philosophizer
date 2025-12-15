interface UserMessageProps {
  message: any;
}

export function UserMessage({ message }: UserMessageProps) {
  const content =
    'parts' in message
      ? message.parts
          .map((part: any) => (part.type === 'text' ? part.text : ''))
          .join('')
      : message.content;

  return (
    <div className="text-text whitespace-pre-wrap leading-7">{content}</div>
  );
}
