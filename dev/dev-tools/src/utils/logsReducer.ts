import { LogEntry } from '../types';
import { MAX_LOGS } from './consoleInterceptor';

export type LogsAction = { type: 'add'; entry: LogEntry } | { type: 'clear' };

export function logsReducer(state: LogEntry[], action: LogsAction): LogEntry[] {
  switch (action.type) {
    case 'add':
      return [...state, action.entry].slice(-MAX_LOGS);
    case 'clear':
      return [];
  }
}
