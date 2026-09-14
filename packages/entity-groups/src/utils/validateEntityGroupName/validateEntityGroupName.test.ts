import { describe, expect, it } from 'vitest';
import { InvalidParameterError } from '@minddrop/utils';
import { DuplicateEntityGroupNameError } from '../../errors';
import { EntityGroupFixtures } from '../../test-utils';
import { validateEntityGroupName } from './validateEntityGroupName';

const { entityGroup_exclusive_1, exclusiveGroups } = EntityGroupFixtures;

describe('validateEntityGroupName', () => {
  it('returns the name trimmed', () => {
    expect(validateEntityGroupName('  My group  ', exclusiveGroups)).toBe(
      'My group',
    );
  });

  it('throws for an empty name', () => {
    expect(() => validateEntityGroupName('   ', exclusiveGroups)).toThrow(
      InvalidParameterError,
    );
  });

  it('throws for a name another group has', () => {
    expect(() =>
      validateEntityGroupName(entityGroup_exclusive_1.name, exclusiveGroups),
    ).toThrow(DuplicateEntityGroupNameError);
  });

  it('compares names ignoring case', () => {
    expect(() =>
      validateEntityGroupName(
        entityGroup_exclusive_1.name.toUpperCase(),
        exclusiveGroups,
      ),
    ).toThrow(DuplicateEntityGroupNameError);
  });

  it('lets a group keep its own name', () => {
    expect(
      validateEntityGroupName(
        entityGroup_exclusive_1.name,
        exclusiveGroups,
        entityGroup_exclusive_1.id,
      ),
    ).toBe(entityGroup_exclusive_1.name);
  });
});
