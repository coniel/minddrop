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

export type IssueStatus = 'open' | 'in-progress' | 'done' | 'wontfix';

export type IssueType = 'bug' | 'feature' | 'improvement' | 'task';

export type IssuePriority = 'low' | 'medium' | 'high' | 'urgent';

export type IssueFeature =
  | 'app-sidebar'
  | 'ast'
  | 'core'
  | 'database-entries'
  | 'databases'
  | 'design-studio'
  | 'designs'
  | 'desktop-app'
  | 'drag-and-drop'
  | 'editor'
  | 'events'
  | 'extension'
  | 'extensions'
  | 'file-system'
  | 'gallery-view'
  | 'i18n'
  | 'icons'
  | 'item-type'
  | 'markdown'
  | 'markdown-editor'
  | 'properties'
  | 'queries'
  | 'selection'
  | 'table-view'
  | 'theme'
  | 'ui-primitives'
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
  feature: IssueFeature;
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
  | 'issues';

export interface ActiveStory {
  groupIndex: number;
  itemIndex: number;
}
