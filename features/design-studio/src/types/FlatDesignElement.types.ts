import {
  CardElement,
  ImagePropertyElement,
  LayoutDesignElement,
  ListElement,
  PageElement,
  PropertyDesignElement,
  StaticDesignElement,
  TextPropertyElement,
} from '@minddrop/designs';

type Parent = { parent: string };
type Children = { children: string[] };

export type FlatCardDesignElement = Omit<CardElement, 'children'> & Children;
export type FlatListDesignElement = Omit<ListElement, 'children'> & Children;
export type FlatPageDesignElement = Omit<PageElement, 'children'> & Children;

export type FlatRootDesignElement =
  | FlatCardDesignElement
  | FlatListDesignElement
  | FlatPageDesignElement;

export type FlatLayoutDesignElement = Omit<LayoutDesignElement, 'children'> &
  Parent &
  Children;

export type FlatStaticDesignElement = StaticDesignElement & Parent;

export type FlatPropertyDesignElement = PropertyDesignElement & Parent;

export type FlatTextPropertyElement = TextPropertyElement & Parent;
export type FlatImagePropertyElement = ImagePropertyElement & Parent;

export type FlatDesignElement =
  | FlatRootDesignElement
  | FlatLayoutDesignElement
  | FlatStaticDesignElement
  | FlatPropertyDesignElement;

export type FlatChildDesignElement =
  | FlatLayoutDesignElement
  | FlatStaticDesignElement
  | FlatPropertyDesignElement;

export type FlatParentDesignElement =
  | FlatRootDesignElement
  | FlatLayoutDesignElement;
