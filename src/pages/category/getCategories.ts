import { type CollectionEntry, getCollection } from 'astro:content'
import slugify from 'slugify'

export default async function getCategories() {
	const blogEntries = await getCollection('posts')
	const categoryEntries = await getCollection('categories')
	blogEntries.sort((a, b) => b.data.date.getTime() - a.data.date.getTime())

	const categories: { [index: string]: {
		name: string,
		description: string,
		posts: CollectionEntry<'posts'>[]
	} } = {}


	categoryEntries.forEach(category => {
		categories[category.id] ??= {
			name: category.data.name,
			description: category.data.description,
			posts: []
		}
	})

	blogEntries.forEach(post => {
		const id = slugify(post.data.category, { lower: true })
		categories[id] ??= {
			name: id,
			description: '',
			posts: []
		}
		categories[id].posts.push(post)
	})

	Object.entries(categories).forEach(([ id, data ]) => {
		if (!data.posts.length) delete categories[id]
	})

	return categories
}