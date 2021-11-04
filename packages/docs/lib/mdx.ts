import fs from 'fs';
import path from 'path';
import glob from 'glob';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import { bundleMDX } from 'mdx-bundler';
import remarkSlug from 'remark-slug';
import rehypeHighlightCode from '@lib/rehype-highlight-code';
import rehypeMetaAttribute from '@lib/rehype-meta-attribute';
import remarkHeroTemplate from '@lib/remark-hero-template';

import type { Frontmatter } from 'types/frontmatter';

const ROOT_PATH = process.cwd();
export const DATA_PATH = path.join(ROOT_PATH, 'data');
if (process.platform === 'win32') {
  process.env.ESBUILD_BINARY_PATH = path.join(
    process.cwd(),
    'node_modules',
    'esbuild',
    'esbuild.exe',
  );
} else {
  process.env.ESBUILD_BINARY_PATH = path.join(
    process.cwd(),
    'node_modules',
    'esbuild',
    'bin',
    'esbuild',
  );
}

// the front matter and content of all mdx files based on `docsPaths`
export const getAllFrontmatter = (fromPath) => {
  const PATH = path.join(DATA_PATH, fromPath);
  const paths = glob.sync(`${PATH}/**/*.mdx`);

  return paths
    .map((filePath) => {
      const source = fs.readFileSync(path.join(filePath), 'utf8');
      const { data, content } = matter(source);

      return {
        ...(data as Frontmatter),
        slug: filePath.replace(`${DATA_PATH}/`, '').replace('.mdx', ''),
        readingTime: readingTime(content),
      } as Frontmatter;
    })
    .sort(
      (a, b) =>
        Number(new Date(b.publishedAt)) - Number(new Date(a.publishedAt)),
    );
};

export const getMdxBySlug = async (basePath, slug) => {
  const source = fs.readFileSync(
    path.join(DATA_PATH, basePath, `${slug}.mdx`),
    'utf8',
  );
  const { frontmatter, code } = await bundleMDX(source, {
    xdmOptions(options) {
      return {
        remarkPlugins: [
          ...(options.remarkPlugins ?? []),
          remarkSlug,
          remarkHeroTemplate,
        ],
        rehypePlugins: [
          ...(options.rehypePlugins ?? []),
          rehypeMetaAttribute,

          rehypeHighlightCode,
        ],
      };
    },
  });

  return {
    frontmatter: {
      ...(frontmatter as Frontmatter),
      slug,
      readingTime: readingTime(code),
    } as Frontmatter,
    code,
  };
};
