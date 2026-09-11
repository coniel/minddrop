/**
 * Searches the gotchas in `dev/gotchas`.
 *
 * Usage:
 *   bun dev/scripts/gotchas.ts [query] [--package <name>] [--path <file>]
 *     [--tag <tag>] [--show <id>] [--hook]
 *
 * Filters combine (AND). With no filters, lists every gotcha grouped by
 * package. `--show` prints a gotcha's full body. `--hook` reads a Claude
 * Code PreToolUse payload from stdin and reports the gotchas matching the
 * target file as additional context.
 */
import { Glob } from 'bun';
import fs from 'node:fs';
import path from 'node:path';

const REPO_ROOT = path.resolve(import.meta.dir, '../..');
const GOTCHAS_DIR = path.join(REPO_ROOT, 'dev/gotchas');

interface Gotcha {
  id: string;
  file: string;
  title: string;
  package: string;
  summary: string;
  paths: string[];
  tags: string[];
  body: string;
}

interface Filters {
  query?: string;
  package?: string;
  path?: string;
  tag?: string;
}

function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.hook) {
    runHook();

    return;
  }

  if (args.show) {
    const gotcha = loadGotchas().find((item) => item.id === args.show);

    if (!gotcha) {
      console.error(`No gotcha with id "${args.show}"`);
      process.exit(1);
    }

    console.log(fs.readFileSync(gotcha.file, 'utf8'));

    return;
  }

  const matches = search(args);

  if (!matches.length) {
    console.log('No matching gotchas.');

    return;
  }

  console.log(format(matches));
}

function runHook() {
  const payload = JSON.parse(fs.readFileSync(0, 'utf8'));
  const filePath: string | undefined = payload?.tool_input?.file_path;

  if (!filePath) {
    return;
  }

  const matches = search({ path: filePath });

  if (!matches.length) {
    return;
  }

  const context = [
    `Gotchas apply to ${toRepoRelative(filePath)}. Read the relevant ones with \`bun dev/scripts/gotchas.ts --show <id>\` before editing:`,
    format(matches),
  ].join('\n');

  console.log(
    JSON.stringify({
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        additionalContext: context,
      },
    }),
  );
}

function search(filters: Filters): Gotcha[] {
  const relativePath = filters.path ? toRepoRelative(filters.path) : undefined;
  const query = filters.query?.toLowerCase();
  const tag = filters.tag?.toLowerCase();

  return loadGotchas().filter((gotcha) => {
    if (filters.package && !matchesPackage(gotcha, filters.package)) {
      return false;
    }

    if (relativePath && !matchesPath(gotcha, relativePath)) {
      return false;
    }

    if (tag && !gotcha.tags.includes(tag)) {
      return false;
    }

    if (query && !matchesQuery(gotcha, query)) {
      return false;
    }

    return true;
  });
}

function matchesPackage(gotcha: Gotcha, name: string): boolean {
  const wanted = name.toLowerCase();
  const packageDir = path.basename(path.dirname(gotcha.file));

  return (
    gotcha.package.toLowerCase() === wanted ||
    packageDir === wanted ||
    gotcha.package.toLowerCase().endsWith(`/${wanted}`)
  );
}

function matchesPath(gotcha: Gotcha, relativePath: string): boolean {
  return gotcha.paths.some((pattern) => {
    if (new Glob(pattern).match(relativePath)) {
      return true;
    }

    // A directory glob also covers the directory itself.
    const directory = pattern.replace(/\/\*\*$/, '');

    return (
      relativePath === directory || relativePath.startsWith(`${directory}/`)
    );
  });
}

function matchesQuery(gotcha: Gotcha, query: string): boolean {
  const haystack = [
    gotcha.title,
    gotcha.summary,
    gotcha.tags.join(' '),
    gotcha.body,
  ]
    .join('\n')
    .toLowerCase();

  return query.split(/\s+/).every((term) => haystack.includes(term));
}

function format(gotchas: Gotcha[]): string {
  const byPackage = new Map<string, Gotcha[]>();

  for (const gotcha of gotchas) {
    const group = byPackage.get(gotcha.package) ?? [];

    group.push(gotcha);
    byPackage.set(gotcha.package, group);
  }

  const sections = [...byPackage.entries()].map(([name, group]) => {
    const lines = group.map(
      (gotcha) => `  ${gotcha.id}\n    ${gotcha.title}\n    ${gotcha.summary}`,
    );

    return [`${name}`, ...lines].join('\n');
  });

  return sections.join('\n\n');
}

function loadGotchas(): Gotcha[] {
  const glob = new Glob('*/*.md');
  const files = [...glob.scanSync({ cwd: GOTCHAS_DIR })].sort();

  return files.map((relative) => {
    const file = path.join(GOTCHAS_DIR, relative);
    const { frontmatter, body } = splitFrontmatter(
      fs.readFileSync(file, 'utf8'),
    );

    return {
      id: relative.replace(/\.md$/, ''),
      file,
      title: readString(frontmatter, 'title'),
      package: readString(frontmatter, 'package'),
      summary: readString(frontmatter, 'summary'),
      paths: readList(frontmatter, 'paths'),
      tags: readList(frontmatter, 'tags').map((tag) => tag.toLowerCase()),
      body,
    };
  });
}

function splitFrontmatter(content: string): {
  frontmatter: string;
  body: string;
} {
  const match = content.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);

  if (!match) {
    return { frontmatter: '', body: content };
  }

  return { frontmatter: match[1], body: match[2] };
}

function readString(frontmatter: string, key: string): string {
  const match = frontmatter.match(new RegExp(`^${key}:[ \\t]*(.*)$`, 'm'));

  return match ? unquote(match[1]) : '';
}

function readList(frontmatter: string, key: string): string[] {
  const match = frontmatter.match(
    new RegExp(`^${key}:[ \\t]*(.*)$((?:\\n[ \\t]+-[ \\t]*.*)*)`, 'm'),
  );

  if (!match) {
    return [];
  }

  const inline = match[1].trim();

  if (inline.startsWith('[')) {
    return inline
      .slice(1, -1)
      .split(',')
      .map((item) => unquote(item))
      .filter(Boolean);
  }

  return match[2]
    .split('\n')
    .map((line) => line.replace(/^[ \t]+-[ \t]*/, ''))
    .map((item) => unquote(item))
    .filter(Boolean);
}

function unquote(value: string): string {
  const trimmed = value.trim();

  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return JSON.parse(
      trimmed.startsWith("'") ? `"${trimmed.slice(1, -1)}"` : trimmed,
    );
  }

  return trimmed;
}

function toRepoRelative(filePath: string): string {
  const absolute = path.resolve(filePath);
  const roots = [REPO_ROOT, process.cwd()];

  for (const root of roots) {
    if (absolute.startsWith(`${root}/`)) {
      return absolute.slice(root.length + 1);
    }
  }

  return filePath;
}

function parseArgs(
  argv: string[],
): Filters & { show?: string; hook?: boolean } {
  const result: Filters & { show?: string; hook?: boolean } = {};
  const positional: string[] = [];

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === '--hook') {
      result.hook = true;
    } else if (arg === '--package' || arg === '-p') {
      result.package = argv[++index];
    } else if (arg === '--path' || arg === '-f') {
      result.path = argv[++index];
    } else if (arg === '--tag' || arg === '-t') {
      result.tag = argv[++index];
    } else if (arg === '--show' || arg === '-s') {
      result.show = argv[++index];
    } else {
      positional.push(arg);
    }
  }

  if (positional.length) {
    result.query = positional.join(' ');
  }

  return result;
}

main();
