import { createContext, useContext } from 'react';
import { useDesignStudioStore } from './DesignStudioStore';

const MediaDirContext = createContext<string | null>(null);

/**
 * Provides the media directory of the entity owning the surrounding
 * layout, scoping the media files its elements can reference.
 */
export const MediaDirProvider = MediaDirContext.Provider;

/**
 * Returns the media directory path of the entity owning the current
 * layout: the provider's value when rendering a layout, falling back
 * to the media directory of the layout open in the editor. Null when
 * no owner is in scope, in which case no media can be resolved.
 */
export function useMediaDirPath(): string | null {
  const providedMediaDirPath = useContext(MediaDirContext);
  const editorMediaDirPath = useDesignStudioStore(
    (state) => state.mediaDirPath,
  );

  return providedMediaDirPath || editorMediaDirPath;
}
