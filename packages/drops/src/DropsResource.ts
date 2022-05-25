import { Resources, TRDBaseDataSchema } from '@minddrop/resources';
import {
  DropBaseData,
  BaseCreateDropData,
  BaseUpdateDropData,
  DropTypeConfigOptions,
} from './types';

const DropBaseDataSchema: TRDBaseDataSchema<DropBaseData> = {
  tags: {
    type: 'resource-ids',
    resource: 'tags:tag',
  },
  color: {
    type: 'content-color',
    required: false,
  },
  duplicatedFrom: {
    type: 'resource-id',
    resource: 'drops:drop',
    required: false,
  },
};

export const DropsResource = Resources.createTyped<
  DropBaseData,
  BaseCreateDropData,
  BaseUpdateDropData,
  DropTypeConfigOptions
>({
  resource: 'drops:drop',
  dataSchema: DropBaseDataSchema,
});
