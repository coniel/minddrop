import { DesignRoleConfig } from '../types';

/**
 * A small caption naming the content beside or below it, such as a
 * field name above its value. Muted by default so the named
 * content stays the focus.
 */
export const LabelRole: DesignRoleConfig = {
  id: 'label',
  elementType: 'text',
  label: 'designs.roles.label.label',
  icon: 'tag',
  lockedStyle: {
    fontSize: 'xs',
    fontWeight: 'medium',
    lineHeight: 'snug',
    color: 'subtle',
  },
  contextStyles: {
    // Single-line list rows keep labels on one line
    list: { truncate: 1 },
  },
  variants: [
    {
      id: 'colour',
      label: 'designs.roleVariantAxes.colour',
      defaultOption: 'default',
      options: [
        {
          id: 'default',
          label: 'designs.roleVariants.default',
        },
        {
          id: 'regular',
          label: 'designs.roleVariants.regular',
          style: { color: 'regular' },
        },
        {
          id: 'accent',
          label: 'designs.roleVariants.accent',
          style: { color: 'solid' },
        },
      ],
    },
  ],
  editableStyles: [
    'textAlign',
    'textTransform',
    'truncate',
    'marginTop',
    'marginRight',
    'marginBottom',
    'marginLeft',
  ],
  context: {},
};
