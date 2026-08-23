import { DesignRoleConfig } from '../types';

/**
 * A section heading within a layout, sized well below the title so
 * the two read as separate levels. Meant for static text, though a
 * property can be bound in its place.
 */
export const HeadingRole: DesignRoleConfig = {
  id: 'heading',
  elementType: 'text',
  label: 'designs.roles.heading.label',
  icon: 'heading',
  lockedStyle: {
    fontWeight: 'semibold',
    lineHeight: 'tight',
    color: 'regular',
  },
  contextStyles: {
    // Single-line list rows keep headings compact
    list: { fontSize: 'sm', truncate: 1 },
  },
  variants: [
    {
      id: 'size',
      label: 'designs.roleVariantAxes.size',
      // Single-line list rows offer no size choice
      layoutTypes: ['card', 'page', 'space'],
      defaultOption: 'md',
      options: [
        {
          id: 'sm',
          label: 'designs.roleVariants.sm',
          contextStyles: {
            card: { fontSize: 'sm' },
            page: { fontSize: 'lg' },
            space: { fontSize: 'lg' },
          },
        },
        {
          id: 'md',
          label: 'designs.roleVariants.md',
          contextStyles: {
            card: { fontSize: 'base' },
            page: { fontSize: 'xl' },
            space: { fontSize: 'xl' },
          },
        },
        {
          id: 'lg',
          label: 'designs.roleVariants.lg',
          contextStyles: {
            card: { fontSize: 'md' },
            page: { fontSize: '2xl' },
            space: { fontSize: '2xl' },
          },
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
    'truncate',
    'marginTop',
    'marginRight',
    'marginBottom',
    'marginLeft',
  ],
  context: {},
};
