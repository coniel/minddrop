import { MATCH_HIGHLIGHT_END, MATCH_HIGHLIGHT_START } from './constants';

export { registerSearchAdapter as registerAdapter } from './SearchAdapter';
export type { SearchAdapter } from './SearchAdapter';
export { initializeSearch as initialize } from './initializeSearch';
export { initializeSearchSync as initializeSync } from './initializeSearchSync';
export { searchFullText as fullText } from './searchFullText';
export {
  handleSearchInitialize,
  handleSearchFullText,
  handleSearchSync,
  handleSearchDatabaseSync,
  handleSearchReindexDatabase,
} from './searchOperations';

export const constants = {
  matchHighlightStart: MATCH_HIGHLIGHT_START,
  matchHighlightEnd: MATCH_HIGHLIGHT_END,
};
