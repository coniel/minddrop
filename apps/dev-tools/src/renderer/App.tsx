import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  ManifestWithSlug,
  NewReviewComment,
  ReviewComment,
} from '../types';
import { DiffViewer } from './DiffViewer';
import { PlanViewer } from './PlanViewer';
import { ReviewPanel } from './ReviewPanel';
import { Sidebar } from './Sidebar';
import { rpc } from './index';
import type {
  FileStatus,
  Plan,
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
  const [manifests, setManifests] = useState<ManifestWithSlug[]>([]);
  const [untrackedFiles, setUntrackedFiles] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('diff');
  const [splitDiff, setSplitDiff] = useState(false);
  const [originalContent, setOriginalContent] = useState('');
  const [currentContent, setCurrentContent] = useState('');
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [planContent, setPlanContent] = useState('');
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
  const refreshData = useCallback(async () => {
    const [manifestData, untracked] = await Promise.all([
      rpc.request.getManifests({}),
      rpc.request.getUntrackedChanges({}),
    ]);

    setManifests(manifestData);
    setUntrackedFiles(untracked);

    // Fetch file statuses for each unique baseRef + worktree pair
    try {
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

      // Also scan the main checkout against HEAD for untracked files
      scans.set('HEAD:null', { baseRef: 'HEAD', worktree: null });

      const statusResults = await Promise.all(
        [...scans.values()].map((scan) => rpc.request.getFileStatuses(scan)),
      );

      // Merge all status maps (later results override earlier)
      const merged: Record<string, FileStatus> = {};

      for (const result of statusResults) {
        Object.assign(merged, result);
      }

      setFileStatuses(merged);
    } catch {
      // Backend may not support this endpoint yet
    }
  }, []);

  // Fetch plans
  const refreshPlans = useCallback(async () => {
    const planData = await rpc.request.getPlans({});
    setPlans(planData);
  }, []);

  // Initial load
  useEffect(() => {
    refreshData();
    refreshPlans();
  }, [refreshData, refreshPlans]);

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

  // Listen for plan changes from the backend watcher
  useEffect(() => {
    const handler = () => {
      refreshPlans();
    };

    window.addEventListener('plans-changed', handler);

    return () => {
      window.removeEventListener('plans-changed', handler);
    };
  }, [refreshPlans]);

  // Load plan content when selection changes
  useEffect(() => {
    if (!selectedPlan) {
      setPlanContent('');

      return;
    }

    const loadPlanContent = async () => {
      const content = await rpc.request.getPlanContent({
        filename: selectedPlan,
      });

      setPlanContent(content);
    };

    loadPlanContent();
  }, [selectedPlan]);

  // Load file content when selection changes
  useEffect(() => {
    if (!selectedFile) {
      setOriginalContent('');
      setCurrentContent('');

      return;
    }

    const loadContent = async () => {
      const [original, current] = await Promise.all([
        rpc.request.getFileContent({
          ref: selectedFile.baseRef,
          path: selectedFile.path,
        }),
        rpc.request.getCurrentFileContent({
          path: selectedFile.path,
          worktree: selectedFile.worktree,
        }),
      ]);

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
    // Build an ordered list of file groups
    const groups: {
      files: string[];
      manifestSlug: string | null;
      baseRef: string;
      worktree: string | null;
    }[] = manifests.map((manifest) => ({
      files: manifest.files,
      manifestSlug: manifest.slug,
      baseRef: manifest.baseRef,
      worktree: manifest.worktree ?? null,
    }));

    if (untrackedFiles.length > 0) {
      groups.push({
        files: untrackedFiles,
        manifestSlug: null,
        baseRef: manifests.length > 0 ? manifests[0].baseRef : 'HEAD',
        worktree: null,
      });
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
          const index = groups[g].files.indexOf(selectedFile.path);

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

        if (nextIndex < 0 || nextIndex >= group.files.length) {
          return;
        }

        setSelectedFile({
          path: group.files[nextIndex],
          manifestSlug: group.manifestSlug,
          baseRef: group.baseRef,
          worktree: group.worktree,
        });
        setSelectedPlan(null);
      } else {
        // Next/prev group
        const direction = event.key === 'l' ? 1 : -1;
        const nextGroupIndex = groupIndex + direction;

        if (nextGroupIndex < 0 || nextGroupIndex >= groups.length) {
          return;
        }

        const nextGroup = groups[nextGroupIndex];

        setSelectedFile({
          path: nextGroup.files[0],
          manifestSlug: nextGroup.manifestSlug,
          baseRef: nextGroup.baseRef,
          worktree: nextGroup.worktree,
        });
        setSelectedPlan(null);
      }
    };

    window.addEventListener('keydown', handler, true);

    return () => {
      window.removeEventListener('keydown', handler, true);
    };
  }, [manifests, untrackedFiles, selectedFile]);

  // Handle selecting a file (clears selected plan, activates its work group)
  const handleSelectFile = useCallback((file: SelectedFile) => {
    setSelectedFile(file);
    setSelectedPlan(null);

    if (file.manifestSlug) {
      setActiveSlug(file.manifestSlug);
    }
  }, []);

  // Handle selecting a plan (clears selected file, activates its work group)
  const handleSelectPlan = useCallback(
    (filename: string) => {
      setSelectedPlan(filename);
      setSelectedFile(null);

      // Plans belong to the work group their slug is prefixed with
      const planSlug = filename.replace('.md', '');
      const manifest = manifests.find(
        (candidate) =>
          planSlug === candidate.slug ||
          planSlug.startsWith(`${candidate.slug}-`),
      );

      if (manifest) {
        setActiveSlug(manifest.slug);
      }
    },
    [manifests],
  );

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
      setSelectedPlan(null);
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
        plans={plans}
        selectedPlan={selectedPlan}
        onSelectPlan={handleSelectPlan}
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
        ) : selectedPlan ? (
          <PlanViewer
            name={
              plans.find((plan) => plan.filename === selectedPlan)?.name ??
              selectedPlan
            }
            content={planContent}
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
