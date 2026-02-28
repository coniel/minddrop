export type LogLevel = 'log' | 'info' | 'warn' | 'error';

export interface LogEntry {
  id: number;
  level: LogLevel;
  args: unknown[];
  timestamp: number;
  source?: { file: string; line: number };
}

export interface SavedLog {
  id: number;
  args: unknown[];
  file: string;
  line: number;
  timestamp: number;
}

export interface EventEntry {
  id: number;
  name: string;
  data: unknown;
  timestamp: number;
}

export interface Note {
  id: number;
  content: string;
  createdAt: number;
  filePath: string;
}

export type IssueStatus = 'open' | 'in-progress' | 'review' | 'done' | 'wontfix';

export type IssueType = 'bug' | 'feature' | 'improvement' | 'task';

export type IssuePriority = 'low' | 'medium' | 'high' | 'urgent';

export type IssuePackage =
  | 'ast'
  | 'core'
  | 'databases'
  | 'designs'
  | 'desktop'
  | 'desktop-2'
  | 'desktop-app'
  | 'dev-tools'
  | 'editor'
  | 'eslint-config'
  | 'events'
  | 'extension'
  | 'extensions'
  | 'feature-app-sidebar'
  | 'feature-database-entries'
  | 'feature-databases'
  | 'feature-design-studio'
  | 'feature-designs'
  | 'feature-drag-and-drop'
  | 'feature-markdown-editor'
  | 'feature-properties'
  | 'feature-views'
  | 'file-system'
  | 'i18n'
  | 'icons'
  | 'markdown'
  | 'properties'
  | 'queries'
  | 'scripts'
  | 'selection'
  | 'table-view'
  | 'test-utils'
  | 'theme'
  | 'ui-primitives'
  | 'utils'
  | 'view-gallery'
  | 'views'
  | 'workspaces'
  | 'other';

export interface Issue {
  id: number;
  number: number;
  title: string;
  status: IssueStatus;
  type: IssueType;
  priority: IssuePriority;
  package: IssuePackage;
  content: string;
  filePath: string;
  createdAt: number;
}

export interface Changelog {
  id: number;
  number: number;
  title: string;
  date: string;
  packages: IssuePackage[];
  issues: number[];
  content: string;
  filePath: string;
  createdAt: number;
}

export type ActiveSection =
  | 'stories'
  | 'state'
  | 'events'
  | 'logs'
  | 'notes'
  | 'issues'
  | 'changelog';

export interface ActiveStory {
  groupIndex: number;
  itemIndex: number;
}
