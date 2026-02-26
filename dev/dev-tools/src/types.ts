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

export type ActiveSection = 'stories' | 'state' | 'events' | 'logs' | 'notes';

export interface ActiveStory {
  groupIndex: number;
  itemIndex: number;
}
