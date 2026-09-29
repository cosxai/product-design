import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Conversation playground: every part of the Agent conversation, for review
// and side-by-side screenshots against design.cosx.co/pattern-agent.
//   pnpm --filter @cosxai/chat playground  →  http://localhost:5191/?c=<demo>&mode=ink&lang=zh
export default defineConfig({ root: __dirname, plugins: [react(), tailwindcss()], server: { port: 5191 } });
