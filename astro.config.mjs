import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwind from "@astrojs/tailwind";
import vue from "@astrojs/vue";
import compress from "astro-compress";
import image from "@astrojs/image";

// https://astro.build/config
export default defineConfig({
  site: 'https://hans5958.github.io/blog',
  base: '/blog',
  integrations: [mdx(), sitemap(), tailwind(), vue(), 
    image({
      serviceEntryPoint: '@astrojs/image/sharp'
    }), 
    import.meta.env.MODE === "production" && compress({
    img: false
  })],
  markdown: {
    shikiConfig: {
      theme: 'github-light',
      langs: []
    }
  }
});