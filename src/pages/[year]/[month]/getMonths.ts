import { type CollectionEntry, getCollection } from 'astro:content'

export default async function getMonths() {
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