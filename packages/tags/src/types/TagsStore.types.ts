import { Tag } from './Tag.types';

export interface TagsStore {
  /**
   * The tags, stored as a `{ [tagId]: Tag }` map.
   */
  tags: Record<string, Tag>;

  /**
   * Bulk inserts an array of tags into the store.
   *
   * @param tags The tags to add to the store.
   */
  loadTags(tags: Tag[]): void;

  /**
   * Clears all data from the store.
   */
  clear(): void;

  /**
   * Sets a tag in the store.
   *
   * @param tag The tag to add.
   */
  setTag(tag: Tag): void;

  /**
   * Removes a tag from the store.
   *
   * @param id The ID of the tag to remove.
   */
  removeTag(id: string): void;
}
