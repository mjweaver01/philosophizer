import indexPageHtml from './frontend/index.html';
import { agent } from './endpoints/agent';
import { rag } from './endpoints/rag';
import { conversations, conversation } from './endpoints/conversations';
import {
  philosophersEndpoint,
  philosopherDetailEndpoint,
} from './endpoints/philosophers';
import { signup, login, me } from './endpoints/auth';
import { initializeAgent } from './utils/agent';
import { testConnection } from './db/connection';

console.log(
  `🚀 Starting bun server in ${process.env.NODE_ENV || 'development'} mode`
);

// Initialize database connection
await testConnection();

await initializeAgent();

const server = Bun.serve({
  port: process.env.PORT ?? 1738,
  idleTimeout: 120,
  routes: {
    // Frontend routes
    '/': indexPageHtml,
    '/about': indexPageHtml,
    '/login': indexPageHtml,
    '/signup': indexPageHtml,
    '/c/:id': indexPageHtml,
    // Auth routes
    '/auth/signup': { POST: signup },
    '/auth/login': { POST: login },
    '/auth/me': { GET: me },
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
console.log(`    http://localhost:${server.port}        - Main chat interface`);
console.log(`    http://localhost:${server.port}/about     - About page`);
console.log(`    http://localhost:${server.port}/login     - Login page`);
console.log(`    http://localhost:${server.port}/signup    - Signup page`);
console.log(
  `    http://localhost:${server.port}/c/:id     - Conversation by ID`
);

console.log('\n🔐 Auth Endpoints:');
console.log('  POST /auth/signup           - Create a new user account');
console.log('  POST /auth/login            - Authenticate a user');
console.log('  GET  /auth/me               - Get current user');

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
console.log(
  '  GET  /conversations         - List all conversations (auth required)'
);
console.log(
  '  POST /conversations         - Create a new conversation (auth required)'
);
console.log(
  '  GET  /conversations/:id     - Get a conversation with messages (auth required)'
);
console.log(
  '  PUT  /conversations/:id     - Update conversation title or messages (auth required)'
);
console.log(
  '  DELETE /conversations/:id   - Delete a conversation (auth required)'
);

console.log('\n🧙 Philosopher Endpoints:');
console.log('  GET  /api/philosophers      - List all indexed philosophers');
console.log('  GET  /api/philosophers/:id  - Get philosopher details');
