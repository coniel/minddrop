import { createItemStore } from '@minddrop/core';
import { RichTextMarkConfig } from './types';

export const RichTextMarkConfigsStore = createItemStore<
  RichTextMarkConfig & { id: string }
>();
