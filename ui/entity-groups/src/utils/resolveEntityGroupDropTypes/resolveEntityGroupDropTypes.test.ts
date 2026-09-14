import { describe, expect, it } from 'vitest';
import { EntityGroupFixtures } from '@minddrop/entity-groups/test-utils';
import { resolveEntityGroupSourceTypeKey } from '../resolveEntityGroupSourceTypeKey';
import { resolveEntityGroupDropTypes } from './resolveEntityGroupDropTypes';

const { groupTypeConfig_exclusive, groupTypeConfig_multi } =
  EntityGroupFixtures;

describe('resolveEntityGroupDropTypes', () => {
  it('accepts any drag for a type taking items from outside its groups', () => {
    expect(resolveEntityGroupDropTypes(groupTypeConfig_multi)).toBeUndefined();
  });

  it('accepts only drags out of the type own groups otherwise', () => {
    expect(resolveEntityGroupDropTypes(groupTypeConfig_exclusive)).toEqual([
      resolveEntityGroupSourceTypeKey(groupTypeConfig_exclusive.id),
    ]);
  });
});
