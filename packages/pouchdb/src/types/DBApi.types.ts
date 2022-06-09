import { ResourceDocument, RDData } from '@minddrop/resources';

export interface DBApi {
  getAll(): Promise<ResourceDocument[]>;

  add<TData extends RDData = {}>(document: ResourceDocument<TData>): void;

  update<TData extends RDData = {}>(document: ResourceDocument<TData>): void;

  delete(id: string): void;
}
