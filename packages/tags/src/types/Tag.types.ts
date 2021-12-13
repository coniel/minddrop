import { ContentColor } from '@minddrop/core';

export interface Tag {
  /**
   * Universally unique ID.
   */
  id: string;

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
  lable?: string;

  /**
   * The tag color.
   */
  color?: ContentColor;
}

export type TagMap = Record<string, Tag>;
