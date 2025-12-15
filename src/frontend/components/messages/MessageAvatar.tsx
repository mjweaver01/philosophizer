interface MessageAvatarProps {
  role: 'user' | 'assistant';
}

export function MessageAvatar({ role }: MessageAvatarProps) {
  return (
    <div className="shrink-0">
      <div
        className={`w-8 h-8 rounded-sm flex items-center justify-center text-white text-sm font-semibold ${
          role === 'user' ? 'bg-gray-700' : 'bg-green-600'
        }`}
      >
        {role === 'user' ? 'U' : 'AI'}
      </div>
    </div>
  );
}

