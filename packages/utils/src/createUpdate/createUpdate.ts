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
): Update<R, C & WithUpdatedAt> {
  const before = { ...object };
  const changes: C & WithUpdatedAt = { ...data, updatedAt: new Date() };
  const after = applyFieldValues(object, changes);

  return { before, after, changes };
}
