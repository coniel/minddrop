import { DesignRoleConfig } from '../types';

/**
 * Secondary text under a title, muted in every context and sized
 * to the layout it is placed in.
 */
export const SubtitleRole: DesignRoleConfig = {
  id: 'subtitle',
  elementType: 'text',
  label: 'designs.roles.subtitle.label',
  icon: 'text',
  lockedStyle: {
    color: 'subtle',
    lineHeight: 'snug',
  },
  contextStyles: {
    card: { fontSize: 'sm' },
    list: { fontSize: 'sm', truncate: 1 },
    page: { fontSize: 'md' },
    space: { fontSize: 'md' },
  },
  editableStyles: [
    'textAlign',
    'textTransform',
    'truncate',
    'marginTop',
    'marginRight',
    'marginBottom',
    'marginLeft',
  ],
  bindsPropertyTypes: ['text', 'select'],
  context: {},
};
