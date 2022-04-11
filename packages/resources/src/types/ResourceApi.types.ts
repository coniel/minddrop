import { Core } from '@minddrop/core';
import { ResourceDocument } from './ResourceDocument.types';

export interface ResourceApi<TData, TCreateData, TUpdateData> {
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
  // Testing
  load(core: Core, documents: ResourceDocument<TData>[]): void;
  clear(): void;
}
