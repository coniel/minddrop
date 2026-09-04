import { DesignElement, TextSettings } from '@minddrop/designs-next';

export type HeadingLevel = 1 | 2 | 3;

export interface HeadingElement extends DesignElement, TextSettings {
  /**
   * The heading level, each carrying its own typography. Absent
   * means the default level.
   */
  level?: HeadingLevel;

  /**
   * The heading's static text content, rendered when no property is
   * selected to fill the element.
   */
  text?: string;
}
