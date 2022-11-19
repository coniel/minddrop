import React from 'react';
import TextDropExtension from '@minddrop/text-drop';
import {
  ResourceDocument,
  ResourceStorageAdapterConfig,
} from '@minddrop/resources';
import { MindDrop } from './MindDrop';

export default {
  title: 'minddrop/MindDrop',
  component: MindDrop,
};

const database: Record<string, ResourceDocument> = {};

const storageAdapter: ResourceStorageAdapterConfig = {
  id: 'test',
  getAll: async () => Object.values(database),
  create: async (doc) => {
    database[doc.id] = doc;
  },
  update: async (id, update) => {
    database[id] = update.after;
  },
  delete: async (doc) => {
    delete database[doc.id];
  },
};

export const App: React.FC = () => (
  <div
    style={{ height: '100%', width: '100%', marginTop: -16, marginLeft: -16 }}
  >
    <MindDrop
      appId="app"
      extensions={[TextDropExtension]}
      resourceStorageAdapter={storageAdapter}
    />
  </div>
);
