import { Resources, RDDataSchema } from '@minddrop/resources';
import { BaseGlobalPersistentStoreData } from './types';

const dataSchema: RDDataSchema<BaseGlobalPersistentStoreData> = {
  extension: {
    type: 'string',
    required: true,
    allowEmpty: false,
    static: true,
  },
};

export const GlobalStoreResource =
  Resources.createTyped<BaseGlobalPersistentStoreData>({
    resource: 'persistent-stores:global',
    dataSchema,
    onCreate: (core, document) => ({
      ...document,
      extension: core.extensionId,
    }),
  });
