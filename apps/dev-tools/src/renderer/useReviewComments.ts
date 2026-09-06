import { useCallback, useEffect, useRef, useState } from 'react';
import type {
  NewReviewComment,
  ReviewComment,
  ReviewCommentChanges,
} from '../types';
import { rpc } from './index';

/**
 * Loads the review comments of a work group and keeps them in sync
 * with the comment files on disk.
 *
 * @param slug - The work group slug, or null when no work group is active.
 * @returns The comments and functions to create, update and delete them.
 */
export function useReviewComments(slug: string | null) {
  const [comments, setComments] = useState<ReviewComment[]>([]);
  // Incremented per load so a stale response for a previous work
  // group is discarded
  const loadTokenRef = useRef(0);

  // Reload the comments from disk
  const refresh = useCallback(async () => {
    const token = ++loadTokenRef.current;

    if (!slug) {
      setComments([]);

      return;
    }

    const loaded = await rpc.request.getReviewComments({ slug });

    if (token === loadTokenRef.current) {
      setComments(loaded);
    }
  }, [slug]);

  // Load on work group change
  useEffect(() => {
    refresh();
  }, [refresh]);

  // Reload when the backend watcher reports comment file changes
  useEffect(() => {
    const handler = () => {
      refresh();
    };

    window.addEventListener('review-comments-changed', handler);

    return () => {
      window.removeEventListener('review-comments-changed', handler);
    };
  }, [refresh]);

  // Write a new comment file
  const createComment = useCallback(
    async (comment: NewReviewComment) => {
      if (!slug) {
        return;
      }

      await rpc.request.createReviewComment({ slug, comment });
      await refresh();
    },
    [slug, refresh],
  );

  // Rewrite a comment file with changes
  const updateComment = useCallback(
    async (id: string, changes: ReviewCommentChanges) => {
      if (!slug) {
        return;
      }

      await rpc.request.updateReviewComment({ slug, id, changes });
      await refresh();
    },
    [slug, refresh],
  );

  // Delete a comment file
  const deleteComment = useCallback(
    async (id: string) => {
      if (!slug) {
        return;
      }

      await rpc.request.deleteReviewComment({ slug, id });
      await refresh();
    },
    [slug, refresh],
  );

  return { comments, createComment, updateComment, deleteComment };
}
