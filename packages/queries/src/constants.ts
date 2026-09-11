import type { UiIconName } from '@minddrop/ui-icons';

export const QueriesDirName = 'queries';
export const QueryFileExtension = 'json';

/**
 * The icon used to represent queries in the UI.
 */
export const QueriesIcon: UiIconName = 'list-filter';

/**
 * The default icon assigned to newly created queries.
 */
export const DefaultQueryIcon = 'lucide:list-filter:default';

// Where a new query's unconfigured source node is seeded on the
// canvas.
export const DEFAULT_SOURCE_NODE_POSITION = { x: 0, y: 120 };

// Where a new query's results node is seeded, leaving a gap
// after the source node wide enough to drop a filter node into.
export const DEFAULT_RESULTS_NODE_POSITION = { x: 640, y: 120 };
