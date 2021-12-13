import { GroupedResources, ResourceDocument } from './DBResource.types';

export interface DBApi {
  getAllDocs(): Promise<GroupedResources>;

  add<T extends ResourceDocument>(type: string, document: T): void;

  update<T extends ResourceDocument>(id: string, changes: Partial<T>): void;

  delete(id: string): void;
}

export type ResourceChangeHandler = (
  resourceType: string,
  document: ResourceDocument,
  deleted: boolean,
) => void;
