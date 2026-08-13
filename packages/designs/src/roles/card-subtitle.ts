import { DesignRoleConfig } from '../types';

/**
 * Secondary text under a card title.
 */
export const CardSubtitleRole: DesignRoleConfig = {
  id: 'card-subtitle',
  elementType: 'text',
  label: 'designs.roles.card-subtitle.label',
  icon: 'text',
  lockedStyle: {
    fontSize: 'sm',
    lineHeight: 'snug',
    color: 'muted',
  },
  bindsPropertyTypes: ['text', 'select'],
  context: { designTypes: ['database'], layoutTypes: ['card'] },
};
