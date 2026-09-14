import React from 'react';
import { DataView, DataViewTypes, DataViews } from '@minddrop/data-views';
import { PropertyFilter } from '@minddrop/filters';
import { FilterMenu, FilterMenuProps } from '@minddrop/ui-filters';
import { useDataViewFilterProperties } from '../useDataViewFilterProperties';

export interface DataViewFilterMenuProps
  extends Pick<FilterMenuProps, 'size' | 'variant' | 'color' | 'onOpenChange'> {
  /**
   * The data view for which to render the filter menu.
   */
  view: DataView;
}

// Stable empty list used when the view has no filters
const NO_FILTERS: PropertyFilter[] = [];

/**
 * Renders the filter menu for a data view's filters. Renders
 * nothing when the view type is not filterable.
 */
export const DataViewFilterMenu: React.FC<DataViewFilterMenuProps> = ({
  view,
  ...other
}) => {
  const viewType = DataViewTypes.use(view.type);
  const properties = useDataViewFilterProperties(view);

  // Persist the changed filters
  function handleFiltersChange(filters: PropertyFilter[]): void {
    DataViews.updateOptions(view.id, { filters });
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
