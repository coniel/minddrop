import { DesignRoleConfig } from '../types';

/**
 * The card's primary heading. Auto-binds to the entry title.
 * Offered in three sizes; medium is the default.
 */
export const CardTitleRole: DesignRoleConfig = {
  id: 'card-title',
  elementType: 'text',
  label: 'designs.roles.card-title.label',
  icon: 'heading',
  lockedStyle: {
    fontWeight: 'semibold',
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
          style: { fontSize: 'base' },
        },
        {
          id: 'md',
          label: 'designs.roleVariants.md',
          style: { fontSize: 'md' },
        },
        {
          id: 'lg',
          label: 'designs.roleVariants.lg',
          style: { fontSize: 'xl' },
        },
      ],
    },
  ],
  bindsPropertyTypes: ['title'],
  context: { designTypes: ['database'], layoutTypes: ['card'] },
};
