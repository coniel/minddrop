import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DesignRoleNotRegisteredError } from '../errors';
import { HeadingRole } from '../roles';
import { cleanup, setup } from '../test-utils';
import { getDesignRole } from './getDesignRole';

describe('getDesignRole', () => {
  beforeEach(setup);
  afterEach(cleanup);

  it('returns the registered role', () => {
    expect(getDesignRole(HeadingRole.id)).toEqual(HeadingRole);
  });

  it('throws when the role is not registered', () => {
    expect(() => getDesignRole('unknown')).toThrow(
      DesignRoleNotRegisteredError,
    );
  });
});
