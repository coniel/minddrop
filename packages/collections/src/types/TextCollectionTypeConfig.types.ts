import { BaseCollectionTypeConfig } from './BaseCollectionTypeConfig.types';
import { CollectionEntryProperties } from './CollectionEntry.types';

export interface TextCollectionTypeConfig extends BaseCollectionTypeConfig {
  /**
   * The data type of the collection.
   */
  type: 'text';

  /**
   * The file extension used for text files in this collection type.
   */
  fileExtension: string;

  /**
   * Whether entries in this collection type require a note.
   *
   * If true, all entries in the collection will be given a `note` property
   * containing an empty string by default.
   *
   * This forces the UI to display a text editor for the entry and is intended
   * for note based collections where the note is the primary content of the entry.
   *
   * Defaults to false.
   */
  requireNote?: boolean;

  /**
   * Callback to parse the content of a text file and return the entry properties
   * contained within it as a partial `CollectionEntryProperties` object.
   *
   * Called when retrieving an entry from the file system.
   *
   * @param content - The content of the text file.
   * @returns The entry properties contained within the text file.
   */
  parse(content: string): Partial<CollectionEntryProperties>;

  /**
   * Callback to convert a collection entry to a string for storing in a text file.
   * Called when creating or updating an entry in the file system.
   *
   * If the text file does not store all entry properties, the callback can
   * return a tuple of `[string, properties]` where `properties` is an object
   * containing the additional properties to store in the entry's properties file.
   *
   * @param entry - The entry data object.
   * @returns The text file content as a string, or a tuple of
   *   `[string, properties]` where `properties` is an object of additional
   *   properties to store in the entry's properties file.
   */
  serialize(
    properties: CollectionEntryProperties,
  ): string | [string, Partial<CollectionEntryProperties>];
}
