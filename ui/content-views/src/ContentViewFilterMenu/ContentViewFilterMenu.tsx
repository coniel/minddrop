import React from 'react';
import {
  ContentView,
  ContentViewTypes,
  ContentViews,
} from '@minddrop/content-views';
import { PropertyFilter } from '@minddrop/filters';
import { FilterMenu, FilterMenuProps } from '@minddrop/ui-filters';
import { useContentViewFilterProperties } from '../useContentViewFilterProperties';

export interface ContentViewFilterMenuProps
  extends Pick<FilterMenuProps, 'size' | 'variant' | 'color' | 'onOpenChange'> {
  /**
   * The content view for which to render the filter menu.
   */
  view: ContentView;
}

// Stable empty list used when the view has no filters
const NO_FILTERS: PropertyFilter[] = [];

/**
 * Renders the filter menu for a content view's filters. Renders
 * nothing when the view type is not filterable.
 */
export const ContentViewFilterMenu: React.FC<ContentViewFilterMenuProps> = ({
  view,
  ...other
}) => {
  const viewType = ContentViewTypes.use(view.type);
  const properties = useContentViewFilterProperties(view);

  // Persist the changed filters
  function handleFiltersChange(filters: PropertyFilter[]): void {
    ContentViews.updateOptions(view.id, { filters });
  }

  // Render nothing for view types which are not filterable
  if (!viewType?.filterable) {
    return null;
  }

  return (
    <FilterMenu
      filters={view.options?.filters ?? NO_FILTERS}
      onFiltersChange={handleFiltersChange}
      properties={properties}
      {...other}
    />
  );
};
