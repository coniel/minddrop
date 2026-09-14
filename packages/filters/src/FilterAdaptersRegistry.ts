import { createRegistry } from '@minddrop/stores';
import { FilterAdapter } from './types';

// The filter adapters, keyed by entity type
export const FilterAdaptersRegistry = createRegistry<FilterAdapter>(
  'Filters:Adapters',
  'type',
  {
    label: 'filter adapter',
  },
);
