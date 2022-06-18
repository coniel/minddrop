import { FieldValueArrayRemove, FieldValueArrayUnion } from '@minddrop/utils';
import { ResourceDocument } from '@minddrop/resources';

export interface FileMetadata {
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
}

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

export interface FileReferenceData extends FileMetadata {
  /**
   * URL to the file if it is located remotely.
   */
  remoteUrl?: string;

  /**
   * Dimensions and aspect ratio of the image. Only set if the file is an image.
   */
  dimensions?: ImageDimensions;
}

export interface CreateFileReferenceData extends FileMetadata {
  /**
   * URL to the file if it is located remotely.
   */
  remoteUrl?: string;

  /**
   * Dimensions and aspect ratio of the image. Only set if the file is an image.
   */
  dimensions?: ImageDimensions;
}

export interface UpdateFileReferenceData {
  /**
   * URL to the file if it is located remotely.
   */
  removeUrl?: string;

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
