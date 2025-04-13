import {
  CollectionEntry,
  CollectionEntryProperties,
} from './CollectionEntry.types';
import { CollectionPropertySchema } from './CollectionPropertiesSchema.types';

export interface CollectionTypeConfig<
  TEntry extends CollectionEntry = CollectionEntry,
> {
  /**
   * A unique identifier for the collection type.
   */
  id: string;

  /**
   * User friendly description of the collection type arranged as a
   * [language code]: { name: string, details: string } map.
   */
  description: Record<string, CollectionTypeDescription>;

  /**
   * The type of data required to create a new entry in the collection.
   * - `file`: The user will be prompted to select a file when creating a new entry.
   * - `url`: The user will be prompted to enter a URL when creating a new entry.
   *
   * The data is then passed to the `createEntry` function of the collection type.
   */
  requiredDataType?: 'file' | 'url';

  /**
   * Default properties applied to all entries in the collection.
   */
  coreProperties?: Record<string, CollectionPropertySchema>;

  /**
   * Function called when a new entry is created.
   *
   * The function receives the `requiredDataType` as a parameter if the collection
   * requires data to create an entry.
   *
   * @param path - The path to the collection directory.
   * @param defaultPrperties - The default properties of the entry, based on the collection property configs.
   * @param data - The data used to create the entry.
   */
  createEntry(
    path: string,
    defaultPrperties: CollectionEntryProperties,
    metadata: CollectionEntryProperties,
  ): Promise<TEntry>;
  createEntry(
    path: string,
    defaultPrperties: CollectionEntryProperties,
    metadata: CollectionEntryProperties,
    data: string,
  ): Promise<TEntry>;
  createEntry(
    path: string,
    defaultPrperties: CollectionEntryProperties,
    metadata: CollectionEntryProperties,
    data: File,
  ): Promise<TEntry>;
  createEntry(
    path: string,
    defaultPrperties: CollectionEntryProperties,
    metadata: CollectionEntryProperties,
    data?: string | File,
  ): Promise<TEntry>;

  /**
   * Function called to retrieve an entry from the collection.
   * Should retrieve the entry from the file system in order to return the
   * latest version of the entry.
   *
   * @param path - The path to the entry.
   * @returns The entry.
   */
  getEntry(path: string): Promise<TEntry>;

  /**
   * Function called to get all entries from the collection directory.
   *
   * @param path - The path to the collection directory.
   * @returns An array containing all the entries in the collection.
   */
  getAllEntries(path: string): Promise<CollectionEntry[]>;

  /**
   * Function called to set an entry's properties. Should overwrite the entry's
   * existing properties with the new ones, including removing any properties
   * that are no longer present in the new properties.
   *
   * @param path - The path to the entry.
   * @param properties - The new properties to set on the entry.
   * @returns The updated entry.
   *
   */
  setEntryProperties(
    path: string,
    properties: CollectionEntryProperties,
  ): Promise<TEntry>;

  /**
   * Function called to rename an entry. Should rename the entry's file(s)
   * on the file system.
   *
   * @param path - The path to the entry.
   * @param newTitle - The new title of the entry.
   * @returns The updated entry.
   */
  renameEntry(path: string, newTitle: string): Promise<TEntry>;

  /**
   * Function called to permanently delete an entry. Should move the entry's file(s)
   * into the file system trash.
   *
   * @param path - The path to the entry.
   */
  deleteEntry(path: string): Promise<void>;

  /**
   * Function called to archive an entry. Should move the entry's file(s) into the collection's
   * archive directory.
   *
   * @param archivePath - The path to the archive directory.
   * @param entryPath - The path to the entry to be archived.
   */
  archiveEntry(acrchivePath: string, entryPath: string): Promise<void>;

  /**
   * Function called to restore an entry from the archive. Should move the entry's file(s)
   * from the collection's archive directory back to the entry's original location.
   *
   * @param archivePath - The path to the archive directory.
   * @param entryPath - The path to the entry to be restored relative to the archive directory.
   * @returns The restored entry.
   */
  restoreEntry(archivePath: string, entryPath: string): Promise<TEntry>;
}

interface CollectionTypeDescription {
  /**
   * Name displayed in the UI.
   */
  name: string;

  /**
   * Short description displayed in the UI.
   */
  details: string;
}
