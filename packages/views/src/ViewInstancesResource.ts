import { Resources, RDDataSchema } from '@minddrop/resources';
import { BaseViewInstanceData } from './types';

const dataSchema: RDDataSchema<BaseViewInstanceData> = {
  extension: {
    type: 'string',
    required: true,
    allowEmpty: false,
  },
};

export const ViewInstancesResource =
  Resources.createTyped<BaseViewInstanceData>({
    resource: 'views:view-instance',
    dataSchema,
  });
