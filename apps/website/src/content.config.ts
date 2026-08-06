import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { defineCollection } from 'astro:content';
import { existsSync } from 'node:fs';
import { basename, extname } from 'node:path';
import { loadEnv } from 'vite';

// Read with an empty mode and prefix, so `.env` and `.env.local` are picked up
// and every variable is visible, not just the `PUBLIC_` ones
const { MINDDROP_BLOG_DIR } = loadEnv('', process.cwd(), '');

// Posts live in a database directory inside a local workspace, so the site can
// only build them on a machine which has that workspace
const hasBlogDirectory =
  Boolean(MINDDROP_BLOG_DIR) && existsSync(MINDDROP_BLOG_DIR);

if (!hasBlogDirectory) {
  console.warn(
    '[website] MINDDROP_BLOG_DIR is unset or missing, building without blog posts',
  );
}

/**
 * Blog posts, read from a database directory in a local workspace. Frontmatter
 * keys are the database's property names, which are mapped onto conventional
 * field names here.
 */
const blog = defineCollection({
  loader: hasBlogDirectory
    ? glob({
        // Entries sit at the top level, `.minddrop` holds database config and
        // templates rather than posts
        pattern: ['**/*.md', '!**/.minddrop/**'],
        base: MINDDROP_BLOG_DIR,
        generateId: ({ entry }) => slugify(basename(entry, extname(entry))),
      })
    : () => [],
  schema: z
    .object({
      Title: z.string(),
      Published: z.boolean().default(false),
      Summary: z.string().optional(),
      Date: z.coerce.date(),
      Tags: z.array(z.string()).default([]),
      Cover: z.string().optional(),
    })
    .transform((data) => ({
      title: data.Title,
      published: data.Published,
      summary: data.Summary,
      date: data.Date,
      tags: data.Tags,
      cover: data.Cover,
    })),
});

/**
 * Changelog entries, one file per app build, kept in the repo root so they sit
 * with the app they describe rather than with the site.
 */
const changelog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: '../../changelog' }),
  schema: z.object({
    version: z.string(),
    build: z.number(),
    date: z.coerce.date(),
  }),
});

export const collections = { blog, changelog };

/**
 * Converts an entry title into a URL slug.
 */
function slugify(value: string): string {
  return (
    value
      .normalize('NFKD')
      // Drop the accents separated out by the normalisation
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  );
}
