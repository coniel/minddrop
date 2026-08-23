import { DataViewTypes } from '@minddrop/data-views';
import {
  DesignElement,
  ViewElement,
  getElementCompatiblePropertyTypes,
} from '@minddrop/designs';
import { PropertyType } from '@minddrop/properties';
import { FlatDesignElement } from '../../types';
import { isStaticContentElement } from '../isStaticContentElement';

/**
 * Checks whether a design property type can be rendered by an
 * element. Compatibility comes from the element type's config, or
 * the property element config for property elements, with view
 * elements additionally checked against the data sources their
 * view type supports.
 *
 * @param propertyType - The property type to check.
 * @param element - The element the property would be bound to.
 * @returns Whether the property can be bound to the element.
 */
export function isPropertyCompatibleWithElement(
  propertyType: PropertyType,
  element: DesignElement | FlatDesignElement,
): boolean {
  // Static elements display their own content, so they never
  // bind to a property. Element types which are always property
  // bound are never static, whatever the element carries.
  if (isStaticContentElement(element)) {
    return false;
  }

  // The element must be able to render the property type
  if (!getElementCompatiblePropertyTypes(element).includes(propertyType)) {
    return false;
  }

  // View elements render a data view rather than a value, so the
  // view type must support the property's data source
  if (element.type === 'view') {
    return isDataSourceSupported(propertyType, element as ViewElement);
  }

  return true;
}

/**
 * Checks whether a view element's view type supports the data
 * source a property type provides.
 */
function isDataSourceSupported(
  propertyType: PropertyType,
  element: ViewElement,
): boolean {
  // Only collection properties carry a data source a view can
  // render
  if (propertyType !== 'collection') {
    return false;
  }

  // Look up the view type, which may not be registered
  const throwOnNotFound = false;
  const viewType = DataViewTypes.get(element.viewType, throwOnNotFound);

  if (!viewType) {
    return false;
  }

  return viewType.supportedDataSources.includes('collection');
}
