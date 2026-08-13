import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import {
  CardBodyRole,
  CardCoverRole,
  CardSubtitleRole,
  CardTitleRole,
  ListTitleRole,
  PageTitleRole,
} from '../roles';
import { cleanup, setup } from '../test-utils';
import { getCompatibleDesignRoles } from './getCompatibleDesignRoles';

describe('getCompatibleDesignRoles', () => {
  beforeEach(setup);
  afterEach(cleanup);

  it('filters by layout type', () => {
    const roles = getCompatibleDesignRoles({
      designType: 'database',
      layoutType: 'card',
    });

    // Only card roles restrict to the card layout type
    expect(roles).toEqual([
      CardTitleRole,
      CardSubtitleRole,
      CardBodyRole,
      CardCoverRole,
    ]);
  });

  it('filters by design type', () => {
    const roles = getCompatibleDesignRoles({
      designType: 'space',
      layoutType: 'list',
    });

    // List roles restrict to database designs, so a space design
    // excludes them
    expect(roles).not.toContain(ListTitleRole);
  });

  it('does not exclude on unset filter axes', () => {
    // A filter with only a layout type must not exclude roles
    // restricted by design type
    const roles = getCompatibleDesignRoles({ layoutType: 'page' });

    expect(roles).toContain(PageTitleRole);
  });

  it('excludes roles restricted to a parent role when none is given', () => {
    // No built-in role restricts by parent role, so all page roles
    // remain when no parent role is set
    const roles = getCompatibleDesignRoles({
      designType: 'database',
      layoutType: 'page',
    });

    expect(roles).toContain(PageTitleRole);
  });
});
