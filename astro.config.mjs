import { defineConfig } from 'astro/config';
export default defineConfig({
  site: 'https://cre-ation.io',
  output: 'static',
  trailingSlash: 'always',
  devToolbar: { enabled: false },
});
