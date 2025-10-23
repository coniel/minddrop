import { FsEntry } from '../types';

function printNode(
  entry: FsEntry,
  prefix: string = '',
  isLast: boolean = true,
): string[] {
  const lines: string[] = [];
  const displayName = entry.name || entry.path;

  if (displayName) {
    const connector = isLast ? '└── ' : '├── ';
    lines.push(prefix + connector + displayName);
  }

  if (entry.children && entry.children.length > 0) {
    const sortedChildren = [...entry.children].sort((a, b) => {
      const aIsDir = !!a.children;
      const bIsDir = !!b.children;

      // Directories first, then files
      if (aIsDir !== bIsDir) return aIsDir ? -1 : 1;

      const aName = a.name || a.path;
      const bName = b.name || b.path;

      return aName.localeCompare(bName);
    });

    sortedChildren.forEach((child, index) => {
      const isLastChild = index === sortedChildren.length - 1;
      const extension = isLast ? '    ' : '│   ';
      const childLines = printNode(child, prefix + extension, isLastChild);
      lines.push(...childLines);
    });
  }

  return lines;
}

export function printFileTree(entries: FsEntry[]): void {
  if (entries.length === 0) {
    console.log('(empty file system)');

    return;
  }

  console.log('File Tree:');

  const sortedEntries = [...entries].sort((a, b) => {
    const aIsDir = !!a.children;
    const bIsDir = !!b.children;

    // Directories first, then files
    if (aIsDir !== bIsDir) return aIsDir ? -1 : 1;

    const aName = a.name || a.path;
    const bName = b.name || b.path;

    return aName.localeCompare(bName);
  });

  sortedEntries.forEach((entry, index) => {
    const isLast = index === sortedEntries.length - 1;
    const lines = printNode(entry, '', isLast);
    lines.forEach((line) => console.log(line));
  });
}
