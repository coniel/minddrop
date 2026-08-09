/**
 * The source database entries are rendered from, determining which
 * source-specific behaviours apply to entry actions (e.g. adding
 * a duplicated entry to the source collection).
 */
export interface DatabaseEntryRenderSource {
  /**
   * The type of source.
   */
  type: 'collection' | 'query' | 'database';

  /**
   * The ID of the source.
   */
  id: string;
}
