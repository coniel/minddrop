import { createRegistry } from '@minddrop/stores';
import {
  ContentViewTypeRegisteredEvent,
  ContentViewTypeUnregisteredEvent,
} from '../events';
import { ContentViewType } from '../types';

export const ContentViewTypesRegistry = createRegistry<ContentViewType>(
  'Views:ContentViewTypes',
  'type',
  {
    label: 'content view type',
    events: {
      registered: ContentViewTypeRegisteredEvent,
      unregistered: ContentViewTypeUnregisteredEvent,
    },
  },
);
