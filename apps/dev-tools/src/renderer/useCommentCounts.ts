import { useCallback, useEffect, useState } from 'react';
import { rpc } from './index';

/**
 * Loads the number of open comments on each file of every work group,
 * keeping them in sync with the comment files on disk.
 *
 * @returns The open comment counts keyed by work group slug and then
 * by file path.
 */
export function useCommentCounts() {
  const [commentCounts, setCommentCounts] = useState<
    Record<string, Record<string, number>>
  >({});

  // Reload the counts from the backend
  const refresh = useCallback(async () => {
    setCommentCounts(await rpc.request.getOpenCommentCounts({}));
  }, []);

  // Initial load
  useEffect(() => {
    refresh();
  }, [refresh]);

  // Reload when comment files or manifests change
  useEffect(() => {
    const handler = () => {
      refresh();
    };

    window.addEventListener('review-comments-changed', handler);
    window.addEventListener('manifests-changed', handler);

    return () => {
      window.removeEventListener('review-comments-changed', handler);
      window.removeEventListener('manifests-changed', handler);
    };
  }, [refresh]);

  return commentCounts;
}
