import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// Component playground: every component's variants, for review and for
// side-by-side screenshots against design.cosx.co.
//   pnpm playground   →  http://localhost:5190/?c=core&mode=ink&lang=zh
export default defineConfig({ root: __dirname, plugins: [react(), tailwindcss()], server: { port: 5190 } });
