import { describe, expect, it } from 'vitest';
import { DesignRoleConfig } from '../../types';
import { resolveRoleStyle } from './resolveRoleStyle';

// A context-adapting role with a size axis restricted away from
// list layouts
const role: DesignRoleConfig = {
  id: 'role',
  elementType: 'text',
  label: 'designs.roles.title.label',
  icon: 'type',
  lockedStyle: { color: 'regular' },
  contextStyles: {
    card: { fontWeight: 'semibold' },
    list: { fontWeight: 'medium', truncate: 1 },
  },
  variants: [
    {
      id: 'size',
      label: 'designs.roleVariantAxes.size',
      layoutTypes: ['card', 'page'],
      defaultOption: 'md',
      options: [
        {
          id: 'md',
          label: 'designs.roleVariants.md',
          contextStyles: {
            card: { fontSize: 'md' },
            page: { fontSize: '4xl' },
          },
        },
        {
          id: 'lg',
          label: 'designs.roleVariants.lg',
          style: { italic: true },
          contextStyles: {
            card: { fontSize: 'xl' },
            page: { fontSize: '5xl' },
          },
        },
      ],
    },
  ],
  context: {},
};

describe('resolveRoleStyle', () => {
  it('applies the layout context styles over the locked styles', () => {
    expect(resolveRoleStyle(role, undefined, 'card')).toEqual({
      color: 'regular',
      fontWeight: 'semibold',
      // The size axis applies its default option's card styles
      fontSize: 'md',
    });
  });

  it('resolves the same option differently per context', () => {
    // The medium size is a larger font on a page than on a card
    expect(resolveRoleStyle(role, undefined, 'page')).toMatchObject({
      fontSize: '4xl',
    });
  });

  it('applies the selected option of each variant axis', () => {
    expect(resolveRoleStyle(role, { size: 'lg' }, 'card')).toMatchObject({
      // The option's context-independent styles apply alongside
      // its context styles
      italic: true,
      fontSize: 'xl',
    });
  });

  it('falls back to the axis default for unknown option IDs', () => {
    expect(resolveRoleStyle(role, { size: 'unknown' }, 'card')).toMatchObject({
      fontSize: 'md',
    });
  });

  it('skips axes restricted away from the layout type', () => {
    // The size axis is not offered on lists, so no option applies
    expect(resolveRoleStyle(role, { size: 'lg' }, 'list')).toEqual({
      color: 'regular',
      fontWeight: 'medium',
      truncate: 1,
    });
  });

  it('applies only context-independent styles without a layout type', () => {
    expect(resolveRoleStyle(role, { size: 'lg' })).toEqual({
      color: 'regular',
      italic: true,
    });
  });
});
