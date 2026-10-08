import { registerSearchAdapter } from '../SearchAdapter';
import { handleSearchDatabaseSync } from '../handleSearchDatabaseSync';
import { handleSearchReindexDatabase } from '../handleSearchReindexDatabase';
import { handleSearchSync } from '../handleSearchSync';

/**
 * Registers a search adapter which runs the backend search handlers
 * in process.
 */
export function registerBackendSearchAdapter(): void {
  registerSearchAdapter({
    // No-op queries and lifecycle calls
    searchFullText: async () => [],
    searchInitialize: async () => undefined,
    searchUnload: async () => undefined,
    // The backend sync handlers
    searchSync: async (params) => handleSearchSync(params),
    searchDatabaseSync: async (params) => handleSearchDatabaseSync(params),
    searchReindexDatabase: async (params) =>
      handleSearchReindexDatabase(params),
  });
}
