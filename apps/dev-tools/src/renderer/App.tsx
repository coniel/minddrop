import { useCallback, useEffect, useState } from 'react';
import type { ManifestWithSlug } from '../types';
import { DiffViewer } from './DiffViewer';
import { PlanViewer } from './PlanViewer';
import { Sidebar } from './Sidebar';
import { rpc } from './index';
import type { Plan, SelectedFile, ViewMode } from './types';
import './App.css';

/**
 * Renders the main dev review application layout with sidebar and diff viewer.
 */
export const App: React.FC = () => {
  const [manifests, setManifests] = useState<ManifestWithSlug[]>([]);
  const [untrackedFiles, setUntrackedFiles] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<SelectedFile | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('diff');
  const [originalContent, setOriginalContent] = useState('');
  const [currentContent, setCurrentContent] = useState('');
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [planContent, setPlanContent] = useState('');

  // Fetch manifests and untracked changes
  const refreshData = useCallback(async () => {
    const [manifestData, untracked] = await Promise.all([
      rpc.request.getManifests({}),
      rpc.request.getUntrackedChanges({}),
    ]);

    setManifests(manifestData);
    setUntrackedFiles(untracked);
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

  // Keyboard shortcuts: q/w/e to switch view modes
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      // Ignore when typing in an input or textarea
      if (
        event.target instanceof HTMLInputElement ||
        event.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (!selectedFile) {
        return;
      }

      if (event.key === 'q' || event.key === 'w' || event.key === 'e') {
        event.preventDefault();
        event.stopPropagation();
      }

      if (event.key === 'q') {
        setViewMode('diff');
      } else if (event.key === 'w') {
        setViewMode('original');
      } else if (event.key === 'e') {
        setViewMode('current');
      }
    };

    window.addEventListener('keydown', handler);

    return () => {
      window.removeEventListener('keydown', handler);
    };
  }, [selectedFile]);

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

  return (
    <div className="app">
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
      />
      <div className="app-main">
        {selectedFile ? (
          <DiffViewer
            selectedFile={selectedFile}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            originalContent={originalContent}
            currentContent={currentContent}
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
