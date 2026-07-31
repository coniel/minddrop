import {
  DesignElement,
  PropertyTypeElementMap,
  RootElement,
  ViewElement,
} from '@minddrop/designs';
import { PropertyType } from '@minddrop/properties';
import { ViewTypes } from '@minddrop/views';
import { propertyTypeDataSourceMap } from '../../constants';
import { FlatDesignElement } from '../../types';

/**
 * Checks whether a property type is compatible with a given
 * design element. For view elements, checks that the property
 * type maps to a data source supported by the view type.
 */
export function isPropertyCompatibleWithElement(
  propertyType: PropertyType,
  element: DesignElement | RootElement | FlatDesignElement,
): boolean {
  // Static elements cannot be mapped to properties
  if (element.static) {
    return false;
  }

  const compatibleTypes = PropertyTypeElementMap[propertyType];

  if (!compatibleTypes || !compatibleTypes.includes(element.type)) {
    return false;
  }

  // View elements are only compatible when the property type maps
  // to a data source that the specific view type supports
  if (element.type === 'view') {
    const dataSource = propertyTypeDataSourceMap[propertyType];

    if (!dataSource) {
      return false;
    }

    const throwOnNotFound = false;
    const viewType = ViewTypes.get(
      (element as ViewElement).viewType,
      throwOnNotFound,
    );

    if (!viewType) {
      return false;
    }

    return viewType.supportedDataSources.includes(dataSource);
  }

  return true;
}
