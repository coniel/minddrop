import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  unlinkSync,
  writeFileSync,
} from 'node:fs';
import type {
  NewReviewComment,
  ReviewComment,
  ReviewCommentChanges,
  ReviewCommentStatus,
} from '../types';

// Review comments live outside the repo alongside the manifests so
// all agent worktrees share them
export const REVIEWS_DIR = `${process.env.HOME}/Documents/MindDrop 2/dev/reviews`;
// Heading separating the comment text from the quoted code in a
// comment file body
const SNIPPET_HEADING = '## Selected code';

/**
 * Reads all review comments for a work group, ordered by creation.
 *
 * @param slug - The work group slug.
 * @returns The work group's review comments.
 */
export function readReviewComments(slug: string): ReviewComment[] {
  const dir = resolveReviewsDir(slug);

  if (!existsSync(dir)) {
    return [];
  }

  const comments: ReviewComment[] = [];

  // Ids start with a timestamp, so filename order is creation order
  for (const entry of readdirSync(dir).sort()) {
    if (!entry.endsWith('.md')) {
      continue;
    }

    try {
      const content = readFileSync(`${dir}/${entry}`, 'utf-8');

      comments.push(parseReviewComment(entry.replace('.md', ''), content));
    } catch {
      // Skip malformed comment files
    }
  }

  return comments;
}

/**
 * Writes a new review comment file for a work group.
 *
 * @param slug - The work group slug.
 * @param comment - The comment fields.
 * @returns The created comment.
 */
export function createReviewComment(
  slug: string,
  comment: NewReviewComment,
): ReviewComment {
  const dir = resolveReviewsDir(slug);

  // Ensure the work group's reviews directory exists
  mkdirSync(dir, { recursive: true });

  // Prefix the id with a timestamp so filenames sort by creation
  const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const created: ReviewComment = {
    ...comment,
    id,
    status: 'open',
    created: new Date().toISOString(),
  };

  writeFileSync(`${dir}/${id}.md`, serializeReviewComment(created));

  return created;
}

/**
 * Rewrites a review comment file with the given changes.
 *
 * @param slug - The work group slug.
 * @param id - The comment id.
 * @param changes - The changed fields.
 */
export function updateReviewComment(
  slug: string,
  id: string,
  changes: ReviewCommentChanges,
): void {
  const path = `${resolveReviewsDir(slug)}/${id}.md`;

  if (!existsSync(path)) {
    return;
  }

  const comment = parseReviewComment(id, readFileSync(path, 'utf-8'));

  writeFileSync(path, serializeReviewComment({ ...comment, ...changes }));
}

/**
 * Deletes a review comment file.
 *
 * @param slug - The work group slug.
 * @param id - The comment id.
 */
export function deleteReviewComment(slug: string, id: string): void {
  const path = `${resolveReviewsDir(slug)}/${id}.md`;

  if (existsSync(path)) {
    unlinkSync(path);
  }
}

/**
 * Deletes a work group's reviews directory and every comment in it.
 *
 * @param slug - The work group slug.
 */
export function deleteReviewCommentsDir(slug: string): void {
  rmSync(resolveReviewsDir(slug), { recursive: true, force: true });
}

/**
 * Resolves the reviews directory of a work group.
 */
function resolveReviewsDir(slug: string): string {
  return `${REVIEWS_DIR}/${slug}`;
}

/**
 * Serializes a review comment into markdown with frontmatter. General
 * comments omit the file anchor properties and the quoted code.
 */
function serializeReviewComment(comment: ReviewComment): string {
  const properties: string[] = [];

  // Only anchored comments carry a file
  if (comment.file !== null) {
    properties.push(`file: ${comment.file}`);
  }

  // File-level comments have no line range
  if (comment.startLine !== null) {
    properties.push(`startLine: ${comment.startLine}`);
    properties.push(`endLine: ${comment.endLine ?? comment.startLine}`);
  }

  properties.push(`status: ${comment.status}`);
  properties.push(`created: ${comment.created}`);

  let body = comment.text.trim();

  // Quote the selected code below the text so the anchor can be
  // re-found by content once line numbers drift
  if (comment.snippet !== null) {
    const language = comment.file?.split('.').pop() ?? '';

    body += `\n\n${SNIPPET_HEADING}\n\n\`\`\`${language}\n${comment.snippet}\n\`\`\``;
  }

  return `---\n${properties.join('\n')}\n---\n\n${body}\n`;
}

/**
 * Parses a review comment file's markdown content.
 */
function parseReviewComment(id: string, content: string): ReviewComment {
  const { properties, body } = splitFrontmatter(content);
  const { text, snippet } = splitSnippet(body);
  const startLine = parseLine(properties.startLine);

  return {
    id,
    file: properties.file ?? null,
    startLine,
    endLine: parseLine(properties.endLine) ?? startLine,
    snippet,
    status: parseStatus(properties.status),
    created: properties.created ?? '',
    text,
  };
}

/**
 * Splits markdown content into its frontmatter properties and body.
 */
function splitFrontmatter(content: string): {
  properties: Record<string, string>;
  body: string;
} {
  // Properties only exist inside a leading frontmatter block
  if (!content.startsWith('---\n')) {
    return { properties: {}, body: content };
  }

  const frontmatterEnd = content.indexOf('\n---\n', 4);

  if (frontmatterEnd === -1) {
    return { properties: {}, body: content };
  }

  const properties: Record<string, string> = {};

  // Read each single-line property
  for (const line of content.slice(4, frontmatterEnd).split('\n')) {
    const separator = line.indexOf(':');

    if (separator === -1) {
      continue;
    }

    properties[line.slice(0, separator).trim()] = line
      .slice(separator + 1)
      .trim();
  }

  return {
    properties,
    body: content.slice(frontmatterEnd + 5).trim(),
  };
}

/**
 * Splits a comment body into its text and the quoted code, if any.
 */
function splitSnippet(body: string): { text: string; snippet: string | null } {
  const headingIndex = body.lastIndexOf(`\n${SNIPPET_HEADING}\n`);

  // General comments have no quoted code
  if (headingIndex === -1) {
    return { text: body, snippet: null };
  }

  const text = body.slice(0, headingIndex).trim();
  const quoted = body.slice(headingIndex + SNIPPET_HEADING.length + 2).trim();

  // Strip the code fence lines around the quoted code
  const fenceStart = quoted.indexOf('\n');
  const fenceEnd = quoted.lastIndexOf('\n```');

  if (!quoted.startsWith('```') || fenceStart === -1 || fenceEnd === -1) {
    return { text, snippet: quoted };
  }

  return { text, snippet: quoted.slice(fenceStart + 1, fenceEnd) };
}

/**
 * Parses a line number property, returning null when absent or invalid.
 */
function parseLine(value: string | undefined): number | null {
  const line = Number(value);

  if (!value || !Number.isInteger(line) || line < 1) {
    return null;
  }

  return line;
}

/**
 * Parses a status property, defaulting to open.
 */
function parseStatus(value: string | undefined): ReviewCommentStatus {
  if (value === 'resolved') {
    return 'resolved';
  }

  return 'open';
}
