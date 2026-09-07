import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { REVIEWS_DIR } from './reviewComments';

// Name of the file recording a work group's reviewed files, kept
// alongside its review comments so both are removed with the work group
const REVIEWED_FILENAME = 'reviewed.json';

/**
 * Reads the content hashes of a work group's reviewed files, keyed by
 * repo-relative path.
 *
 * @param slug - The work group slug.
 * @returns The reviewed files' content hashes.
 */
export function readReviewedHashes(slug: string): Record<string, string> {
  const path = resolveReviewedPath(slug);

  if (!existsSync(path)) {
    return {};
  }

  try {
    return JSON.parse(readFileSync(path, 'utf-8')) as Record<string, string>;
  } catch {
    // Treat a malformed file as nothing reviewed
    return {};
  }
}

/**
 * Records the content hash a file was reviewed at.
 *
 * @param slug - The work group slug.
 * @param path - The repo-relative file path.
 * @param hash - The hash of the reviewed content.
 */
export function updateReviewedHash(
  slug: string,
  path: string,
  hash: string,
): void {
  const hashes = readReviewedHashes(slug);

  hashes[path] = hash;

  writeReviewedHashes(slug, hashes);
}

/**
 * Removes a file's recorded content hash, marking it unreviewed.
 *
 * @param slug - The work group slug.
 * @param path - The repo-relative file path.
 */
export function deleteReviewedHash(slug: string, path: string): void {
  const hashes = readReviewedHashes(slug);

  delete hashes[path];

  writeReviewedHashes(slug, hashes);
}

/**
 * Hashes file content, so a file changed since it was reviewed can be
 * told apart from one still matching what was reviewed.
 *
 * @param content - The file content.
 * @returns The content's hash.
 */
export function hashFileContent(content: string): string {
  return createHash('sha1').update(content).digest('hex');
}

/**
 * Writes a work group's reviewed file hashes.
 */
function writeReviewedHashes(
  slug: string,
  hashes: Record<string, string>,
): void {
  const dir = `${REVIEWS_DIR}/${slug}`;

  // The work group may have no review directory yet
  mkdirSync(dir, { recursive: true });

  writeFileSync(
    `${dir}/${REVIEWED_FILENAME}`,
    `${JSON.stringify(hashes, null, 2)}\n`,
  );
}

/**
 * Resolves the reviewed files path of a work group.
 */
function resolveReviewedPath(slug: string): string {
  return `${REVIEWS_DIR}/${slug}/${REVIEWED_FILENAME}`;
}
