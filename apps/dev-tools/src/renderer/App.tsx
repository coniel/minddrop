import { useCallback, useEffect, useRef, useState } from 'react';
import type { ManifestWithSlug } from '../types';
import { DiffViewer } from './DiffViewer';
import { PlanViewer } from './PlanViewer';
import { Sidebar } from './Sidebar';
import { rpc } from './index';
import type { FileStatus, Plan, SelectedFile, ViewMode } from './types';
import './App.css';

/**
 * Renders the main dev review application layout with sidebar and diff viewer.
 */
export const App: React.FC = () => {
  const [manifests, setManifests] = useState<ManifestWithSlug[]>([]);
  const [untrackedFiles, setUntrackedFiles] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('diff');
  const [splitDiff, setSplitDiff] = useState(true);
  const [originalContent, setOriginalContent] = useState('');
  const [currentContent, setCurrentContent] = useState('');
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [planContent, setPlanContent] = useState('');
  const [fileStatuses, setFileStatuses] = useState<Record<string, FileStatus>>(
    {},
  );

  // Fetch manifests, untracked changes, and file statuses
  const refreshData = useCallback(async () => {
    const [manifestData, untracked] = await Promise.all([
      rpc.request.getManifests({}),
      rpc.request.getUntrackedChanges({}),
    ]);

    setManifests(manifestData);
    setUntrackedFiles(untracked);

    // Fetch file statuses for each unique baseRef
    try {
      const baseRefs = new Set(
        manifestData.map((manifest) => manifest.baseRef),
      );

      // Also use HEAD for untracked files
      baseRefs.add('HEAD');

      const statusResults = await Promise.all(
        [...baseRefs].map((baseRef) =>
          rpc.request.getFileStatuses({ baseRef }),
        ),
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
        rpc.request.getCurrentFileContent({ path: selectedFile.path }),
      ]);

      setOriginalContent(original);
      setCurrentContent(current);

      // Default to "current" view for new files (no original content)
      if (!original) {
        setViewMode('current');
      } else {
        setViewMode('diff');
      }
    };

    loadContent();
  }, [selectedFile]);

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
    }[] = manifests.map((manifest) => ({
      files: manifest.files,
      manifestSlug: manifest.slug,
      baseRef: manifest.baseRef,
    }));

    if (untrackedFiles.length > 0) {
      groups.push({
        files: untrackedFiles,
        manifestSlug: null,
        baseRef: manifests.length > 0 ? manifests[0].baseRef : 'HEAD',
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
        });
        setSelectedPlan(null);
      }
    };

    window.addEventListener('keydown', handler, true);

    return () => {
      window.removeEventListener('keydown', handler, true);
    };
  }, [manifests, untrackedFiles, selectedFile]);

  // Handle selecting a file (clears selected plan)
  const handleSelectFile = useCallback((file: SelectedFile) => {
    setSelectedFile(file);
    setSelectedPlan(null);
  }, []);

  // Handle selecting a plan (clears selected file)
  const handleSelectPlan = useCallback((filename: string) => {
    setSelectedPlan(filename);
    setSelectedFile(null);
  }, []);

  // Handle deleting a work group
  const handleDeleteManifest = useCallback(
    async (slug: string) => {
      await rpc.request.deleteManifest({ slug });
      await refreshData();
    },
    [refreshData],
  );

  // Handle assigning an untracked file to a manifest
  const handleAssignFile = useCallback(
    async (file: string, slug: string) => {
      await rpc.request.addFileToManifest({ slug, file });
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

  return (
    <div className="app" ref={appRef}>
      <Sidebar
        manifests={manifests}
        untrackedFiles={untrackedFiles}
        selectedFile={selectedFile}
        onSelectFile={handleSelectFile}
        onAssignFile={handleAssignFile}
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
    </div>
  );
};
