import indexPageHtml from './frontend/index.html';
import { agent } from './endpoints/agent';
import { rag } from './endpoints/rag';
import { conversations, conversation } from './endpoints/conversations';
import {
  philosophersEndpoint,
  philosopherDetailEndpoint,
} from './endpoints/philosophers';
import { initializeAgent } from './utils/agent';

console.log(
  `🚀 Starting bun server in ${process.env.NODE_ENV || 'development'} mode`
);

await initializeAgent();

const server = Bun.serve({
  port: process.env.PORT ?? 1738,
  idleTimeout: 120,
  routes: {
    // Frontend routes
    '/': indexPageHtml,
    '/about': indexPageHtml,
    '/c/:id': indexPageHtml,
    // API routes
    '/agent': agent,
    '/rag': rag,
    '/api/philosophers': philosophersEndpoint,
    '/api/philosophers/:id': philosopherDetailEndpoint,
    '/conversations': conversations,
    '/conversations/:id': conversation,
  },
  ...(process.env.NODE_ENV === 'production'
    ? {}
    : {
        development: {
          hmr: true,
        },
      }),
});

console.log(`\n💻 Web UI: http://localhost:${server.port}`);
console.log(`    http://localhost:${server.port}     - Main chat interface`);
console.log(`    http://localhost:${server.port}/about  - About page`);
console.log(`    http://localhost:${server.port}/c/:id  - Conversation by ID`);

console.log('\n🤖 AI Endpoints:');
console.log(
  '  POST /agent                 - Agent with tools and conversation history'
);

console.log('\n📚 RAG Endpoints:');
console.log(
  '  POST /rag                   - Query vector store for relevant passages'
);
console.log('  GET  /rag                   - Get collection statistics');

console.log('\n🗣️  Conversation Endpoints:');
console.log('  GET  /conversations         - List all conversations');
console.log('  POST /conversations         - Create a new conversation');
console.log('  GET  /conversations/:id     - Get a conversation with messages');
console.log(
  '  PUT  /conversations/:id     - Update conversation title or messages'
);
console.log('  DELETE /conversations/:id   - Delete a conversation');

console.log('\n🧙 Philosopher Endpoints:');
console.log('  GET  /api/philosophers      - List all indexed philosophers');
console.log('  GET  /api/philosophers/:id  - Get philosopher details');
