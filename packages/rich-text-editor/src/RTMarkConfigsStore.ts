import { Resources } from '@minddrop/resources';
import { RTMarkConfig } from './types';

export const RTMarkConfigsStore = Resources.createConfigsStore<RTMarkConfig>({
  idField: 'key',
});
