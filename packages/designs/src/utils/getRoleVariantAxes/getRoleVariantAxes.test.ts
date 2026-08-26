import { describe, expect, it } from 'vitest';
import { DesignRoleConfig, DesignRoleVariantAxis } from '../../types';
import { getRoleVariantAxes } from './getRoleVariantAxes';

// An unrestricted axis and one restricted to card layouts
const intentAxis: DesignRoleVariantAxis = {
  id: 'intent',
  label: 'designs.roleVariantAxes.size',
  defaultOption: 'neutral',
  options: [],
};

const sizeAxis: DesignRoleVariantAxis = {
  id: 'size',
  label: 'designs.roleVariantAxes.size',
  layoutTypes: ['card'],
  defaultOption: 'md',
  options: [],
};

const role: DesignRoleConfig = {
  id: 'role',
  elementType: 'text',
  label: 'designs.roles.heading.label',
  icon: 'type',
  lockedStyle: {},
  variants: [intentAxis, sizeAxis],
  context: {},
};

describe('getRoleVariantAxes', () => {
  it('keeps axes offered in the layout type', () => {
    expect(getRoleVariantAxes(role, 'card')).toEqual([intentAxis, sizeAxis]);
  });

  it('excludes axes restricted away from the layout type', () => {
    expect(getRoleVariantAxes(role, 'list')).toEqual([intentAxis]);
  });

  it('excludes nothing without a layout type', () => {
    expect(getRoleVariantAxes(role)).toEqual([intentAxis, sizeAxis]);
  });

  it('returns no axes for roles without variants', () => {
    expect(
      getRoleVariantAxes({ ...role, variants: undefined }, 'card'),
    ).toEqual([]);
  });
});
