import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ContentRole, HeadingRole, LabelRole } from '../roles';
import { cleanup, setup } from '../test-utils';
import { getCompatibleDesignRoles } from './getCompatibleDesignRoles';

describe('getCompatibleDesignRoles', () => {
  beforeEach(setup);
  afterEach(cleanup);

  it('filters by layout type', () => {
    const roles = getCompatibleDesignRoles({
      designType: 'database',
      layoutType: 'list',
    });

    // The content roles restrict themselves away from list layouts
    expect(roles).not.toContain(ContentRole);
    expect(roles).toContain(HeadingRole);
    expect(roles).toContain(LabelRole);
  });

  it('offers unrestricted roles in every context', () => {
    const roles = getCompatibleDesignRoles({
      designType: 'space',
      layoutType: 'space',
    });

    // The heading role restricts no context axis
    expect(roles).toContain(HeadingRole);
  });

  it('does not exclude on unset filter axes', () => {
    // A filter with only a layout type must not exclude roles
    // restricted on other axes
    const roles = getCompatibleDesignRoles({ layoutType: 'page' });

    expect(roles).toContain(ContentRole);
  });

  it('excludes roles restricted to a parent role when none is given', () => {
    // No built-in role restricts by parent role, so all page roles
    // remain when no parent role is set
    const roles = getCompatibleDesignRoles({
      designType: 'database',
      layoutType: 'page',
    });

    expect(roles).toContain(HeadingRole);
  });
});
