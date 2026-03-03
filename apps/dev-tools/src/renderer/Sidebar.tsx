import { useState } from 'react';
import type { ManifestWithSlug } from '../types';
import { FileIcon } from './FileIcon';
import { FileList } from './FileList';
import type { Plan, SelectedFile } from './types';
import './Sidebar.css';

interface SidebarProps {
  /**
   * All active manifests.
   */
  manifests: ManifestWithSlug[];

  /**
   * Files changed in git but not in any manifest.
   */
  untrackedFiles: string[];

  /**
   * The currently selected file, if any.
   */
  selectedFile: SelectedFile | null;

  /**
   * Called when a file is selected for viewing.
   */
  onSelectFile: (file: SelectedFile) => void;

  /**
   * Called when an untracked file is assigned to a manifest.
   */
  onAssignFile: (file: string, slug: string) => void;

  /**
   * All available plans.
   */
  plans: Plan[];

  /**
   * The filename of the currently selected plan, if any.
   */
  selectedPlan: string | null;

  /**
   * Called when a plan is selected for viewing.
   */
  onSelectPlan: (filename: string) => void;

  /**
   * Called when a work group is deleted.
   */
  onDeleteManifest: (slug: string) => void;
}

/**
 * Renders the sidebar with work groups and untracked changes.
 */
export const Sidebar: React.FC<SidebarProps> = ({
  manifests,
  untrackedFiles,
  selectedFile,
  onSelectFile,
  onAssignFile,
  plans,
  selectedPlan,
  onSelectPlan,
  onDeleteManifest,
}) => {
  // Track which groups are expanded
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    () => new Set(manifests.map((manifest) => manifest.slug)),
  );

  // Track which untracked file has its assign dropdown open
  const [assigningFile, setAssigningFile] = useState<string | null>(null);

  // Toggle a group's expanded state
  const toggleGroup = (slug: string) => {
    setExpandedGroups((previous) => {
      const next = new Set(previous);

      if (next.has(slug)) {
        next.delete(slug);
      } else {
        next.add(slug);
      }

      return next;
    });
  };

  // Handle selecting a file from a manifest
  const handleSelectManifestFile = (
    manifest: ManifestWithSlug,
    path: string,
  ) => {
    onSelectFile({
      path,
      manifestSlug: manifest.slug,
      baseRef: manifest.baseRef,
    });
  };

  // Handle selecting an untracked file
  const handleSelectUntrackedFile = (path: string) => {
    // Use the first manifest's baseRef, or HEAD
    const baseRef = manifests.length > 0 ? manifests[0].baseRef : 'HEAD';

    onSelectFile({
      path,
      manifestSlug: null,
      baseRef,
    });
  };

  // Handle assigning an untracked file to a manifest
  const handleAssign = (file: string, slug: string) => {
    onAssignFile(file, slug);
    setAssigningFile(null);
  };

  // Group plans by manifest slug using prefix matching
  const plansForManifest = (slug: string): Plan[] => {
    return plans.filter((plan) => {
      const planSlug = plan.filename.replace('.md', '');

      return planSlug === slug || planSlug.startsWith(`${slug}-`);
    });
  };

  // Plans that don't match any manifest
  const unmatchedPlans = plans.filter((plan) => {
    const planSlug = plan.filename.replace('.md', '');

    return !manifests.some(
      (manifest) =>
        planSlug === manifest.slug || planSlug.startsWith(`${manifest.slug}-`),
    );
  });

  return (
    <div className="sidebar">
      <div className="sidebar-header">Work Groups</div>

      <div className="sidebar-content">
        {manifests.map((manifest) => {
          const groupPlans = plansForManifest(manifest.slug);

          return (
            <div key={manifest.slug} className="sidebar-group">
              <div className="sidebar-group-header-row">
                <button
                  className="sidebar-group-header"
                  onClick={() => toggleGroup(manifest.slug)}
                >
                  <span className="sidebar-group-chevron">
                    {expandedGroups.has(manifest.slug) ? '▼' : '▶'}
                  </span>
                  <span className="sidebar-group-title">{manifest.title}</span>
                  <span className="sidebar-group-count">
                    {manifest.files.length}
                  </span>
                </button>
                <button
                  className="sidebar-delete-button"
                  onClick={() => onDeleteManifest(manifest.slug)}
                  title="Remove work group"
                >
                  ✕
                </button>
              </div>

              {expandedGroups.has(manifest.slug) && (
                <>
                  {groupPlans.map((plan) => (
                    <button
                      key={plan.filename}
                      className={`sidebar-plan-button ${selectedPlan === plan.filename ? 'selected' : ''}`}
                      onClick={() => onSelectPlan(plan.filename)}
                    >
                      {plan.name}
                    </button>
                  ))}

                  <FileList
                    files={manifest.files}
                    selectedPath={selectedFile?.path ?? null}
                    onSelectFile={(path) =>
                      handleSelectManifestFile(manifest, path)
                    }
                  />
                </>
              )}
            </div>
          );
        })}

        {manifests.length === 0 && (
          <div className="sidebar-empty">No work groups found</div>
        )}

        {untrackedFiles.length > 0 && (
          <>
            <div className="sidebar-header sidebar-header-untracked">
              Untracked Changes
            </div>

            {untrackedFiles.map((file) => (
              <div key={file} className="sidebar-untracked-file">
                <button
                  className={`sidebar-file-button ${selectedFile?.path === file ? 'selected' : ''}`}
                  onClick={() => handleSelectUntrackedFile(file)}
                >
                  <FileIcon filename={file} />
                  {getFileName(file)}
                </button>

                <div className="sidebar-assign-wrapper">
                  <button
                    className="sidebar-assign-button"
                    onClick={(event) => {
                      event.stopPropagation();
                      setAssigningFile(assigningFile === file ? null : file);
                    }}
                    title="Assign to work group"
                  >
                    +
                  </button>

                  {assigningFile === file && (
                    <div className="sidebar-assign-dropdown">
                      {manifests.map((manifest) => (
                        <button
                          key={manifest.slug}
                          className="sidebar-assign-option"
                          onClick={() => handleAssign(file, manifest.slug)}
                        >
                          {manifest.title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </>
        )}

        {unmatchedPlans.length > 0 && (
          <>
            <div className="sidebar-header sidebar-header-plans">Plans</div>

            {unmatchedPlans.map((plan) => (
              <button
                key={plan.filename}
                className={`sidebar-plan-button ${selectedPlan === plan.filename ? 'selected' : ''}`}
                onClick={() => onSelectPlan(plan.filename)}
              >
                {plan.name}
              </button>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

/**
 * Extracts the filename from a repo-relative path.
 */
function getFileName(path: string): string {
  return path.split('/').pop() ?? path;
}
