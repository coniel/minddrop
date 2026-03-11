import { MATCH_HIGHLIGHT_END, MATCH_HIGHLIGHT_START } from './constants';

export { registerSearchAdapter as registerAdapter } from './SearchAdapter';
export type { SearchAdapter } from './SearchAdapter';
export { registerSqliteAdapter } from './SqliteAdapter';
export { initializeSearch as initialize } from './initializeSearch';
export { searchFullText as fullText } from './searchFullText';
export {
  handleSearchInitialize,
  handleSearchFullText,
  handleSearchStructured,
  handleSearchSync,
  handleSearchDatabaseSync,
  handleSearchReindexDatabase,
  handleSearchRenameProperty,
} from './searchOperations';

export const constants = {
  matchHighlightStart: MATCH_HIGHLIGHT_START,
  matchHighlightEnd: MATCH_HIGHLIGHT_END,
};
