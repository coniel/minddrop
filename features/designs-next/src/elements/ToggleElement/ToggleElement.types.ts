import { DesignElement } from '@minddrop/designs-next';

/**
 * How a toggle element draws its state: as a checkbox, as a switch,
 * or as one of two icons.
 */
export type ToggleStyle = 'checkbox' | 'switch' | 'icon';

/**
 * The size a toggle element draws its state at, matching the
 * checkbox and switch primitives' sizes.
 */
export type ToggleElementSize = 'sm' | 'md' | 'lg';

export interface ToggleElement extends DesignElement {
  /**
   * The style the state is drawn in. A checkbox by default.
   */
  style?: ToggleStyle;

  /**
   * The size the state is drawn at. Medium by default.
   */
  size?: ToggleElementSize;

  /**
   * The stringified icon the icon style draws for a true value.
   * Omitted for the default.
   */
  checkedIcon?: string;

  /**
   * The stringified icon the icon style draws for any other value.
   * Omitted for the default.
   */
  uncheckedIcon?: string;
}
