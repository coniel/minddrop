import { Resources, RDDataSchema } from '@minddrop/resources';
import {
  ExtensionDocumentData,
  CreateExtensionDocumentData,
  UpdateExtensionDocumentData,
} from './types';

const dataSchema: RDDataSchema<ExtensionDocumentData> = {
  extension: {
    type: 'string',
    required: true,
    allowEmpty: false,
  },
  enabled: {
    type: 'boolean',
    required: true,
  },
  topics: {
    type: 'resource-ids',
    resource: 'topics:topic',
    required: true,
  },
};

export const ExtensionsResource = Resources.create<
  ExtensionDocumentData,
  CreateExtensionDocumentData,
  UpdateExtensionDocumentData
>({
  resource: 'extensions:document',
  dataSchema,
  defaultData: {
    enabled: true,
    topics: [],
  },
});
