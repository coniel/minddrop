import { useEffect, useRef, useState } from 'react';
import type { ReviewComment } from '../types';
import { CommentEditor } from './CommentEditor';
import { FileIcon } from './FileIcon';
import './ReviewPanel.css';

interface ReviewPanelProps {
  /**
   * The slug of the work group being reviewed, or null when none is
   * active.
   */
  slug: string | null;

  /**
   * The title of the work group being reviewed.
   */
  title: string;

  /**
   * The work group's review comments.
   */
  comments: ReviewComment[];

  /**
   * The work group's files in manifest order, used to order the
   * per-file comment groups.
   */
  fileOrder: string[];

  /**
   * The id of the comment currently highlighted, if any.
   */
  focusedCommentId: string | null;

  /**
   * Called when a comment is clicked.
   */
  onSelectComment: (comment: ReviewComment) => void;

  /**
   * Called when a comment is resolved or reopened.
   */
  onResolveComment: (id: string, resolved: boolean) => void;

  /**
   * Called when a comment is deleted.
   */
  onDeleteComment: (id: string) => void;

  /**
   * Called with the text of a new general comment.
   */
  onCreateComment: (text: string) => void;

  /**
   * Called when the panel's close button is clicked.
   */
  onClose: () => void;

  /**
   * Optional inline styles for resize overrides.
   */
  style?: React.CSSProperties;
}

/**
 * Renders the review sidebar listing a work group's comments, with
 * general comments first and file comments grouped by file.
 */
export const ReviewPanel: React.FC<ReviewPanelProps> = ({
  slug,
  title,
  comments,
  fileOrder,
  focusedCommentId,
  onSelectComment,
  onResolveComment,
  onDeleteComment,
  onCreateComment,
  onClose,
  style,
}) => {
  const listRef = useRef<HTMLDivElement>(null);
  const [isComposing, setIsComposing] = useState(false);
  const [copied, setCopied] = useState(false);

  // Comments not anchored to a file
  const generalComments = comments.filter((comment) => comment.file === null);

  // File comments grouped and ordered by manifest file order
  const fileGroups = groupCommentsByFile(comments, fileOrder);

  // Number of comments still to address
  const openCount = comments.filter(
    (comment) => comment.status === 'open',
  ).length;

  // Scroll the highlighted comment into view
  useEffect(() => {
    if (!focusedCommentId || !listRef.current) {
      return;
    }

    const element = listRef.current.querySelector(
      `[data-comment-id="${focusedCommentId}"]`,
    );

    element?.scrollIntoView({ block: 'nearest' });
  }, [focusedCommentId]);

  // Close the composer when the work group changes
  useEffect(() => {
    setIsComposing(false);
  }, [slug]);

  // Save a new general comment
  const handleCreateComment = (text: string) => {
    onCreateComment(text);
    setIsComposing(false);
  };

  // Copy an instruction for the agent to address the open comments
  const handleCopyPrompt = async () => {
    if (!slug) {
      return;
    }

    await navigator.clipboard.writeText(
      `Address the open review comments for the "${title}" work group in ~/Documents/MindDrop 2/dev/reviews/${slug}/`,
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="review-panel" style={style}>
      <div className="review-panel-header">
        <span className="review-panel-title">Review</span>

        {openCount > 0 && (
          <span className="review-panel-count">{openCount}</span>
        )}

        <span className="review-panel-spacer" />

        {slug && (
          <>
            <button
              className="review-panel-header-button"
              onClick={handleCopyPrompt}
              title="Copy an instruction for the agent to address the open comments"
            >
              {copied ? 'Copied' : 'Copy prompt'}
            </button>
            <button
              className="review-panel-header-button"
              onClick={() => setIsComposing(true)}
              title="New general comment"
            >
              +
            </button>
          </>
        )}

        <button
          className="review-panel-header-button"
          onClick={onClose}
          title="Hide review panel (ctrl+r)"
        >
          ✕
        </button>
      </div>

      {slug ? (
        <div className="review-panel-list" ref={listRef}>
          <div className="review-panel-work-group">{title}</div>

          {isComposing && (
            <div className="review-panel-composer">
              <CommentEditor
                placeholder="Write a general comment"
                onSubmit={handleCreateComment}
                onCancel={() => setIsComposing(false)}
              />
            </div>
          )}

          {generalComments.length > 0 && (
            <div className="review-panel-group">
              <div className="review-panel-group-label">General</div>

              {generalComments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  focused={comment.id === focusedCommentId}
                  onSelect={onSelectComment}
                  onResolve={onResolveComment}
                  onDelete={onDeleteComment}
                />
              ))}
            </div>
          )}

          {fileGroups.map((group) => (
            <div key={group.file} className="review-panel-group">
              <div className="review-panel-group-label" title={group.file}>
                <FileIcon filename={group.file} />
                {getFileName(group.file)}
              </div>

              {group.comments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  focused={comment.id === focusedCommentId}
                  onSelect={onSelectComment}
                  onResolve={onResolveComment}
                  onDelete={onDeleteComment}
                />
              ))}
            </div>
          ))}

          {comments.length === 0 && !isComposing && (
            <div className="review-panel-empty">
              Select code and press enter to comment
            </div>
          )}
        </div>
      ) : (
        <div className="review-panel-empty">
          Select a work group file to review
        </div>
      )}
    </div>
  );
};

/**
 * Renders a single comment with its anchor, text and actions.
 */
function CommentItem({
  comment,
  focused,
  onSelect,
  onResolve,
  onDelete,
}: {
  comment: ReviewComment;
  focused: boolean;
  onSelect: (comment: ReviewComment) => void;
  onResolve: (id: string, resolved: boolean) => void;
  onDelete: (id: string) => void;
}) {
  const resolved = comment.status === 'resolved';

  // Toggle resolved without selecting the comment
  const handleResolve = (event: React.MouseEvent) => {
    event.stopPropagation();
    onResolve(comment.id, !resolved);
  };

  // Delete without selecting the comment
  const handleDelete = (event: React.MouseEvent) => {
    event.stopPropagation();
    onDelete(comment.id);
  };

  return (
    <div
      className={`review-comment ${focused ? 'focused' : ''} ${resolved ? 'resolved' : ''}`}
      data-comment-id={comment.id}
      onClick={() => onSelect(comment)}
    >
      {comment.file !== null && (
        <div className="review-comment-anchor">
          <span className="review-comment-lines">
            {formatAnchor(comment.startLine, comment.endLine)}
          </span>
          <span className="review-comment-snippet">
            {getFirstLine(comment.snippet)}
          </span>
        </div>
      )}

      <div className="review-comment-text">{comment.text}</div>

      <div className="review-comment-actions">
        <button
          className={`review-comment-action ${resolved ? 'active' : ''}`}
          onClick={handleResolve}
          title={resolved ? 'Reopen' : 'Resolve'}
        >
          ✓
        </button>
        <button
          className="review-comment-action"
          onClick={handleDelete}
          title="Delete"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

/**
 * A file's comments, ordered by line.
 */
interface FileCommentGroup {
  /**
   * The repo-relative file path.
   */
  file: string;

  /**
   * The comments anchored to the file.
   */
  comments: ReviewComment[];
}

/**
 * Groups file-anchored comments by file, ordering groups by the given
 * file order and comments within a group by line, file-level comments
 * first.
 */
function groupCommentsByFile(
  comments: ReviewComment[],
  fileOrder: string[],
): FileCommentGroup[] {
  const groups = new Map<string, ReviewComment[]>();

  // Collect the comments of each file
  for (const comment of comments) {
    if (comment.file === null) {
      continue;
    }

    const group = groups.get(comment.file) ?? [];

    group.push(comment);
    groups.set(comment.file, group);
  }

  // Files missing from the order sort after the ordered ones
  const orderIndex = (file: string) => {
    const index = fileOrder.indexOf(file);

    if (index === -1) {
      return fileOrder.length;
    }

    return index;
  };

  return [...groups.entries()]
    .sort(([fileA], [fileB]) => {
      return (
        orderIndex(fileA) - orderIndex(fileB) || fileA.localeCompare(fileB)
      );
    })
    .map(([file, fileComments]) => ({
      file,
      comments: fileComments.sort(
        (commentA, commentB) =>
          (commentA.startLine ?? 0) - (commentB.startLine ?? 0),
      ),
    }));
}

/**
 * Formats a file comment's anchor label: the line range, or "File" for
 * a file-level comment.
 */
function formatAnchor(
  startLine: number | null,
  endLine: number | null,
): string {
  if (startLine === null) {
    return 'File';
  }

  if (endLine === null || startLine === endLine) {
    return `L${startLine}`;
  }

  return `L${startLine}-${endLine}`;
}

/**
 * Returns the first non-blank line of a snippet, trimmed.
 */
function getFirstLine(snippet: string | null): string {
  if (!snippet) {
    return '';
  }

  const line = snippet.split('\n').find((candidate) => candidate.trim());

  return line?.trim() ?? '';
}

/**
 * Extracts the filename from a repo-relative path.
 */
function getFileName(path: string): string {
  return path.split('/').pop() ?? path;
}
