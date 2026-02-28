import {
  ContainerElementStyle,
  ImageElementStyle,
  TextElementStyle,
} from '../styles';

export interface NumberFormat {
  /**
   * Number of decimal places to display.
   */
  decimals: number;

  /**
   * Thousands separator style.
   */
  thousandsSeparator: 'none' | 'comma' | 'period' | 'space';

  /**
   * Text displayed before the number.
   */
  prefix: string;

  /**
   * Text displayed after the number.
   */
  suffix: string;

  /**
   * How to display the sign of the number.
   */
  signDisplay: 'auto' | 'always' | 'never';

  /**
   * Optional text style overrides for the prefix.
   */
  prefixStyle?: Partial<TextElementStyle>;

  /**
   * Optional text style overrides for the suffix.
   */
  suffixStyle?: Partial<TextElementStyle>;
}

export interface DesignElementBase {
  /**
   * A unique identifier for the element.
   */
  id: string;

  /**
   * The type of element this is.
   */
  type: string;
}

/******************************************************************************
 * Elements
 *****************************************************************************/

export interface TextElement extends DesignElementBase {
  type: 'text';

  /**
   * The element style.
   */
  style: TextElementStyle;

  /**
   * Placeholder text displayed when the element has no content.
   */
  placeholder?: string;
}

export interface FormattedTextElement extends DesignElementBase {
  type: 'formatted-text';

  /**
   * The element style.
   */
  style: TextElementStyle;
}

export interface NumberElement extends DesignElementBase {
  type: 'number';

  /**
   * The element style.
   */
  style: TextElementStyle;

  /**
   * Placeholder number displayed when the element has no content.
   */
  placeholder?: string;

  /**
   * Number formatting options.
   */
  format?: NumberFormat;
}

export interface ImageElement extends DesignElementBase {
  type: 'image';

  /**
   * The element style.
   */
  style: ImageElementStyle;

  /**
   * The file name of a placeholder image stored in the
   * placeholder-media directory.
   */
  placeholderImage?: string;
}

export type LeafDesignElement =
  | TextElement
  | FormattedTextElement
  | NumberElement
  | ImageElement;

/******************************************************************************
 * Container Elements
 *****************************************************************************/

export interface RootElement extends DesignElementBase {
  type: 'root';

  /**
   * The element style.
   */
  style: ContainerElementStyle;

  /**
   * The child elements contained within this container.
   */
  children: DesignElement[];
}

export interface ContainerElement extends DesignElementBase {
  type: 'container';

  /**
   * The element style.
   */
  style: ContainerElementStyle;

  /**
   * The child elements contained within this container.
   */
  children: DesignElement[];
}

/******************************************************************************
 * Composite Types
 *****************************************************************************/

export type DesignElement = LeafDesignElement | ContainerElement | RootElement;
