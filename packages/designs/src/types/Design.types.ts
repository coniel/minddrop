import {
  CardElement,
  ListElement,
  PageElement,
  RootDesignElement,
  RootElementType,
} from './DesignElement.types';

export type DesignType = RootElementType;

export interface BaseDesign {
  /**
   * A unique identifier for this design.
   */
  id: string;

  /**
   * The type of the design's root element. Determines the type of design.
   */
  type: DesignType;

  /**
   * User specified name for this design.
   */
  name: string;

  /**
   * The elements composing this design.
   */
  tree: RootDesignElement;
}

export interface CardDesign extends BaseDesign {
  type: 'card';
  tree: CardElement;
}

export interface ListDesign extends BaseDesign {
  type: 'list';
  tree: ListElement;
}

export interface PageDesign extends BaseDesign {
  type: 'page';
  tree: PageElement;
}

export type Design = CardDesign | ListDesign | PageDesign;
