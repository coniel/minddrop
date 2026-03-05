import {
  BadgesElement,
  ContainerElement,
  DateElement,
  EditorElement,
  FormattedTextElement,
  IconElement,
  ImageElement,
  ImageViewerElement,
  LeafDesignElement,
  NumberElement,
  RootElement,
  TextElement,
  UrlElement,
  WebviewElement,
} from '@minddrop/designs';

type Parent = { parent: string };
type Children = { children: string[] };

export type FlatRootDesignElement = Omit<RootElement, 'children'> & Children;

export type FlatContainerDesignElement = Omit<ContainerElement, 'children'> &
  Parent &
  Children;

export type FlatLeafDesignElement = LeafDesignElement & Parent;

export type FlatBadgesElement = BadgesElement & Parent;
export type FlatTextElement = TextElement & Parent;
export type FlatFormattedTextElement = FormattedTextElement & Parent;
export type FlatNumberElement = NumberElement & Parent;
export type FlatDateElement = DateElement & Parent;
export type FlatImageElement = ImageElement & Parent;
export type FlatImageViewerElement = ImageViewerElement & Parent;
export type FlatUrlElement = UrlElement & Parent;
export type FlatIconElement = IconElement & Parent;
export type FlatEditorElement = EditorElement & Parent;
export type FlatWebviewElement = WebviewElement & Parent;

export type FlatDesignElement =
  | FlatRootDesignElement
  | FlatContainerDesignElement
  | FlatLeafDesignElement;

export type FlatChildDesignElement =
  | FlatContainerDesignElement
  | FlatLeafDesignElement;

export type FlatParentDesignElement = FlatContainerDesignElement;
