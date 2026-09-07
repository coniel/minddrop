import { useEffect, useRef, useState } from 'react';
import type { ManifestWithSlug, UntrackedChange } from '../types';
import { FileIcon } from './FileIcon';
import { FileList } from './FileList';
import type { PackageFileGroup } from './groupFilesByPackage';
import { groupFilesByPackage } from './groupFilesByPackage';
import type { FileStatus, SelectedFile } from './types';
import './Sidebar.css';

interface SidebarProps {
  /**
   * All active manifests.
   */
  manifests: ManifestWithSlug[];

  /**
   * Files changed in git but not in any manifest.
   */
  untrackedFiles: UntrackedChange[];

  /**
   * The currently selected file, if any.
   */
  selectedFile: SelectedFile | null;

  /**
   * Called when a file is selected for viewing.
   */
  onSelectFile: (file: SelectedFile) => void;

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
  onDeleteManifest,
  fileStatuses,
  style,
}) => {
  const searchInputRef = useRef<HTMLInputElement>(null);
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
  const handleSelectUntrackedFile = (change: UntrackedChange) => {
    onSelectFile({
      path: change.path,
      manifestSlug: null,
      baseRef: change.baseRef,
      worktree: change.worktree,
    });
  };

  // Keyboard shortcut: mod+k to focus the search field
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      if (!(event.metaKey || event.ctrlKey) || event.key !== 'k') {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      searchInputRef.current?.focus();
      searchInputRef.current?.select();
    };

    window.addEventListener('keydown', handler, true);

    return () => {
      window.removeEventListener('keydown', handler, true);
    };
  }, []);

  // Handle typing in the search field
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  // Handle clearing the search field
  const handleClearSearch = () => {
    setSearchQuery('');
  };

  // Escape clears the search, or leaves the field when already empty
  const handleSearchKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (event.key !== 'Escape') {
      return;
    }

    event.preventDefault();

    if (searchQuery === '') {
      event.currentTarget.blur();

      return;
    }

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

  // Work groups grouped by the agent worktree they belong to
  const agentSections = groupManifestsByAgent(manifests);

  // Untracked files grouped by checkout, then by package
  const untrackedSections = groupUntrackedChanges(untrackedFiles);

  // Matches for the current query, across every work group and untracked files
  const searchResults = searchFileNames(searchQuery, manifests, untrackedFiles);

  // Whether the search results replace the regular sidebar content
  const isSearching = searchQuery.trim().length > 0;

  return (
    <div className="sidebar" style={style}>
      <div className="sidebar-search">
        <input
          ref={searchInputRef}
          className="sidebar-search-input"
          type="text"
          value={searchQuery}
          placeholder="Search files"
          title="Search files (mod+k)"
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          onChange={handleSearchChange}
          onKeyDown={handleSearchKeyDown}
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
              key={`${result.manifestSlug ?? 'untracked'}:${result.worktree ?? 'main'}:${result.path}`}
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
          {agentSections.map((section) => (
            <div
              key={section.worktree ?? 'main'}
              className="sidebar-agent-section"
            >
              <div className="sidebar-agent-label">
                {section.worktree ?? 'main'}
              </div>

              {section.manifests.map((manifest) => (
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
                    <FileList
                      files={manifest.files}
                      selectedPath={selectedFile?.path ?? null}
                      onSelectFile={(path) =>
                        handleSelectManifestFile(manifest, path)
                      }
                      fileStatuses={fileStatuses}
                    />
                  )}
                </div>
              ))}
            </div>
          ))}

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

              {untrackedSections.map((section) => (
                <div
                  key={section.worktree ?? 'main'}
                  className="sidebar-worktree-section"
                >
                  <div className="sidebar-worktree-label">
                    {section.worktree ?? 'main'}
                  </div>

                  {section.groups.map((group) => (
                    <div key={group.label} className="sidebar-package-group">
                      <div className="sidebar-package-label">{group.label}</div>

                      {group.files.map((file) => (
                        <button
                          key={file}
                          className={`sidebar-file-button ${isSelectedUntracked(selectedFile, file, section.worktree) ? 'selected' : ''} ${fileStatuses[file] ? `file-status-${fileStatuses[file]}` : ''}`}
                          onClick={() =>
                            handleSelectUntrackedFile(section.changes[file])
                          }
                          title={file}
                        >
                          <FileIcon filename={file} />
                          {getFileName(file)}
                        </button>
                      ))}
                    </div>
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
 * Returns whether the selected file is the given untracked file.
 */
function isSelectedUntracked(
  selectedFile: SelectedFile | null,
  path: string,
  worktree: string | null,
): boolean {
  return (
    selectedFile !== null &&
    selectedFile.manifestSlug === null &&
    selectedFile.path === path &&
    selectedFile.worktree === worktree
  );
}

/**
 * The work groups belonging to one agent's checkout.
 */
interface AgentSection {
  /**
   * The worktree name, or null for the main checkout.
   */
  worktree: string | null;

  /**
   * The checkout's work groups.
   */
  manifests: ManifestWithSlug[];
}

/**
 * Groups work groups by the checkout they live in, sorted by checkout
 * name with the main checkout last.
 */
function groupManifestsByAgent(manifests: ManifestWithSlug[]): AgentSection[] {
  const sections: AgentSection[] = [];

  for (const manifest of manifests) {
    const worktree = manifest.worktree ?? null;

    let section = sections.find((candidate) => candidate.worktree === worktree);

    if (!section) {
      section = { worktree, manifests: [] };
      sections.push(section);
    }

    section.manifests.push(manifest);
  }

  return sections.sort(compareAgentSections);
}

/**
 * Orders agent sections by worktree name, with the main checkout last.
 */
function compareAgentSections(a: AgentSection, b: AgentSection): number {
  if (a.worktree === null) {
    return 1;
  }

  if (b.worktree === null) {
    return -1;
  }

  return a.worktree.localeCompare(b.worktree);
}

/**
 * The untracked changes of one checkout, grouped by package.
 */
interface UntrackedSection {
  /**
   * The worktree name, or null for the main checkout.
   */
  worktree: string | null;

  /**
   * The checkout's changed files grouped by package.
   */
  groups: PackageFileGroup[];

  /**
   * The checkout's changes keyed by path.
   */
  changes: Record<string, UntrackedChange>;
}

/**
 * Groups untracked changes by the checkout they live in, then by
 * package, preserving the order in which each checkout first appears.
 */
function groupUntrackedChanges(changes: UntrackedChange[]): UntrackedSection[] {
  const sections: UntrackedSection[] = [];

  // Collect each checkout's changes
  for (const change of changes) {
    let section = sections.find(
      (candidate) => candidate.worktree === change.worktree,
    );

    if (!section) {
      section = { worktree: change.worktree, groups: [], changes: {} };
      sections.push(section);
    }

    section.changes[change.path] = change;
  }

  // Group each checkout's files by package
  for (const section of sections) {
    section.groups = groupFilesByPackage(Object.keys(section.changes));
  }

  return sections;
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
  untrackedFiles: UntrackedChange[],
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

  // Collect matches from untracked changes
  for (const change of untrackedFiles) {
    if (seenPaths.has(change.path)) {
      continue;
    }

    if (!getFileName(change.path).toLowerCase().includes(trimmedQuery)) {
      continue;
    }

    seenPaths.add(change.path);
    results.push({
      path: change.path,
      manifestSlug: null,
      baseRef: change.baseRef,
      worktree: change.worktree,
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
