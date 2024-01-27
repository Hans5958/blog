import { type CollectionEntry, getCollection } from 'astro:content'
import slugify from 'slugify'

export default async function getTags() {
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