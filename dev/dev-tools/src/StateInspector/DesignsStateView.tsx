import React from 'react';
import { Designs } from '@minddrop/designs';
import { StoreInspector } from './StoreInspector';

export function useDesignsStoreCounts() {
  const designs = Designs.useAll();

  return {
    designs: designs.length,
  };
}

export const DesignsStateView: React.FC = () => {
  const designs = Designs.useAll();

  return (
    <StoreInspector
      title="Designs"
      items={designs}
      getLabel={(design) => design.name}
      getId={(design) => design.id}
    />
  );
};
