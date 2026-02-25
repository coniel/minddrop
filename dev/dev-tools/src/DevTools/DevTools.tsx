import React, { useCallback, useEffect, useMemo, useReducer, useState, useSyncExternalStore } from 'react';

function useTime() {
  return useSyncExternalStore(
    (cb) => {
      const id = setInterval(cb, 10000);
      return () => clearInterval(id);
    },
    () => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
  );
}
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
import { Events } from '@minddrop/events';
import { DatabasesStateView, useDatabaseStoreCounts } from '../StateInspector';
import { EventsPanel, nextEventId } from '../EventsPanel';
import { ListenerEntry, ListenersPanel } from '../ListenersPanel';
import { LogsPanel, SavedLogsPanel } from '../LogsPanel';
import { ActiveSection, ActiveStory, LogEntry, SavedLog } from '../types';
import {
  clearSavedLogsByFile,
  eventsReducer,
  installConsoleInterceptors,
  loadSavedLogs,
  logsReducer,
  persistSavedLog,
  setLogListener,
} from '../utils';
import './DevTools.css';

const RESIZE_EDGES = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'] as const;
type ResizeEdge = (typeof RESIZE_EDGES)[number];

interface EventTreeNode {
  segment: string;
  fullPath: string;
  count: number;
  children: EventTreeNode[];
}

const STATE_STORES = [
  { id: 'databases', label: 'Databases' },
  { id: 'database-entries', label: 'Entries' },
  { id: 'database-templates', label: 'Templates' },
] as const;

type StateView = (typeof STATE_STORES)[number]['id'];

export const DevTools: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [windowMode, setWindowMode] = useState(
    () => JSON.parse(localStorage.getItem('dev-tools-window-mode') ?? 'false'),
  );
  const [windowSidebarOpen, setWindowSidebarOpen] = useState(false);
  const [windowPos, setWindowPos] = useState(
    () => JSON.parse(localStorage.getItem('dev-tools-window-pos') ?? 'null') ?? { x: 80, y: 80 },
  );
  const windowPosRef = React.useRef(windowPos);
  windowPosRef.current = windowPos;
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
  const [stateView, setStateView] = useState<StateView>('databases');
  const storeCounts = useDatabaseStoreCounts();
  const [events, dispatchEvent] = useReducer(eventsReducer, []);
  const [eventsView, setEventsView] = useState('all');
  const [openNodes, setOpenNodes] = useState<Set<string>>(new Set());
  const [activeEventsTab, setActiveEventsTab] = useState<'events' | 'listeners'>('events');
  const [listenersView, setListenersView] = useState('all');
  const [listenersTick, setListenersTick] = useState(0);
  const [showHelp, setShowHelp] = useState(false);
  const time = useTime();

  const allListeners = useMemo((): ListenerEntry[] => {
    const result: ListenerEntry[] = [];
    for (const [eventName, { listeners }] of Object.entries(Events.listeners)) {
      if (eventName === '*') continue;
      for (const listener of listeners) {
        result.push({ eventName, id: listener.id });
      }
    }
    return result;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listenersTick]);

  const listenersTree = useMemo(() => {
    interface RawNode {
      children: Map<string, RawNode>;
      count: number;
      fullPath: string;
    }
    const root: RawNode = { children: new Map(), count: 0, fullPath: '' };
    const eventCounts = new Map<string, number>();
    for (const { eventName } of allListeners) {
      eventCounts.set(eventName, (eventCounts.get(eventName) ?? 0) + 1);
    }
    for (const [eventName, count] of eventCounts) {
      const parts = eventName.split(':');
      let node = root;
      let path = '';
      for (const part of parts) {
        path = path ? `${path}:${part}` : part;
        if (!node.children.has(part)) {
          node.children.set(part, { children: new Map(), count: 0, fullPath: path });
        }
        node.children.get(part)!.count += count;
        node = node.children.get(part)!;
      }
    }
    function toArray(rawNode: RawNode): EventTreeNode[] {
      return [...rawNode.children.values()].map((child) => ({
        segment: child.fullPath.split(':').pop()!,
        fullPath: child.fullPath,
        count: child.count,
        children: toArray(child),
      }));
    }
    return toArray(root);
  }, [allListeners]);

  const eventTree = useMemo(() => {
    interface RawNode {
      children: Map<string, RawNode>;
      count: number;
      fullPath: string;
    }

    const exactCounts = new Map<string, number>();
    for (const e of events) {
      exactCounts.set(e.name, (exactCounts.get(e.name) ?? 0) + 1);
    }

    const root: RawNode = { children: new Map(), count: 0, fullPath: '' };
    const seen = new Set<string>();

    for (let i = events.length - 1; i >= 0; i--) {
      const name = events[i].name;
      if (seen.has(name)) continue;
      seen.add(name);

      const count = exactCounts.get(name)!;
      const parts = name.split(':');
      let node = root;
      let path = '';
      for (const part of parts) {
        path = path ? `${path}:${part}` : part;
        if (!node.children.has(part)) {
          node.children.set(part, { children: new Map(), count: 0, fullPath: path });
        }
        node.children.get(part)!.count += count;
        node = node.children.get(part)!;
      }
    }

    function toArray(rawNode: RawNode): EventTreeNode[] {
      return [...rawNode.children.values()].map((child) => ({
        segment: child.fullPath.split(':').pop()!,
        fullPath: child.fullPath,
        count: child.count,
        children: toArray(child),
      }));
    }

    return toArray(root);
  }, [events]);

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

  // Catch-all event listener
  useEffect(() => {
    Events.on('*', 'dev-tools-events-panel', (event) => {
      if (event.name === '*') return;
      dispatchEvent({
        type: 'add',
        entry: {
          id: nextEventId(),
          name: event.name,
          data: event.data,
          timestamp: Date.now(),
        },
      });
    });
    return () => Events.removeListener('*', 'dev-tools-events-panel');
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

      if (e.key === 'Escape' && visible && showHelp) {
        setShowHelp(false);
      }

      if (e.key === '?' && visible) {
        e.preventDefault();
        setShowHelp((v) => !v);
      }

      if (e.key === 'f' && visible) {
        e.preventDefault();
        setWindowMode((m) => {
          if (!m && activeSection === 'stories') setActiveSection('logs');
          return !m;
        });
      }

      if (e.key === 'a' && visible && windowMode) {
        e.preventDefault();
        setWindowSidebarOpen((v) => !v);
      }

      if (e.key === 's' && visible) {
        e.preventDefault();
        let selector = '';
        if (activeSection === 'logs') selector = '.dev-tools-search';
        else if (activeSection === 'state') selector = '.store-inspector-search-input';
        else if (activeSection === 'events' && activeEventsTab === 'events') selector = '.events-panel-search-input';
        else if (activeSection === 'events' && activeEventsTab === 'listeners') selector = '.listeners-panel-search-input';
        if (selector) {
          const input = document.querySelector<HTMLInputElement>(selector);
          input?.focus();
          input?.select();
        }
      }

      if (e.key === 'Tab' && visible && windowMode) {
        e.preventDefault();
        const gap = 12;
        const snapWidth = 500;
        const height = window.innerHeight - gap * 2;
        if (windowPosRef.current.x === gap) {
          setWindowSize({ width: snapWidth, height });
          setWindowPos({ x: window.innerWidth - snapWidth - gap, y: gap });
        } else {
          setWindowSize({ width: snapWidth, height });
          setWindowPos({ x: gap, y: gap });
        }
      }

      if (e.key === '[' && visible && windowMode) {
        e.preventDefault();
        const gap = 12;
        setWindowSize({ width: 500, height: window.innerHeight - gap * 2 });
        setWindowPos({ x: gap, y: gap });
      }

      if (e.key === ']' && visible && windowMode) {
        e.preventDefault();
        const gap = 12;
        setWindowSize({ width: 500, height: window.innerHeight - gap * 2 });
        setWindowPos({ x: window.innerWidth - 500 - gap, y: gap });
      }

      if (e.key === 'q' && visible) {
        e.preventDefault();
        setActiveSection('logs');
      }

      if (e.key === 'w' && visible) {
        e.preventDefault();
        setActiveSection('state');
      }

      if (e.key === 'e' && visible) {
        e.preventDefault();
        setActiveSection('events');
      }

      if (e.key === 'c' && visible) {
        e.preventDefault();
        if (activeSection === 'events') {
          dispatchEvent({ type: 'clear' });
          setEventsView('all');
          setOpenNodes(new Set());
        } else if (activeSection === 'logs') {
          dispatch({ type: 'clear' });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [visible, activeSection, windowMode, showHelp, activeEventsTab]);

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

  const renderEventNode = (node: EventTreeNode, depth: number): React.ReactNode => {
    const isOpen = openNodes.has(node.fullPath);
    const hasChildren = node.children.length > 0;
    const isActive = activeEventsTab === 'events' && eventsView === node.fullPath;

    const toggle = () => {
      setActiveEventsTab('events');
      setEventsView(node.fullPath);
      if (hasChildren) {
        setOpenNodes((prev) => {
          const next = new Set(prev);
          if (isActive && next.has(node.fullPath)) next.delete(node.fullPath);
          else next.add(node.fullPath);
          return next;
        });
      }
    };

    const item = (
      <>
        <MenuItem size="compact" active={isActive} onClick={toggle}>
          <span className="dev-tools-store-item-label">
            <span className="dev-tools-events-source-label">
              {hasChildren && (
                <span className="dev-tools-events-chevron">
                  {isOpen ? '▾' : '▸'}
                </span>
              )}
              {node.segment}
            </span>
            <span className="dev-tools-count-badge">{node.count}</span>
          </span>
        </MenuItem>
        {isOpen && hasChildren && (
          <div className="dev-tools-events-children">
            {node.children.map((child) => renderEventNode(child, depth + 1))}
          </div>
        )}
      </>
    );

    if (depth === 0) {
      return <MenuGroup key={node.fullPath} padded>{item}</MenuGroup>;
    }
    return <React.Fragment key={node.fullPath}>{item}</React.Fragment>;
  };

  const renderListenerNode = (node: EventTreeNode): React.ReactNode => (
    <MenuGroup key={node.fullPath} padded>
      <MenuItem
        size="compact"
        active={activeEventsTab === 'listeners' && listenersView === node.fullPath}
        onClick={() => { setActiveEventsTab('listeners'); setListenersView(node.fullPath); }}
      >
        <span className="dev-tools-store-item-label">
          {node.segment}
          <span className="dev-tools-count-badge">{node.count}</span>
        </span>
      </MenuItem>
    </MenuGroup>
  );

  const helpOverlay = showHelp && (
    <div className="dev-tools-help-overlay" onClick={() => setShowHelp(false)}>
      <div className="dev-tools-help-card" onClick={(e) => e.stopPropagation()}>
        <div className="dev-tools-help-group">
          <div className="dev-tools-help-group-title">General</div>
          {[
            ['d', 'Toggle DevTools'],
            ['?', 'Help'],
          ].map(([key, label]) => (
            <div key={key} className="dev-tools-help-row">
              <kbd className="dev-tools-help-key">{key}</kbd>
              <span>{label}</span>
            </div>
          ))}
        </div>
        <div className="dev-tools-help-group">
          <div className="dev-tools-help-group-title">Window</div>
          {[
            ['f', 'Toggle fullscreen'],
            ['a', 'Toggle sidebar'],
            ['Tab', 'Snap left / right'],
            ['[', 'Snap left'],
            [']', 'Snap right'],
          ].map(([key, label]) => (
            <div key={key} className="dev-tools-help-row">
              <kbd className="dev-tools-help-key">{key}</kbd>
              <span>{label}</span>
            </div>
          ))}
        </div>
        <div className="dev-tools-help-group">
          <div className="dev-tools-help-group-title">Navigation</div>
          {[
            ['q', 'Logs'],
            ['w', 'State'],
            ['e', 'Events'],
          ].map(([key, label]) => (
            <div key={key} className="dev-tools-help-row">
              <kbd className="dev-tools-help-key">{key}</kbd>
              <span>{label}</span>
            </div>
          ))}
        </div>
        <div className="dev-tools-help-group">
          <div className="dev-tools-help-group-title">View</div>
          {[
            ['c', 'Clear view'],
            ['s', 'Focus search'],
          ].map(([key, label]) => (
            <div key={key} className="dev-tools-help-row">
              <kbd className="dev-tools-help-key">{key}</kbd>
              <span>{label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

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
        <DatabasesStateView stateView={stateView} />
      )}

      {activeSection === 'events' && activeEventsTab === 'events' && (
        <EventsPanel
          events={events}
          eventsView={eventsView}
          onClear={() => {
            dispatchEvent({ type: 'clear' });
            setEventsView('all');
            setOpenNodes(new Set());
          }}
        />
      )}

      {activeSection === 'events' && activeEventsTab === 'listeners' && (
        <ListenersPanel
          listeners={allListeners}
          listenersView={listenersView}
          onRefresh={() => setListenersTick((t) => t + 1)}
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
            {time}
          </Text>
        </div>

        {helpOverlay}

        <div className="dev-tools-window-body">
          {windowSidebarOpen && (
            <aside className="dev-tools-sidebar dev-tools-sidebar-window">
              <nav className="dev-tools-nav">
                {activeSection === 'state' && (
                  <MenuGroup padded>
                    <MenuLabel label="Databases" />
                    {STATE_STORES.map(({ id, label }) => (
                      <MenuItem
                        key={id}
                        size="compact"
                        active={stateView === id}
                        onClick={() => setStateView(id)}
                      >
                        <span className="dev-tools-store-item-label">
                          {label}
                          <span className="dev-tools-count-badge">
                            {storeCounts[id]}
                          </span>
                        </span>
                      </MenuItem>
                    ))}
                  </MenuGroup>
                )}

                {activeSection === 'events' && (
                  <>
                    <MenuGroup padded>
                      <MenuItem
                        size="compact"
                        active={activeEventsTab === 'events' && eventsView === 'all'}
                        onClick={() => { setActiveEventsTab('events'); setEventsView('all'); }}
                      >
                        <span className="dev-tools-store-item-label">
                          All Events
                          <span className="dev-tools-count-badge">{events.length}</span>
                        </span>
                      </MenuItem>
                    </MenuGroup>
                    {eventTree.map((node) => renderEventNode(node, 0))}
                    <Separator margin="small" />
                    <MenuGroup padded>
                      <MenuItem
                        size="compact"
                        active={activeEventsTab === 'listeners' && listenersView === 'all'}
                        onClick={() => { setActiveEventsTab('listeners'); setListenersView('all'); }}
                      >
                        <span className="dev-tools-store-item-label">
                          All Listeners
                          <span className="dev-tools-count-badge">{allListeners.length}</span>
                        </span>
                      </MenuItem>
                    </MenuGroup>
                    {listenersTree.map((node) => renderListenerNode(node))}
                  </>
                )}

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
      {helpOverlay}
      <div className="dev-tools">
        {/* --- Sidebar --- */}
        <aside className="dev-tools-sidebar">
          <div className="dev-tools-sidebar-header">
            <Text size="sm" weight="semibold">
              DevTools
            </Text>
            <Text size="xs" color="subtle" mono>
              {time}
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

            {activeSection === 'state' && (
              <MenuGroup padded>
                <MenuLabel label="Databases" />
                {STATE_STORES.map(({ id, label }) => (
                  <MenuItem
                    key={id}
                    size="compact"
                    active={stateView === id}
                    onClick={() => setStateView(id)}
                  >
                    <span className="dev-tools-store-item-label">
                      {label}
                      <span className="dev-tools-count-badge">
                        {storeCounts[id]}
                      </span>
                    </span>
                  </MenuItem>
                ))}
              </MenuGroup>
            )}

            {activeSection === 'events' && (
              <>
                <MenuGroup padded>
                  <MenuItem
                    size="compact"
                    active={activeEventsTab === 'events' && eventsView === 'all'}
                    onClick={() => { setActiveEventsTab('events'); setEventsView('all'); }}
                  >
                    <span className="dev-tools-store-item-label">
                      All Events
                      <span className="dev-tools-count-badge">{events.length}</span>
                    </span>
                  </MenuItem>
                </MenuGroup>
                {eventTree.map((node) => renderEventNode(node, 0))}
                <Separator margin="small" />
                <MenuGroup padded>
                  <MenuItem
                    size="compact"
                    active={activeEventsTab === 'listeners' && listenersView === 'all'}
                    onClick={() => { setActiveEventsTab('listeners'); setListenersView('all'); }}
                  >
                    <span className="dev-tools-store-item-label">
                      All Listeners
                      <span className="dev-tools-count-badge">{allListeners.length}</span>
                    </span>
                  </MenuItem>
                </MenuGroup>
                {listenersTree.map((node) => renderListenerNode(node))}
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
