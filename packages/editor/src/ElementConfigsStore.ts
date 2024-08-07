import { createItemStore } from '@minddrop/core';
import { EditorBlockElementConfig, EditorInlineElementConfig } from './types';

export const ElementConfigsStore = createItemStore<
  (EditorBlockElementConfig<any> | EditorInlineElementConfig<any>) & {
    id: string;
  }
>();
