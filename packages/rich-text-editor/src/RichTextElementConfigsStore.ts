import { createItemStore } from '@minddrop/core';
import { RichTextElementConfig } from './types';

export const RichTextElementConfigsStore = createItemStore<
  RichTextElementConfig<any> & { id: string }
>();
