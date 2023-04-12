import { z, defineCollection } from 'astro:content';

const postCollection = defineCollection({
  schema: ({ image }) => z.object({
    title: z.string(),
    date: z.string().transform(str => new Date(str)),
    date_mod: z.string().transform(str => new Date(str)).optional(),
    category: z.string().default('Uncategorized'),
    tags: z.string().default('').transform(str => str.split(' ')),
    description: z.string().default(''),
    excerpt: z.string().default(''),
    cover: image().optional(),
    coverAlt: z.string().default(''),
    redirect_from: z.string().array().optional()
  })
});
export const collections = {
  'posts': postCollection,
};