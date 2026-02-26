import React from 'react';
import { Views, ViewTypes } from '@minddrop/views';
import { StoreInspector } from './StoreInspector';

export type ViewsStateViewId = 'views' | 'view-types';

interface ViewsStateViewProps {
  stateView: ViewsStateViewId;
}

export function useViewsStoreCounts() {
  const views = Views.useAll();
  const viewTypes = ViewTypes.useAll();

  return {
    views: views.length,
    'view-types': viewTypes.length,
  };
}

export const ViewsStateView: React.FC<ViewsStateViewProps> = ({ stateView }) => {
  const views = Views.useAll();
  const viewTypes = ViewTypes.useAll();

  if (stateView === 'views') {
    return (
      <StoreInspector
        title="Views"
        items={views}
        getLabel={(view) => view.name}
        getId={(view) => view.id}
      />
    );
  }

  if (stateView === 'view-types') {
    return (
      <StoreInspector
        title="View Types"
        items={viewTypes}
        getLabel={(viewType) => viewType.name}
        getId={(viewType) => viewType.type}
      />
    );
  }

  return null;
};
