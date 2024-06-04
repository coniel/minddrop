import { BlockElement, BlockElementProps } from '../../types';

export interface ImageElementData {
  /**
   * The image filename.
   */
  filename: string;

  /**
   * The embedded image title.
   */
  title: string;

  /**
   * The embedded image description.
   */
  description?: string;

  /**
   * The image file extension.
   */
  extension: 'jpg' | 'jpeg' | 'png' | 'gif' | 'bmp' | 'webp' | 'svg';
}

export type ImageElement = BlockElement<ImageElementData>;

export type ImageElementProps = BlockElementProps<ImageElement>;
