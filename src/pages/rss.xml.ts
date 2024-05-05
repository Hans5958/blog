import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import relativeUrl from '../components/urlHelper.js';
import { SITE_TITLE } from '../config.js';

export async function GET(context) {
  const blog = (await getCollection('posts')).sort((a, b) => Number(b.data.date) - Number(a.data.date))
  return generateRssFromPosts(null, 'Collection and articles and texts of Hans5958.', context, blog)
}

export const generateRssFromPosts = (title, description, context, posts) => {
  return rss({
    title: title ?? SITE_TITLE,
    description: description,
    site: context.site,
    items: posts.map((post) => {
      const customData: string[] = []

      customData.push('<dc:creator><![CDATA[Hans5958]]></dc:creator>')

      if (post.data.dateMod) {
        customData.push(`<atom:updated>${new Date(post.data.dateMod).toISOString()}</atom:updated>`)
      }
      
      if (post.data.cover?.src) {
        customData.push(`<media:thumbnail url="${post.data.cover?.src}" />`)
      }

      return {
        title: post.data.title,
        pubDate: post.data.date,
        description: post.data.description,
        link: relativeUrl('/' + post.slug),
        categories: [post.data.category, ...post.data.tags],
        customData: customData.join("")
      }
    }),
    xmlns: {
      dc: 'http://purl.org/dc/elements/1.1/',
      atom: 'http://www.w3.org/2005/Atom',
      media: 'http://search.yahoo.com/mrss/'
    }
  })
}