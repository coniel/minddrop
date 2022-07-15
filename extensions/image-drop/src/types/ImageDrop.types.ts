import { Drop } from '@minddrop/drops';

export interface ImageDropData {
  /**
   * The image file reference ID.
   */
  file?: string;
}

export type ImageDrop = Drop<ImageDropData>;
export type CreateImageDropData = ImageDropData;
export type UpdateImageDropData = ImageDropData;
