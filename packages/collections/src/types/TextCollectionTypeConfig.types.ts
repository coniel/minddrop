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
   * Whether to allow new entries to be created by importing text files.
   *
   * If true, users can create new entries by selecting text files with the
   * specified file extension. The `parse` method will be used to extract
   * entry properties from the file content.
   *
   * @default false
   */
  enableImports?: boolean;

  /**
   * The fields to include in the "New Entry" form when creating a new entry
   * from scratch (not from dropped/pasted text).
   *
   * This should be an array of entry property names that are relevant for
   * creating a new entry. All specified properties will be considered required.
   *
   * If ommitted, a new entry will be created with all properties set to their
   * default values (if any).
   */
  newEntryFields?: string[];

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

  /**
   * Optional callback to determine if a given string matches the format
   * used by this collection type.
   *
   * If provided, this is used to auto-detect the collection type when
   * creating a new collection entry from a string.
   *
   * @param string - The string to test.
   * @returns An object of entry properties if the string matches the format,
   *   or null if it does not match.
   */
  match?(string: string): Partial<CollectionEntryProperties> | null;
}
