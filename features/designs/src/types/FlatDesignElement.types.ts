import {
  ContainerElement,
  DatePropertyElement,
  LeafDesignElement,
  NumberPropertyElement,
  PagePanelElement,
  PropertyElement,
  RootElement,
  TextElement,
  UrlPropertyElement,
} from '@minddrop/designs';

type Parent = { parent: string };
type Children = { children: string[] };

export type FlatRootDesignElement = Omit<RootElement, 'children'> & Children;

export type FlatContainerDesignElement = Omit<ContainerElement, 'children'> &
  Parent &
  Children;

export type FlatPagePanelDesignElement = Omit<PagePanelElement, 'children'> &
  Parent &
  Children;

export type FlatLeafDesignElement = LeafDesignElement & Parent;

export type FlatTextElement = TextElement & Parent;
export type FlatPropertyElement = PropertyElement & Parent;
export type FlatNumberPropertyElement = NumberPropertyElement & Parent;
export type FlatDatePropertyElement = DatePropertyElement & Parent;
export type FlatUrlPropertyElement = UrlPropertyElement & Parent;

export type FlatDesignElement =
  | FlatRootDesignElement
  | FlatContainerDesignElement
  | FlatPagePanelDesignElement
  | FlatLeafDesignElement;

export type FlatChildDesignElement =
  | FlatContainerDesignElement
  | FlatPagePanelDesignElement
  | FlatLeafDesignElement;

export type FlatParentDesignElement =
  | FlatContainerDesignElement
  | FlatPagePanelDesignElement;
