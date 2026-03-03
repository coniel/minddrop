import { createContext, useContext } from 'react';

const DesignPreviewContext = createContext(false);

/**
 * Provides a preview mode flag to all descendant design
 * elements. When true, interactive elements like the image
 * viewer disable their controls.
 */
export const DesignPreviewProvider = DesignPreviewContext.Provider;

/**
 * Returns whether the current design element tree is in
 * preview mode.
 */
export function useDesignPreview(): boolean {
  return useContext(DesignPreviewContext);
}
