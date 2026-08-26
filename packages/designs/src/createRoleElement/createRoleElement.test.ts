import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { DesignRoleNotRegisteredError } from '../errors';
import { HeadingRole, PageContentRole } from '../roles';
import { cleanup, setup } from '../test-utils';
import { createRoleElement } from './createRoleElement';

describe('createRoleElement', () => {
  beforeEach(setup);
  afterEach(cleanup);

  it('creates an element of the role base type carrying the role ID', () => {
    const element = createRoleElement(HeadingRole.id);

    expect(element.type).toBe('text');
    expect(element.role).toBe(HeadingRole.id);
  });

  it('creates the element unbound', () => {
    // Role elements render static content, so they never bind a
    // property on creation
    const element = createRoleElement(PageContentRole.id);

    expect(element.property).toBeUndefined();
  });

  it('throws when the role is not registered', () => {
    expect(() => createRoleElement('unknown')).toThrow(
      DesignRoleNotRegisteredError,
    );
  });
});
