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

export type PackageWorkspace =
  | 'apps'
  | 'dev'
  | 'features'
  | 'packages'
  | 'ui'
  | 'views'
  | 'other';

export interface PackageOption {
  value: string;
  label: string;
  workspace: PackageWorkspace;
}

export const WORKSPACE_LABELS: Record<PackageWorkspace, string> = {
  apps: 'Apps',
  dev: 'Dev',
  features: 'Features',
  packages: 'Packages',
  ui: 'UI',
  views: 'Views',
  other: 'Other',
};

export const WORKSPACE_COLORS: Record<PackageWorkspace, string> = {
  apps: '#a371f7',
  dev: '#636e7b',
  features: '#539bf5',
  packages: '#e0823d',
  ui: '#b083f0',
  views: '#39d353',
  other: '#636e7b',
};

export const ISSUE_PACKAGES: PackageOption[] = [
  // apps
  { value: 'desktop', label: 'desktop', workspace: 'apps' },
  { value: 'desktop-2', label: 'desktop-2', workspace: 'apps' },
  // dev
  { value: 'dev-tools', label: 'dev-tools', workspace: 'dev' },
  // features (label strips feature- prefix)
  { value: 'feature-app-sidebar', label: 'app-sidebar', workspace: 'features' },
  { value: 'feature-database-entries', label: 'database-entries', workspace: 'features' },
  { value: 'feature-databases', label: 'databases', workspace: 'features' },
  { value: 'feature-design-studio', label: 'design-studio', workspace: 'features' },
  { value: 'feature-designs', label: 'designs', workspace: 'features' },
  { value: 'feature-drag-and-drop', label: 'drag-and-drop', workspace: 'features' },
  { value: 'feature-markdown-editor', label: 'markdown-editor', workspace: 'features' },
  { value: 'feature-properties', label: 'properties', workspace: 'features' },
  { value: 'feature-views', label: 'views', workspace: 'features' },
  // packages
  { value: 'ast', label: 'ast', workspace: 'packages' },
  { value: 'core', label: 'core', workspace: 'packages' },
  { value: 'databases', label: 'databases', workspace: 'packages' },
  { value: 'designs', label: 'designs', workspace: 'packages' },
  { value: 'desktop-app', label: 'desktop-app', workspace: 'packages' },
  { value: 'editor', label: 'editor', workspace: 'packages' },
  { value: 'eslint-config', label: 'eslint-config', workspace: 'packages' },
  { value: 'events', label: 'events', workspace: 'packages' },
  { value: 'extension', label: 'extension', workspace: 'packages' },
  { value: 'extensions', label: 'extensions', workspace: 'packages' },
  { value: 'file-system', label: 'file-system', workspace: 'packages' },
  { value: 'i18n', label: 'i18n', workspace: 'packages' },
  { value: 'icons', label: 'icons', workspace: 'packages' },
  { value: 'markdown', label: 'markdown', workspace: 'packages' },
  { value: 'properties', label: 'properties', workspace: 'packages' },
  { value: 'queries', label: 'queries', workspace: 'packages' },
  { value: 'scripts', label: 'scripts', workspace: 'packages' },
  { value: 'selection', label: 'selection', workspace: 'packages' },
  { value: 'test-utils', label: 'test-utils', workspace: 'packages' },
  { value: 'theme', label: 'theme', workspace: 'packages' },
  { value: 'utils', label: 'utils', workspace: 'packages' },
  { value: 'views', label: 'views', workspace: 'packages' },
  { value: 'workspaces', label: 'workspaces', workspace: 'packages' },
  // ui
  { value: 'ui-primitives', label: 'ui-primitives', workspace: 'ui' },
  // views
  { value: 'table-view', label: 'table-view', workspace: 'views' },
  { value: 'view-gallery', label: 'view-gallery', workspace: 'views' },
  // other
  { value: 'other', label: 'other', workspace: 'other' },
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

export function getPackageColor(packageValue: string): string {
  const entry = ISSUE_PACKAGES.find((item) => item.value === packageValue);

  return WORKSPACE_COLORS[entry?.workspace ?? 'other'];
}

export const PACKAGE_GROUPS = (() => {
  const order: PackageWorkspace[] = [
    'apps',
    'dev',
    'features',
    'packages',
    'ui',
    'views',
    'other',
  ];

  return order
    .map((workspace) => ({
      workspace,
      label: WORKSPACE_LABELS[workspace],
      packages: ISSUE_PACKAGES.filter((item) => item.workspace === workspace),
    }))
    .filter((group) => group.packages.length > 0);
})();
