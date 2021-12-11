import { DBApi } from '@minddrop/pouchdb';

export declare global {
  interface Window {
    db: DBApi;
  }
}
