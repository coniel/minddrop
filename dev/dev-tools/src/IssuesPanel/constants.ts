export const ISSUE_STATUSES = [
  { value: 'open', label: 'Open' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'review', label: 'Review' },
  { value: 'done', label: 'Done' },
  { value: 'wontfix', label: "Won't Fix" },
] as const;

export const ISSUE_TYPES = [
  { value: 'bug', label: 'Bug' },
  { value: 'feature', label: 'Feature' },
  { value: 'improvement', label: 'Improvement' },
  { value: 'task', label: 'Task' },
] as const;

export const ISSUE_PRIORITIES = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
  { value: 'urgent', label: 'Urgent' },
] as const;

export interface PackageOption {
  value: string;
  label: string;
  color: string;
}

export const ISSUE_PACKAGES: PackageOption[] = [
  { value: 'ast', label: 'ast', color: '#c4a35a' },
  { value: 'core', label: 'core', color: '#e06c75' },
  { value: 'database-entries', label: 'database-entries', color: '#636e7b' },
  { value: 'databases', label: 'databases', color: '#61afef' },
  {
    value: 'design-property-mapping',
    label: 'design-property-mapping',
    color: '#636e7b',
  },
  { value: 'design-studio', label: 'design-studio', color: '#c678dd' },
  { value: 'designs', label: 'designs', color: '#be5046' },
  { value: 'desktop', label: 'desktop', color: '#d19a66' },
  { value: 'desktop-app', label: 'desktop-app', color: '#e5c07b' },
  {
    value: 'desktop-electrobun',
    label: 'desktop-electrobun',
    color: '#56b6c2',
  },
  { value: 'ui-drag-and-drop', label: 'drag-and-drop', color: '#a371f7' },
  { value: 'editor', label: 'editor', color: '#e88e6a' },
  { value: 'events', label: 'events', color: '#7ec8e3' },
  { value: 'extension', label: 'extension', color: '#d4a5a5' },
  { value: 'extensions', label: 'extensions', color: '#a3be8c' },
  { value: 'file-system', label: 'file-system', color: '#b48ead' },
  { value: 'gallery-view', label: 'gallery-view', color: '#39d353' },
  { value: 'i18n', label: 'i18n', color: '#dbb168' },
  { value: 'markdown', label: 'markdown', color: '#87a8c4' },
  { value: 'markdown-editor', label: 'markdown-editor', color: '#6796e6' },
  { value: 'properties', label: 'properties', color: '#4ec9b0' },
  { value: 'queries', label: 'queries', color: '#c586c0' },
  { value: 'selection', label: 'selection', color: '#ce9178' },
  { value: 'stores', label: 'stores', color: '#9cdcfe' },
  { value: 'table-view', label: 'table-view', color: '#e5534b' },
  { value: 'ui-components', label: 'ui-components', color: '#d7ba7d' },
  { value: 'ui-icons', label: 'ui-icons', color: '#b083f0' },
  { value: 'ui-primitives', label: 'ui-primitives', color: '#da70d6' },
  { value: 'ui-theme', label: 'ui-theme', color: '#dcdcaa' },
  { value: 'utils', label: 'utils', color: '#4fc1ff' },
  { value: 'views', label: 'views', color: '#569cd6' },
  { value: 'workspaces', label: 'workspaces', color: '#d16969' },
  // Dev tooling and deprecated packages (grey)
  { value: 'dev-tools', label: 'dev-tools', color: '#636e7b' },
  { value: 'eslint-config', label: 'eslint-config', color: '#636e7b' },
  { value: 'scripts', label: 'scripts', color: '#636e7b' },
  { value: 'test-utils', label: 'test-utils', color: '#636e7b' },
  { value: 'tsconfig', label: 'tsconfig', color: '#636e7b' },
  { value: 'other', label: 'other', color: '#636e7b' },
];

export const STATUS_COLORS: Record<string, string> = {
  open: 'var(--content-color-green)',
  'in-progress': 'var(--content-color-orange)',
  review: 'var(--content-color-blue)',
  done: 'var(--content-color-purple)',
  wontfix: 'var(--content-color-grey)',
};

export const STATUS_ICONS: Record<string, string> = {
  open: 'open',
  'in-progress': 'in-progress',
  review: 'review',
  done: 'done',
  wontfix: 'wontfix',
};

export const TYPE_COLORS: Record<string, string> = {
  bug: '#e5534b',
  feature: '#a371f7',
  improvement: '#39d353',
  task: '#768390',
};

export const PRIORITY_COLORS: Record<string, string> = {
  low: '#768390',
  medium: '#539bf5',
  high: '#e0823d',
  urgent: '#e5534b',
};

/**
 * Strips workspace path prefixes from a package name
 * (e.g. `features/databases` → `databases`, `ui/primitives` → `ui-primitives`).
 */
export function stripPathPrefix(value: string): string {
  // Replace `ui/` with `ui-` to preserve the ui- prefix (e.g. `ui-primitives`)
  if (value.startsWith('ui/')) {
    return `ui-${value.slice(3)}`;
  }

  return value.replace(/^(views|features|packages|apps|dev)\//, '');
}

export function getPackageColor(packageValue: string): string {
  const normalized = stripPathPrefix(packageValue);
  const entry = ISSUE_PACKAGES.find((item) => item.value === normalized);

  return entry?.color ?? '#636e7b';
}
