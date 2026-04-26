/**
 * Question generation utility for HQE (Hypothetical Question Embeddings)
 * Generates hypothetical questions that each chunk would answer
 */

import { generateText } from 'ai';
import { LLM_MODEL } from '../../constants/providers';
import { QUESTION_GENERATION_PROMPT } from '../../constants/prompts';
import { QUESTIONS_PER_CHUNK } from '../../constants/rag';
import { getModelProviderById } from '../../utils/providers';

/**
 * Generate hypothetical questions for a text chunk
 */
export async function generateQuestions(chunkText: string): Promise<string[]> {
  try {
    const modelProvider = await getModelProviderById(LLM_MODEL);

    if (!modelProvider) {
      throw new Error(`Model provider '${LLM_MODEL}' not found`);
    }
    if (!modelProvider.available) {
      throw new Error(`Model provider '${LLM_MODEL}' is not available`);
    }

    const userPrompt = `Text:\n${chunkText}\n\nGenerate ${QUESTIONS_PER_CHUNK} questions that this text would answer:`;

    const result = await generateText({
      model: modelProvider.model,
      messages: [
        { role: 'system', content: QUESTION_GENERATION_PROMPT },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      topP: 0.9,
    });

    const { text } = result;

    return parseQuestions(text);
  } catch (err) {
    console.error('  Error generating questions:', err);
    // Return fallback generic question if generation fails
    return [
      `What philosophical or theological concept does this text discuss about ${extractKeyPhrase(chunkText)}?`,
    ];
  }
}

/**
 * Parse the LLM output to extract individual questions
 */
function parseQuestions(text: string): string[] {
  const questions: string[] = [];

  // Remove the prompt if it's still in the output
  let cleanText = text
    .replace(/Text:|Questions?:|Generate \d+ questions/gi, '')
    .trim();

  // Split by line and extract numbered questions
  const lines = cleanText.split('\n');

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Match numbered questions (e.g., "1.", "1)", "Question 1:", etc.)
    const match = trimmed.match(/^\d+[.):\-\s]+(.+)/);
    if (match && match[1]) {
      const question = match[1].trim();
      if (question.length > 10) {
        // Basic quality filter
        questions.push(question);
      }
    } else if (trimmed.endsWith('?') && trimmed.length > 10) {
      // Also accept lines that end with ? (might not be numbered)
      questions.push(trimmed);
    }
  }

  // Ensure we have at least one question
  if (questions.length === 0) {
    // If parsing failed, try to split by question marks
    const qMarks = cleanText.split('?').filter(q => q.trim().length > 10);
    questions.push(
      ...qMarks.slice(0, QUESTIONS_PER_CHUNK).map(q => q.trim() + '?')
    );
  }

  // Limit to requested number of questions
  return questions.slice(0, QUESTIONS_PER_CHUNK);
}

/**
 * Extract a key phrase from text for fallback question generation
 */
function extractKeyPhrase(text: string): string {
  // Try to find a meaningful phrase from the first sentence
  const firstSentence = text.split(/[.!?]/)[0] || text;
  const words = firstSentence.trim().split(/\s+/);

  // Return first 3-5 words as a key phrase
  const phraseLength = Math.min(5, Math.max(3, words.length));
  return words.slice(0, phraseLength).join(' ').toLowerCase();
}
