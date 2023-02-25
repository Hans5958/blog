import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import relativeUrl from '../components/urlHelper.js';
import { SITE_TITLE } from '../config.js';

export async function get(context) {
  const blog = await getCollection('posts');
  return rss({
    title: SITE_TITLE,
    description: "Collection and articles and texts of Hans5958.",
    site: context.site,
    items: blog.sort((a, b) => Number(b.data.date) - Number(a.data.date)).map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      link: relativeUrl('/' + post.slug),
    })),
  });
}