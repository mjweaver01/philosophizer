#!/usr/bin/env bun
/**
 * Script to download and index philosopher texts into the vector store
 *
 * Usage:
 *   bun run src/rag/scripts/indexTexts.ts                    # Index all texts
 *   bun run src/rag/scripts/indexTexts.ts --philosopher plato  # Index specific philosopher
 *   bun run src/rag/scripts/indexTexts.ts --source plato-republic  # Index specific source
 *   bun run src/rag/scripts/indexTexts.ts --clear            # Clear and reindex everything
 *   bun run src/rag/scripts/indexTexts.ts --stats            # Show collection stats
 */

import {
  TEXT_SOURCES,
  getSourcesByPhilosopher,
  type TextSource,
} from '../sources';
import { downloadText, readDownloadedText } from '../utils/downloader';
import { createChunksWithMetadata, getChunkStats } from '../utils/chunker';
import {
  addChunks,
  isSourceIndexed,
  clearCollection,
  getCollectionStats,
} from '../utils/vectorStore';
import 'dotenv/config';

interface IndexOptions {
  philosopher?: string;
  sourceId?: string;
  clear?: boolean;
  stats?: boolean;
  force?: boolean;
}

/**
 * Parse command line arguments
 */
function parseArgs(): IndexOptions {
  const args = process.argv.slice(2);
  const options: IndexOptions = {};

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    switch (arg) {
      case '--philosopher':
      case '-p':
        options.philosopher = args[++i];
        break;
      case '--source':
      case '-s':
        options.sourceId = args[++i];
        break;
      case '--clear':
      case '-c':
        options.clear = true;
        break;
      case '--stats':
        options.stats = true;
        break;
      case '--force':
      case '-f':
        options.force = true;
        break;
      default:
        if (!arg?.startsWith('-')) {
          // Treat as philosopher name if no flag
          options.philosopher = arg;
        }
    }
  }

  return options;
}

/**
 * Index a single text source
 */
async function indexSource(
  source: TextSource,
  force: boolean = false
): Promise<boolean> {
  console.log(`\n📚 Processing: ${source.title} (${source.philosopher})`);

  // Check if already indexed
  if (!force && (await isSourceIndexed(source.id))) {
    console.log(`  ⏭ Already indexed, skipping (use --force to reindex)`);
    return true;
  }

  // Download the text
  const downloadResult = await downloadText(source);
  if (!downloadResult.success) {
    console.error(`  ✗ Download failed: ${downloadResult.error}`);
    return false;
  }

  // Read the downloaded text
  const text = await readDownloadedText(source.id);
  if (!text) {
    console.error(`  ✗ Failed to read downloaded text`);
    return false;
  }

  console.log(`  📄 Text length: ${text.length.toLocaleString()} characters`);

  // Chunk the text
  const chunks = createChunksWithMetadata(
    text,
    source.id,
    source.philosopher,
    source.title,
    source.author
  );

  const stats = getChunkStats(chunks);
  console.log(
    `  🧩 Created ${stats.count} chunks (avg ${stats.avgLength} chars)`
  );

  // Add to vector store
  try {
    const added = await addChunks(chunks);
    console.log(`  ✓ Indexed ${added} chunks`);
    return true;
  } catch (error) {
    console.error(
      `  ✗ Indexing failed: ${error instanceof Error ? error.message : error}`
    );
    return false;
  }
}

/**
 * Main indexing function
 */
async function main() {
  const options = parseArgs();

  console.log('═══════════════════════════════════════════════════════════');
  console.log('           Philosopher RAG - Text Indexing Script           ');
  console.log('═══════════════════════════════════════════════════════════');

  // Show stats and exit
  if (options.stats) {
    console.log('\n📊 Collection Statistics:');
    try {
      const stats = await getCollectionStats();
      console.log(`  Total chunks: ${stats.totalChunks}`);
      const philosophers = Object.keys(stats.byPhilosopher);
      console.log(`  Philosophers indexed: ${philosophers.length}`);
      if (philosophers.length > 0) {
        console.log(`  - ${philosophers.join('\n  - ')}`);
      }
    } catch (error) {
      console.log('  No collection found or error reading stats.');
    }
    return;
  }

  // Clear collection if requested
  if (options.clear) {
    console.log('\n🗑 Clearing existing collection...');
    await clearCollection();
  }

  // Determine which sources to index
  let sources: TextSource[];

  if (options.sourceId) {
    const source = TEXT_SOURCES.find(s => s.id === options.sourceId);
    if (!source) {
      console.error(`\n✗ Source not found: ${options.sourceId}`);
      console.log('\nAvailable sources:');
      TEXT_SOURCES.forEach(s => console.log(`  - ${s.id}`));
      process.exit(1);
    }
    sources = [source];
  } else if (options.philosopher) {
    sources = getSourcesByPhilosopher(options.philosopher);
    if (sources.length === 0) {
      console.error(
        `\n✗ No sources found for philosopher: ${options.philosopher}`
      );
      console.log('\nAvailable philosophers:');
      const philosophers = [...new Set(TEXT_SOURCES.map(s => s.philosopher))];
      philosophers.forEach(p => console.log(`  - ${p}`));
      process.exit(1);
    }
  } else {
    sources = TEXT_SOURCES;
  }

  console.log(`\n📥 Will process ${sources.length} text(s)`);

  // Index each source
  let success = 0;
  let failed = 0;

  for (const source of sources) {
    const result = await indexSource(source, options.force || options.clear);
    if (result) {
      success++;
    } else {
      failed++;
    }
  }

  // Summary
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('                         Summary                            ');
  console.log('═══════════════════════════════════════════════════════════');
  console.log(`  ✓ Successful: ${success}`);
  console.log(`  ✗ Failed: ${failed}`);

  // Show final stats
  try {
    const stats = await getCollectionStats();
    console.log(`\n📊 Collection now contains:`);
    console.log(`  Total chunks: ${stats.totalChunks}`);
    console.log(
      `  Philosophers: ${Object.keys(stats.byPhilosopher).join(', ')}`
    );
  } catch {
    // Ignore stats errors
  }

  console.log('\n✅ Done!');
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
