import React, { useEffect, useReducer, useRef, useState } from 'react';
import {
  MenuGroup,
  MenuItem,
  MenuLabel,
  Separator,
  Stack,
  Text,
} from '@minddrop/ui-primitives';
import { stories } from '@minddrop/ui-primitives/stories';
import './DevTools.css';

/* ============================================================
   CONSOLE INTERCEPTOR
   Installed on first render, captures logs into component state.
   ============================================================ */

export type LogLevel = 'log' | 'info' | 'warn' | 'error';

export interface LogEntry {
  id: number;
  level: LogLevel;
  args: unknown[];
  timestamp: number;
}

const MAX_LOGS = 200;

let interceptorsInstalled = false;
let logListener: ((entry: LogEntry) => void) | null = null;
let logCounter = 0;

function installInterceptors() {
  if (interceptorsInstalled) return;
  interceptorsInstalled = true;

  const levels: LogLevel[] = ['log', 'info', 'warn', 'error'];

  levels.forEach((level) => {
    const original = console[level].bind(console);

    console[level] = (...args: unknown[]) => {
      original(...args);

      logListener?.({
        id: ++logCounter,
        level,
        args,
        timestamp: Date.now(),
      });
    };
  });
}

/* ============================================================
   TYPES
   ============================================================ */

type ActiveSection = 'stories' | 'state' | 'events' | 'logs';

interface ActiveStory {
  groupIndex: number;
  itemIndex: number;
}

/* ============================================================
   DEV TOOLS
   ============================================================ */

export const DevTools: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [activeSection, setActiveSection] = useState<ActiveSection>('stories');
  const [activeStory, setActiveStory] = useState<ActiveStory>({
    groupIndex: 0,
    itemIndex: 0,
  });
  const [logs, dispatch] = useReducer(logsReducer, []);

  // Install console interceptors on first render
  useEffect(() => {
    installInterceptors();

    logListener = (entry) => {
      dispatch({ type: 'add', entry });
    };

    return () => {
      logListener = null;
    };
  }, []);

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if originating from an input or contenteditable
      const target = e.target as HTMLElement;
      e.preventDefault();

      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target.isContentEditable
      ) {
        return;
      }

      if (e.key === 'd') {
        setVisible((v) => !v);
      }

      if (e.key === 'Escape' && visible) {
        setVisible(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [visible]);

  if (!visible) return null;

  const activeStoryComponent = (() => {
    const group = stories[activeStory.groupIndex];

    if (!group) return null;
    const item = group.items[activeStory.itemIndex];

    if (!item) return null;

    return item.component;
  })();

  const ActiveStoryComponent = activeStoryComponent;

  return (
    <div className="dev-tools-overlay">
      <div className="dev-tools">
        {/* --- Sidebar --- */}
        <aside className="dev-tools-sidebar">
          <div className="dev-tools-sidebar-header">
            <Text size="sm" weight="semibold">
              DevTools
            </Text>
            <Text size="xs" color="subtle" mono>
              d / esc
            </Text>
          </div>

          <nav className="dev-tools-nav">
            {/* Top-level sections */}
            <MenuGroup padded>
              <MenuItem
                label="Stories"
                icon="book-open"
                active={activeSection === 'stories'}
                onClick={() => setActiveSection('stories')}
              />
              <MenuItem
                label="State"
                icon="database"
                active={activeSection === 'state'}
                onClick={() => setActiveSection('state')}
              />
              <MenuItem
                label="Events"
                icon="zap"
                active={activeSection === 'events'}
                onClick={() => setActiveSection('events')}
              />
              <MenuItem
                label="Logs"
                icon="terminal"
                active={activeSection === 'logs'}
                onClick={() => setActiveSection('logs')}
              />
            </MenuGroup>

            {/* Story groups */}
            {activeSection === 'stories' && (
              <>
                <Separator margin="small" />
                {stories.map((group, groupIndex) => (
                  <MenuGroup key={group.group} padded>
                    <MenuLabel label={group.group} />
                    {group.items.map((item, itemIndex) => (
                      <MenuItem
                        key={item.label}
                        label={item.label}
                        size="compact"
                        active={
                          activeStory.groupIndex === groupIndex &&
                          activeStory.itemIndex === itemIndex
                        }
                        onClick={() =>
                          setActiveStory({ groupIndex, itemIndex })
                        }
                      />
                    ))}
                  </MenuGroup>
                ))}
              </>
            )}
          </nav>
        </aside>

        {/* --- Content --- */}
        <main className="dev-tools-content">
          {activeSection === 'stories' && ActiveStoryComponent && (
            <div className="dev-tools-story">
              <ActiveStoryComponent />
            </div>
          )}

          {activeSection === 'state' && (
            <DevToolsPlaceholder
              icon="database"
              title="State inspector"
              description="Import and register your state stores to inspect them here."
            />
          )}

          {activeSection === 'events' && (
            <DevToolsPlaceholder
              icon="zap"
              title="Event log"
              description="Add a catch-all listener to your event bus to stream events here."
            />
          )}

          {activeSection === 'logs' && (
            <LogsPanel
              logs={logs}
              onClear={() => dispatch({ type: 'clear' })}
            />
          )}
        </main>
      </div>
    </div>
  );
};

/* ============================================================
   LOGS PANEL
   ============================================================ */

interface LogsPanelProps {
  logs: LogEntry[];
  onClear: () => void;
}

const LogsPanel: React.FC<LogsPanelProps> = ({ logs, onClear }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="dev-tools-logs">
      <div className="dev-tools-logs-toolbar">
        <Text size="sm" weight="medium">
          Console
        </Text>
        <Text
          size="xs"
          color="muted"
          style={{ marginLeft: 'auto', cursor: 'pointer' }}
          onClick={onClear}
        >
          Clear
        </Text>
      </div>
      <div className="dev-tools-logs-list">
        {logs.length === 0 && (
          <Text size="sm" color="subtle" style={{ padding: 'var(--space-4)' }}>
            No logs yet.
          </Text>
        )}
        {logs.map((entry) => (
          <div
            key={entry.id}
            className={`dev-tools-log-entry dev-tools-log-${entry.level}`}
          >
            <Text mono size="xs" color="subtle" className="dev-tools-log-time">
              {new Date(entry.timestamp).toLocaleTimeString()}
            </Text>
            <Text mono size="xs" className="dev-tools-log-message">
              {entry.args.map((arg) => formatArg(arg)).join(' ')}
            </Text>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
};

/* ============================================================
   PLACEHOLDER
   ============================================================ */

interface DevToolsPlaceholderProps {
  icon: string;
  title: string;
  description: string;
}

const DevToolsPlaceholder: React.FC<DevToolsPlaceholderProps> = ({
  title,
  description,
}) => (
  <div className="dev-tools-placeholder">
    <Stack align="center" gap={2}>
      <Text size="lg" weight="semibold" color="muted">
        {title}
      </Text>
      <Text
        size="sm"
        color="subtle"
        style={{ maxWidth: 320, textAlign: 'center' }}
      >
        {description}
      </Text>
    </Stack>
  </div>
);

/* ============================================================
   HELPERS
   ============================================================ */

type LogsAction = { type: 'add'; entry: LogEntry } | { type: 'clear' };

function logsReducer(state: LogEntry[], action: LogsAction): LogEntry[] {
  switch (action.type) {
    case 'add':
      return [...state, action.entry].slice(-MAX_LOGS);
    case 'clear':
      return [];
  }
}

function formatArg(arg: unknown): string {
  if (typeof arg === 'string') return arg;

  if (arg instanceof Error) return `${arg.name}: ${arg.message}`;

  try {
    return JSON.stringify(arg, null, 2);
  } catch {
    return String(arg);
  }
}
