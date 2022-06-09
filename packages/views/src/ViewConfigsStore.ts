import { Resources } from '@minddrop/resources';
import { ViewConfig } from './types';

export const ViewConfigsStore = Resources.createConfigsStore<ViewConfig>({
  idField: 'id',
});
