import { Resources, RDDataSchema } from '@minddrop/resources';
import { FileReferenceData } from './types';

const dataSchema: RDDataSchema<FileReferenceData> = {
  name: {
    type: 'string',
    required: true,
    allowEmpty: false,
  },
  size: {
    type: 'number',
    required: true,
    min: 1,
  },
  type: {
    type: 'string',
    required: true,
    allowEmpty: false,
  },
  url: {
    type: 'string',
    required: false,
    allowEmpty: false,
  },
  dimensions: {
    type: 'object',
    required: false,
    schema: {
      width: {
        type: 'number',
        required: true,
        min: 1,
      },
      height: {
        type: 'number',
        required: true,
        min: 1,
      },
      aspectRatio: {
        type: 'number',
        required: true,
      },
    },
  },
};

export const FileReferencesResource = Resources.create({
  resource: 'files:file-reference',
  dataSchema,
});
