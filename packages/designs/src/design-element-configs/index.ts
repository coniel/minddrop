import type { PropertyType } from '@minddrop/properties';
import { InvalidParameterError } from '@minddrop/utils';
import type { DesignElementConfig, DesignRoleId } from '../types';
import { BadgesElementConfig } from './badges';
import type { BadgesElement } from './badges';
import { ContainerElementConfig } from './container';
import type { ContainerElement } from './container';
import { DateElementConfig } from './date';
import type { DateElement } from './date';
import { EditorElementConfig } from './editor';
import type { EditorElement } from './editor';
import { FormattedTextElementConfig } from './formatted-text';
import type { FormattedTextElement } from './formatted-text';
import { IconElementConfig } from './icon';
import type { IconElement } from './icon';
import { ImageElementConfig } from './image';
import type { ImageElement } from './image';
import { ImageViewerElementConfig } from './image-viewer';
import type { ImageViewerElement } from './image-viewer';
import { NumberElementConfig } from './number';
import type { NumberElement } from './number';
import { PagePanelElementConfig } from './page-panel';
import type { PagePanelElement } from './page-panel';
import { RootElementConfig } from './root';
import type { RootElement } from './root';
import { TextElementConfig } from './text';
import type { TextElement } from './text';
import { UrlElementConfig } from './url';
import type { UrlElement } from './url';
import { ViewElementConfig } from './view';
import type { ViewElement } from './view';
import { WebviewElementConfig } from './webview';
import type { WebviewElement } from './webview';

/******************************************************************************
 * Re-exports
 *****************************************************************************/

export * from './placeholder-generators';
export * from './badges';
export * from './text';
export * from './formatted-text';
export * from './view';
export * from './number';
export * from './date';
export * from './url';
export * from './image';
export * from './image-viewer';
export * from './icon';
export * from './editor';
export * from './webview';
export * from './container';
export * from './page-panel';
export * from './root';

/******************************************************************************
 * Union types
 *****************************************************************************/

/**
 * Union of all leaf (non-container) design element types.
 */
export type LeafDesignElement =
  | BadgesElement
  | TextElement
  | FormattedTextElement
  | NumberElement
  | DateElement
  | UrlElement
  | ImageElement
  | ImageViewerElement
  | IconElement
  | EditorElement
  | WebviewElement
  | ViewElement;

/**
 * Union of all design element types.
 */
export type DesignElement =
  | LeafDesignElement
  | ContainerElement
  | PagePanelElement
  | RootElement;

/**
 * Union of all design element type identifiers.
 */
export type DesignElementType = DesignElement['type'];

/**
 * A design element playing a registered role: a basic element
 * extended with the role tag. The role's variant styles are locked
 * over the element's own style at resolution time.
 */
export type RoleDesignElement<TElement extends DesignElement = DesignElement> =
  TElement & {
    /**
     * The registered design role the element plays (e.g.
     * 'card-title').
     */
    role: DesignRoleId;

    /**
     * The element's selected role variant per axis, as an
     * [axis ID]: [option ID] map. Axes omitted or set to an
     * unknown option use the axis default option.
     */
    roleVariants?: Record<string, string>;
  };

/**
 * Strips the `id` field from an element type to produce
 * a template type used when creating new elements.
 */
type Template<T> = Omit<T, 'id'>;

/**
 * Union of all design element template types (element without id).
 */
export type DesignElementTemplate =
  | Template<BadgesElement>
  | Template<TextElement>
  | Template<FormattedTextElement>
  | Template<NumberElement>
  | Template<DateElement>
  | Template<UrlElement>
  | Template<ImageElement>
  | Template<ImageViewerElement>
  | Template<IconElement>
  | Template<EditorElement>
  | Template<WebviewElement>
  | Template<ViewElement>
  | Template<ContainerElement>
  | Template<PagePanelElement>;

/******************************************************************************
 * Config registry
 *****************************************************************************/

/**
 * All built-in design element configs.
 */
const elementConfigs: DesignElementConfig[] = [
  BadgesElementConfig,
  TextElementConfig,
  FormattedTextElementConfig,
  EditorElementConfig,
  NumberElementConfig,
  DateElementConfig,
  UrlElementConfig,
  ImageElementConfig,
  ImageViewerElementConfig,
  IconElementConfig,
  WebviewElementConfig,
  ViewElementConfig,
  ContainerElementConfig,
  PagePanelElementConfig,
  RootElementConfig,
];

// Configs indexed by element type for constant time lookup
const elementConfigMap: Record<string, DesignElementConfig> =
  Object.fromEntries(elementConfigs.map((config) => [config.type, config]));

/**
 * Returns every design element config.
 */
export function getElementConfigs(): DesignElementConfig[] {
  return elementConfigs;
}

/**
 * Returns the config for the given element type.
 *
 * @throws {InvalidParameterError} If the element type is not registered.
 */
export function getElementConfig(type: string): DesignElementConfig {
  // Look up the config by element type
  const config = elementConfigMap[type];

  // Guard against unknown element types
  if (!config) {
    throw new InvalidParameterError(
      `No design element config registered for type '${type}'.`,
    );
  }

  return config;
}

/**
 * Returns the element types able to render the given property type.
 */
export function getElementsForPropertyType(
  propertyType: PropertyType,
): DesignElementType[] {
  // Collect the type of every config listing the property type as
  // compatible
  return elementConfigs
    .filter((config) => config.compatiblePropertyTypes.includes(propertyType))
    .map((config) => config.type as DesignElementType);
}
