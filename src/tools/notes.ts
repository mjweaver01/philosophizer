import { tool } from 'ai';
import { z } from 'zod';

// In-memory storage for research notes during a session
const researchNotes = new Map<string, { note: string; timestamp: Date }[]>();

export const saveNote = tool({
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
    const normalizedTopic = topic.toLowerCase().trim();
    const existing = researchNotes.get(normalizedTopic) || [];

    existing.push({
      note: note.trim(),
      timestamp: new Date(),
    });

    researchNotes.set(normalizedTopic, existing);

    const totalNotes = Array.from(researchNotes.values()).reduce(
      (sum, notes) => sum + notes.length,
      0
    );

    return `✓ Saved note under "${topic}" (${existing.length} notes in this topic, ${totalNotes} total notes)`;
  },
});

export const recallNotes = tool({
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
    if (researchNotes.size === 0) {
      return 'No notes have been saved yet.';
    }

    if (topic) {
      const normalizedTopic = topic.toLowerCase().trim();
      const notes = researchNotes.get(normalizedTopic);

      if (!notes || notes.length === 0) {
        const availableTopics = Array.from(researchNotes.keys());
        return `No notes found for "${topic}". Available topics: ${availableTopics.join(', ')}`;
      }

      let output = `## Notes: ${topic}\n\n`;
      notes.forEach((entry, i) => {
        output += `${i + 1}. ${entry.note}\n`;
      });

      return output;
    }

    // Return all notes organized by topic
    let output = '## All Research Notes\n\n';

    for (const [topicName, notes] of researchNotes.entries()) {
      output += `### ${topicName}\n`;
      notes.forEach((entry, i) => {
        output += `${i + 1}. ${entry.note}\n`;
      });
      output += '\n';
    }

    const totalNotes = Array.from(researchNotes.values()).reduce(
      (sum, notes) => sum + notes.length,
      0
    );
    output += `---\n*Total: ${totalNotes} notes across ${researchNotes.size} topics*`;

    return output;
  },
});

// Utility to clear notes (useful between research sessions)
export const clearNotes = tool({
  description:
    'Clear all saved notes. Use this at the start of a new research task to start fresh.',
  inputSchema: z.object({}),
  execute: async () => {
    const count = Array.from(researchNotes.values()).reduce(
      (sum, notes) => sum + notes.length,
      0
    );
    researchNotes.clear();
    return `Cleared ${count} notes. Ready for new research.`;
  },
});
