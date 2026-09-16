import { describe, expect, it } from 'vitest';
import { EntityGroups } from '@minddrop/entity-groups';
import { resolveEntityGroupNameError } from './resolveEntityGroupNameError';

describe('resolveEntityGroupNameError', () => {
  it('reports a name another group already has', () => {
    expect(
      resolveEntityGroupNameError(
        new EntityGroups.errors.DuplicateName('My group'),
      ),
    ).toBe('entityGroups.name.taken');
  });

  it('rethrows an error the field cannot report', () => {
    const error = new Error('something else');

    expect(() => resolveEntityGroupNameError(error)).toThrow(error);
  });
});
