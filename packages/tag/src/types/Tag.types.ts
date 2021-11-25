import { ContentColor } from '@minddrop/core';

export interface Tag {
  /**
   * Universally unique ID.
   */
  id: string;

  /**
   * The tag text label.
   */
  label: string;

  /**
   * The tag color.
   */
  color: ContentColor;
}

export interface CreateTagData {
  /**
   * The tag text label.
   */
  label: string;

  /**
   * The tag color.
   */
  color?: ContentColor;
}

export interface UpdateTagData {
  /**
   * The tag text label.
   */
  label?: string;

  /**
   * The tag color.
   */
  color?: ContentColor;
}
