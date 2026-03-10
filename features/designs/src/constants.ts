import {
  ELEMENT_GROUPS,
  PropertyTypeElementMap,
  elementConfigs,
  elementIconMap,
  elementLabelMap,
} from '@minddrop/designs';
import { TranslationKey } from '@minddrop/i18n';
import { PropertyType } from '@minddrop/properties';
import { ViewDataSourceType } from '@minddrop/views';

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
  collection: 'properties.collection.name',
  // TODO: remove @ts-expect-error once query property type is added
  // @ts-expect-error query property type not yet defined
  query: 'properties.query.name',
};

/**
 * Maps view data source types to their corresponding property
 * types. Used to determine which property types a view element
 * supports based on the view type's supported data sources.
 */
export const dataSourcePropertyTypeMap: Partial<
  Record<ViewDataSourceType, PropertyType>
> = {
  collection: 'collection',
  // TODO: remove @ts-expect-error once query property type is added
  // @ts-expect-error query property type not yet defined
  query: 'query',
};

/**
 * Reverse of dataSourcePropertyTypeMap. Maps property types back
 * to their corresponding data source types. Used to check whether
 * a view element's view type supports a given property type.
 */
export const propertyTypeDataSourceMap: Partial<
  Record<PropertyType, ViewDataSourceType>
> = Object.fromEntries(
  Object.entries(dataSourcePropertyTypeMap).map(([source, propType]) => [
    propType,
    source,
  ]),
);

// -- Design Property Mapping constants --

/**
 * Data transfer key for database property drag data.
 * Used as the selection item type when dragging properties
 * from the property list onto design elements.
 */
export const DatabasePropertiesDataKey = 'database-properties';
