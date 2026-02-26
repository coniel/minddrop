export const ISSUE_STATUSES = [
  { value: 'open', label: 'Open' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
  { value: 'wontfix', label: "Won't Fix" },
] as const;

export const ISSUE_TYPES = [
  { value: 'bug', label: 'Bug' },
  { value: 'feature', label: 'Feature' },
  { value: 'improvement', label: 'Improvement' },
  { value: 'task', label: 'Task' },
] as const;

export const ISSUE_FEATURES = [
  { value: 'app-sidebar', label: 'App Sidebar' },
  { value: 'ast', label: 'AST' },
  { value: 'core', label: 'Core' },
  { value: 'database-entries', label: 'Database Entries' },
  { value: 'databases', label: 'Databases' },
  { value: 'design-studio', label: 'Design Studio' },
  { value: 'designs', label: 'Designs' },
  { value: 'desktop-app', label: 'Desktop App' },
  { value: 'drag-and-drop', label: 'Drag & Drop' },
  { value: 'editor', label: 'Editor' },
  { value: 'events', label: 'Events' },
  { value: 'extension', label: 'Extension' },
  { value: 'extensions', label: 'Extensions' },
  { value: 'file-system', label: 'File System' },
  { value: 'gallery-view', label: 'Gallery View' },
  { value: 'i18n', label: 'i18n' },
  { value: 'icons', label: 'Icons' },
  { value: 'item-type', label: 'Item Type' },
  { value: 'markdown', label: 'Markdown' },
  { value: 'markdown-editor', label: 'Markdown Editor' },
  { value: 'properties', label: 'Properties' },
  { value: 'queries', label: 'Queries' },
  { value: 'selection', label: 'Selection' },
  { value: 'table-view', label: 'Table View' },
  { value: 'theme', label: 'Theme' },
  { value: 'ui-primitives', label: 'UI Primitives' },
  { value: 'views', label: 'Views' },
  { value: 'workspaces', label: 'Workspaces' },
  { value: 'other', label: 'Other' },
] as const;

export const STATUS_COLORS: Record<string, string> = {
  open: 'var(--content-color-green)',
  'in-progress': 'var(--content-color-orange)',
  done: 'var(--content-color-purple)',
  wontfix: 'var(--content-color-grey)',
};

export const STATUS_ICONS: Record<string, string> = {
  open: 'open',
  'in-progress': 'in-progress',
  done: 'done',
  wontfix: 'wontfix',
};

export const TYPE_COLORS: Record<string, string> = {
  bug: '#e5534b',
  feature: '#a371f7',
  improvement: '#39d353',
  task: '#768390',
};

export const FEATURE_COLORS: Record<string, string> = {
  'app-sidebar': '#539bf5',
  ast: '#768390',
  core: '#e5534b',
  'database-entries': '#c69026',
  databases: '#e0823d',
  'design-studio': '#db61a2',
  designs: '#f47067',
  'desktop-app': '#a371f7',
  'drag-and-drop': '#2dba4e',
  editor: '#57ab5a',
  events: '#daaa3f',
  extension: '#c69026',
  extensions: '#986ee2',
  'file-system': '#636e7b',
  'gallery-view': '#39d353',
  i18n: '#6cb6ff',
  icons: '#dcbdfb',
  'item-type': '#2dba4e',
  markdown: '#768390',
  'markdown-editor': '#57ab5a',
  properties: '#daaa3f',
  queries: '#f47067',
  selection: '#539bf5',
  'table-view': '#e0823d',
  theme: '#f692ce',
  'ui-primitives': '#b083f0',
  views: '#56d364',
  workspaces: '#6cb6ff',
  other: '#636e7b',
};
