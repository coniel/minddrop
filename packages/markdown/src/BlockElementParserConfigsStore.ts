import { createItemStore } from '@minddrop/core';
import { BlockElementParserConfig } from './types';

export const BlockElementParserConfigsStore = createItemStore<
  BlockElementParserConfig & { id: string }
>();
