import { Design } from '../../types';

/**
 * Revives the date fields of a design parsed from JSON, where they
 * arrive as ISO strings, back into `Date` instances. Covers the
 * design's own dates and those of every layout.
 *
 * @param design - The design whose dates to revive.
 * @returns The design with revived dates.
 */
export function reviveDesignDates(design: Design): Design {
  return {
    ...design,
    created: new Date(design.created),
    lastModified: new Date(design.lastModified),
    // Revive each layout's dates
    layouts: design.layouts.map((layout) => ({
      ...layout,
      created: new Date(layout.created),
      lastModified: new Date(layout.lastModified),
    })),
  };
}
