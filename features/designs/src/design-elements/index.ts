import type { DesignElement as DesignElementType } from '@minddrop/designs';
import type { FlatDesignElement } from '../types';
import {
  ContainerDesignElement,
  ContainerElementStyleEditor,
  ContainerStudioDesignElement,
} from './container';
import {
  DateDesignElement,
  DateElementStyleEditor,
  DateStudioDesignElement,
} from './date';
import {
  EditorDesignElement,
  EditorElementStyleEditor,
  EditorStudioDesignElement,
} from './editor';
import {
  FormattedTextDesignElement,
  FormattedTextElementStyleEditor,
  FormattedTextStudioDesignElement,
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
import {
  NumberDesignElement,
  NumberElementStyleEditor,
  NumberStudioDesignElement,
} from './number';
import {
  TextDesignElement,
  TextElementStyleEditor,
  TextStudioDesignElement,
} from './text';
import {
  UrlDesignElement,
  UrlElementStyleEditor,
  UrlStudioDesignElement,
} from './url';
import {
  WebviewDesignElement,
  WebviewElementStyleEditor,
  WebviewStudioDesignElement,
} from './webview';

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
   */
  DisplayComponent: React.ComponentType<{ element: DesignElementType }>;

  /**
   * Component that renders the element in the design studio canvas.
   */
  StudioComponent: React.ComponentType<{ element: FlatDesignElement }>;

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
): React.ComponentType<{ element: DesignElementType }> => component;

const asStudio = (
  component: React.ComponentType<any>,
): React.ComponentType<{ element: FlatDesignElement }> => component;

/**
 * All registered element UI configurations.
 */
const elementUIs: ElementUIConfig[] = [
  {
    type: 'text',
    DisplayComponent: asDisplay(TextDesignElement),
    StudioComponent: asStudio(TextStudioDesignElement),
    StyleEditorComponent: TextElementStyleEditor,
  },
  {
    type: 'formatted-text',
    DisplayComponent: asDisplay(FormattedTextDesignElement),
    StudioComponent: asStudio(FormattedTextStudioDesignElement),
    StyleEditorComponent: FormattedTextElementStyleEditor,
  },
  {
    type: 'number',
    DisplayComponent: asDisplay(NumberDesignElement),
    StudioComponent: asStudio(NumberStudioDesignElement),
    StyleEditorComponent: NumberElementStyleEditor,
  },
  {
    type: 'date',
    DisplayComponent: asDisplay(DateDesignElement),
    StudioComponent: asStudio(DateStudioDesignElement),
    StyleEditorComponent: DateElementStyleEditor,
  },
  {
    type: 'url',
    DisplayComponent: asDisplay(UrlDesignElement),
    StudioComponent: asStudio(UrlStudioDesignElement),
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
    StudioComponent: asStudio(EditorStudioDesignElement),
    StyleEditorComponent: EditorElementStyleEditor,
  },
  {
    type: 'webview',
    DisplayComponent: asDisplay(WebviewDesignElement),
    StudioComponent: asStudio(WebviewStudioDesignElement),
    StyleEditorComponent: WebviewElementStyleEditor,
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
