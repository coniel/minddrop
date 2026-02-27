/**
 * Lightweight YAML frontmatter parser/serializer for issue files.
 *
 * Format:
 * ```
 * ---
 * title: Fix bug
 * number: 1
 * status: open
 * type: bug
 * feature: databases
 * created: 2026-02-26T12:00:00.000Z
 * ---
 * Notes content here...
 * ```
 */

export interface IssueFrontmatter {
  title: string;
  number: number;
  status: string;
  type: string;
  priority: string;
  feature: string;
  created: string;
}

const DELIMITER = '---';

export function parseIssueFrontmatter(raw: string): {
  frontmatter: IssueFrontmatter;
  content: string;
} {
  const lines = raw.split('\n');

  if (lines[0]?.trim() !== DELIMITER) {
    return {
      frontmatter: {
        title: '',
        number: 0,
        status: 'open',
        type: 'task',
        priority: 'medium',
        feature: 'other',
        created: new Date().toISOString(),
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
        status: 'open',
        type: 'task',
        priority: 'medium',
        feature: 'other',
        created: new Date().toISOString(),
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
      status: frontmatter.status ?? 'open',
      type: frontmatter.type ?? 'task',
      priority: frontmatter.priority ?? 'medium',
      feature: frontmatter.feature ?? 'other',
      created: frontmatter.created ?? new Date().toISOString(),
    },
    content,
  };
}

export function serializeIssueFrontmatter(
  frontmatter: IssueFrontmatter,
  content: string,
): string {
  const lines = [
    DELIMITER,
    `title: ${frontmatter.title}`,
    `number: ${frontmatter.number}`,
    `status: ${frontmatter.status}`,
    `type: ${frontmatter.type}`,
    `priority: ${frontmatter.priority}`,
    `feature: ${frontmatter.feature}`,
    `created: ${frontmatter.created}`,
    DELIMITER,
  ];

  if (content) {
    lines.push('', content);
  }

  return lines.join('\n');
}
