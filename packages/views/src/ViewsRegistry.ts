import { createRegistry } from '@minddrop/stores';
import { View } from './types';

export const ViewsRegistry = createRegistry<View>('Views:Registered', 'type', {
  label: 'view',
});
