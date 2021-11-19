import { ContentColor } from './Color.types';

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
