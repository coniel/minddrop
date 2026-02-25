import React, { useCallback, useEffect, useReducer, useState } from 'react';
import {
  IconButton,
  MenuGroup,
  MenuItem,
  MenuLabel,
  Separator,
  Text,
} from '@minddrop/ui-primitives';
import { stories } from '@minddrop/ui-primitives/stories';
import { DevToolsPlaceholder } from '../DevToolsPlaceholder';
import { LogsPanel, SavedLogsPanel } from '../LogsPanel';
import { ActiveSection, ActiveStory, LogEntry, SavedLog } from '../types';
import {
  clearSavedLogsByFile,
  installConsoleInterceptors,
  loadSavedLogs,
  logsReducer,
  persistSavedLog,
  setLogListener,
} from '../utils';
import './DevTools.css';

const RESIZE_EDGES = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'] as const;
type ResizeEdge = (typeof RESIZE_EDGES)[number];

export const DevTools: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [windowMode, setWindowMode] = useState(
    () => JSON.parse(localStorage.getItem('dev-tools-window-mode') ?? 'false'),
  );
  const [windowSidebarOpen, setWindowSidebarOpen] = useState(false);
  const [windowPos, setWindowPos] = useState(
    () => JSON.parse(localStorage.getItem('dev-tools-window-pos') ?? 'null') ?? { x: 80, y: 80 },
  );
  const [windowSize, setWindowSize] = useState(
    () => JSON.parse(localStorage.getItem('dev-tools-window-size') ?? 'null') ?? { width: 680, height: 480 },
  );
  const [activeSection, setActiveSection] = useState<ActiveSection>('logs');
  const [activeStory, setActiveStory] = useState<ActiveStory>({
    groupIndex: 0,
    itemIndex: 0,
  });
  const [logs, dispatch] = useReducer(logsReducer, []);
  const [savedLogs, setSavedLogs] = useState<SavedLog[]>(() => loadSavedLogs());
  // 'live' shows the console; any other string is a filename showing saved logs.
  const [logsView, setLogsView] = useState<string>('live');

  useEffect(() => {
    localStorage.setItem('dev-tools-window-mode', JSON.stringify(windowMode));
  }, [windowMode]);

  useEffect(() => {
    localStorage.setItem('dev-tools-window-pos', JSON.stringify(windowPos));
  }, [windowPos]);

  useEffect(() => {
    localStorage.setItem('dev-tools-window-size', JSON.stringify(windowSize));
  }, [windowSize]);

  // Install console interceptors on first render
  useEffect(() => {
    installConsoleInterceptors();

    setLogListener((entry) => {
      dispatch({ type: 'add', entry });
    });

    return () => {
      setLogListener(null);
    };
  }, []);

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;

      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target.isContentEditable
      ) {
        return;
      }

      if (e.key === 'd') {
        e.preventDefault();
        setVisible((v) => !v);
      }

      if (e.key === 'Escape' && visible) {
        setVisible(false);
      }

      if (e.key === 'f' && visible) {
        e.preventDefault();
        setWindowMode((m) => {
          if (!m && activeSection === 'stories') setActiveSection('logs');
          return !m;
        });
      }

      if (e.key === 's' && visible && windowMode) {
        e.preventDefault();
        setWindowSidebarOpen((v) => !v);
      }

      if (e.key === 'q' && visible && windowMode) {
        e.preventDefault();
        const gap = 12;
        setWindowSize({ width: 500, height: window.innerHeight - gap * 2 });
        setWindowPos({ x: gap, y: gap });
      }

      if (e.key === 'w' && visible && windowMode) {
        e.preventDefault();
        const gap = 12;
        setWindowSize({ width: 500, height: window.innerHeight - gap * 2 });
        setWindowPos({ x: window.innerWidth - 500 - gap, y: gap });
      }

      if (e.key === 'j' && visible) {
        e.preventDefault();
        setActiveSection('logs');
      }

      if (e.key === 'k' && visible) {
        e.preventDefault();
        setActiveSection('state');
      }

      if (e.key === 'l' && visible) {
        e.preventDefault();
        setActiveSection('events');
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [visible, activeSection, windowMode]);

  const onSave = useCallback((entry: LogEntry) => {
    const log: SavedLog = {
      id: Date.now(),
      args: entry.args,
      file: entry.source?.file ?? 'unknown',
      line: entry.source?.line ?? 0,
      timestamp: entry.timestamp,
    };
    persistSavedLog(log);
    setSavedLogs(loadSavedLogs());
  }, []);

  const handleClearFile = useCallback((file: string) => {
    clearSavedLogsByFile(file);
    setSavedLogs((prev) => prev.filter((l) => l.file !== file));
    setLogsView((v) => (v === file ? 'live' : v));
  }, []);

  const handleMoveStart = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    e.preventDefault();
    const orig = { ...windowPos };
    const start = { x: e.clientX, y: e.clientY };

    const onMouseMove = (me: MouseEvent) => {
      setWindowPos({ x: orig.x + me.clientX - start.x, y: orig.y + me.clientY - start.y });
    };
    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  const handleResizeStart = (e: React.MouseEvent, edge: ResizeEdge) => {
    e.preventDefault();
    e.stopPropagation();
    const origPos = { ...windowPos };
    const origSize = { ...windowSize };
    const start = { x: e.clientX, y: e.clientY };

    const onMouseMove = (me: MouseEvent) => {
      const dx = me.clientX - start.x;
      const dy = me.clientY - start.y;
      let { x, y } = origPos;
      let { width, height } = origSize;

      if (edge.includes('e')) width = Math.max(320, origSize.width + dx);
      if (edge.includes('s')) height = Math.max(200, origSize.height + dy);
      if (edge.includes('w')) {
        width = Math.max(320, origSize.width - dx);
        x = origPos.x + origSize.width - width;
      }
      if (edge.includes('n')) {
        height = Math.max(200, origSize.height - dy);
        y = origPos.y + origSize.height - height;
      }

      setWindowPos({ x, y });
      setWindowSize({ width, height });
    };
    const onMouseUp = () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
  };

  if (!visible) return null;

  const group = stories[activeStory.groupIndex];
  const ActiveStoryComponent = group?.items[activeStory.itemIndex]?.component;

  const savedFiles = [...new Set(savedLogs.map((l) => l.file))];
  const savedLogsForView = savedLogs.filter((l) => l.file === logsView);

  const contentArea = (
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

      {activeSection === 'logs' && logsView === 'live' && (
        <LogsPanel
          logs={logs}
          onClear={() => dispatch({ type: 'clear' })}
          onSave={onSave}
        />
      )}

      {activeSection === 'logs' && logsView !== 'live' && (
        <SavedLogsPanel logs={savedLogsForView} />
      )}
    </main>
  );

  // --- Window mode ---
  if (windowMode) {
    return (
      <div
        className="dev-tools-window"
        style={{
          left: windowPos.x,
          top: windowPos.y,
          width: windowSize.width,
          height: windowSize.height,
        }}
      >
        {RESIZE_EDGES.map((edge) => (
          <div
            key={edge}
            className={`dev-tools-resize-handle dev-tools-resize-${edge}`}
            onMouseDown={(e) => handleResizeStart(e, edge)}
          />
        ))}

        <div className="dev-tools-window-header" onMouseDown={handleMoveStart}>
          <IconButton
            icon="panel-left"
            label="Toggle sidebar"
            size="sm"
            active={windowSidebarOpen}
            onClick={() => setWindowSidebarOpen((v) => !v)}
          />
          <div className="dev-tools-section-tabs">
            <IconButton
              icon="terminal"
              label="Logs"
              size="sm"
              active={activeSection === 'logs'}
              onClick={() => setActiveSection('logs')}
            />
            <IconButton
              icon="database"
              label="State"
              size="sm"
              active={activeSection === 'state'}
              onClick={() => setActiveSection('state')}
            />
            <IconButton
              icon="zap"
              label="Events"
              size="sm"
              active={activeSection === 'events'}
              onClick={() => setActiveSection('events')}
            />
          </div>
          <Text size="xs" color="subtle" mono style={{ marginLeft: 'auto' }}>
            d / esc / f / s
          </Text>
        </div>

        <div className="dev-tools-window-body">
          {windowSidebarOpen && (
            <aside className="dev-tools-sidebar dev-tools-sidebar-window">
              <nav className="dev-tools-nav">
                {activeSection === 'logs' && (
                  <>
                    <MenuGroup padded>
                      <MenuItem
                        label="Console"
                        icon="terminal"
                        size="compact"
                        active={logsView === 'live'}
                        onClick={() => setLogsView('live')}
                      />
                    </MenuGroup>

                    {savedFiles.length > 0 && (
                      <>
                        <Separator margin="small" />
                        <MenuGroup padded>
                          <MenuLabel label="Saved" />
                          {savedFiles.map((file) => (
                            <MenuItem
                              key={file}
                              label={file}
                              size="compact"
                              active={logsView === file}
                              onClick={() => setLogsView(file)}
                              actions={
                                <IconButton
                                  icon="x"
                                  label={`Clear ${file}`}
                                  size="sm"
                                  onClick={() => handleClearFile(file)}
                                />
                              }
                            />
                          ))}
                        </MenuGroup>
                      </>
                    )}
                  </>
                )}
              </nav>
            </aside>
          )}
          {contentArea}
        </div>
      </div>
    );
  }

  // --- Fullscreen mode ---
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
              d / esc / f
            </Text>
          </div>

          <div className="dev-tools-section-tabs">
            <IconButton
              icon="terminal"
              label="Logs"
              size="sm"
              active={activeSection === 'logs'}
              onClick={() => setActiveSection('logs')}
            />
            <IconButton
              icon="database"
              label="State"
              size="sm"
              active={activeSection === 'state'}
              onClick={() => setActiveSection('state')}
            />
            <IconButton
              icon="zap"
              label="Events"
              size="sm"
              active={activeSection === 'events'}
              onClick={() => setActiveSection('events')}
            />
            <IconButton
              icon="book-open"
              label="Stories"
              size="sm"
              active={activeSection === 'stories'}
              onClick={() => setActiveSection('stories')}
            />
          </div>

          <nav className="dev-tools-nav">
            {activeSection === 'logs' && (
              <>
                <MenuGroup padded>
                  <MenuItem
                    label="Console"
                    icon="terminal"
                    size="compact"
                    active={logsView === 'live'}
                    onClick={() => setLogsView('live')}
                  />
                </MenuGroup>

                {savedFiles.length > 0 && (
                  <>
                    <Separator margin="small" />
                    <MenuGroup padded>
                      <MenuLabel label="Saved" />
                      {savedFiles.map((file) => (
                        <MenuItem
                          key={file}
                          label={file}
                          size="compact"
                          active={logsView === file}
                          onClick={() => setLogsView(file)}
                          actions={
                            <IconButton
                              icon="x"
                              label={`Clear ${file}`}
                              size="sm"
                              onClick={() => handleClearFile(file)}
                            />
                          }
                        />
                      ))}
                    </MenuGroup>
                  </>
                )}
              </>
            )}

            {activeSection === 'stories' && (
              <>
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
        {contentArea}
      </div>
    </div>
  );
};
