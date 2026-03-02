import { createObjectStore } from '@minddrop/utils';
import { MarkConfig } from './types';

export const MarkConfigsStore = createObjectStore<MarkConfig>('key');
