import {
  ContainerElementStyle,
  IconElementStyle,
  ImageElementStyle,
  TextElementStyle,
  WebviewElementStyle,
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

  /**
   * Whether the element displays static content rather than
   * being mappable to a database property.
   */
  static?: boolean;
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

  /**
   * Placeholder text displayed when the element has no content.
   */
  placeholder?: string;
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

export interface UrlElement extends DesignElementBase {
  type: 'url';

  /**
   * The element style.
   */
  style: TextElementStyle;

  /**
   * Placeholder text displayed when the element has no content.
   */
  placeholder?: string;

  /**
   * Whether to show the protocol part of the URL (e.g. "https://").
   */
  showProtocol?: boolean;

  /**
   * Whether to show the subdomain part of the URL (e.g. "www.").
   */
  showSubdomain?: boolean;

  /**
   * Whether to show the domain part of the URL (e.g. "example").
   */
  showDomain?: boolean;

  /**
   * Whether to show the top-level domain part of the URL (e.g. ".com").
   */
  showTld?: boolean;

  /**
   * Whether to show the path part of the URL (e.g. "/about?q=1#s").
   */
  showPath?: boolean;
}

export interface IconElement extends DesignElementBase {
  type: 'icon';

  /**
   * The element style.
   */
  style: IconElementStyle;

  /**
   * Stringified UserIcon (e.g. "content-icon:cat:cyan" or "emoji:👍:0").
   */
  icon?: string;
}

export interface WebviewElement extends DesignElementBase {
  type: 'webview';

  /**
   * The element style.
   */
  style: WebviewElementStyle;
}

export type LeafDesignElement =
  | TextElement
  | FormattedTextElement
  | NumberElement
  | UrlElement
  | ImageElement
  | IconElement
  | WebviewElement;

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

/**
 * Union of all design element type identifiers.
 */
export type DesignElementType =
  | 'root'
  | 'container'
  | 'text'
  | 'formatted-text'
  | 'number'
  | 'url'
  | 'image'
  | 'icon'
  | 'webview';
