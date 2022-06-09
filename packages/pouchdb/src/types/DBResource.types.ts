import type PouchDB from 'pouchdb';
import { ResourceDocument } from '@minddrop/resources';

export interface DBResourceDocument extends ResourceDocument {
  _id: string;
  _rev?: string;
  _deleted?: boolean;
  resource: string;
}

export type ResourceDB = PouchDB.Database<DBResourceDocument>;

export type GroupedResources = Record<string, ResourceDocument[]>;
