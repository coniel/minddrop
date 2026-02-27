import {
  ContainerElementStyle,
  ImageElementStyle,
  TextElementStyle,
} from '../styles';

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
}

export interface ImageElement extends DesignElementBase {
  type: 'image';

  /**
   * The element style.
   */
  style: ImageElementStyle;
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
