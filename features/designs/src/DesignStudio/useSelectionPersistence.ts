import { useEffect } from 'react';
import {
  useTransientViewStateContext,
  useTransientViewStateKey,
} from '@minddrop/ui-primitives';
import { useDesignStudio, useDesignStudioStore } from '../DesignStudioStore';

/**
 * The layout and element the studio was left on.
 */
interface StoredSelection {
  /**
   * The ID of the layout which was open.
   */
  layoutId: string;

  /**
   * The ID of the selected element, null when the layout was open
   * without a selection.
   */
  elementId: string | null;
}

/**
 * Restores the layout and element the studio was left on, and
 * records them as they change. The studio store is created per
 * mount, so without this a tab switch drops the selection along
 * with the store.
 */
export function useSelectionPersistence(): void {
  const studio = useDesignStudio();
  const context = useTransientViewStateContext();
  const openDesignId = useDesignStudioStore((state) => state.design?.id);
  const activeLayoutId = useDesignStudioStore((state) => state.activeLayoutId);
  const selectedElementId = useDesignStudioStore(
    (state) => state.selectedElementId,
  );

  // The selection is recorded per design, so reopening a design
  // returns to where it was left rather than where another was
  const stateKey = useTransientViewStateKey(
    `design-studio:${openDesignId ?? ''}`,
  );

  // Restore the recorded selection once the design is open, which
  // the studio does in an effect of its own on mount
  useEffect(() => {
    const design = studio.getDesign();

    if (!design) {
      return;
    }

    const stored = context?.get(stateKey) as StoredSelection | undefined;

    if (!stored) {
      return;
    }

    // The layout may have been deleted since it was recorded
    if (!design.layouts.some((layout) => layout.id === stored.layoutId)) {
      return;
    }

    studio.setActiveLayout(stored.layoutId);

    // The element may have been deleted since it was recorded,
    // leaving the layout open without a selection
    if (
      stored.elementId &&
      studio.getElements(stored.layoutId)[stored.elementId]
    ) {
      studio.selectElement(stored.elementId, stored.layoutId);
    }
  }, [context, stateKey, studio, openDesignId]);

  // Record the selection as it changes, leaving the recorded
  // selection alone while no layout is open so that closing a
  // design does not wipe it
  useEffect(() => {
    if (!context || !activeLayoutId) {
      return;
    }

    context.set(stateKey, {
      layoutId: activeLayoutId,
      elementId: selectedElementId,
    });
  }, [context, stateKey, activeLayoutId, selectedElementId]);
}
