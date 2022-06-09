import { ContentColor } from '@minddrop/core';
import { ResourceDocument } from '@minddrop/resources';

export interface TagData {
  /**
   * The tag label text.
   */
  label: string;

  /**
   * The tag color.
   */
  color: ContentColor;
}

export interface CreateTagData {
  /**
   * The tag label text.
   */
  label: string;

  /**
   * The tag color.
   */
  color?: ContentColor;
}

export interface UpdateTagData {
  /**
   * The tag label text.
   */
  label?: string;

  /**
   * The tag color.
   */
  color?: ContentColor;
}

export interface TagChanges {
  /**
   * The tag label text.
   */
  label?: string;

  /**
   * The tag color.
   */
  color?: ContentColor;
}

export type Tag = ResourceDocument<TagData>;

export type TagMap = Record<string, ResourceDocument<TagData>>;
