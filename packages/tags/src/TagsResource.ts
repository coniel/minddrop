import { RDDataSchema, Resources } from '@minddrop/resources';
import { TagData } from './types';

const dataSchema: RDDataSchema<TagData> = {
  label: {
    type: 'string',
    required: true,
    allowEmpty: true,
  },
  color: {
    type: 'content-color',
    required: true,
  },
};

export const TagsResource = Resources.create({
  resource: 'tags:tag',
  dataSchema,
  defaultData: {
    color: 'blue',
  },
});
