import { Element } from '../../types';

export interface UnsupportedElementData {
  /**
   * The construct's source, kept so that it can be written back exactly as
   * the user wrote it.
   */
  value: string;
}

export type UnsupportedElement = Element<'unsupported', UnsupportedElementData>;
