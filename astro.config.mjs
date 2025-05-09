import { defineConfig } from 'astro/config'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'
import vue from "@astrojs/vue"
import compress from "astro-compress"
import icon from "astro-icon"
import { prettyImages } from './src/plugins/pretty-images'

// https://astro.build/config
export default defineConfig({
	site: 'https://hans5958.github.io/blog/',
	base: '/blog/',
	integrations: [
		mdx(), sitemap(), vue(), icon(),
		import.meta.env.MODE === "production" && compress({
			img: false
		}),
	],
	markdown: {
		shikiConfig: {
			theme: 'github-light',
			langs: []
		},
		rehypePlugins: [
			prettyImages
		],
	},
	image: {
		remotePatterns: [{ protocol: "https" }],
	},
	vite: {
		plugins: [
			tailwindcss()
		],
	},
	compressHTML: false
})