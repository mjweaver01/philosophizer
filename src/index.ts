import indexPageHtml from './frontend/index.html';
import { agent } from './endpoints/agent';
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
    '/agent': agent,
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
console.log('  POST /agent - Agent with tools and conversation history');
