import { DesignElementStyle } from '../styles';
import { DesignType } from './Design.types';

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
 * Property Elements
 *****************************************************************************/

export interface PropertyDesignElementBase extends DesignElementBase {
  /**
   * The name of the property to use as the element's content.
   */
  property: string;
}

export interface TitlePropertyElement extends PropertyDesignElementBase {
  type: 'title-property';
}

export interface TextPropertyElement extends PropertyDesignElementBase {
  type: 'text-property';
}

export interface FormattedTextPropertyElement
  extends PropertyDesignElementBase {
  type: 'formatted-text-property';
}

export interface NumberPropertyElement extends PropertyDesignElementBase {
  type: 'number-property';
}

export interface UrlPropertyElement extends PropertyDesignElementBase {
  type: 'url-property';
}

export interface ImagePropertyElement extends PropertyDesignElementBase {
  type: 'image-property';
}

export type PropertyDesignElement =
  | TitlePropertyElement
  | TextPropertyElement
  | FormattedTextPropertyElement
  | NumberPropertyElement
  | UrlPropertyElement
  | ImagePropertyElement;

/******************************************************************************
 * Static Elements
 *****************************************************************************/

export interface TextElement extends DesignElementBase {
  type: 'text';

  /**
   * The text value.
   */
  value: string;
}

export type StaticDesignElement = TextElement;

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

export type DesignElement =
  | PropertyDesignElement
  | StaticDesignElement
  | ContainerElement
  | RootElement;
