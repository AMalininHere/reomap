import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import reactRefresh from '@vitejs/plugin-react-refresh';

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    reactRefresh(),
  ],
});
