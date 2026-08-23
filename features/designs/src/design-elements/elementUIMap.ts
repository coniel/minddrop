import {
  DesignElement,
  DesignElementType,
  RootElement,
} from '@minddrop/designs';
import { DesignRootElement } from '../DesignElements/DesignRootElement';
import { FlatDesignElement } from '../types';
import { BadgesDesignElement } from './badges';
import {
  ContainerDesignElement,
  ContainerStudioDesignElement,
} from './container';
import { DateDesignElement } from './date';
import { EditorDesignElement } from './editor';
import { FormattedTextDesignElement } from './formatted-text';
import { IconDesignElement, IconStudioDesignElement } from './icon';
import { ImageDesignElement } from './image';
import { ImageViewerDesignElement } from './image-viewer';
import { NumberDesignElement } from './number';
import {
  PagePanelDesignElement,
  PagePanelStudioDesignElement,
} from './page-panel';
import { PropertyDesignElement } from './property';
import { TextDesignElement } from './text';
import { UrlDesignElement } from './url';
import { ViewDesignElement } from './view';
import { WebviewDesignElement } from './webview';

/**
 * UI configuration for a design element type.
 */
export interface ElementUIConfig {
  /**
   * The element type the UI renders.
   */
  type: DesignElementType;

  /**
   * The component rendering the element at runtime.
   */
  DisplayComponent: React.ComponentType<{ element: DesignElement }>;

  /**
   * The component rendering the element on the studio canvas, for
   * element types needing interactive editing behaviour (drop
   * targets, pickers, resize handles). Element types without one
   * render their display component inside the studio wrapper.
   */
  StudioComponent?: React.ComponentType<{
    element: FlatDesignElement;
    rootProps: Record<string, unknown>;
  }>;
}

/**
 * Builds an element UI config from a per-type component, containing
 * the cast from the narrowed element props to the unions.
 */
function elementUI<TElement extends DesignElement>(config: {
  type: TElement['type'];
  DisplayComponent: React.ComponentType<{ element: TElement }>;
  StudioComponent?: React.ComponentType<{
    element: never;
    rootProps: Record<string, unknown>;
  }>;
}): ElementUIConfig {
  return config as unknown as ElementUIConfig;
}

/**
 * The element UIs of all built-in element types.
 */
const elementUIs: ElementUIConfig[] = [
  elementUI({ type: 'badges', DisplayComponent: BadgesDesignElement }),
  elementUI({ type: 'text', DisplayComponent: TextDesignElement }),
  elementUI({
    type: 'formatted-text',
    DisplayComponent: FormattedTextDesignElement,
  }),
  elementUI({ type: 'number', DisplayComponent: NumberDesignElement }),
  elementUI({ type: 'date', DisplayComponent: DateDesignElement }),
  elementUI({ type: 'url', DisplayComponent: UrlDesignElement }),
  elementUI({ type: 'image', DisplayComponent: ImageDesignElement }),
  elementUI({
    type: 'image-viewer',
    DisplayComponent: ImageViewerDesignElement,
  }),
  elementUI({
    type: 'icon',
    DisplayComponent: IconDesignElement,
    StudioComponent: IconStudioDesignElement as never,
  }),
  elementUI({ type: 'editor', DisplayComponent: EditorDesignElement }),
  elementUI({ type: 'webview', DisplayComponent: WebviewDesignElement }),
  elementUI({ type: 'view', DisplayComponent: ViewDesignElement }),
  elementUI({ type: 'property', DisplayComponent: PropertyDesignElement }),
  elementUI({
    type: 'container',
    DisplayComponent: ContainerDesignElement,
    StudioComponent: ContainerStudioDesignElement as never,
  }),
  elementUI({
    type: 'page-panel',
    DisplayComponent: PagePanelDesignElement,
    StudioComponent: PagePanelStudioDesignElement as never,
  }),
  elementUI<RootElement>({
    type: 'root',
    DisplayComponent: DesignRootElement,
  }),
];

/**
 * Element UI configs indexed by element type.
 */
export const elementUIMap: Record<string, ElementUIConfig> = Object.fromEntries(
  elementUIs.map((config) => [config.type, config]),
);
