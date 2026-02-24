export type LogLevel = 'log' | 'info' | 'warn' | 'error';

export interface LogEntry {
  id: number;
  level: LogLevel;
  args: unknown[];
  timestamp: number;
  source?: { file: string; line: number };
}

export type ActiveSection = 'stories' | 'state' | 'events' | 'logs';

export interface ActiveStory {
  groupIndex: number;
  itemIndex: number;
}
