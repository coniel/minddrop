import { Element } from '../../types';

export interface ImageElementData {
  /**
   * The image's source.
   */
  url: string;

  /**
   * The image's alternative text.
   */
  alt?: string | null;

  /**
   * The image's optional title.
   */
  title?: string | null;
}

export type ImageElement = Element<'image', ImageElementData>;
