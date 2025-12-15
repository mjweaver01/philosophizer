import indexPageHtml from './frontend/index.html';
import { agent } from './endpoints/agent';
import { rag } from './endpoints/rag';
import { conversations, conversation } from './endpoints/conversations';
import { initializeAgent } from './utils/agent';

console.log(
  `🚀 Starting bun server in ${process.env.NODE_ENV || 'development'} mode`
);

await initializeAgent();

const server = Bun.serve({
  port: process.env.PORT ?? 1738,
  idleTimeout: 120,
  routes: {
    '/': indexPageHtml,
    '/c/:id': indexPageHtml, // Client-side routing for conversations
    '/agent': agent,
    '/rag': rag,
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
console.log('\nAPI Endpoints:');
console.log(
  '  POST /agent            - Agent with tools and conversation history'
);
console.log(
  '  POST /rag              - Query the vector store for relevant passages'
);
console.log('  GET  /rag              - Get collection statistics');
console.log('  GET  /conversations    - List all conversations');
console.log('  POST /conversations    - Create a new conversation');
console.log('  GET  /conversations/:id - Get a conversation with messages');
console.log(
  '  PUT  /conversations/:id - Update conversation title or messages'
);
console.log('  DELETE /conversations/:id - Delete a conversation');
