import { FieldValueArrayRemove, FieldValueArrayUnion } from '@minddrop/utils';
import { ResourceDocument } from '@minddrop/resources';

export interface ImageDimensions {
  /**
   * The image width.
   */
  width: number;

  /**
   * The image height.
   */
  height: number;

  /**
   * The image aspect ratio (width/height).
   */
  aspectRatio: number;
}

export interface FileReferenceData {
  /**
   * The file media type.
   */
  type: string;

  /**
   * The file name.
   */
  name: string;

  /**
   * The file size in bytes.
   */
  size: number;

  /**
   * URL to the file if it is located remotely.
   */
  url?: string;

  /**
   * Dimensions and aspect ratio of the image. Only set if the file is an image.
   */
  dimensions?: ImageDimensions;
}

export type FileReference = ResourceDocument<FileReferenceData>;

export interface ImageFileReference extends FileReference {
  /**
   * Dimensions and aspect ratio of the image. Only set if the file is an image.
   */
  dimensions: ImageDimensions;
}

export type FileReferenceMap = Record<string, FileReference>;

export interface FileReferenceChanges {
  attachedTo: string[] | FieldValueArrayUnion | FieldValueArrayRemove;
}
