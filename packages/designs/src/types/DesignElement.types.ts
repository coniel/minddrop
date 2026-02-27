import { DesignElementStyle } from '../styles';

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
   * The element style customizations.
   */
  style?: Partial<DesignElementStyle>;
}

/******************************************************************************
 * Elements
 *****************************************************************************/

export interface TextElement extends DesignElementBase {
  type: 'text';

  /**
   * Placeholder text displayed when the element has no content.
   */
  placeholder?: string;
}

export interface FormattedTextElement extends DesignElementBase {
  type: 'formatted-text';
}

export interface NumberElement extends DesignElementBase {
  type: 'number';
}

export interface UrlElement extends DesignElementBase {
  type: 'url';
}

export interface ImageElement extends DesignElementBase {
  type: 'image';
}

export type LeafDesignElement =
  | TextElement
  | FormattedTextElement
  | NumberElement
  | UrlElement
  | ImageElement;

/******************************************************************************
 * Container Elements
 *****************************************************************************/

export interface RootElement extends DesignElementBase {
  type: 'root';

  /**
   * The child elements contained within this container.
   */
  children: DesignElement[];
}

export interface ContainerElement extends DesignElementBase {
  type: 'container';

  /**
   * The child elements contained within this container.
   */
  children: DesignElement[];
}

/******************************************************************************
 * Composite Types
 *****************************************************************************/

export type DesignElement = LeafDesignElement | ContainerElement | RootElement;
