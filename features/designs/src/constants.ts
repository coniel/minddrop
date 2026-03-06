import {
  ContainerElement,
  DesignElement,
  ELEMENT_GROUPS,
  PropertyTypeElementMap,
  RootElement,
  elementConfigs,
  elementIconMap,
  elementLabelMap,
} from '@minddrop/designs';
import { TranslationKey } from '@minddrop/i18n';
import { PropertyType } from '@minddrop/properties';

// -- Design Studio constants --

export const DesignElementTemplatesDataKey = 'design-element-templates';
export const DesignElementsDataKey = 'design-elements';

// Re-export config-derived maps for feature-internal consumers
export {
  ELEMENT_GROUPS,
  PropertyTypeElementMap,
  elementIconMap,
  elementLabelMap,
};

/**
 * Maps element type identifiers to the property types they
 * can be mapped to.
 */
export const elementCompatiblePropertyTypesMap: Record<
  string,
  readonly PropertyType[]
> = Object.fromEntries(
  elementConfigs.map((config) => [config.type, config.compatiblePropertyTypes]),
);

/**
 * Maps property type identifiers to their i18n label keys.
 */
export const propertyTypeLabelMap: Record<PropertyType, TranslationKey> = {
  title: 'properties.title.name',
  text: 'properties.text.name',
  number: 'properties.number.name',
  date: 'properties.date.name',
  toggle: 'properties.toggle.name',
  url: 'properties.url.name',
  image: 'properties.image.name',
  select: 'properties.select.name',
  icon: 'properties.icon.name',
  'formatted-text': 'properties.textFormatted.name',
  created: 'properties.created.name',
  'last-modified': 'properties.lastModified.name',
  file: 'properties.file.name',
};

// -- Design Property Mapping constants --

/**
 * Data transfer key for database property drag data.
 * Used as the selection item type when dragging properties
 * from the property list onto design elements.
 */
export const DatabasePropertiesDataKey = 'database-properties';

/**
 * Checks whether a property type is compatible with a given
 * design element. For image/file properties, containers and
 * root elements are only compatible when they have a background
 * image set.
 */
export function isPropertyCompatibleWithElement(
  propertyType: PropertyType,
  element: DesignElement | RootElement,
): boolean {
  // Static elements cannot be mapped to properties
  if (element.static) {
    return false;
  }

  const compatibleTypes = PropertyTypeElementMap[propertyType];

  if (!compatibleTypes || !compatibleTypes.includes(element.type)) {
    return false;
  }

  // Image/file properties require containers/root to have a background image
  const isImageProperty = propertyType === 'image' || propertyType === 'file';
  const isContainerOrRoot =
    element.type === 'container' || element.type === 'root';

  if (isImageProperty && isContainerOrRoot) {
    const style = (element as ContainerElement | RootElement).style;

    return !!style.backgroundImage;
  }

  return true;
}
