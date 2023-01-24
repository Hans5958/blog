import { z, defineCollection } from 'astro:content';

const postCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    date: z.string().transform(str => new Date(str)),
    categories: z.string().default('Uncategorized').transform(str => str.split(' ')),
    tags: z.string().default('').transform(str => str.split(' ')),
    slug: z.string(),
    description: z.string().default(''),
    excerpt: z.string().default(''),
    cover: z.object({
      src: z.string(),
      alt: z.string().default('')
    }).optional()
  })
});
export const collections = {
  'posts': postCollection,
};