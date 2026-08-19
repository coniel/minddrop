import { createKeyValueStore } from '@minddrop/stores';
import { WindowSizeSlot } from '@minddrop/utils';

export interface LayoutRegionSize {
  /**
   * The region width in pixels.
   */
  width?: number;

  /**
   * The region height in pixels.
   */
  height?: number;
}

/**
 * Builds a composite key from a layout ID, render context, region,
 * and window size slot, e.g. `"my-layout:page:panel-left:sm"`. The
 * context is where the layout is rendered (e.g. `page`, `dialog`) and
 * the region is the sized part (e.g. `frame`, `panel-left`).
 */
export function layoutRegionSizeKey(
  layoutId: string,
  context: string,
  region: string,
  slot: WindowSizeSlot,
): string {
  return `${layoutId}:${context}:${region}:${slot}`;
}

/**
 * Persistent store for runtime UI sizing of layout regions, keyed by
 * `layoutId:context:region:windowSizeSlot`. Sizes are per window size
 * slot so they stay sensible across monitors.
 *
 * Named `-next` while the legacy designs feature owns the original
 * store name and namespace; flipped back once legacy is deleted.
 */
export const LayoutRegionSizesStore = createKeyValueStore<
  Record<string, LayoutRegionSize>
>(
  'DesignsNext:LayoutRegionSizes',
  {},
  {
    persistTo: 'workspace-config',
    namespace: 'layout-region-sizes-next',
  },
);
