import { applyFieldValues } from '../applyFieldValues';

export interface Update<Resource, Changes> {
  before: Resource;
  after: Resource;
  changes: Changes;
}

type WithUpdatedAt = {
  updatedAt: Date;
};

export function createUpdate<C extends object, R extends object>(
  object: R,
  data: C,
  setUpdatedAt?: boolean,
): Update<R, C | (C & WithUpdatedAt)> {
  const before = { ...object };
  const changes: C | (C & WithUpdatedAt) = setUpdatedAt
    ? { ...data, updatedAt: new Date() }
    : data;
  const after = applyFieldValues(object, changes);

  return { before, after, changes };
}
