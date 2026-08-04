import { Design, Layout } from '@minddrop/designs';

export interface PageLayoutOption {
  /**
   * The design containing the layout.
   */
  design: Design;

  /**
   * The page layout.
   */
  layout: Layout;
}

/**
 * Collects all page type layouts across the given designs, paired
 * with their parent design.
 *
 * @param designs - The designs to collect page layouts from.
 * @returns The page layout options.
 */
export function getPageLayoutOptions(designs: Design[]): PageLayoutOption[] {
  // Pair each design's page layouts with the design itself
  return designs.flatMap((design) =>
    design.layouts
      .filter((layout) => layout.type === 'page')
      .map((layout) => ({ design, layout })),
  );
}
