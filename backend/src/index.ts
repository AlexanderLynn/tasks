import express from 'express';
import cors from 'cors';
import { runMigrations } from './db/migrate.js';
import { apiRouter } from './api/index.js';
import { errorHandler, notFoundHandler } from './middleware/errors.js';

const app = express();
const API_PORT = process.env.API_PORT || 8080;
const MCP_ENABLED = process.env.MCP_ENABLED === 'true' || process.env.ENABLE_MCP_SERVER === 'true';
const MCP_PORT = process.env.MCP_PORT ? parseInt(process.env.MCP_PORT) : null;

// Middleware
app.use(cors());
app.use(express.json());

// Run migrations and start server
async function startServer() {
  await runMigrations();

  // API routes
  app.use('/api', apiRouter);

  // Health check
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Error handling
  app.use(notFoundHandler);
  app.use(errorHandler);

  // Start API server
  app.listen(API_PORT, () => {
    console.log(`Habit Tracker API server running on port ${API_PORT}`);
  });

  // Start MCP server if enabled
  if (MCP_ENABLED) {
    if (MCP_PORT) {
      // Start HTTP-based MCP server on specified port
      import('./mcp-server.js').then(() => {
        console.log(`MCP HTTP server started on port ${MCP_PORT}`);
      }).catch((error) => {
        console.error('Failed to start MCP HTTP server:', error);
      });
    } else {
      // Start stdio-based MCP server
      import('./mcp/index.js').then(() => {
        console.log('MCP stdio server started');
      }).catch((error) => {
        console.error('Failed to start MCP stdio server:', error);
      });
    }
  }
}

startServer().catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
