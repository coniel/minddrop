import {
  CardElement,
  ListElement,
  PageElement,
  RootDesignElement,
} from './DesignElement.types';

export type DesignType = 'card' | 'list' | 'page';

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

export type DesignForType<T extends DesignType> = T extends 'card'
  ? CardDesign
  : T extends 'list'
    ? ListDesign
    : T extends 'page'
      ? PageDesign
      : never;
