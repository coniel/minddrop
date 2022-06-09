import { ResourceStorageAdapterConfig } from '@minddrop/resources';

export declare global {
  interface Window {
    resourceStorageAdapter: ResourceStorageAdapterConfig;

    files: {
      getAttachmentsPath(): string;
      create(file: File, id: string): void;
      get(id: string): Promise<string>;
    };
  }
}
