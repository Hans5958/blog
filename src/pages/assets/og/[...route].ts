import { getCollection } from 'astro:content'
import { remark } from 'remark';
import remarkStrip from 'strip-markdown'
import { OGImageRoute } from 'astro-og-canvas'

const posts = {}

for (const post of await getCollection('posts')) {
	if (post.data.cover) continue
	posts[post.slug] = {}
	posts[post.slug].title = post.data.title
	let excerpt = ""

	if (post.data.excerpt) {
		const excerptUnified = await remark()
			.use(remarkStrip)
			.process(post.data.excerpt)
		excerpt = excerptUnified.toString()
	}
		posts[post.slug].description = excerpt 
}


export const { getStaticPaths, GET } = OGImageRoute({
	param: 'route',

	pages: posts,

	getImageOptions: (path, post) => ({
		title: post.title,
		description: post.description,
		bgGradient: [[51, 65, 85], [100, 116, 139]],
		logo: {
			path: './src/assets/images/site-logo.png',
			size: [277 / 1.5, 128 / 1.5]
		},
		font: {
			title: {
				lineHeight: 1.2,
				families: ['Lato']
			},
			description: {
				size: 30
			}
		},
		padding: 60,
		fonts: [
			'https://api.fontsource.org/v1/fonts/lato/latin-400-normal.ttf'
		]
	}),
})