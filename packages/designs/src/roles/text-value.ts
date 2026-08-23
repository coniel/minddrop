import { DesignRoleConfig } from '../types';

/**
 * Renders a plain text property value, such as a name or summary.
 * Auto-binds to the first free text property. The appearance axis
 * shifts it between a short plain value, reading-length
 * description, fine-print caption and a quote.
 */
export const TextValueRole: DesignRoleConfig = {
  id: 'text-value',
  elementType: 'text',
  label: 'designs.roles.text-value.label',
  icon: 'whole-word',
  lockedStyle: {},
  contextStyles: {
    // Single-line list rows keep values compact
    list: { fontSize: 'sm', truncate: 1 },
  },
  variants: [
    {
      id: 'appearance',
      label: 'designs.roleVariantAxes.appearance',
      defaultOption: 'plain',
      options: [
        {
          id: 'plain',
          label: 'designs.roleVariants.plain',
        },
        {
          id: 'description',
          label: 'designs.roleVariants.description',
          contextStyles: {
            card: { fontSize: 'sm', lineHeight: 'normal' },
            page: { fontSize: 'md', lineHeight: 'relaxed' },
            space: { fontSize: 'md', lineHeight: 'relaxed' },
          },
        },
        {
          id: 'caption',
          label: 'designs.roleVariants.caption',
          style: { fontSize: 'xs', color: 'subtle' },
        },
        {
          id: 'quote',
          label: 'designs.roleVariants.quote',
          style: { fontFamily: 'serif', italic: true },
        },
      ],
    },
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
          id: 'muted',
          label: 'designs.roleVariants.muted',
          style: { color: 'subtle' },
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
    'italic',
    'truncate',
    'marginTop',
    'marginRight',
    'marginBottom',
    'marginLeft',
  ],
  bindsPropertyTypes: ['text', 'select'],
  context: {},
};
