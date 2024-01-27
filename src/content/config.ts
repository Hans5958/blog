import { z, defineCollection } from 'astro:content';

export const collections = {
  'posts': defineCollection({
    schema: ({ image }) => z.object({
      title: z.string(),
      date: z.string().transform(str => new Date(str)),
      dateMod: z.string().transform(str => new Date(str)).optional(),
      category: z.string().default('Uncategorized'),
      tags: z.string().default('').transform(str => str.split(' ')),
      description: z.string().default(''),
      excerpt: z.string().default(''),
      cover: image().optional(),
      coverAlt: z.string().default(''),
      redirectFrom: z.string().array().optional()
    })
  }),

  'categories': defineCollection({
    type: 'data',
    schema: () => z.object({
      name: z.string(),
      // slug: z.string(),
      description: z.string().default('')
    })
  }),

  'tags': defineCollection({
    type: 'data',
    schema: () => z.object({
      name: z.string(),
      // slug: z.string(),
      description: z.string().default('')
    })
  })
};