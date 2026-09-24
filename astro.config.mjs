import { defineConfig } from 'astro/config';
export default defineConfig({
  site: 'https://cottrellashley.github.io',
  base: '/cre-ation',
  output: 'static',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
});
