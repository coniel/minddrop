import { useMemo } from 'react';
import { ContentViewTypesRegistry } from '../ContentViewTypesRegistry';
import { ContentViewType, ViewDataSourceType } from '../types';

/**
 * Returns the registered content view types supporting at least one
 * of the given data sources, in registration order. Returns every
 * registered type when no data sources are given.
 *
 * @param dataSources - The data source types.
 * @returns The content view types.
 */
export function useContentViewTypesForDataSources(
  dataSources?: ViewDataSourceType[],
): ContentViewType[] {
  // Subscribe to the registered view types
  const viewTypes = ContentViewTypesRegistry.useAll();

  // Keep the view types supporting one of the data sources
  return useMemo(() => {
    // No data sources, every view type qualifies
    if (!dataSources) {
      return viewTypes;
    }

    return viewTypes.filter((viewType) =>
      dataSources.some((dataSource) =>
        viewType.supportedDataSources.includes(dataSource),
      ),
    );
  }, [viewTypes, dataSources]);
}
