import {
  ContainerElement,
  DesignElement,
  DesignElementType,
  RootElement,
} from '@minddrop/designs';
import { PropertyType } from '@minddrop/properties';

/**
 * Data transfer key for database property drag data.
 * Used as the selection item type when dragging properties
 * from the property list onto design elements.
 */
export const DatabasePropertiesDataKey = 'database-properties';

/**
 * Maps each property type to the design element types that
 * can render it. Used to determine which design elements
 * accept which property types during drag-and-drop mapping.
 *
 * Note: 'date' is not a real DesignElementType — date properties
 * currently cannot be mapped to any design element.
 */
export const PropertyTypeElementMap: Record<
  PropertyType,
  (DesignElementType | 'date')[]
> = {
  title: ['text'],
  text: ['text'],
  'formatted-text': ['formatted-text'],
  url: ['text'],
  select: ['text'],
  toggle: ['text'],
  number: ['number'],
  date: ['date'],
  created: ['date'],
  'last-modified': ['date'],
  image: ['image', 'container', 'root'],
  file: ['image', 'container', 'root'],
  icon: ['icon'],
};

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
  const compatibleTypes = PropertyTypeElementMap[propertyType];

  if (!compatibleTypes.includes(element.type)) {
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
