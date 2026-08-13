import { DesignRoleConfig } from '../types';

/**
 * The card's body text.
 */
export const CardBodyRole: DesignRoleConfig = {
  id: 'card-body',
  elementType: 'text',
  label: 'designs.roles.card-body.label',
  icon: 'align-left',
  lockedStyle: {
    fontSize: 'sm',
    lineHeight: 'snug',
    color: 'regular',
  },
  bindsPropertyTypes: ['text'],
  context: { designTypes: ['database'], layoutTypes: ['card'] },
};
