import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { getBlogPosts } from '../utils/getBlogPosts';

export const GET: APIRoute = async (context) => {
  const posts = await getBlogPosts();

  return rss({
    title: 'MindDrop Blog',
    description:
      'Writing from the people building MindDrop: new features, the thinking behind them, and what is coming next.',
    site: context.site ?? 'https://minddrop.app',
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.summary,
      pubDate: post.data.date,
      link: `/blog/${post.id}`,
    })),
  });
};
