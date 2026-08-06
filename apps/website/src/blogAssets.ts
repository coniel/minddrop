import type { AstroIntegration } from 'astro';
import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { copyFile, mkdir } from 'node:fs/promises';
import { basename, dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import type { MdastPluginDefinition } from 'satteri';

const BlogAssetsUrlPrefix = '/blog-assets';

/**
 * Absolute source path of every asset referenced by a rendered post, keyed by
 * the file name it is published under. Filled in while posts are rendered and
 * consumed once the build finishes.
 */
const referencedAssets = new Map<string, string>();

/**
 * Markdown plugin which rewrites relative image references in blog posts to
 * public `/blog-assets` URLs, and records the source file so the build can
 * copy it into the output.
 *
 * Posts live outside the site, so the bundler cannot resolve their images the
 * way it resolves in-repo assets.
 */
export function rewriteBlogAssetPaths(): MdastPluginDefinition {
  return {
    name: 'rewrite-blog-asset-paths',
    image: (node, context) => {
      // Leave absolute URLs, data URIs, and site-root paths untouched
      if (!context.fileURL || !isRelativeReference(node.url)) {
        return;
      }

      const entryPath = fileURLToPath(context.fileURL);
      const sourcePath = resolve(dirname(entryPath), decodeURI(node.url));
      const publishedName = getPublishedAssetName(sourcePath);

      referencedAssets.set(publishedName, sourcePath);

      context.setProperty(
        node,
        'url',
        `${BlogAssetsUrlPrefix}/${publishedName}`,
      );
    },
  };
}

/**
 * Astro integration which copies the assets referenced by blog posts into the
 * build output, and serves them from their original location during dev.
 */
export function blogAssets(): AstroIntegration {
  return {
    name: 'blog-assets',
    hooks: {
      // Serve referenced assets straight from the workspace while developing
      'astro:server:setup': ({ server }) => {
        server.middlewares.use((request, response, next) => {
          const requestedName = getRequestedAssetName(request.url);
          const sourcePath = requestedName
            ? referencedAssets.get(requestedName)
            : undefined;

          // Not an asset request, or an asset no rendered post references
          if (!sourcePath) {
            next();

            return;
          }

          createReadStream(sourcePath).pipe(response);
        });
      },

      // Copy referenced assets into the output once every post has rendered
      'astro:build:done': async ({ dir }) => {
        if (referencedAssets.size === 0) {
          return;
        }

        const outputDirectory = fileURLToPath(
          new URL(`.${BlogAssetsUrlPrefix}`, dir),
        );

        await mkdir(outputDirectory, { recursive: true });

        await Promise.all(
          Array.from(referencedAssets, ([publishedName, sourcePath]) =>
            copyFile(sourcePath, join(outputDirectory, publishedName)),
          ),
        );
      },
    },
  };
}

/**
 * Checks whether a Markdown image reference points at a file next to the post,
 * as opposed to an external URL, a data URI, or a site-root path.
 */
function isRelativeReference(url: string): boolean {
  if (!url || url.startsWith('/') || url.startsWith('#')) {
    return false;
  }

  return !/^[a-z][a-z0-9+.-]*:/i.test(url);
}

/**
 * Builds the file name an asset is published under. The source path is hashed
 * into the name so same-named images in different posts do not collide.
 */
function getPublishedAssetName(sourcePath: string): string {
  const hash = createHash('sha1').update(sourcePath).digest('hex').slice(0, 8);

  return `${hash}-${basename(sourcePath)}`;
}

/**
 * Extracts the published asset name from a dev server request URL, or null if
 * the request is not for a blog asset.
 */
function getRequestedAssetName(url: string | undefined): string | null {
  if (!url?.startsWith(`${BlogAssetsUrlPrefix}/`)) {
    return null;
  }

  const [path] = url.split('?');

  return decodeURIComponent(path.slice(BlogAssetsUrlPrefix.length + 1));
}
