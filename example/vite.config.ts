import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';
import reactJsx from 'vite-react-jsx';
import reactRefresh from '@vitejs/plugin-react-refresh';

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    reactJsx(),
    reactRefresh(),
  ],
});
