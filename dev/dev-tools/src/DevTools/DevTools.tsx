import React, {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import { Events } from '@minddrop/events';
import { Fs } from '@minddrop/file-system';
import {
  IconButton,
  MenuGroup,
  MenuItem,
  MenuLabel,
  Separator,
  Text,
} from '@minddrop/ui-primitives';
import { stories } from '@minddrop/ui-primitives/stories';
import { Workspaces } from '@minddrop/workspaces';
import { EventsPanel, nextEventId } from '../EventsPanel';
import { ListenerEntry, ListenersPanel } from '../ListenersPanel';
import { IssuesPanel } from '../IssuesPanel';
import { ISSUE_PACKAGES, TYPE_COLORS } from '../IssuesPanel/constants';
import { NewIssueData, NewIssueDialog } from '../NewIssueDialog';
import { LogsPanel, SavedLogsPanel } from '../LogsPanel';
import { NotesPanel } from '../NotesPanel';
import {
  DatabasesStateView,
  DatabasesStateViewId,
  DesignsStateView,
  QueriesStateView,
  ViewsStateView,
  ViewsStateViewId,
  WorkspacesStateView,
  useDatabaseStoreCounts,
  useDesignsStoreCounts,
  useQueriesStoreCounts,
  useViewsStoreCounts,
  useWorkspacesStoreCounts,
} from '../StateInspector';
import {
  ActiveSection,
  ActiveStory,
  Issue,
  IssuePackage,
  IssuePriority,
  IssueStatus,
  IssueType,
  LogEntry,
  Note,
  SavedLog,
} from '../types';
import {
  clearSavedLogsByFile,
  eventsReducer,
  installConsoleInterceptors,
  loadSavedLogs,
  logsReducer,
  parseIssueFrontmatter,
  persistSavedLog,
  serializeIssueFrontmatter,
  setLogListener,
} from '../utils';
import './DevTools.css';

function useTime() {
  return useSyncExternalStore(
    (cb) => {
      const id = setInterval(cb, 10000);
      return () => clearInterval(id);
    },
    () =>
      new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }),
  );
}

const RESIZE_EDGES = ['n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw'] as const;
type ResizeEdge = (typeof RESIZE_EDGES)[number];

interface EventTreeNode {
  segment: string;
  fullPath: string;
  count: number;
  children: EventTreeNode[];
}

const STATE_STORE_GROUPS = [
  {
    label: 'Databases',
    stores: [
      { id: 'databases' as const, label: 'Databases' },
      { id: 'database-entries' as const, label: 'Entries' },
      { id: 'database-templates' as const, label: 'Templates' },
      { id: 'database-automations' as const, label: 'Automations' },
      { id: 'database-serializers' as const, label: 'Serializers' },
    ],
  },
  {
    label: 'Content',
    stores: [
      { id: 'workspaces' as const, label: 'Workspaces' },
      { id: 'designs' as const, label: 'Designs' },
      { id: 'queries' as const, label: 'Queries' },
      { id: 'views' as const, label: 'Views' },
      { id: 'view-types' as const, label: 'View Types' },
    ],
  },
];

type StateView =
  | DatabasesStateViewId
  | 'workspaces'
  | 'designs'
  | 'queries'
  | ViewsStateViewId;

let noteIdCounter = 0;

function nextNoteId() {
  noteIdCounter += 1;

  return noteIdCounter;
}

function getNotesDirPath(workspacePath: string) {
  return Fs.concatPath(workspacePath, 'dev', 'notes');
}

function focusEditorToEnd() {
  const editorElement = document.querySelector<HTMLElement>(
    '.notes-panel-editor .editor',
  );

  if (!editorElement) {
    return;
  }

  editorElement.focus();

  const selection = window.getSelection();
  const range = document.createRange();
  range.selectNodeContents(editorElement);
  range.collapse(false);
  selection?.removeAllRanges();
  selection?.addRange(range);
}

let issueIdCounter = 0;

function nextIssueId() {
  issueIdCounter += 1;

  return issueIdCounter;
}

function getIssuesDirPath(workspacePath: string) {
  return Fs.concatPath(workspacePath, 'dev', 'issues');
}

function getDevConfigPath(workspacePath: string) {
  return Fs.concatPath(workspacePath, 'dev', 'config.json');
}

interface DevConfig {
  lastIssueNumber: number;
}

async function readDevConfig(workspacePath: string): Promise<DevConfig> {
  try {
    const raw = await Fs.readTextFile(getDevConfigPath(workspacePath));

    return JSON.parse(raw);
  } catch {
    return { lastIssueNumber: 0 };
  }
}

async function writeDevConfig(
  workspacePath: string,
  config: DevConfig,
): Promise<void> {
  await Fs.writeTextFile(
    getDevConfigPath(workspacePath),
    JSON.stringify(config, null, 2) + '\n',
  );
}

function sanitizeFileName(name: string): string {
  return name.replace(/[/\\:*?"<>|]/g, '').trim() || 'New Issue';
}

function getNoteFileTitle(content: string): string {
  const firstLine = content
    .split('\n')[0]
    .replace(/^#+\s*/, '')
    .trim();

  return firstLine.replace(/[/\\:*?"<>|]/g, '').trim() || 'Note';
}

export const DevTools: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [windowMode, setWindowMode] = useState(() =>
    JSON.parse(localStorage.getItem('dev-tools-window-mode') ?? 'false'),
  );
  const [windowSidebarOpen, setWindowSidebarOpen] = useState(false);
  const [windowPos, setWindowPos] = useState(
    () =>
      JSON.parse(localStorage.getItem('dev-tools-window-pos') ?? 'null') ?? {
        x: 80,
        y: 80,
      },
  );
  const windowPosRef = React.useRef(windowPos);
  windowPosRef.current = windowPos;
  const [windowSize, setWindowSize] = useState(
    () =>
      JSON.parse(localStorage.getItem('dev-tools-window-size') ?? 'null') ?? {
        width: 680,
        height: 480,
      },
  );
  const [activeSection, setActiveSection] = useState<ActiveSection>(
    () =>
      (localStorage.getItem('dev-tools-active-section') as ActiveSection) ??
      'logs',
  );
  const [activeStory, setActiveStory] = useState<ActiveStory>(
    () =>
      JSON.parse(
        localStorage.getItem('dev-tools-active-story') ?? 'null',
      ) ?? { groupIndex: 0, itemIndex: 0 },
  );
  const [logs, dispatch] = useReducer(logsReducer, []);
  const [savedLogs, setSavedLogs] = useState<SavedLog[]>(() => loadSavedLogs());
  // 'live' shows the console; any other string is a filename showing saved logs.
  const [logsView, setLogsView] = useState<string>(
    () => localStorage.getItem('dev-tools-logs-view') ?? 'live',
  );
  const [stateView, setStateView] = useState<StateView>(
    () =>
      (localStorage.getItem('dev-tools-state-view') as StateView) ??
      'databases',
  );
  const databaseStoreCounts = useDatabaseStoreCounts();
  const workspacesStoreCounts = useWorkspacesStoreCounts();
  const designsStoreCounts = useDesignsStoreCounts();
  const queriesStoreCounts = useQueriesStoreCounts();
  const viewsStoreCounts = useViewsStoreCounts();
  const storeCounts: Record<StateView, number> = {
    ...databaseStoreCounts,
    ...workspacesStoreCounts,
    ...designsStoreCounts,
    ...queriesStoreCounts,
    ...viewsStoreCounts,
  };
  const workspacePath = Workspaces.useAll()[0]?.path ?? '';
  const [notes, setNotes] = useState<Note[]>([]);
  const notesRef = useRef(notes);
  notesRef.current = notes;
  const [openNoteIds, setOpenNoteIds] = useState<number[]>([]);
  const [activeNoteId, setActiveNoteId] = useState<number | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const issuesRef = useRef(issues);
  issuesRef.current = issues;
  const [selectedIssueId, setSelectedIssueId] = useState<number | null>(null);
  const [events, dispatchEvent] = useReducer(eventsReducer, []);
  const [eventsView, setEventsView] = useState(
    () => localStorage.getItem('dev-tools-events-view') ?? 'all',
  );
  const [openNodes, setOpenNodes] = useState<Set<string>>(new Set());
  const [activeEventsTab, setActiveEventsTab] = useState<
    'events' | 'listeners'
  >(
    () =>
      (localStorage.getItem('dev-tools-events-tab') as
        | 'events'
        | 'listeners') ?? 'events',
  );
  const [listenersView, setListenersView] = useState(
    () => localStorage.getItem('dev-tools-listeners-view') ?? 'all',
  );
  const [listenersTick, setListenersTick] = useState(0);
  const [showHelp, setShowHelp] = useState(false);
  const [showNewIssueDialog, setShowNewIssueDialog] = useState(false);
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
          node.children.set(part, {
            children: new Map(),
            count: 0,
            fullPath: path,
          });
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
          node.children.set(part, {
            children: new Map(),
            count: 0,
            fullPath: path,
          });
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

  useEffect(() => {
    localStorage.setItem('dev-tools-active-section', activeSection);
  }, [activeSection]);

  useEffect(() => {
    localStorage.setItem(
      'dev-tools-active-story',
      JSON.stringify(activeStory),
    );
  }, [activeStory]);

  useEffect(() => {
    localStorage.setItem('dev-tools-logs-view', logsView);
  }, [logsView]);

  useEffect(() => {
    localStorage.setItem('dev-tools-state-view', stateView);
  }, [stateView]);

  useEffect(() => {
    localStorage.setItem('dev-tools-events-view', eventsView);
  }, [eventsView]);

  useEffect(() => {
    localStorage.setItem('dev-tools-events-tab', activeEventsTab);
  }, [activeEventsTab]);

  useEffect(() => {
    localStorage.setItem('dev-tools-listeners-view', listenersView);
  }, [listenersView]);

  useEffect(() => {
    const activeNote = notes.find((note) => note.id === activeNoteId);

    if (activeNote) {
      localStorage.setItem('dev-tools-active-note-path', activeNote.filePath);
    } else {
      localStorage.removeItem('dev-tools-active-note-path');
    }
  }, [activeNoteId, notes]);

  // Prevent the application window from handling Escape (e.g. closing the webview).
  // Uses capture so it runs before other listeners but only calls preventDefault,
  // leaving internal handlers free to act on the event.
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
      }
    };

    window.addEventListener('keydown', handleEscape, { capture: true });

    return () =>
      window.removeEventListener('keydown', handleEscape, { capture: true });
  }, []);

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

  // Load notes from file system on first render
  useEffect(() => {
    const loadNotes = async () => {
      if (!workspacePath) {
        return;
      }

      const notesDir = getNotesDirPath(workspacePath);

      await Fs.ensureDir(notesDir);

      const entries = await Fs.readDir(notesDir);
      const mdEntries = entries.filter((entry) => entry.name?.endsWith('.md'));

      if (mdEntries.length === 0) {
        return;
      }

      const loadedNotes = await Promise.all(
        mdEntries.map(async (entry) => {
          const filePath = Fs.concatPath(notesDir, entry.name!);
          const content = await Fs.readTextFile(filePath);

          return {
            id: nextNoteId(),
            content,
            createdAt: Date.now(),
            filePath,
          };
        }),
      );

      setNotes(loadedNotes);

      const savedNoteFilePath = localStorage.getItem(
        'dev-tools-active-note-path',
      );

      if (savedNoteFilePath) {
        const savedNote = loadedNotes.find(
          (note) => note.filePath === savedNoteFilePath,
        );

        if (savedNote) {
          setOpenNoteIds([savedNote.id]);
          setActiveNoteId(savedNote.id);
        }
      }
    };

    loadNotes();
  }, [workspacePath]);

  // Load issues from file system and watch for external changes
  useEffect(() => {
    let watcherId: string | null = null;

    const loadIssues = async () => {
      if (!workspacePath) {
        return;
      }

      const issuesDir = getIssuesDirPath(workspacePath);

      await Fs.ensureDir(issuesDir);

      // Read last issue number from config
      const config = await readDevConfig(workspacePath);
      issueIdCounter = config.lastIssueNumber;

      const entries = await Fs.readDir(issuesDir);
      const mdEntries = entries.filter((entry) => entry.name?.endsWith('.md'));

      if (mdEntries.length === 0) {
        setIssues([]);

        return;
      }

      const loadedIssues = await Promise.all(
        mdEntries.map(async (entry) => {
          const filePath = Fs.concatPath(issuesDir, entry.name!);
          const raw = await Fs.readTextFile(filePath);
          const { frontmatter, content } = parseIssueFrontmatter(raw);

          return {
            id: frontmatter.number,
            number: frontmatter.number,
            title: frontmatter.title,
            status: frontmatter.status as IssueStatus,
            type: frontmatter.type as IssueType,
            priority: (frontmatter.priority || 'medium') as IssuePriority,
            package: frontmatter.package as IssuePackage,
            content,
            filePath,
            createdAt: new Date(frontmatter.created).getTime() || Date.now(),
          };
        }),
      );

      setIssues(loadedIssues);
    };

    const startWatching = async () => {
      if (!workspacePath) {
        return;
      }

      const issuesDir = getIssuesDirPath(workspacePath);

      await Fs.ensureDir(issuesDir);

      watcherId = await Fs.watch([issuesDir], () => {
        loadIssues();
      });
    };

    loadIssues();
    startWatching();

    return () => {
      if (watcherId) {
        Fs.unwatch(watcherId);
      }
    };
  }, [workspacePath]);

  // Keyboard shortcut handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;

      if (e.key === 'Escape' && target.isContentEditable) {
        e.preventDefault();
        target.blur();

        return;
      }

      if (
        e.metaKey &&
        /^[0-9]$/.test(e.key) &&
        target.isContentEditable &&
        visible &&
        activeSection === 'notes'
      ) {
        e.preventDefault();
        const note = notesRef.current.find((n) =>
          n.content
            .split('\n')[0]
            .replace(/^#+\s*/, '')
            .trim()
            .startsWith(e.key),
        );

        if (note) {
          handleOpenNote(note.id);
          setTimeout(focusEditorToEnd, 0);
        }

        return;
      }

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
        if (showHelp) {
          setShowHelp(false);
        } else {
          setVisible(false);
        }
      }

      if (e.key === '?' && visible) {
        e.preventDefault();
        setShowHelp((v) => !v);
      }

      if (e.key === 'f' && visible) {
        e.preventDefault();
        setWindowMode((m: boolean) => {
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
        else if (activeSection === 'state')
          selector = '.store-inspector-search-input';
        else if (activeSection === 'events' && activeEventsTab === 'events')
          selector = '.events-panel-search-input';
        else if (activeSection === 'events' && activeEventsTab === 'listeners')
          selector = '.listeners-panel-search-input';
        if (selector) {
          const input = document.querySelector<HTMLInputElement>(selector);
          input?.focus();
          input?.select();
        }
      }

      if (e.key === 'h' && visible && activeSection === 'notes') {
        e.preventDefault();
        focusEditorToEnd();
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

      if (e.key === 'q') {
        e.preventDefault();
        if (visible && activeSection === 'logs') {
          setVisible(false);
        } else {
          setVisible(true);
          setActiveSection('logs');
        }
      }

      if (e.key === 'w') {
        e.preventDefault();
        if (visible && activeSection === 'state') {
          setVisible(false);
        } else {
          setVisible(true);
          setActiveSection('state');
        }
      }

      if (e.key === 'e') {
        e.preventDefault();
        if (visible && activeSection === 'events') {
          setVisible(false);
        } else {
          setVisible(true);
          setActiveSection('events');
        }
      }

      if (e.key === 'r') {
        e.preventDefault();

        if (visible && activeSection === 'issues') {
          setVisible(false);
        } else {
          setVisible(true);
          setActiveSection('issues');
        }
      }

      if (e.key === 't') {
        e.preventDefault();

        if (visible && activeSection === 'notes') {
          setVisible(false);
        } else {
          setVisible(true);
          setActiveSection('notes');
        }
      }

      if (e.key === 'i' && !showNewIssueDialog) {
        e.preventDefault();
        setShowNewIssueDialog(true);
      }

      if (e.key === 'n') {
        e.preventDefault();
        handleCreateNote();
        setVisible(true);
        setActiveSection('notes');
      }

      if (/^[0-9]$/.test(e.key) && !e.metaKey) {
        const note = notesRef.current.find((n) =>
          n.content
            .split('\n')[0]
            .replace(/^#+\s*/, '')
            .trim()
            .startsWith(e.key),
        );

        if (note) {
          e.preventDefault();
          handleOpenNote(note.id);
          setVisible(true);
          setActiveSection('notes');
          setTimeout(focusEditorToEnd, 0);
        }
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
  }, [visible, activeSection, windowMode, showHelp, showNewIssueDialog, activeEventsTab]);

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

  const handleCreateNote = useCallback(async () => {
    const notesDir = workspacePath ? getNotesDirPath(workspacePath) : null;

    if (notesDir) {
      await Fs.ensureDir(notesDir);
    }

    const filePath = notesDir
      ? (await Fs.incrementalPath(Fs.concatPath(notesDir, 'Note.md'))).path
      : '';

    if (filePath) {
      await Fs.writeTextFile(filePath, '');
    }

    const newNote: Note = {
      id: nextNoteId(),
      content: '',
      createdAt: Date.now(),
      filePath,
    };

    setNotes((previous) => [...previous, newNote]);
    setOpenNoteIds((previous) => [...previous, newNote.id]);
    setActiveNoteId(newNote.id);
  }, []);

  const handleOpenNote = useCallback((noteId: number) => {
    setOpenNoteIds((previous) => {
      if (previous.includes(noteId)) {
        return previous;
      }

      return [...previous, noteId];
    });
    setActiveNoteId(noteId);
  }, []);

  const handleCloseNote = useCallback(
    (noteId: number) => {
      const index = openNoteIds.indexOf(noteId);
      const remaining = openNoteIds.filter((id) => id !== noteId);

      setOpenNoteIds(remaining);
      setActiveNoteId((current) => {
        if (current !== noteId) {
          return current;
        }

        return remaining[index] ?? remaining[index - 1] ?? null;
      });
    },
    [openNoteIds],
  );

  const handleNoteChange = useCallback(
    async (noteId: number, content: string) => {
      const note = notesRef.current.find((n) => n.id === noteId);
      console.log(note);

      if (!note) {
        return;
      }

      const oldFileTitle = getNoteFileTitle(note.content);
      const newFileTitle = getNoteFileTitle(content);

      if (!note.filePath || oldFileTitle === newFileTitle) {
        if (note.filePath) {
          Fs.writeTextFile(note.filePath, content);
        }

        setNotes((previous) =>
          previous.map((n) => (n.id === noteId ? { ...n, content } : n)),
        );

        return;
      }

      const parentDir = Fs.parentDirPath(note.filePath);
      const { path: newPath } = await Fs.incrementalPath(
        Fs.concatPath(parentDir, `${newFileTitle}.md`),
      );

      await Fs.rename(note.filePath, newPath);
      await Fs.writeTextFile(newPath, content);

      setNotes((previous) =>
        previous.map((n) =>
          n.id === noteId ? { ...n, content, filePath: newPath } : n,
        ),
      );
    },
    [],
  );

  const handleCreateIssue = useCallback(
    async (data: NewIssueData) => {
      const issuesDir = workspacePath ? getIssuesDirPath(workspacePath) : null;

      if (issuesDir) {
        await Fs.ensureDir(issuesDir);
      }

      const issueNumber = nextIssueId();
      const createdAt = Date.now();
      const fileName = sanitizeFileName(data.title);
      const filePath = issuesDir
        ? (await Fs.incrementalPath(Fs.concatPath(issuesDir, `${issueNumber} ${fileName}.md`)))
            .path
        : '';

      const newIssue: Issue = {
        id: issueNumber,
        number: issueNumber,
        title: data.title,
        status: data.status,
        type: data.type,
        priority: data.priority,
        package: data.package,
        content: data.content,
        filePath,
        createdAt,
      };

      if (filePath) {
        await Fs.writeTextFile(
          filePath,
          serializeIssueFrontmatter(
            {
              title: newIssue.title,
              number: newIssue.number,
              status: newIssue.status,
              type: newIssue.type,
              priority: newIssue.priority,
              package: newIssue.package,
              created: new Date(createdAt).toISOString(),
            },
            data.content,
          ),
        );
      }

      // Update config with new last issue number
      if (workspacePath) {
        await writeDevConfig(workspacePath, {
          lastIssueNumber: issueNumber,
        });
      }

      setIssues((previous) => [...previous, newIssue]);
      setShowNewIssueDialog(false);
    },
    [workspacePath],
  );

  const handleIssueChange = useCallback(
    async (issueId: number, changes: Partial<Issue>) => {
      const issue = issuesRef.current.find((item) => item.id === issueId);

      if (!issue) {
        return;
      }

      const updated = { ...issue, ...changes };
      const oldTitle = sanitizeFileName(issue.title);
      const newTitle = sanitizeFileName(updated.title);
      let { filePath } = updated;

      if (issue.filePath && oldTitle !== newTitle) {
        const parentDir = Fs.parentDirPath(issue.filePath);
        const { path: newPath } = await Fs.incrementalPath(
          Fs.concatPath(parentDir, `${updated.number} ${newTitle}.md`),
        );

        await Fs.rename(issue.filePath, newPath);
        filePath = newPath;
      }

      if (filePath) {
        await Fs.writeTextFile(
          filePath,
          serializeIssueFrontmatter(
            {
              title: updated.title,
              number: updated.number,
              status: updated.status,
              type: updated.type,
              priority: updated.priority,
              package: updated.package,
              created: new Date(updated.createdAt).toISOString(),
            },
            updated.content,
          ),
        );
      }

      setIssues((previous) =>
        previous.map((item) =>
          item.id === issueId ? { ...updated, filePath } : item,
        ),
      );
    },
    [],
  );

  const handleDeleteIssue = useCallback(async (issueId: number) => {
    const issue = issuesRef.current.find((item) => item.id === issueId);

    if (!issue) {
      return;
    }

    if (issue.filePath) {
      await Fs.removeFile(issue.filePath);
    }

    setIssues((previous) => previous.filter((item) => item.id !== issueId));
  }, []);

  const handleMoveStart = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    e.preventDefault();
    const orig = { ...windowPos };
    const start = { x: e.clientX, y: e.clientY };

    const onMouseMove = (me: MouseEvent) => {
      setWindowPos({
        x: orig.x + me.clientX - start.x,
        y: orig.y + me.clientY - start.y,
      });
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

  const renderEventNode = (
    node: EventTreeNode,
    depth: number,
  ): React.ReactNode => {
    const isOpen = openNodes.has(node.fullPath);
    const hasChildren = node.children.length > 0;
    const isActive =
      activeEventsTab === 'events' && eventsView === node.fullPath;

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
      return (
        <MenuGroup key={node.fullPath} padded>
          {item}
        </MenuGroup>
      );
    }
    return <React.Fragment key={node.fullPath}>{item}</React.Fragment>;
  };

  const renderListenerNode = (node: EventTreeNode): React.ReactNode => (
    <MenuGroup key={node.fullPath} padded>
      <MenuItem
        size="compact"
        active={
          activeEventsTab === 'listeners' && listenersView === node.fullPath
        }
        onClick={() => {
          setActiveEventsTab('listeners');
          setListenersView(node.fullPath);
        }}
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
            ['q', 'Toggle logs'],
            ['w', 'Toggle state'],
            ['e', 'Toggle events'],
            ['r', 'Toggle issues'],
            ['t', 'Toggle notes'],
            ['i', 'New issue'],
            ['n', 'New note'],
            ['0–9', 'Open note by title'],
            ['⌘0–9', 'Open note by title (in editor)'],
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
            ['h', 'Focus notes editor'],
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

  if (!visible) {
    return showNewIssueDialog ? (
      <NewIssueDialog
        issueNumber={issueIdCounter + 1}
        onSubmit={handleCreateIssue}
        onClose={() => setShowNewIssueDialog(false)}
      />
    ) : null;
  }

  const group = stories[activeStory.groupIndex];
  const ActiveStoryComponent = group?.items[activeStory.itemIndex]?.component;

  const savedFiles = [...new Set(savedLogs.map((l) => l.file))];
  const savedLogsForView = savedLogs.filter((l) => l.file === logsView);

  // Group open issues by package for sidebar, sorted by type within each group
  const TYPE_ORDER = ['bug', 'feature', 'improvement', 'task'];
  const openIssues = issues.filter(
    (issue) =>
      issue.status === 'open' ||
      issue.status === 'in-progress' ||
      issue.status === 'review',
  );
  const issuesByPackage = new Map<string, Issue[]>();

  for (const issue of openIssues) {
    const key = issue.package;
    const list = issuesByPackage.get(key);

    if (list) {
      list.push(issue);
    } else {
      issuesByPackage.set(key, [issue]);
    }
  }

  for (const list of issuesByPackage.values()) {
    list.sort(
      (a, b) => TYPE_ORDER.indexOf(a.type) - TYPE_ORDER.indexOf(b.type),
    );
  }

  const sortedPackageKeys = [...issuesByPackage.keys()].sort((a, b) => {
    const packageA = ISSUE_PACKAGES.find((item) => item.value === a);
    const packageB = ISSUE_PACKAGES.find((item) => item.value === b);
    const labelA = packageA?.label ?? a;
    const labelB = packageB?.label ?? b;

    return labelA.localeCompare(labelB);
  });

  const issuesSidebar = (
    <>
      <MenuGroup padded>
        <MenuItem
          size="compact"
          label="New Issue"
          icon="plus"
          onClick={() => setShowNewIssueDialog(true)}
        />
      </MenuGroup>
      {sortedPackageKeys.map((packageKey, index) => {
        const packageInfo = ISSUE_PACKAGES.find(
          (item) => item.value === packageKey,
        );
        const label = packageInfo?.label ?? packageKey;
        const packageIssues = issuesByPackage.get(packageKey) ?? [];

        return (
          <React.Fragment key={packageKey}>
            {index > 0 && <Separator margin="small" />}
            <MenuGroup padded>
              <MenuLabel>{label}</MenuLabel>
              {packageIssues.map((issue) => (
                <MenuItem
                  key={issue.id}
                  size="compact"
                  active={selectedIssueId === issue.id}
                  onClick={() => setSelectedIssueId(issue.id)}
                >
                  <span className="dev-tools-issue-label">
                    <span
                      className="dev-tools-issue-number"
                      style={{ color: TYPE_COLORS[issue.type] }}
                    >
                      #{issue.number}
                    </span>
                    {issue.title || 'Untitled'}
                  </span>
                </MenuItem>
              ))}
            </MenuGroup>
          </React.Fragment>
        );
      })}
    </>
  );

  const contentArea = (
    <main className="dev-tools-content">
      {activeSection === 'stories' && ActiveStoryComponent && (
        <div className="dev-tools-story">
          <ActiveStoryComponent />
        </div>
      )}

      {activeSection === 'state' &&
        (() => {
          switch (stateView) {
            case 'databases':
            case 'database-entries':
            case 'database-templates':
            case 'database-automations':
            case 'database-serializers':
              return <DatabasesStateView stateView={stateView} />;
            case 'workspaces':
              return <WorkspacesStateView />;
            case 'designs':
              return <DesignsStateView />;
            case 'queries':
              return <QueriesStateView />;
            case 'views':
            case 'view-types':
              return <ViewsStateView stateView={stateView} />;
            default:
              return null;
          }
        })()}

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

      {activeSection === 'notes' && (
        <NotesPanel
          notes={notes}
          openNoteIds={openNoteIds}
          activeNoteId={activeNoteId}
          onNoteChange={handleNoteChange}
          onCloseNote={handleCloseNote}
          onSelectNote={handleOpenNote}
          onCreateNote={handleCreateNote}
        />
      )}

      {activeSection === 'issues' && (
        <IssuesPanel
          issues={issues}
          selectedIssueId={selectedIssueId}
          onSelectIssue={setSelectedIssueId}
          onIssueChange={handleIssueChange}
          onCreateIssue={() => setShowNewIssueDialog(true)}
          onDeleteIssue={handleDeleteIssue}
        />
      )}
    </main>
  );

  const newIssueDialog = showNewIssueDialog && (
    <NewIssueDialog
      issueNumber={issueIdCounter + 1}
      onSubmit={handleCreateIssue}
      onClose={() => setShowNewIssueDialog(false)}
    />
  );

  // --- Window mode ---
  if (windowMode) {
    return (
      <>
      {newIssueDialog}
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
            <IconButton
              icon="circle-dot"
              label="Issues"
              size="sm"
              active={activeSection === 'issues'}
              onClick={() => setActiveSection('issues')}
            />
            <IconButton
              icon="sticky-note"
              label="Notes"
              size="sm"
              active={activeSection === 'notes'}
              onClick={() => setActiveSection('notes')}
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
                {activeSection === 'state' &&
                  STATE_STORE_GROUPS.map((group, groupIndex) => (
                    <React.Fragment key={group.label}>
                      {groupIndex > 0 && <Separator margin="small" />}
                      <MenuGroup padded>
                        <MenuLabel label={group.label} />
                        {group.stores.map(({ id, label }) => (
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
                    </React.Fragment>
                  ))}

                {activeSection === 'events' && (
                  <>
                    <MenuGroup padded>
                      <MenuItem
                        size="compact"
                        active={
                          activeEventsTab === 'events' && eventsView === 'all'
                        }
                        onClick={() => {
                          setActiveEventsTab('events');
                          setEventsView('all');
                        }}
                      >
                        <span className="dev-tools-store-item-label">
                          All Events
                          <span className="dev-tools-count-badge">
                            {events.length}
                          </span>
                        </span>
                      </MenuItem>
                    </MenuGroup>
                    {eventTree.map((node) => renderEventNode(node, 0))}
                    <Separator margin="small" />
                    <MenuGroup padded>
                      <MenuItem
                        size="compact"
                        active={
                          activeEventsTab === 'listeners' &&
                          listenersView === 'all'
                        }
                        onClick={() => {
                          setActiveEventsTab('listeners');
                          setListenersView('all');
                        }}
                      >
                        <span className="dev-tools-store-item-label">
                          All Listeners
                          <span className="dev-tools-count-badge">
                            {allListeners.length}
                          </span>
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

                {activeSection === 'notes' && (
                  <MenuGroup padded>
                    <MenuItem
                      size="compact"
                      label="New Note"
                      icon="plus"
                      onClick={handleCreateNote}
                    />
                    {notes.map((note) => (
                      <MenuItem
                        key={note.id}
                        size="compact"
                        active={activeNoteId === note.id}
                        onClick={() => handleOpenNote(note.id)}
                      >
                        <span className="dev-tools-store-item-label">
                          {note.content
                            .split('\n')[0]
                            .replace(/^#+\s*/, '')
                            .trim() || 'Untitled'}
                        </span>
                      </MenuItem>
                    ))}
                  </MenuGroup>
                )}

                {activeSection === 'issues' && issuesSidebar}
              </nav>
            </aside>
          )}
          {contentArea}
        </div>
      </div>
      </>
    );
  }

  // --- Fullscreen mode ---
  return (
    <>
    {newIssueDialog}
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
              icon="circle-dot"
              label="Issues"
              size="sm"
              active={activeSection === 'issues'}
              onClick={() => setActiveSection('issues')}
            />
            <IconButton
              icon="sticky-note"
              label="Notes"
              size="sm"
              active={activeSection === 'notes'}
              onClick={() => setActiveSection('notes')}
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

            {activeSection === 'state' &&
              STATE_STORE_GROUPS.map((group, groupIndex) => (
                <React.Fragment key={group.label}>
                  {groupIndex > 0 && <Separator margin="small" />}
                  <MenuGroup padded>
                    <MenuLabel label={group.label} />
                    {group.stores.map(({ id, label }) => (
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
                </React.Fragment>
              ))}

            {activeSection === 'events' && (
              <>
                <MenuGroup padded>
                  <MenuItem
                    size="compact"
                    active={
                      activeEventsTab === 'events' && eventsView === 'all'
                    }
                    onClick={() => {
                      setActiveEventsTab('events');
                      setEventsView('all');
                    }}
                  >
                    <span className="dev-tools-store-item-label">
                      All Events
                      <span className="dev-tools-count-badge">
                        {events.length}
                      </span>
                    </span>
                  </MenuItem>
                </MenuGroup>
                {eventTree.map((node) => renderEventNode(node, 0))}
                <Separator margin="small" />
                <MenuGroup padded>
                  <MenuItem
                    size="compact"
                    active={
                      activeEventsTab === 'listeners' && listenersView === 'all'
                    }
                    onClick={() => {
                      setActiveEventsTab('listeners');
                      setListenersView('all');
                    }}
                  >
                    <span className="dev-tools-store-item-label">
                      All Listeners
                      <span className="dev-tools-count-badge">
                        {allListeners.length}
                      </span>
                    </span>
                  </MenuItem>
                </MenuGroup>
                {listenersTree.map((node) => renderListenerNode(node))}
              </>
            )}

            {activeSection === 'notes' && (
              <MenuGroup padded>
                <MenuItem
                  size="compact"
                  label="New Note"
                  icon="plus"
                  onClick={handleCreateNote}
                />
                {notes.map((note) => (
                  <MenuItem
                    key={note.id}
                    size="compact"
                    active={activeNoteId === note.id}
                    onClick={() => handleOpenNote(note.id)}
                  >
                    <span className="dev-tools-store-item-label">
                      {note.content
                        .split('\n')[0]
                        .replace(/^#+\s*/, '')
                        .trim() || 'Untitled'}
                    </span>
                  </MenuItem>
                ))}
              </MenuGroup>
            )}

            {activeSection === 'issues' && issuesSidebar}

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
    </>
  );
};
