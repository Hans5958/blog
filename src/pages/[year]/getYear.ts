import { type CollectionEntry, getCollection } from 'astro:content'

export default async function getYears() {
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