import { useMemo } from 'react';
import { DesignsStore, useDesigns } from '../DesignsStore';
import { defaultLayouts } from '../default-layouts';
import { Layout, LayoutType } from '../types';

/**
 * Returns the default (built-in) layout for the given ID, or null if there
 * isn't one.
 */
function getDefaultLayout(id: string): Layout | null {
  return defaultLayouts.find((layout) => layout.id === id) || null;
}

/**
 * Retrieves a layout by its ID by searching across all designs and the
 * built-in default layouts.
 *
 * @param id - The ID of the layout to retrieve.
 * @returns The layout or null if it doesn't exist.
 */
export function getLayout(id: string): Layout | null {
  // Search every design's layouts for a matching ID
  for (const design of DesignsStore.getAllArray()) {
    const layout = design.layouts.find((candidate) => candidate.id === id);

    if (layout) {
      return layout;
    }
  }

  // Fall back to the built-in default layouts
  return getDefaultLayout(id);
}

/**
 * Retrieves all layouts across all designs (excludes built-in defaults).
 */
export function getAllLayouts(): Layout[] {
  return DesignsStore.getAllArray().flatMap((design) => design.layouts);
}

/**
 * Reactive hook returning a layout by its ID.
 *
 * @param id - The ID of the layout to retrieve.
 * @returns The layout or null if it doesn't exist.
 */
export const useLayout = (id: string): Layout | null => {
  const designs = useDesigns();

  return useMemo(() => {
    // Search every design's layouts for a matching ID
    for (const design of designs) {
      const layout = design.layouts.find((candidate) => candidate.id === id);

      if (layout) {
        return layout;
      }
    }

    // Fall back to the built-in default layouts
    return getDefaultLayout(id);
  }, [designs, id]);
};

/**
 * Reactive hook returning all layouts across all designs.
 */
export const useLayouts = (): Layout[] => {
  const designs = useDesigns();

  return useMemo(() => designs.flatMap((design) => design.layouts), [designs]);
};

/**
 * Reactive hook returning all layouts of a given type.
 */
export const useLayoutsOfType = (type: LayoutType): Layout[] => {
  const layouts = useLayouts();

  return useMemo(
    () => layouts.filter((layout) => layout.type === type),
    [layouts, type],
  );
};
