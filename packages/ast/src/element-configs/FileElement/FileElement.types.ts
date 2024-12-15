import { Element } from '../../types';

export interface FileElementData {
  /**
   * The file name.
   */
  filename: string;

  /**
   * The file extension.
   */
  extension: string;

  /**
   * The title of the file, typically the filename
   * without the extension.
   */
  title: string;

  /**
   * An optional description of the file.
   */
  description?: string;
}

export type FileElement = Element<'file', FileElementData>;
