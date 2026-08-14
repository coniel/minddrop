import { useEffect, useState } from 'react';
import type { ManifestWithSlug } from '../types';
import { FileIcon } from './FileIcon';
import { FileList } from './FileList';
import { groupFilesByPackage } from './groupFilesByPackage';
import type { FileStatus, Plan, SelectedFile } from './types';
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

  /**
   * Git status for each changed file.
   */
  fileStatuses: Record<string, FileStatus>;

  /**
   * Optional inline styles for resize overrides.
   */
  style?: React.CSSProperties;
}

/**
 * Renders the sidebar with work groups and untracked changes.
 */
export const Sidebar: React.FC<SidebarProps> = ({
  manifests,
  untrackedFiles,
  selectedFile,
  onSelectFile,
  plans,
  selectedPlan,
  onSelectPlan,
  onDeleteManifest,
  fileStatuses,
  style,
}) => {
  // Detect footer layout (<=1200px)
  const isFooterLayout = useMediaQuery('(max-width: 1200px)');

  // Track which groups are expanded
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(
    () => new Set(manifests.map((manifest) => manifest.slug)),
  );

  // The current file name search query
  const [searchQuery, setSearchQuery] = useState('');

  // Toggle a group's expanded state (disabled in footer layout)
  const toggleGroup = (slug: string) => {
    if (isFooterLayout) {
      return;
    }

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
      worktree: manifest.worktree ?? null,
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
      worktree: null,
    });
  };

  // Group plans by manifest slug using prefix matching
  const plansForManifest = (slug: string): Plan[] => {
    return plans.filter((plan) => {
      const planSlug = plan.filename.replace('.md', '');

      return planSlug === slug || planSlug.startsWith(`${slug}-`);
    });
  };

  // Handle typing in the search field
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  // Handle clearing the search field
  const handleClearSearch = () => {
    setSearchQuery('');
  };

  // Handle selecting a search result
  const handleSelectSearchResult = (result: SearchResult) => {
    onSelectFile({
      path: result.path,
      manifestSlug: result.manifestSlug,
      baseRef: result.baseRef,
      worktree: result.worktree,
    });
  };

  // Untracked files grouped by the package they belong to
  const untrackedGroups = groupFilesByPackage(untrackedFiles);

  // Matches for the current query, across every work group and untracked files
  const searchResults = searchFileNames(searchQuery, manifests, untrackedFiles);

  // Whether the search results replace the regular sidebar content
  const isSearching = searchQuery.trim().length > 0;

  // Plans that don't match any manifest
  const unmatchedPlans = plans.filter((plan) => {
    const planSlug = plan.filename.replace('.md', '');

    return !manifests.some(
      (manifest) =>
        planSlug === manifest.slug || planSlug.startsWith(`${manifest.slug}-`),
    );
  });

  return (
    <div className="sidebar" style={style}>
      <div className="sidebar-search">
        <input
          className="sidebar-search-input"
          type="text"
          value={searchQuery}
          placeholder="Search files"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          onChange={handleSearchChange}
        />

        {isSearching && (
          <button
            className="sidebar-search-clear"
            onClick={handleClearSearch}
            title="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {isSearching ? (
        <div className="sidebar-content sidebar-search-results">
          {searchResults.map((result) => (
            <button
              key={`${result.manifestSlug ?? 'untracked'}:${result.path}`}
              className={`sidebar-file-button ${selectedFile?.path === result.path ? 'selected' : ''} ${fileStatuses[result.path] ? `file-status-${fileStatuses[result.path]}` : ''}`}
              onClick={() => handleSelectSearchResult(result)}
              title={result.path}
            >
              <FileIcon filename={result.path} />
              <span className="sidebar-search-result-name">
                {getFileName(result.path)}
              </span>
              <span className="sidebar-search-result-path">
                {getDirectoryName(result.path)}
              </span>
            </button>
          ))}

          {searchResults.length === 0 && (
            <div className="sidebar-empty">No matching files</div>
          )}
        </div>
      ) : (
        <div className="sidebar-content">
          {unmatchedPlans.length > 0 && (
            <div className="sidebar-plans-section">
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
            </div>
          )}

          <div className="sidebar-header sidebar-header-work-groups">
            Work Groups
          </div>

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
                    <span className="sidebar-group-title">
                      {manifest.title}
                    </span>
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

                {(isFooterLayout || expandedGroups.has(manifest.slug)) && (
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
                      fileStatuses={fileStatuses}
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
            <div className="sidebar-untracked-section">
              <div className="sidebar-header sidebar-header-untracked">
                Untracked Changes
                <span className="sidebar-header-count">
                  {untrackedFiles.length}
                </span>
              </div>

              {untrackedGroups.map((group) => (
                <div key={group.label} className="sidebar-package-group">
                  <div className="sidebar-package-label">{group.label}</div>

                  {group.files.map((file) => (
                    <button
                      key={file}
                      className={`sidebar-file-button ${selectedFile?.path === file ? 'selected' : ''} ${fileStatuses[file] ? `file-status-${fileStatuses[file]}` : ''}`}
                      onClick={() => handleSelectUntrackedFile(file)}
                      title={file}
                    >
                      <FileIcon filename={file} />
                      {getFileName(file)}
                    </button>
                  ))}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * Extracts the filename from a repo-relative path.
 */
function getFileName(path: string): string {
  return path.split('/').pop() ?? path;
}

/**
 * Extracts the directory portion of a repo-relative path.
 */
function getDirectoryName(path: string): string {
  return path.split('/').slice(0, -1).join('/');
}

/**
 * A file matching the current search query, along with the diff context
 * needed to open it.
 */
interface SearchResult {
  /**
   * The repo-relative file path.
   */
  path: string;

  /**
   * The slug of the work group the file belongs to, or null when untracked.
   */
  manifestSlug: string | null;

  /**
   * The git ref the file is diffed against.
   */
  baseRef: string;

  /**
   * The worktree the file lives in, if any.
   */
  worktree: string | null;
}

/**
 * Returns the files whose name matches the query, across all work groups and
 * untracked changes. Returns an empty array for a blank query.
 */
function searchFileNames(
  query: string,
  manifests: ManifestWithSlug[],
  untrackedFiles: string[],
): SearchResult[] {
  const trimmedQuery = query.trim().toLowerCase();

  // A blank query has no results
  if (!trimmedQuery) {
    return [];
  }

  const results: SearchResult[] = [];

  // Track paths already added so a file in several work groups appears once
  const seenPaths = new Set<string>();

  // Collect matches from every work group
  for (const manifest of manifests) {
    for (const path of manifest.files) {
      if (seenPaths.has(path)) {
        continue;
      }

      if (!getFileName(path).toLowerCase().includes(trimmedQuery)) {
        continue;
      }

      seenPaths.add(path);
      results.push({
        path,
        manifestSlug: manifest.slug,
        baseRef: manifest.baseRef,
        worktree: manifest.worktree ?? null,
      });
    }
  }

  // Untracked files fall back to the first work group's base ref
  const untrackedBaseRef = manifests.length > 0 ? manifests[0].baseRef : 'HEAD';

  // Collect matches from untracked changes
  for (const path of untrackedFiles) {
    if (seenPaths.has(path)) {
      continue;
    }

    if (!getFileName(path).toLowerCase().includes(trimmedQuery)) {
      continue;
    }

    seenPaths.add(path);
    results.push({
      path,
      manifestSlug: null,
      baseRef: untrackedBaseRef,
      worktree: null,
    });
  }

  return results;
}

/**
 * Returns whether the given media query currently matches.
 */
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(
    () => window.matchMedia(query).matches,
  );

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);

    const handler = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    mediaQuery.addEventListener('change', handler);

    return () => {
      mediaQuery.removeEventListener('change', handler);
    };
  }, [query]);

  return matches;
}
