import { DesignElementConfig, Designs } from '@minddrop/designs-next';
import { CollectionElement } from './CollectionElement.types';
import { CollectionElementRenderer } from './CollectionElementRenderer';
import { CollectionViewTypeMenu } from './CollectionViewTypeMenu';

export const CollectionElementType = 'collection';

// The height a new collection element takes, in grid units
const DefaultRowSpan = 64;

/**
 * Config for the collection element. It embeds a content view
 * containing the entries of the collection property it maps to. Not
 * listed on the grid palette: a content view takes a page's height
 * rather than a block's.
 */
export const CollectionElementConfig: DesignElementConfig<CollectionElement> = {
  type: CollectionElementType,
  label: 'databases.elements.collection.label',
  icon: 'app-window',
  propertyTypes: ['collection'],
  component: CollectionElementRenderer,
  defaultColumnSpan: Designs.constants.TypeColumns.card,
  defaultRowSpan: DefaultRowSpan,
  // Fix the block's height, as the view scrolls inside it
  defaultContentFit: 'fixed',
  settingControls: [CollectionViewTypeMenu, 'background', 'corner-radius'],
};
