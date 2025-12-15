#!/usr/bin/env bun
/**
 * Script to test querying the philosopher vector store
 *
 * Usage:
 *   bun run src/rag/scripts/queryTest.ts "What is virtue?"
 *   bun run src/rag/scripts/queryTest.ts "What is virtue?" --philosopher aristotle
 *   bun run src/rag/scripts/queryTest.ts "What is virtue?" -n 10
 */

import {
  queryPassages,
  formatResults,
  getCollectionStats,
} from '../utils/vectorStore';
import 'dotenv/config';

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(
      'Usage: bun run src/rag/scripts/queryTest.ts "your query" [--philosopher name] [-n limit]'
    );
    console.log('\nExamples:');
    console.log(
      '  bun run src/rag/scripts/queryTest.ts "What is the meaning of life?"'
    );
    console.log(
      '  bun run src/rag/scripts/queryTest.ts "What is virtue?" --philosopher aristotle'
    );
    console.log(
      '  bun run src/rag/scripts/queryTest.ts "suffering and liberation" -n 10'
    );
    return;
  }

  // Parse arguments
  let query = '';
  let philosopher: string | undefined;
  let limit = 5;

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--philosopher' || arg === '-p') {
      philosopher = args[++i];
    } else if (arg === '-n' || arg === '--limit') {
      limit = parseInt(args[++i] || '5', 10);
    } else if (!arg?.startsWith('-')) {
      query = arg || '';
    }
  }

  if (!query) {
    console.error('Please provide a query');
    process.exit(1);
  }

  console.log('═══════════════════════════════════════════════════════════');
  console.log('           Philosopher RAG - Query Test                     ');
  console.log('═══════════════════════════════════════════════════════════');

  // Show collection stats first
  try {
    const stats = await getCollectionStats();
    console.log(
      `\n📊 Collection: ${stats.totalChunks} chunks, ${Object.keys(stats.byPhilosopher).length} philosophers`
    );
  } catch (error) {
    console.error('Error reading collection. Have you indexed texts yet?');
    console.log('Run: bun run src/rag/scripts/indexTexts.ts');
    process.exit(1);
  }

  console.log(`\n🔍 Query: "${query}"`);
  if (philosopher) {
    console.log(`   Philosopher: ${philosopher}`);
  }
  console.log(`   Limit: ${limit} results`);

  console.log('\n⏳ Searching...\n');

  const startTime = Date.now();
  const results = await queryPassages(query, { philosopher, limit });
  const elapsed = Date.now() - startTime;

  console.log(`Found ${results.length} results in ${elapsed}ms\n`);
  console.log('───────────────────────────────────────────────────────────');

  if (results.length === 0) {
    console.log('No relevant passages found.');
    if (philosopher) {
      console.log(`\nTry searching without --philosopher to search all texts.`);
    }
  } else {
    for (let i = 0; i < results.length; i++) {
      const result = results[i]!;
      console.log(`\n[${i + 1}] ${result.title}`);
      console.log(`    Author: ${result.author}`);
      console.log(`    Philosopher: ${result.philosopher}`);
      console.log(
        `    Relevance: ${(result.relevanceScore * 100).toFixed(1)}%`
      );
      console.log(
        `\n    "${result.content.slice(0, 400)}${result.content.length > 400 ? '...' : ''}"`
      );
      console.log(
        '\n───────────────────────────────────────────────────────────'
      );
    }
  }

  console.log('\n✅ Done!');
}

main().catch(error => {
  console.error('Error:', error);
  process.exit(1);
});
