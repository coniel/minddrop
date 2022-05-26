import { Resources, RDDataSchema } from '@minddrop/resources';
import { BaseViewInstanceData } from './types';

const dataSchema: RDDataSchema<BaseViewInstanceData> = {
  view: {
    type: 'string',
    required: true,
    allowEmpty: false,
  },
};

export const ViewInstancesResource = Resources.createTyped({
  resource: 'views:view',
  dataSchema,
});
