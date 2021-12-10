export interface DBResourceDocument {
  _id: string;
  _rev?: string;
  _deleted?: boolean;
  resourceType: string;
}

export interface ResourceDocument {
  id: string;
}
