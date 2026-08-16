import { PropertiesSchema } from '@minddrop/properties';
import { DatabaseEntry, DatabaseEntryMetadata } from '../../types';
import { getTimestampProperty } from '../getTimestampProperty';

export interface MergedEntryMetadata {
  /**
   * The entry with its sidecar metadata and resolved timestamps.
   */
  entry: DatabaseEntry;

  /**
   * Whether the sidecar's timestamps differ from the resolved ones
   * and need to be written back.
   */
  sidecarOutdated: boolean;
}

/**
 * Merges an entry's metadata sidecar into the entry as read from disk,
 * resolving its timestamps in order of precedence: timestamp property,
 * sidecar, file stat.
 *
 * File stat values are only ever a seed: the resulting timestamps are
 * written back to the sidecar, from where they are read from then on.
 *
 * @param entry - The entry as read from disk, with stat derived timestamps.
 * @param schema - The database's properties schema.
 * @param metadata - The entry's sidecar metadata, if it has any.
 *
 * @returns The merged entry and whether its sidecar needs writing.
 */
export function mergeEntryMetadata(
  entry: DatabaseEntry,
  schema: PropertiesSchema,
  metadata: DatabaseEntryMetadata | undefined,
): MergedEntryMetadata {
  const sidecar = metadata ?? {};

  // Timestamp properties are the user's own copy of the timestamps and
  // take precedence over the app's record of them
  const createdProperty = getTimestampProperty(
    'created',
    schema,
    entry.properties,
  );
  const lastModifiedProperty = getTimestampProperty(
    'last-modified',
    schema,
    entry.properties,
  );

  // Fall back to the sidecar, then to the stat derived seed values
  const created = createdProperty ?? sidecar.created ?? entry.created;
  const lastModified =
    lastModifiedProperty ?? sidecar.lastModified ?? entry.lastModified;

  // The sidecar needs writing when it is missing a timestamp, or when a
  // timestamp property has since been edited outside the app
  const sidecarOutdated =
    sidecar.created?.getTime() !== created.getTime() ||
    sidecar.lastModified?.getTime() !== lastModified.getTime();

  return {
    entry: {
      ...entry,
      created,
      lastModified,
      metadata: { ...sidecar, created, lastModified },
    },
    sidecarOutdated,
  };
}
