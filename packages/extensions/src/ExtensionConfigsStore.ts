import { Resources } from '@minddrop/resources';
import { ExtensionConfig } from './types';

export const ExtensionConfigsStore =
  Resources.createConfigsStore<ExtensionConfig>({
    idField: 'id',
  });
