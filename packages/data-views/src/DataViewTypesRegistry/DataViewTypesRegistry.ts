import { createRegistry } from '@minddrop/stores';
import {
  DataViewTypeRegisteredEvent,
  DataViewTypeUnregisteredEvent,
} from '../events';
import { DataViewType } from '../types';

export const DataViewTypesRegistry = createRegistry<DataViewType>(
  'Views:DataViewTypes',
  'type',
  {
    label: 'data view type',
    events: {
      registered: DataViewTypeRegisteredEvent,
      unregistered: DataViewTypeUnregisteredEvent,
    },
  },
);
