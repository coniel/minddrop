import type { TranslationKey } from '@minddrop/i18n';
import type { PropertyType } from '@minddrop/properties';
import type { UiIconName } from '@minddrop/ui-icons';
import type { DesignElementConfig, ElementGroup } from '../types';
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
import { RootElementConfig } from './root';
import type { RootElement } from './root';
import { TextElementConfig } from './text';
import type { TextElement } from './text';
import { UrlElementConfig } from './url';
import type { UrlElement } from './url';
import { WebviewElementConfig } from './webview';
import type { WebviewElement } from './webview';

/******************************************************************************
 * Re-exports
 *****************************************************************************/

export * from './placeholder-generators';
export * from './badges';
export * from './text';
export * from './formatted-text';
export * from './number';
export * from './date';
export * from './url';
export * from './image';
export * from './image-viewer';
export * from './icon';
export * from './editor';
export * from './webview';
export * from './container';
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
  | WebviewElement;

/**
 * Union of all design element types.
 */
export type DesignElement = LeafDesignElement | ContainerElement | RootElement;

/**
 * Union of all design element type identifiers.
 */
export type DesignElementType =
  | 'root'
  | 'container'
  | 'badges'
  | 'text'
  | 'formatted-text'
  | 'number'
  | 'date'
  | 'url'
  | 'image'
  | 'image-viewer'
  | 'icon'
  | 'editor'
  | 'webview';

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
  | Template<ContainerElement>;

/******************************************************************************
 * Config registry
 *****************************************************************************/

/**
 * All registered design element configs.
 */
export const elementConfigs: DesignElementConfig[] = [
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
  ContainerElementConfig,
  RootElementConfig,
];

/******************************************************************************
 * Derived maps
 *****************************************************************************/

/**
 * Maps element type identifiers to their default templates.
 */
export const ElementTemplates: Record<string, DesignElementTemplate> =
  Object.fromEntries(
    elementConfigs.map((config) => [config.type, config.template]),
  ) as Record<string, DesignElementTemplate>;

/**
 * Maps element type identifiers to their icon names.
 */
export const elementIconMap: Record<string, UiIconName> = Object.fromEntries(
  elementConfigs.map((config) => [config.type, config.icon]),
);

/**
 * Maps element type identifiers to their i18n label keys.
 */
export const elementLabelMap: Record<string, TranslationKey> =
  Object.fromEntries(
    elementConfigs.map((config) => [config.type, config.label]),
  );

/**
 * Element groups for the design studio palette, derived
 * from each config's group property.
 */
export const ELEMENT_GROUPS: { label: string; types: string[] }[] = (
  ['content', 'media', 'layout'] as ElementGroup[]
).map((group) => ({
  label: `design-studio.elements.group.${group}`,
  types: elementConfigs
    .filter((config) => config.group === group)
    .map((config) => config.type),
}));

/**
 * Maps each property type to the design element types that
 * can render it. Built by inverting each config's
 * compatiblePropertyTypes list.
 */
export const PropertyTypeElementMap: Record<PropertyType, DesignElementType[]> =
  elementConfigs.reduce(
    (map, config) => {
      for (const propertyType of config.compatiblePropertyTypes) {
        if (!map[propertyType]) {
          map[propertyType] = [];
        }

        map[propertyType].push(config.type as DesignElementType);
      }

      return map;
    },
    {} as Record<PropertyType, DesignElementType[]>,
  );
