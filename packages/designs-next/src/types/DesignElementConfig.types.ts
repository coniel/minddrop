import type { TranslationKey } from '@minddrop/i18n';
import type { UiIconName } from '@minddrop/ui-icons';
import { DesignElement, ElementWidthMode } from './DesignElement.types';

export interface DesignElementConfig {
  /**
   * The element type identifier.
   */
  type: string;

  /**
   * i18n key of the element's palette label.
   */
  label: TranslationKey;

  /**
   * The icon representing the element in the palette.
   */
  icon: UiIconName;

  /**
   * The palette group the element is listed under.
   */
  group: string;

  /**
   * Number of columns a newly inserted element spans.
   */
  defaultColumnSpan: number;

  /**
   * Number of rows a newly inserted element spans.
   */
  defaultRowSpan: number;

  /**
   * The width mode assigned to newly inserted elements. Defaults to
   * fluid.
   */
  defaultWidthMode?: ElementWidthMode;

  /**
   * Whether newly inserted elements grow to their content's height.
   */
  defaultNaturalHeight?: boolean;

  /**
   * Resolves the element's minimum height in grid units, acting as
   * its resize floor. Omitted for elements without an intrinsic
   * minimum.
   */
  resolveMinRowSpan?: (element: DesignElement) => number;

  /**
   * Resolves the element's vertical resize step in grid units.
   * Line-based text elements step by their line height, making the
   * block height act as a max-lines setting. Omitted for freely
   * resizable elements.
   */
  resolveRowSpanStep?: (element: DesignElement) => number;
}
