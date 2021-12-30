import { FileReference } from './FileReference.types';

export interface FileReferencesStore {
  /**
   * The files, stored as a `{ [fileId]: FileReference }` map.
   */
  files: Record<string, FileReference>;

  /**
   * Bulk inserts an array of files into the store.
   *
   * @param files The files to add to the store.
   */
  loadFileReferences(files: FileReference[]): void;

  /**
   * Clears all data from the store.
   */
  clear(): void;

  /**
   * Sets a file in the store.
   *
   * @param file The file to add.
   */
  setFileReference(file: FileReference): void;

  /**
   * Removes a file from the store.
   *
   * @param id The ID of the file to remove.
   */
  removeFileReference(id: string): void;
}
