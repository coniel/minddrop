import type PouchDB from 'pouchdb';

export interface DBResourceDocument {
  _id: string;
  _rev?: string;
  _deleted?: boolean;
  resourceType: string;
}

export interface ResourceDocument {
  id: string;
}

export type ResourceDB = PouchDB.Database<DBResourceDocument>;

export type GroupedResources = Record<string, ResourceDocument[]>;
