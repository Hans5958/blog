import { z, defineCollection } from 'astro:content'
import { glob } from 'astro/loaders'

export const collections = {
  'posts': defineCollection({
    loader: glob({ pattern: '**/[^_]*.md?(x)', base: "./src/content/posts" }),
    schema: ({ image }) => z.object({
      slug: z.string(),
      title: z.string(),
      date: z.string().transform(str => new Date(str)),
      dateMod: z.string().transform(str => new Date(str)).optional(),
      category: z.string().default('Uncategorized'),
      tags: z.string().array().default([]),
      description: z.string().default(''),
      excerpt: z.string().default(''),
      cover: image().optional(),
      coverAlt: z.string().default(''),
      redirectFrom: z.string().array().default([]),
    })
  }),

  'categories': defineCollection({
    loader: glob({ pattern: '**/[^_]*.yml', base: "./src/content/categories" }),
    schema: () => z.object({
      name: z.string(),
      // slug: z.string(),
      description: z.string().default('')
    })
  }),

  'tags': defineCollection({
    loader: glob({ pattern: '**/[^_]*.yml', base: "./src/content/tags" }),
    schema: () => z.object({
      name: z.string(),
      // slug: z.string(),
      description: z.string().default('')
    })
  })
}