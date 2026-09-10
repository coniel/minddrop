import { createRegistry } from '@minddrop/stores';
import { EntityGroupTypeConfig } from './types';

/**
 * The registered group type configs, keyed by type ID.
 */
export const EntityGroupTypesRegistry = createRegistry<EntityGroupTypeConfig>(
  'EntityGroups:Types',
  'id',
  { label: 'entity group type' },
);
