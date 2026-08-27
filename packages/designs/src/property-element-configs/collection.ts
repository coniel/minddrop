import { DataViewTypes } from '@minddrop/data-views';
import { PropertyElementConfig } from '../types';

/**
 * The collection property element. Renders the bound collection
 * property's view as an embedded data view; the presentation
 * variants are the view types the view can render as, derived
 * live from the registered data view types supporting collection
 * data sources.
 */
export const CollectionPropertyElementConfig: PropertyElementConfig = {
  propertyType: 'collection',
  label: 'properties.collection.name',
  icon: 'app-window',
  bindsPropertyTypes: ['collection'],
  defaultVariant: 'gallery',
  context: { designTypes: ['database'], layoutTypes: ['page'] },
  get variants() {
    // One variant per registered view type able to render a
    // collection, so new view types join the vocabulary on
    // registration
    return DataViewTypes.getAll()
      .filter((viewType) =>
        viewType.supportedDataSources.includes('collection'),
      )
      .map((viewType) => ({
        id: viewType.type,
        label: viewType.name,
        description: viewType.description,
        renderer: 'view',
        styleCategory: 'embed' as const,
      }));
  },
};
