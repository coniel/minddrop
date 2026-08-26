import { LayoutType } from '@minddrop/designs';
import { TranslationKey } from '@minddrop/i18n';
import { PropertyType } from '@minddrop/properties';
import { UiIconName } from '@minddrop/ui-icons';

/**
 * Drag-and-drop data key carrying design element templates
 * dragged from the elements palette.
 */
export const DesignElementTemplatesDataKey = 'design-element-templates';

/**
 * Drag-and-drop data key carrying existing design elements
 * dragged on the canvas.
 */
export const DesignElementsDataKey = 'design-elements';

/**
 * Drag-and-drop data key carrying design roles dragged from the
 * elements palette. Role drops instantiate the role's element type
 * rather than a bare template.
 */
export const DesignRolesDataKey = 'design-roles';

/**
 * Drag-and-drop data key carrying property elements dragged from
 * the elements palette. Property element drops instantiate an
 * element dynamically rather than from a bare template.
 */
export const DesignPropertyElementsDataKey = 'design-property-elements';

/**
 * Drag-and-drop data key carrying layout types dragged from the
 * layouts panel onto the canvas, where they are dropped to create
 * a layout at the drop point.
 */
export const DesignLayoutTypesDataKey = 'design-layout-types';

/**
 * The size, in pixels, an empty container or layout root is held
 * open at in the studio. Without it a layout with no elements
 * collapses to nothing and cannot be dropped onto. Kept in sync
 * with the min-height in EmptyDropHint.css.
 */
export const EmptyElementMinSize = 80;

/**
 * The narrowest width a page panel can be given, in pixels.
 */
export const PagePanelMinWidth = 120;

/**
 * The widest width a page panel can be given, in pixels.
 */
export const PagePanelMaxWidth = 640;

/**
 * The icon displayed for each layout type.
 */
export const layoutTypeIconMap: Record<LayoutType, UiIconName> = {
  page: 'layout',
  card: 'layout-grid',
  list: 'layout-list',
  space: 'panels-top-left',
};

/**
 * The i18n key of each layout type's name.
 */
export const layoutTypeLabelMap: Record<LayoutType, TranslationKey> = {
  page: 'designs.layouts.page.label',
  card: 'designs.layouts.card.label',
  list: 'designs.layouts.list.label',
  space: 'designs.layouts.space.label',
};

/**
 * The i18n key of each layout type's description.
 */
export const layoutTypeDescriptionMap: Record<LayoutType, TranslationKey> = {
  page: 'designs.layouts.page.description',
  card: 'designs.layouts.card.description',
  list: 'designs.layouts.list.description',
  space: 'designs.layouts.space.description',
};

/**
 * The i18n key of each layout type's bare name, used as the default
 * layout name and as the label of a layout's root tree node.
 */
export const layoutTypeNameMap: Record<LayoutType, TranslationKey> = {
  page: 'designs.layouts.page.name',
  card: 'designs.layouts.card.name',
  list: 'designs.layouts.list.name',
  space: 'designs.layouts.space.name',
};

/**
 * The i18n key of each property type's name. The keys are irregular,
 * so they are listed rather than derived.
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
};

/**
 * The icon representing the design studio, shared by every
 * surface opening it.
 */
export const DesignStudioIcon: UiIconName = 'pencil-ruler';

export const DesignStudioViewName = 'designs:view:studio-next';
export const DesignStudioViewId = 'designs:studio-next';

// The studio view's title while no design is open
export const DesignStudioViewTitle =
  'designsStudio.title' satisfies TranslationKey;
