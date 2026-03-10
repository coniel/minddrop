import type { DesignElement as DesignElementType } from '@minddrop/designs';
import type { FlatDesignElement } from '../types';
import { BadgesDesignElement, BadgesElementStyleEditor } from './badges';
import {
  ContainerDesignElement,
  ContainerElementStyleEditor,
  ContainerStudioDesignElement,
} from './container';
import { DateDesignElement, DateElementStyleEditor } from './date';
import { EditorDesignElement, EditorElementStyleEditor } from './editor';
import {
  FormattedTextDesignElement,
  FormattedTextElementStyleEditor,
} from './formatted-text';
import {
  IconDesignElement,
  IconElementStyleEditor,
  IconStudioDesignElement,
} from './icon';
import {
  ImageDesignElement,
  ImageElementStyleEditor,
  ImageStudioDesignElement,
} from './image';
import {
  ImageViewerDesignElement,
  ImageViewerElementStyleEditor,
  ImageViewerStudioDesignElement,
} from './image-viewer';
import { NumberDesignElement, NumberElementStyleEditor } from './number';
import { TextDesignElement, TextElementStyleEditor } from './text';
import { UrlDesignElement, UrlElementStyleEditor } from './url';
import { ViewDesignElement, ViewElementStyleEditor } from './view';
import { WebviewDesignElement, WebviewElementStyleEditor } from './webview';

/******************************************************************************
 * Types
 *****************************************************************************/

/**
 * UI configuration for a design element type. Maps an element
 * type to its display, studio, and style editor components.
 */
export interface ElementUIConfig {
  /**
   * The element type identifier.
   */
  type: string;

  /**
   * Component that renders the element in the design preview.
   * Also used as the studio renderer when no StudioComponent
   * is provided.
   */
  DisplayComponent: React.ComponentType<{
    element: DesignElementType;
    rootProps?: Record<string, unknown>;
  }>;

  /**
   * Optional component that renders the element in the design
   * studio canvas. When omitted, DisplayComponent is used
   * instead. Receives `rootProps` which must be spread on the
   * outermost DOM element to enable drag-and-drop and
   * click-to-select.
   */
  StudioComponent?: React.ComponentType<{
    element: FlatDesignElement;
    rootProps: Record<string, unknown>;
  }>;

  /**
   * Component that renders the style editor panel for this element.
   */
  StyleEditorComponent?: React.ComponentType<{ elementId: string }>;
}

/******************************************************************************
 * Registry
 *****************************************************************************/

// Cast components to the registry's generic prop types since each
// component internally narrows to its specific element type
const asDisplay = (
  component: React.ComponentType<any>,
): React.ComponentType<{
  element: DesignElementType;
  rootProps?: Record<string, unknown>;
}> => component;

const asStudio = (
  component: React.ComponentType<any>,
): React.ComponentType<{
  element: FlatDesignElement;
  rootProps: Record<string, unknown>;
}> => component;

/**
 * All registered element UI configurations.
 */
const elementUIs: ElementUIConfig[] = [
  {
    type: 'badges',
    DisplayComponent: asDisplay(BadgesDesignElement),
    StyleEditorComponent: BadgesElementStyleEditor,
  },
  {
    type: 'text',
    DisplayComponent: asDisplay(TextDesignElement),
    StyleEditorComponent: TextElementStyleEditor,
  },
  {
    type: 'formatted-text',
    DisplayComponent: asDisplay(FormattedTextDesignElement),
    StyleEditorComponent: FormattedTextElementStyleEditor,
  },
  {
    type: 'number',
    DisplayComponent: asDisplay(NumberDesignElement),
    StyleEditorComponent: NumberElementStyleEditor,
  },
  {
    type: 'date',
    DisplayComponent: asDisplay(DateDesignElement),
    StyleEditorComponent: DateElementStyleEditor,
  },
  {
    type: 'url',
    DisplayComponent: asDisplay(UrlDesignElement),
    StyleEditorComponent: UrlElementStyleEditor,
  },
  {
    type: 'icon',
    DisplayComponent: asDisplay(IconDesignElement),
    StudioComponent: asStudio(IconStudioDesignElement),
    StyleEditorComponent: IconElementStyleEditor,
  },
  {
    type: 'image',
    DisplayComponent: asDisplay(ImageDesignElement),
    StudioComponent: asStudio(ImageStudioDesignElement),
    StyleEditorComponent: ImageElementStyleEditor,
  },
  {
    type: 'image-viewer',
    DisplayComponent: asDisplay(ImageViewerDesignElement),
    StudioComponent: asStudio(ImageViewerStudioDesignElement),
    StyleEditorComponent: ImageViewerElementStyleEditor,
  },
  {
    type: 'editor',
    DisplayComponent: asDisplay(EditorDesignElement),
    StyleEditorComponent: EditorElementStyleEditor,
  },
  {
    type: 'webview',
    DisplayComponent: asDisplay(WebviewDesignElement),
    StyleEditorComponent: WebviewElementStyleEditor,
  },
  {
    type: 'view',
    DisplayComponent: asDisplay(ViewDesignElement),
    StyleEditorComponent: ViewElementStyleEditor,
  },
  {
    type: 'container',
    DisplayComponent: asDisplay(ContainerDesignElement),
    StudioComponent: asStudio(ContainerStudioDesignElement),
    StyleEditorComponent: ContainerElementStyleEditor,
  },
  {
    type: 'root',
    // Root uses container's display and studio renderers are
    // handled separately by DesignRootElement/DesignStudioRootElement
    DisplayComponent: asDisplay(ContainerDesignElement),
    StudioComponent: asStudio(ContainerStudioDesignElement),
    StyleEditorComponent: ContainerElementStyleEditor,
  },
];

/**
 * Maps element type identifiers to their UI configuration.
 * Used by dispatchers to look up the correct component for
 * each element type without manual switch statements.
 */
export const elementUIMap: Record<string, ElementUIConfig> = Object.fromEntries(
  elementUIs.map((ui) => [ui.type, ui]),
);
