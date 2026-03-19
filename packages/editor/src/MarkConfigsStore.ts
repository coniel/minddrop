import { createObjectStore } from '@minddrop/stores';
import { MarkConfig } from './types';

export const MarkConfigsStore = createObjectStore<MarkConfig>(
  'Editor:MarkConfigs',
  'key',
);
