import { Resources, RDDataSchema } from '@minddrop/resources';
import { BaseLocalPersistentStoreData } from './types';

const dataSchema: RDDataSchema<BaseLocalPersistentStoreData> = {
  app: {
    type: 'string',
    required: true,
    allowEmpty: false,
    static: true,
  },
  extension: {
    type: 'string',
    required: true,
    allowEmpty: false,
    static: true,
  },
};

export const LocalStoreResource =
  Resources.createTyped<BaseLocalPersistentStoreData>({
    resource: 'persistent-stores:local',
    dataSchema,
    onCreate: (core, document) => ({
      ...document,
      app: core.appId,
      extension: core.extensionId,
    }),
  });
