import { createItemStore } from '@minddrop/core';
import { ElementConfig } from './types';

export const ElementConfigsStore = createItemStore<
  ElementConfig<any> & { id: string }
>();
