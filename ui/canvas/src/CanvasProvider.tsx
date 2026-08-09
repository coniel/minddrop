import { useMemo, useRef, useState } from 'react';
import { CanvasContext, CanvasContextValue } from './CanvasContext';
import { CanvasStore, createCanvasStore } from './createCanvasStore';
import { CanvasStoreConfig } from './types';

export interface CanvasProviderProps extends CanvasStoreConfig {
  /**
   * An externally created canvas store to use instead of creating
   * one internally. Allows non-React code to access the store via
   * a module-level instance.
   */
  store?: CanvasStore;

  /**
   * The canvas UI (viewport, toolbars, overlays).
   */
  children: React.ReactNode;
}

/**
 * Provides a canvas instance's store and element refs to the
 * Canvas component, node hooks and toolbars rendered within.
 */
export const CanvasProvider: React.FC<CanvasProviderProps> = ({
  store,
  children,
  ...config
}) => {
  // Use the provided store, or create an instance for the
  // lifetime of the provider
  const [instance] = useState(() => store || createCanvasStore(config));
  const viewportRef = useRef<HTMLDivElement>(null);
  const transformLayerRef = useRef<HTMLDivElement>(null);

  // Stable context value for the provider's lifetime
  const value = useMemo<CanvasContextValue>(
    () => ({ store: instance, viewportRef, transformLayerRef }),
    [instance],
  );

  return (
    <CanvasContext.Provider value={value}>{children}</CanvasContext.Provider>
  );
};
