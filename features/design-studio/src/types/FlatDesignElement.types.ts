import {
  ContainerElement,
  ImagePropertyElement,
  PropertyDesignElement,
  RootElement,
  StaticDesignElement,
  TextPropertyElement,
} from '@minddrop/designs';

type Parent = { parent: string };
type Children = { children: string[] };

export type FlatRootDesignElement = Omit<RootElement, 'children'> & Children;

export type FlatContainerDesignElement = Omit<ContainerElement, 'children'> &
  Parent &
  Children;

export type FlatStaticDesignElement = StaticDesignElement & Parent;

export type FlatPropertyDesignElement = PropertyDesignElement & Parent;

export type FlatTextPropertyElement = TextPropertyElement & Parent;
export type FlatImagePropertyElement = ImagePropertyElement & Parent;

export type FlatDesignElement =
  | FlatRootDesignElement
  | FlatContainerDesignElement
  | FlatStaticDesignElement
  | FlatPropertyDesignElement;

export type FlatChildDesignElement =
  | FlatContainerDesignElement
  | FlatStaticDesignElement
  | FlatPropertyDesignElement;

export type FlatParentDesignElement = FlatContainerDesignElement;
