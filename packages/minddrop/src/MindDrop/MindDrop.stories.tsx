import {
  DBResourceDocument,
  initializePouchdb,
  ResourceDB,
} from '@minddrop/pouchdb';
import TextDropExtension from '@minddrop/text-drop';
import React from 'react';
import { MindDrop } from './MindDrop';

export default {
  title: 'minddrop/MindDrop',
  component: MindDrop,
};

const database: Record<string, DBResourceDocument> = {};

const dbApi: ResourceDB = {
  // @ts-ignore
  allDocs: async () => ({
    rows: Object.values(database).map((doc) => ({ doc })),
  }),
  // @ts-ignore
  put: async (doc: DBResourceDocument) => {
    // eslint-disable-next-line no-underscore-dangle
    database[doc._id] = doc;
  },
  // @ts-ignore
  get: async (id: string) => database[id],
};

const api = initializePouchdb(dbApi);

console.log(TextDropExtension);
export const App: React.FC = () => {
  return (
    <div
      style={{ height: '100%', width: '100%', marginTop: -16, marginLeft: -16 }}
    >
      <MindDrop appId="app" extensions={[TextDropExtension]} dbApi={api} />
    </div>
  );
};
