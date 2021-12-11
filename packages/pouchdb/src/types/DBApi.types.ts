import { GroupedResources, ResourceDocument } from './DBResource.types';

export interface DBApi {
  getAllDocs(): Promise<GroupedResources>;

  add<T extends ResourceDocument>(type: string, document: T): Promise<void>;

  update<T extends ResourceDocument>(
    id: string,
    changes: Partial<T>,
  ): Promise<void>;

  delete(id: string): Promise<void>;
}

export type ResourceChangeHandler = (
  resourceType: string,
  document: ResourceDocument,
  deleted: boolean,
) => void;
