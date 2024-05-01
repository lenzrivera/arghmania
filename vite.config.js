import { defineConfig } from 'vite';
import topLevelAwait from 'vite-plugin-top-level-await';
import { svelte } from '@sveltejs/vite-plugin-svelte';

export default defineConfig({
  base: '',
  plugins: [
    svelte(),
    topLevelAwait({
      promiseExportName: '__tla',
      promiseImportName: i => `__tla_${i}`,
    }),
  ],
});
