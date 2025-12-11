import { type CollectionEntry, getCollection } from 'astro:content'
import slugify from 'slugify'

export async function getCategories() {
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

export async function getTags() {
	const blogEntries = await getCollection('posts')
	const tagEntries = await getCollection('tags')
	blogEntries.sort((a, b) => b.data.date.getTime() - a.data.date.getTime())

	const tags: { [index: string]: {
		name: string,
		description: string,
		posts: CollectionEntry<'posts'>[]
	} } = {}


	tagEntries.forEach(tag => {
		tags[tag.id] ??= {
			name: tag.data.name,
			description: tag.data.description,
			posts: []
		}
	})

	blogEntries.forEach(post => {
		const postTags = post.data.tags
		postTags.forEach(tag => {
			const id = slugify(tag, { lower: true })
			tags[id] ??= {
				name: id,
				description: '',
				posts: []
			}
			tags[id].posts.push(post)
		})	
	})

	Object.entries(tags).forEach(([ id, data ]) => {
		if (!data.posts.length) delete tags[id]
	})

	return tags
}

export async function getYears() {
	const blogEntries = await getCollection('posts')
	blogEntries.sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
	
	const years: { [index: number]: CollectionEntry<'posts'>[] } = {}
	
	blogEntries.forEach(post => {
		const postYear = post.data.date.getFullYear()
		if (!years[postYear]) {
			years[postYear] = []
		}
		years[postYear].push(post)
	})

	return years
}

export async function getMonths() {
	const blogEntries = await getCollection('posts')
	blogEntries.sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
	
	const months: { [index: number]: CollectionEntry<'posts'>[] } = {}
	
	blogEntries.forEach(post => {
		const postDate = `${post.data.date.getFullYear()}-${(post.data.date.getMonth() + 1).toString().padStart(2, '0')}`
		if (!months[postDate]) {
			months[postDate] = []
		}
		months[postDate].push(post)
	})

	return months
}