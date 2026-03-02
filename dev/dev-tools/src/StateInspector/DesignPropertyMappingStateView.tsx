import React from 'react';
import { useDesignPropertyMappingStore } from '@minddrop/feature-designs';
import { JsonTree } from '../LogsPanel/JsonTree';

export function useDesignPropertyMappingStoreCounts() {
  const propertyMap = useDesignPropertyMappingStore(
    (state) => state.propertyMap,
  );

  return {
    'design-property-mapping': Object.keys(propertyMap).length,
  };
}

export const DesignPropertyMappingStateView: React.FC = () => {
  const databaseId = useDesignPropertyMappingStore((state) => state.databaseId);
  const designId = useDesignPropertyMappingStore((state) => state.designId);
  const view = useDesignPropertyMappingStore((state) => state.view);
  const propertyMap = useDesignPropertyMappingStore(
    (state) => state.propertyMap,
  );

  return (
    <div style={{ padding: 'var(--space-4)' }}>
      <JsonTree
        value={{
          databaseId,
          designId,
          view,
          propertyMap,
        }}
      />
    </div>
  );
};
