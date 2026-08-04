import { EntityId } from '@minddrop/utils';

export type CollectionId = EntityId<'collection'>;

export interface Collection {
  /**
   * A unique identifier for the collection. Virtual collections
   * use caller-supplied composite IDs instead of typed IDs.
   */
  id: string;

  /**
   * Whether the collection is virtual (exists only in memory,
   * not persisted to a file).
   */
  virtual?: boolean;

  /**
   * The user defined name of the collection.
   */
  name: string;

  /**
   * The date the collection was created.
   */
  created: Date;

  /**
   * The date the collection was last modified.
   */
  lastModified: Date;

  /**
   * The identifiers of the database entries in the collection.
   */
  entries: string[];
}

export type UpdateCollectionData = Partial<
  Pick<Collection, 'name' | 'entries'>
>;

export type UpdateVirtualCollectionData = Partial<
  Pick<Collection, 'id' | 'name' | 'entries'>
>;
