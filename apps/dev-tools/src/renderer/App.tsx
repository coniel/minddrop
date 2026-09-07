import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  ManifestWithSlug,
  NewReviewComment,
  ReviewComment,
  UntrackedChange,
} from '../types';
import { DiffViewer } from './DiffViewer';
import { ReviewPanel } from './ReviewPanel';
import { Sidebar } from './Sidebar';
import { rpc } from './index';
import type {
  FileStatus,
  RevealRequest,
  SelectedFile,
  ViewMode,
} from './types';
import { useReviewComments } from './useReviewComments';
import './App.css';

/**
 * Renders the main dev review application layout with sidebar, diff
 * viewer and review panel.
 */
export const App: React.FC = () => {
  // A comment's file to reveal once its content has loaded
  const pendingRevealRef = useRef<{ path: string; line: number } | null>(null);
  // Whether a refresh is running, and whether one was requested while
  // it ran
  const refreshStateRef = useRef({ running: false, pending: false });
  // Incremented per content load so a stale response for a previously
  // selected file is discarded
  const contentLoadTokenRef = useRef(0);
  const [manifests, setManifests] = useState<ManifestWithSlug[]>([]);
  const [untrackedFiles, setUntrackedFiles] = useState<UntrackedChange[]>([]);
  const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('diff');
  const [splitDiff, setSplitDiff] = useState(false);
  const [originalContent, setOriginalContent] = useState('');
  const [currentContent, setCurrentContent] = useState('');
  const [fileStatuses, setFileStatuses] = useState<Record<string, FileStatus>>(
    {},
  );
  // The work group whose comments the review panel shows
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [reviewPanelOpen, setReviewPanelOpen] = useState(false);
  const [focusedCommentId, setFocusedCommentId] = useState<string | null>(null);
  const [reveal, setReveal] = useState<RevealRequest | null>(null);
  const { comments, createComment, updateComment, deleteComment } =
    useReviewComments(activeSlug);

  // The manifest of the work group being reviewed
  const activeManifest =
    manifests.find((manifest) => manifest.slug === activeSlug) ?? null;

  // Number of comments still to address, shown on the collapsed panel
  const openCommentCount = comments.filter(
    (comment) => comment.status === 'open',
  ).length;

  // Fetch manifests, untracked changes, and file statuses
  const loadChanges = useCallback(async () => {
    const [manifestData, untracked] = await Promise.all([
      rpc.request.getManifests({}),
      rpc.request.getUntrackedChanges({}),
    ]);

    setManifests(manifestData);
    setUntrackedFiles(untracked);

    // Fetch file statuses for each unique baseRef + worktree pair
    const scans = new Map<
      string,
      { baseRef: string; worktree: string | null }
    >();

    for (const manifest of manifestData) {
      const worktree = manifest.worktree ?? null;

      scans.set(`${manifest.baseRef}:${worktree}`, {
        baseRef: manifest.baseRef,
        worktree,
      });
    }

    // Also scan each checkout untracked changes were found in
    for (const change of untracked) {
      scans.set(`${change.baseRef}:${change.worktree}`, {
        baseRef: change.baseRef,
        worktree: change.worktree,
      });
    }

    const statusResults = await Promise.all(
      [...scans.values()].map((scan) => rpc.request.getFileStatuses(scan)),
    );

    // Merge all status maps (later results override earlier)
    const merged: Record<string, FileStatus> = {};

    for (const result of statusResults) {
      Object.assign(merged, result);
    }

    setFileStatuses(merged);
  }, []);

  // Refresh the changes, folding requests made while a refresh runs
  // into a single trailing refresh so bursts of watcher events do not
  // pile up git scans
  const refreshData = useCallback(async () => {
    const state = refreshStateRef.current;

    state.pending = true;

    if (state.running) {
      return;
    }

    state.running = true;

    while (state.pending) {
      state.pending = false;

      try {
        await loadChanges();
      } catch (error) {
        console.error('Failed to refresh changes', error);
      }
    }

    state.running = false;
  }, [loadChanges]);

  // Initial load
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Listen for manifest changes from the backend watcher
  useEffect(() => {
    const handler = () => {
      refreshData();
    };

    window.addEventListener('manifests-changed', handler);

    return () => {
      window.removeEventListener('manifests-changed', handler);
    };
  }, [refreshData]);

  // Load file content when selection changes
  useEffect(() => {
    if (!selectedFile) {
      setOriginalContent('');
      setCurrentContent('');

      return;
    }

    const loadContent = async () => {
      const token = ++contentLoadTokenRef.current;
      let original: string;
      let current: string;

      try {
        [original, current] = await Promise.all([
          rpc.request.getFileContent({
            ref: selectedFile.baseRef,
            path: selectedFile.path,
          }),
          rpc.request.getCurrentFileContent({
            path: selectedFile.path,
            worktree: selectedFile.worktree,
          }),
        ]);
      } catch (error) {
        console.error(`Failed to load ${selectedFile.path}`, error);

        return;
      }

      // Another file was selected while this one loaded
      if (token !== contentLoadTokenRef.current) {
        return;
      }

      setOriginalContent(original);
      setCurrentContent(current);

      // Default to "current" view for new files (no original content)
      if (!original) {
        setViewMode('current');
      } else {
        setViewMode('diff');
      }

      // Reveal a comment's line now that its file content is loaded
      if (pendingRevealRef.current?.path === selectedFile.path) {
        setReveal({ line: pendingRevealRef.current.line, token: Date.now() });
        pendingRevealRef.current = null;
      }
    };

    loadContent();
  }, [selectedFile]);

  // Drop the active work group when its manifest is removed
  useEffect(() => {
    if (
      activeSlug &&
      !manifests.some((manifest) => manifest.slug === activeSlug)
    ) {
      setActiveSlug(null);
    }
  }, [manifests, activeSlug]);

  // Keyboard shortcut: ctrl+r to toggle the review panel
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (!event.ctrlKey || event.key !== 'r') {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      setReviewPanelOpen((previous) => !previous);
    };

    window.addEventListener('keydown', handler, true);

    return () => {
      window.removeEventListener('keydown', handler, true);
    };
  }, []);

  // Keyboard shortcuts: ctrl+1/2/3 to switch view modes
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (!event.ctrlKey || !selectedFile) {
        return;
      }

      if (event.key === '1' || event.key === '2' || event.key === '3') {
        event.preventDefault();
        event.stopPropagation();
      }

      if (event.key === '1') {
        if (viewMode === 'diff') {
          setSplitDiff((previous) => !previous);
        } else {
          setViewMode('diff');
        }
      } else if (event.key === '2') {
        setViewMode('original');
      } else if (event.key === '3') {
        setViewMode('current');
      }
    };

    window.addEventListener('keydown', handler, true);

    return () => {
      window.removeEventListener('keydown', handler, true);
    };
  }, [selectedFile, viewMode]);

  // Keyboard shortcuts: ctrl+j/k for next/prev file, ctrl+h/l for next/prev list
  useEffect(() => {
    // Build an ordered list of file groups, each entry carrying its own
    // diff context
    const groups: SelectedFile[][] = manifests.map((manifest) =>
      manifest.files.map((path) => ({
        path,
        manifestSlug: manifest.slug,
        baseRef: manifest.baseRef,
        worktree: manifest.worktree ?? null,
      })),
    );

    if (untrackedFiles.length > 0) {
      groups.push(
        untrackedFiles.map((change) => ({
          path: change.path,
          manifestSlug: null,
          baseRef: change.baseRef,
          worktree: change.worktree,
        })),
      );
    }

    const handler = (event: KeyboardEvent) => {
      if (!event.ctrlKey) {
        return;
      }

      if (
        event.key !== 'j' &&
        event.key !== 'k' &&
        event.key !== 'h' &&
        event.key !== 'l'
      ) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      if (groups.length === 0) {
        return;
      }

      // Find which group and index the current file is in
      let groupIndex = 0;
      let fileIndex = 0;

      if (selectedFile) {
        for (let g = 0; g < groups.length; g++) {
          const index = groups[g].findIndex(
            (entry) =>
              entry.path === selectedFile.path &&
              entry.manifestSlug === selectedFile.manifestSlug &&
              entry.worktree === selectedFile.worktree,
          );

          if (index !== -1) {
            groupIndex = g;
            fileIndex = index;
            break;
          }
        }
      }

      if (event.key === 'j' || event.key === 'k') {
        // Next/prev file within the current group
        const group = groups[groupIndex];
        const direction = event.key === 'j' ? 1 : -1;
        const nextIndex = fileIndex + direction;

        if (nextIndex < 0 || nextIndex >= group.length) {
          return;
        }

        setSelectedFile(group[nextIndex]);
      } else {
        // Next/prev group
        const direction = event.key === 'l' ? 1 : -1;
        const nextGroupIndex = groupIndex + direction;

        if (nextGroupIndex < 0 || nextGroupIndex >= groups.length) {
          return;
        }

        setSelectedFile(groups[nextGroupIndex][0]);
      }
    };

    window.addEventListener('keydown', handler, true);

    return () => {
      window.removeEventListener('keydown', handler, true);
    };
  }, [manifests, untrackedFiles, selectedFile]);

  // Handle selecting a file (activates its work group)
  const handleSelectFile = useCallback((file: SelectedFile) => {
    setSelectedFile(file);

    if (file.manifestSlug) {
      setActiveSlug(file.manifestSlug);
    }
  }, []);

  // Handle clicking a comment: open its file and scroll to its lines
  const handleSelectComment = useCallback(
    (comment: ReviewComment) => {
      setFocusedCommentId(comment.id);

      if (comment.file === null) {
        return;
      }

      // The file is already open, reveal the lines directly
      if (selectedFile?.path === comment.file) {
        if (comment.startLine === null) {
          return;
        }

        if (viewMode === 'original') {
          setViewMode('current');
        }

        setReveal({ line: comment.startLine, token: Date.now() });

        return;
      }

      if (!activeManifest) {
        return;
      }

      // Reveal once the file's content has loaded, file-level comments
      // only open the file
      if (comment.startLine !== null) {
        pendingRevealRef.current = {
          path: comment.file,
          line: comment.startLine,
        };
      }

      setSelectedFile({
        path: comment.file,
        manifestSlug: activeManifest.slug,
        baseRef: activeManifest.baseRef,
        worktree: activeManifest.worktree ?? null,
      });
    },
    [selectedFile, viewMode, activeManifest],
  );

  // Handle a new comment on selected code
  const handleCreateFileComment = useCallback(
    (comment: NewReviewComment) => {
      createComment(comment);
      setReviewPanelOpen(true);
    },
    [createComment],
  );

  // Handle a new general comment from the review panel
  const handleCreateGeneralComment = useCallback(
    (text: string) => {
      createComment({
        file: null,
        startLine: null,
        endLine: null,
        snippet: null,
        text,
      });
    },
    [createComment],
  );

  // Handle resolving or reopening a comment
  const handleResolveComment = useCallback(
    (id: string, resolved: boolean) => {
      updateComment(id, { status: resolved ? 'resolved' : 'open' });
    },
    [updateComment],
  );

  // Handle deleting a comment
  const handleDeleteComment = useCallback(
    (id: string) => {
      deleteComment(id);
      setFocusedCommentId((previous) => (previous === id ? null : previous));
    },
    [deleteComment],
  );

  // Handle deleting a work group
  const handleDeleteManifest = useCallback(
    async (slug: string) => {
      await rpc.request.deleteManifest({ slug });
      await refreshData();
    },
    [refreshData],
  );

  // Track whether we are in sidebar (horizontal) or footer (vertical) layout
  const [isHorizontal, setIsHorizontal] = useState(
    () => window.matchMedia('(min-width: 1201px)').matches,
  );

  // Reset custom size when crossing the breakpoint
  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1201px)');

    const handler = (event: MediaQueryListEvent) => {
      setIsHorizontal(event.matches);
      setSidebarSize(null);
    };

    mediaQuery.addEventListener('change', handler);

    return () => {
      mediaQuery.removeEventListener('change', handler);
    };
  }, []);

  // Resize handle state
  const appRef = useRef<HTMLDivElement>(null);
  const [sidebarSize, setSidebarSize] = useState<number | null>(null);
  const isDragging = useRef(false);

  // Handle resize drag
  const handleResizeStart = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    isDragging.current = true;
    document.body.style.userSelect = 'none';

    // Capture layout direction at drag start
    const horizontal = window.matchMedia('(min-width: 1201px)').matches;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isDragging.current || !appRef.current) {
        return;
      }

      const rect = appRef.current.getBoundingClientRect();

      if (horizontal) {
        // Sidebar on the left, drag to resize width
        const width = Math.max(
          180,
          Math.min(moveEvent.clientX - rect.left, rect.width - 200),
        );
        setSidebarSize(width);
      } else {
        // Footer at the bottom, drag to resize height
        const height = Math.max(
          100,
          Math.min(rect.bottom - moveEvent.clientY, rect.height - 200),
        );
        setSidebarSize(height);
      }
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      document.body.style.userSelect = '';
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, []);

  // Build sidebar inline style from resize state
  const sidebarStyle: React.CSSProperties | undefined = sidebarSize
    ? isHorizontal
      ? { width: sidebarSize, minWidth: sidebarSize }
      : { height: sidebarSize }
    : undefined;

  // Review panel resize state, width only as it is always a column
  const [reviewPanelSize, setReviewPanelSize] = useState<number | null>(null);

  // Handle review panel resize drag
  const handleReviewResizeStart = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    isDragging.current = true;
    document.body.style.userSelect = 'none';

    const handleMouseMove = (moveEvent: MouseEvent) => {
      if (!isDragging.current || !appRef.current) {
        return;
      }

      const rect = appRef.current.getBoundingClientRect();

      // Panel on the right, drag to resize width
      const width = Math.max(
        220,
        Math.min(rect.right - moveEvent.clientX, rect.width - 400),
      );
      setReviewPanelSize(width);
    };

    const handleMouseUp = () => {
      isDragging.current = false;
      document.body.style.userSelect = '';
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, []);

  // Build review panel inline style from resize state
  const reviewPanelStyle: React.CSSProperties | undefined =
    reviewPanelSize && isHorizontal
      ? { width: reviewPanelSize, minWidth: reviewPanelSize }
      : undefined;

  return (
    <div className="app" ref={appRef}>
      <Sidebar
        manifests={manifests}
        untrackedFiles={untrackedFiles}
        selectedFile={selectedFile}
        onSelectFile={handleSelectFile}
        onDeleteManifest={handleDeleteManifest}
        fileStatuses={fileStatuses}
        style={sidebarStyle}
      />
      <div className="app-resize-handle" onMouseDown={handleResizeStart} />
      <div className="app-main">
        {selectedFile ? (
          <DiffViewer
            selectedFile={selectedFile}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            originalContent={originalContent}
            currentContent={currentContent}
            splitDiff={splitDiff}
            onSplitDiffChange={setSplitDiff}
            comments={comments}
            focusedCommentId={focusedCommentId}
            reveal={reveal}
            canComment={selectedFile.manifestSlug !== null}
            onCreateComment={handleCreateFileComment}
            onFocusComment={setFocusedCommentId}
          />
        ) : (
          <div className="app-empty">Select a file to view changes</div>
        )}
      </div>

      {reviewPanelOpen ? (
        <>
          <div
            className="app-resize-handle app-review-resize-handle"
            onMouseDown={handleReviewResizeStart}
          />
          <ReviewPanel
            slug={activeManifest?.slug ?? null}
            title={activeManifest?.title ?? ''}
            comments={comments}
            fileOrder={activeManifest?.files ?? []}
            focusedCommentId={focusedCommentId}
            onSelectComment={handleSelectComment}
            onResolveComment={handleResolveComment}
            onDeleteComment={handleDeleteComment}
            onCreateComment={handleCreateGeneralComment}
            onClose={() => setReviewPanelOpen(false)}
            style={reviewPanelStyle}
          />
        </>
      ) : (
        <button
          className="review-toggle"
          onClick={() => setReviewPanelOpen(true)}
          title="Show review panel (ctrl+r)"
        >
          <span className="review-toggle-label">Review</span>

          {openCommentCount > 0 && (
            <span className="review-panel-count">{openCommentCount}</span>
          )}
        </button>
      )}
    </div>
  );
};
