import { DesignRoleConfig } from '../types';

/**
 * The page's main title. Auto-binds to the entry title.
 * Offered in three sizes; medium is the default.
 */
export const PageTitleRole: DesignRoleConfig = {
  id: 'page-title',
  elementType: 'text',
  label: 'designs.roles.page-title.label',
  icon: 'heading',
  lockedStyle: {
    fontWeight: 'bold',
    lineHeight: 'tight',
    color: 'regular',
  },
  variants: [
    {
      id: 'size',
      label: 'designs.roleVariantAxes.size',
      defaultOption: 'md',
      options: [
        {
          id: 'sm',
          label: 'designs.roleVariants.sm',
          style: { fontSize: '2xl' },
        },
        {
          id: 'md',
          label: 'designs.roleVariants.md',
          style: { fontSize: '4xl' },
        },
        {
          id: 'lg',
          label: 'designs.roleVariants.lg',
          style: { fontSize: '5xl' },
        },
      ],
    },
  ],
  bindsPropertyTypes: ['title'],
  context: { layoutTypes: ['page', 'space'] },
};
