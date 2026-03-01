import {
  ContainerElement,
  FormattedTextElement,
  IconElement,
  ImageElement,
  LeafDesignElement,
  NumberElement,
  RootElement,
  TextElement,
  UrlElement,
} from '@minddrop/designs';

type Parent = { parent: string };
type Children = { children: string[] };

export type FlatRootDesignElement = Omit<RootElement, 'children'> & Children;

export type FlatContainerDesignElement = Omit<ContainerElement, 'children'> &
  Parent &
  Children;

export type FlatLeafDesignElement = LeafDesignElement & Parent;

export type FlatTextElement = TextElement & Parent;
export type FlatFormattedTextElement = FormattedTextElement & Parent;
export type FlatNumberElement = NumberElement & Parent;
export type FlatImageElement = ImageElement & Parent;
export type FlatUrlElement = UrlElement & Parent;
export type FlatIconElement = IconElement & Parent;

export type FlatDesignElement =
  | FlatRootDesignElement
  | FlatContainerDesignElement
  | FlatLeafDesignElement;

export type FlatChildDesignElement =
  | FlatContainerDesignElement
  | FlatLeafDesignElement;

export type FlatParentDesignElement = FlatContainerDesignElement;
