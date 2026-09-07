import { FileIcon } from './FileIcon';
import { groupFilesByPackage } from './groupFilesByPackage';
import type { FileStatus } from './types';
import './Sidebar.css';

interface FileListProps {
  /**
   * Repo-relative file paths to display.
   */
  files: string[];

  /**
   * The currently selected file path, if any.
   */
  selectedPath: string | null;

  /**
   * Called when a file is clicked.
   */
  onSelectFile: (path: string) => void;

  /**
   * Git status for each changed file.
   */
  fileStatuses: Record<string, FileStatus>;

  /**
   * The paths of the files already reviewed.
   */
  reviewedPaths: Set<string>;

  /**
   * Number of open comments on each file.
   */
  commentCounts: Record<string, number>;
}

/**
 * Renders a list of file entries within a work group.
 */
export const FileList: React.FC<FileListProps> = ({
  files,
  selectedPath,
  onSelectFile,
  fileStatuses,
  reviewedPaths,
  commentCounts,
}) => {
  // Group the files by the package they belong to
  const groups = groupFilesByPackage(files);

  return (
    <div className="file-list">
      {groups.map((group) => (
        <div key={group.label} className="sidebar-package-group">
          <div className="sidebar-package-label">{group.label}</div>

          {group.files.map((file) => (
            <button
              key={file}
              className={`sidebar-file-button ${selectedPath === file ? 'selected' : ''} ${reviewedPaths.has(file) ? 'reviewed' : ''} ${fileStatuses[file] ? `file-status-${fileStatuses[file]}` : ''}`}
              onClick={() => onSelectFile(file)}
              title={file}
            >
              <span className="sidebar-file-check">
                {reviewedPaths.has(file) ? '✓' : ''}
              </span>
              <FileIcon filename={file} />
              <span className="sidebar-file-name">{getFileName(file)}</span>

              {commentCounts[file] > 0 && (
                <span className="sidebar-file-comment-count">
                  {commentCounts[file]}
                </span>
              )}
            </button>
          ))}
        </div>
      ))}
    </div>
  );
};

/**
 * Extracts the filename from a repo-relative path.
 */
function getFileName(path: string): string {
  return path.split('/').pop() ?? path;
}
