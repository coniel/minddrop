import { Resources, RDDataSchema } from '@minddrop/resources';
import {
  RTDocumentData,
  CreateRTDocumentData,
  UpdateRTDocumentData,
} from './types';

const dataSchema: RDDataSchema<RTDocumentData> = {
  children: {
    type: 'resource-ids',
    resource: 'rich-text:element',
    addAsParent: true,
    required: true,
  },
};

export const RTDocumentsResource = Resources.create<
  RTDocumentData,
  CreateRTDocumentData,
  UpdateRTDocumentData
>({
  resource: 'rich-text:document',
  dataSchema,
});
