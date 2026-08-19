import { DesignRoleConfig } from '../types';

/**
 * The entry's primary heading. Auto-binds to the title property
 * and adapts its look to the layout it is placed in: prominent on
 * pages, compact and truncated on list rows. Offered in three
 * sizes where sizing makes sense; medium is the default.
 */
export const TitleRole: DesignRoleConfig = {
  id: 'title',
  elementType: 'text',
  label: 'designs.roles.title.label',
  icon: 'type',
  lockedStyle: {
    color: 'regular',
  },
  contextStyles: {
    card: { fontWeight: 'semibold', lineHeight: 'tight' },
    list: {
      fontSize: 'base',
      fontWeight: 'medium',
      lineHeight: 'none',
      truncate: 1,
    },
    page: { fontWeight: 'bold', lineHeight: 'tight' },
    space: { fontWeight: 'bold', lineHeight: 'tight' },
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
            card: { fontSize: 'base' },
            page: { fontSize: '2xl' },
            space: { fontSize: '2xl' },
          },
        },
        {
          id: 'md',
          label: 'designs.roleVariants.md',
          contextStyles: {
            card: { fontSize: 'md' },
            page: { fontSize: '4xl' },
            space: { fontSize: '4xl' },
          },
        },
        {
          id: 'lg',
          label: 'designs.roleVariants.lg',
          contextStyles: {
            card: { fontSize: 'xl' },
            page: { fontSize: '5xl' },
            space: { fontSize: '5xl' },
          },
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
  supportsStaticContent: false,
  bindsPropertyTypes: ['title'],
  context: {},
};
