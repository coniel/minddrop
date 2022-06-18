import { Core } from '@minddrop/core';
import { FileReference } from './FileReference.types';

export interface FileStorageApi {
  /**
   * Returns the file URL (possibly a data URL) for the
   * given file ID.
   *
   * @param fileId - The file ID.
   * @returns The URL of the file or null if it is not in storage.
   */
  getUrl(fileId: string): string | null;

  /**
   * Saves a file to the persistent file storage.
   * Returns a file reference for the saved file.
   *
   * @param core - A MindDrop core instance.
   * @param file - The file to save.
   * @returns A file reference.
   */
  save(core: Core, file: File): Promise<FileReference>;

  /**
   * Downloads a file from the given URL and saves it
   * into the persistent file storage.
   * Returns a file reference for the downloaded file.
   *
   * @param core - A MindDrop core instance.
   * @param url - The URL of the file to download.
   * @returns A file referece.
   */
  download(core: Core, url: string): Promise<FileReference>;
}
