import {
  CardElement,
  LayoutDesignElement,
  ListElement,
  PageElement,
  PropertyDesignElement,
  StaticDesignElement,
} from '@minddrop/designs';

export type FlatCardDesignElement = Omit<CardElement, 'children'> & {
  children: string[];
};

export type FlatListDesignElement = Omit<ListElement, 'children'> & {
  children: string[];
};

export type FlatPageDesignElement = Omit<PageElement, 'children'> & {
  children: string[];
};

export type FlatRootDesignElement =
  | FlatCardDesignElement
  | FlatListDesignElement
  | FlatPageDesignElement;

export type FlatLayoutDesignElement = Omit<LayoutDesignElement, 'children'> & {
  children: string[];
  parent: string;
};

export type FlatStaticDesignElement = StaticDesignElement & {
  parent: string;
};

export type FlatPropertyDesignElement = PropertyDesignElement & {
  parent: string;
};

export type FlatDesignElement =
  | FlatRootDesignElement
  | FlatLayoutDesignElement
  | FlatStaticDesignElement
  | FlatPropertyDesignElement;
