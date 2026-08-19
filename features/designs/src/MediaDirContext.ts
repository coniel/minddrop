import { createContext, useContext } from 'react';

const MediaDirContext = createContext<string | null>(null);

/**
 * Provides the media directory of the entity owning the surrounding
 * layout, scoping the media files its elements can reference.
 */
export const MediaDirProvider = MediaDirContext.Provider;

/**
 * Returns the media directory path of the entity owning the current
 * layout, or null when no owner is in scope, in which case no media
 * can be resolved.
 */
export function useMediaDirPath(): string | null {
  return useContext(MediaDirContext);
}
