/**
 * Lightweight YAML frontmatter parser/serializer for changelog files.
 *
 * Format:
 * ```
 * ---
 * title: Added border support to design studio
 * number: 1
 * date: 2026-02-27
 * packages: designs, feature-design-studio
 * ---
 * Content here...
 * ```
 */

export interface ChangelogFrontmatter {
  title: string;
  number: number;
  date: string;
  packages: string;
  issues: string;
}

const DELIMITER = '---';

export function parseChangelogFrontmatter(raw: string): {
  frontmatter: ChangelogFrontmatter;
  content: string;
} {
  const lines = raw.split('\n');

  if (lines[0]?.trim() !== DELIMITER) {
    return {
      frontmatter: {
        title: '',
        number: 0,
        date: new Date().toISOString().slice(0, 10),
        packages: '',
        issues: '',
      },
      content: raw,
    };
  }

  const closingIndex = lines.indexOf(DELIMITER, 1);

  if (closingIndex === -1) {
    return {
      frontmatter: {
        title: '',
        number: 0,
        date: new Date().toISOString().slice(0, 10),
        packages: '',
        issues: '',
      },
      content: raw,
    };
  }

  const frontmatter: Record<string, string> = {};

  for (let index = 1; index < closingIndex; index++) {
    const colonIndex = lines[index].indexOf(':');

    if (colonIndex === -1) {
      continue;
    }

    const key = lines[index].slice(0, colonIndex).trim();
    const value = lines[index].slice(colonIndex + 1).trim();
    frontmatter[key] = value;
  }

  const content = lines.slice(closingIndex + 1).join('\n').replace(/^\n/, '');

  return {
    frontmatter: {
      title: frontmatter.title ?? '',
      number: parseInt(frontmatter.number ?? '0', 10) || 0,
      date: frontmatter.date ?? new Date().toISOString().slice(0, 10),
      packages: frontmatter.packages ?? '',
      issues: frontmatter.issues ?? '',
    },
    content,
  };
}

export function serializeChangelogFrontmatter(
  frontmatter: ChangelogFrontmatter,
  content: string,
): string {
  const lines = [
    DELIMITER,
    `title: ${frontmatter.title}`,
    `number: ${frontmatter.number}`,
    `date: ${frontmatter.date}`,
    `packages: ${frontmatter.packages}`,
    `issues: ${frontmatter.issues}`,
    DELIMITER,
  ];

  if (content) {
    lines.push('', content);
  }

  return lines.join('\n');
}
