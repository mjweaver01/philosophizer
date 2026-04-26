import { tool } from 'ai';
import { z } from 'zod';

type NoteEntry = { note: string; timestamp: Date };

/** topic (normalized) -> notes, scoped per user and optional conversation */
const researchNotesByScope = new Map<string, Map<string, NoteEntry[]>>();

function getTopicStore(scopeKey: string): Map<string, NoteEntry[]> {
  let inner = researchNotesByScope.get(scopeKey);
  if (!inner) {
    inner = new Map();
    researchNotesByScope.set(scopeKey, inner);
  }
  return inner;
}

/**
 * Research note tools scoped to a user (and optionally a conversation) so
 * notes never leak across tenants or unrelated chats.
 */
export function createNotesTools(userId: string, conversationId?: string) {
  const scopeKey = `${userId}:${conversationId ?? 'none'}`;

  const saveNote = tool({
    description:
      'Save an important finding, fact, or insight during research. Use this to keep track of key information that should be referenced later when synthesizing your final answer.',
    inputSchema: z.object({
      topic: z
        .string()
        .describe(
          'A category or topic label for this note (e.g., "key facts", "statistics", "sources", "contradictions")'
        ),
      note: z
        .string()
        .describe(
          'The important finding, fact, or insight to save. Be specific and include source information if available.'
        ),
    }),
    execute: async ({ topic, note }) => {
      const store = getTopicStore(scopeKey);
      const normalizedTopic = topic.toLowerCase().trim();
      const existing = store.get(normalizedTopic) || [];

      existing.push({
        note: note.trim(),
        timestamp: new Date(),
      });

      store.set(normalizedTopic, existing);

      const totalNotes = Array.from(store.values()).reduce(
        (sum, notes) => sum + notes.length,
        0
      );

      return `Saved note under "${topic}" (${existing.length} notes in this topic, ${totalNotes} total notes in this session)`;
    },
  });

  const recallNotes = tool({
    description:
      'Recall saved notes from your research. Use this to review what you have learned before synthesizing your final answer.',
    inputSchema: z.object({
      topic: z
        .string()
        .optional()
        .describe(
          'Optional: specific topic to recall notes for. If not provided, returns all saved notes.'
        ),
    }),
    execute: async ({ topic }) => {
      const store = getTopicStore(scopeKey);
      if (store.size === 0) {
        return 'No notes have been saved yet.';
      }

      if (topic) {
        const normalizedTopic = topic.toLowerCase().trim();
        const notes = store.get(normalizedTopic);

        if (!notes || notes.length === 0) {
          const availableTopics = Array.from(store.keys());
          return `No notes found for "${topic}". Available topics: ${availableTopics.join(', ')}`;
        }

        let output = `## Notes: ${topic}\n\n`;
        notes.forEach((entry, i) => {
          output += `${i + 1}. ${entry.note}\n`;
        });

        return output;
      }

      let output = '## All Research Notes\n\n';

      for (const [topicName, notes] of store.entries()) {
        output += `### ${topicName}\n`;
        notes.forEach((entry, i) => {
          output += `${i + 1}. ${entry.note}\n`;
        });
        output += '\n';
      }

      const totalNotes = Array.from(store.values()).reduce(
        (sum, notes) => sum + notes.length,
        0
      );
      output += `---\n*Total: ${totalNotes} notes across ${store.size} topics*`;

      return output;
    },
  });

  const clearNotes = tool({
    description:
      'Clear all saved notes for this chat session. Use this at the start of a new research task to start fresh.',
    inputSchema: z.object({}),
    execute: async () => {
      const store = getTopicStore(scopeKey);
      const count = Array.from(store.values()).reduce(
        (sum, notes) => sum + notes.length,
        0
      );
      store.clear();
      return `Cleared ${count} notes. Ready for new research.`;
    },
  });

  return { saveNote, recallNotes, clearNotes };
}
