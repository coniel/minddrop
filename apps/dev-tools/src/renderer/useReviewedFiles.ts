import { useCallback, useEffect, useState } from 'react';
import { rpc } from './index';

/**
 * Loads the reviewed files of every work group and keeps them in sync
 * with the working tree, so a file edited after it was reviewed comes
 * back as needing review.
 *
 * @returns The reviewed file paths keyed by work group slug, and
 * functions to change and reload them.
 */
export function useReviewedFiles() {
  const [reviewedFiles, setReviewedFiles] = useState<Record<string, string[]>>(
    {},
  );

  // Reload the reviewed files from the backend
  const refresh = useCallback(async () => {
    setReviewedFiles(await rpc.request.getReviewedFiles({}));
  }, []);

  // Initial load
  useEffect(() => {
    refresh();
  }, [refresh]);

  // Reload when the backend watcher reports working tree changes, so
  // files an agent has since edited lose their reviewed state
  useEffect(() => {
    const handler = () => {
      refresh();
    };

    window.addEventListener('manifests-changed', handler);

    return () => {
      window.removeEventListener('manifests-changed', handler);
    };
  }, [refresh]);

  // Mark a file as reviewed or bring it back to needing review
  const setReviewed = useCallback(
    async (slug: string, path: string, reviewed: boolean) => {
      await rpc.request.setFileReviewed({ slug, path, reviewed });
      await refresh();
    },
    [refresh],
  );

  return { reviewedFiles, setReviewed };
}
