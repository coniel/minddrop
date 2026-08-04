import {
  ELEMENT_GROUPS,
  LayoutType,
  PropertyTypeElementMap,
  elementConfigs,
  elementIconMap,
  elementLabelMap,
} from '@minddrop/designs';
import { TranslationKey } from '@minddrop/i18n';
import { PropertyType } from '@minddrop/properties';
import { UiIconName } from '@minddrop/ui-icons';
import { ViewDataSourceType } from '@minddrop/views';

// -- Design Studio constants --

export const DesignElementTemplatesDataKey = 'design-element-templates';
export const DesignElementsDataKey = 'design-elements';

// Element types with static content support
export const CONTENT_ELEMENT_TYPES = [
  'text',
  'formatted-text',
  'number',
  'date',
  'badges',
  'url',
  'image',
  'image-viewer',
  'icon',
];

// Fallback icon applied when an icon element enters static mode
// with no icon set
export const DEFAULT_STATIC_ICON = 'content-icon:cat:default';

// Re-export config-derived maps for feature-internal consumers
export {
  ELEMENT_GROUPS,
  PropertyTypeElementMap,
  elementIconMap,
  elementLabelMap,
};

/**
 * Maps layout types to their icons.
 */
export const layoutTypeIconMap: Record<LayoutType, UiIconName> = {
  page: 'layout',
  card: 'layout-grid',
  list: 'layout-list',
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
