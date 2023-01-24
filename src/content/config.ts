import { z, defineCollection } from 'astro:content';

const postCollection = defineCollection({
  schema: z.object({
    title: z.string(),
    date: z.string().transform(str => new Date(str)),
    categories: z.string().transform(str => str.split(' ')).optional(),
    tags: z.string().transform(str => str.split(' ')).optional(),
    slug: z.string(),
    description: z.string().optional(),
    excerpt: z.string().optional(),
    cover: z.object({
      src: z.string(),
      alt: z.string().optional()
    }).optional()
  })
});
export const collections = {
  'posts': postCollection,
};