import { DBApi } from '@minddrop/pouchdb';

export declare global {
  interface Window {
    db: DBApi;

    files: {
      getAttachmentsPath(): string;
      create(file: File, id: string): void;
      get(id: string): Promise<string>;
    };
  }
}
