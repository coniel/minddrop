import { Core } from '@minddrop/core';
import {
  ResourceDocument,
  ResourceDocumentCustomData,
} from './ResourceDocument.types';

export interface ResourceApi<
  TData extends ResourceDocumentCustomData,
  TCreateData extends Partial<TData> & ResourceDocumentCustomData,
  TUpdateData extends Partial<TData> & ResourceDocumentCustomData,
> {
  // Setters
  create(core: Core, data: TCreateData): ResourceDocument<TData>;
  update(
    core: Core,
    documentId: string,
    data: TUpdateData,
  ): ResourceDocument<TData>;
  delete(core: Core, documentId: string): ResourceDocument<TData>;
  restore(core: Core, documentId: string): ResourceDocument<TData>;
  deletePermanently(core: Core, documentId: string): ResourceDocument<TData>;
  // Getters
  get(documentId: string): ResourceDocument<TData>;
  get(documentIds: string[]): Record<string, ResourceDocument<TData>>;
  getAll(): Record<string, ResourceDocument<TData>>;
  store: {
    get(documentId: string): ResourceDocument<TData>;
    get(documentIds: string[]): Record<string, ResourceDocument<TData>>;
    getAll(): Record<string, ResourceDocument<TData>>;
    add(core: Core, document: ResourceDocument<TData>): void;
    set(core: Core, document: ResourceDocument<TData>): void;
    remove(core: Core, documentId: string): void;
    load(core: Core, documents: ResourceDocument<TData>[]): void;
    clear(): void;
  };
}
