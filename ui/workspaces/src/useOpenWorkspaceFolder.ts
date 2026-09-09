import { useCallback } from 'react';
import { Fs } from '@minddrop/file-system';
import { TranslationKey } from '@minddrop/i18n';
import { Workspace, Workspaces } from '@minddrop/workspaces';

export interface UseOpenWorkspaceFolderOptions {
  /**
   * Callback fired with the translation key of the message shown to
   * the user when the folder could not be opened.
   */
  onError?: (message: TranslationKey) => void;
}

/**
 * Returns a callback which asks the user to select a workspace folder
 * and adds the selected workspace, making it the active one.
 *
 * The callback returns the added workspace, or `null` if the picker
 * was cancelled or the selected folder could not be opened.
 */
export function useOpenWorkspaceFolder({
  onError,
}: UseOpenWorkspaceFolderOptions = {}): () => Promise<Workspace | null> {
  return useCallback(async () => {
    // Ask the user to select a workspace folder
    const path = await Fs.openFilePicker({ directory: true });

    // Do nothing if the picker was cancelled
    if (typeof path !== 'string') {
      return null;
    }

    // Only existing workspaces can be opened, as a folder of files is
    // not usable as content until it has been set up as a workspace.
    if (!(await Workspaces.isWorkspace(path))) {
      onError?.('workspaces.errors.notAWorkspace');

      return null;
    }

    try {
      // Add the workspace, which makes it active
      return await Workspaces.add(path);
    } catch {
      onError?.('workspaces.errors.unknown');

      return null;
    }
  }, [onError]);
}
