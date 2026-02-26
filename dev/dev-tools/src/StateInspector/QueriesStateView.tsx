import React from 'react';
import { Queries } from '@minddrop/queries';
import { StoreInspector } from './StoreInspector';

export function useQueriesStoreCounts() {
  const queries = Queries.useAll();

  return {
    queries: queries.length,
  };
}

export const QueriesStateView: React.FC = () => {
  const queries = Queries.useAll();

  return (
    <StoreInspector
      title="Queries"
      items={queries}
      getLabel={(query) => query.name}
      getId={(query) => query.id}
    />
  );
};
