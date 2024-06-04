import { BlockElement, BlockElementProps } from '../../types';

export interface FileElementData {
  /**
   * The filename.
   */
  filename: string;

  /**
   * The embedded file title.
   */
  title: string;

  /**
   * The embedded file description.
   */
  description?: string;

  /**
   * The file extension.
   */
  extension: string;
}

export type FileElement = BlockElement<FileElementData>;

export type FileElementProps = BlockElementProps<FileElement>;
