import { FileIcon } from './FileIcon';
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
}

/**
 * Renders a list of file entries within a work group.
 */
export const FileList: React.FC<FileListProps> = ({
  files,
  selectedPath,
  onSelectFile,
  fileStatuses,
}) => {
  return (
    <div className="file-list">
      {files.map((file) => (
        <button
          key={file}
          className={`sidebar-file-button ${selectedPath === file ? 'selected' : ''} ${fileStatuses[file] ? `file-status-${fileStatuses[file]}` : ''}`}
          onClick={() => onSelectFile(file)}
          title={file}
        >
          <FileIcon filename={file} />
          {getFileName(file)}
        </button>
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
