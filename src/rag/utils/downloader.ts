/**
 * Utility for downloading texts from Project Gutenberg and other sources
 */

import { mkdir, writeFile, exists } from 'fs/promises';
import { join } from 'path';
import type { TextSource } from '../sources';

const TEXTS_DIR = join(import.meta.dir, '..', 'texts');

/**
 * Ensure the texts directory exists
 */
async function ensureTextsDir(): Promise<void> {
  if (!(await exists(TEXTS_DIR))) {
    await mkdir(TEXTS_DIR, { recursive: true });
  }
}

/**
 * Clean Gutenberg text by removing header/footer boilerplate
 */
function cleanGutenbergText(text: string): string {
  // Find the start of the actual content (after Gutenberg header)
  const startMarkers = [
    '*** START OF THE PROJECT GUTENBERG EBOOK',
    '*** START OF THIS PROJECT GUTENBERG EBOOK',
    '*END*THE SMALL PRINT',
    '***START OF THE PROJECT GUTENBERG EBOOK',
  ];

  const endMarkers = [
    '*** END OF THE PROJECT GUTENBERG EBOOK',
    '*** END OF THIS PROJECT GUTENBERG EBOOK',
    '***END OF THE PROJECT GUTENBERG EBOOK',
    'End of the Project Gutenberg EBook',
    'End of Project Gutenberg',
  ];

  let content = text;

  // Find and remove header
  for (const marker of startMarkers) {
    const startIndex = content.indexOf(marker);
    if (startIndex !== -1) {
      // Find the end of the line containing the marker
      const lineEnd = content.indexOf('\n', startIndex);
      if (lineEnd !== -1) {
        content = content.substring(lineEnd + 1);
      }
      break;
    }
  }

  // Find and remove footer
  for (const marker of endMarkers) {
    const endIndex = content.indexOf(marker);
    if (endIndex !== -1) {
      content = content.substring(0, endIndex);
      break;
    }
  }

  // Clean up excessive whitespace
  content = content
    .replace(/\r\n/g, '\n') // Normalize line endings
    .replace(/\n{4,}/g, '\n\n\n') // Max 3 newlines
    .trim();

  return content;
}

/**
 * Download a single text source
 */
export async function downloadText(
  source: TextSource
): Promise<{ success: boolean; path?: string; error?: string }> {
  await ensureTextsDir();

  const filePath = join(TEXTS_DIR, `${source.id}.txt`);

  // Check if already downloaded
  if (await exists(filePath)) {
    console.log(`✓ Already downloaded: ${source.title}`);
    return { success: true, path: filePath };
  }

  try {
    console.log(`⬇ Downloading: ${source.title}...`);

    const response = await fetch(source.url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; PhilosopherRAG/1.0; Educational)',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    let text = await response.text();

    // Clean Gutenberg texts
    if (source.url.includes('gutenberg.org')) {
      text = cleanGutenbergText(text);
    }

    // Write to file
    await writeFile(filePath, text, 'utf-8');

    console.log(`✓ Downloaded: ${source.title} (${text.length} chars)`);
    return { success: true, path: filePath };
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error(`✗ Failed to download ${source.title}: ${errorMsg}`);
    return { success: false, error: errorMsg };
  }
}

/**
 * Download multiple text sources
 */
export async function downloadTexts(
  sources: TextSource[]
): Promise<{ downloaded: number; failed: number; errors: string[] }> {
  const results = { downloaded: 0, failed: 0, errors: [] as string[] };

  for (const source of sources) {
    const result = await downloadText(source);
    if (result.success) {
      results.downloaded++;
    } else {
      results.failed++;
      results.errors.push(`${source.title}: ${result.error}`);
    }

    // Be nice to Gutenberg servers - small delay between requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  return results;
}

/**
 * Read a downloaded text file
 */
export async function readDownloadedText(
  sourceId: string
): Promise<string | null> {
  const filePath = join(TEXTS_DIR, `${sourceId}.txt`);

  if (!(await exists(filePath))) {
    return null;
  }

  const file = Bun.file(filePath);
  return await file.text();
}

/**
 * Get the path to a downloaded text file
 */
export function getTextPath(sourceId: string): string {
  return join(TEXTS_DIR, `${sourceId}.txt`);
}

/**
 * Check if a text has been downloaded
 */
export async function isTextDownloaded(sourceId: string): Promise<boolean> {
  const filePath = join(TEXTS_DIR, `${sourceId}.txt`);
  return await exists(filePath);
}
