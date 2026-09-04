import { Design, Designs } from '@minddrop/designs-next';
import type { Database } from '../types';

/**
 * Loads database designs into the designs store.
 *
 * @param databases - The databases whose designs to load.
 */
export function loadDatabaseDesigns(databases: Database[]): void {
  // Attach each database as the owner of its stored designs
  const designs: Design[] = databases.flatMap((database) =>
    (database.designs ?? []).map((design) => ({
      ...design,
      owner: database.id,
    })),
  );

  if (designs.length === 0) {
    return;
  }

  // Load the designs via the Designs API
  Designs.load(designs);
}
