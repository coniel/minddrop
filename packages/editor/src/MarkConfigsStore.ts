import { createItemStore } from '@minddrop/core';
import { MarkConfig } from './types';

export const MarkConfigsStore = createItemStore<MarkConfig & { id: string }>();
