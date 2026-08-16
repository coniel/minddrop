import { DatabaseEntries } from '@minddrop/databases';
import { ReferenceSource } from '@minddrop/editor';
import { resolveEntryReference } from '../resolveEntryReference';

// How many entries are offered before anything has been searched for
const RecentEntryCount = 10;

/**
 * Offers the app's entries as the references a wikilink can point at.
 *
 * The editor knows nothing of entries: it is handed this and lists whatever
 * it returns.
 */
export const entryReferenceSource: ReferenceSource = {
  getRecent: () =>
    DatabaseEntries.getRecent(RecentEntryCount).map(resolveEntryReference),

  search: (query) =>
    DatabaseEntries.searchByTitle(query).map(resolveEntryReference),
};
