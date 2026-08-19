import type { PropertyType } from '@minddrop/properties';
import { InvalidParameterError } from '@minddrop/utils';
import type { DesignElementConfig } from '../types';
import type { DesignElementType } from './DesignElement.types';
import { BadgesElementConfig } from './badges';
import { ContainerElementConfig } from './container';
import { DateElementConfig } from './date';
import { EditorElementConfig } from './editor';
import { FormattedTextElementConfig } from './formatted-text';
import { IconElementConfig } from './icon';
import { ImageElementConfig } from './image';
import { ImageViewerElementConfig } from './image-viewer';
import { NumberElementConfig } from './number';
import { PagePanelElementConfig } from './page-panel';
import { RootElementConfig } from './root';
import { TextElementConfig } from './text';
import { UrlElementConfig } from './url';
import { ViewElementConfig } from './view';
import { WebviewElementConfig } from './webview';

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
