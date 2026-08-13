import { DesignRoleConfig } from '../types';

/**
 * The primary text of a list row. Auto-binds to the entry title.
 */
export const ListTitleRole: DesignRoleConfig = {
  id: 'list-title',
  elementType: 'text',
  label: 'designs.roles.list-title.label',
  icon: 'heading',
  lockedStyle: {
    fontSize: 'base',
    fontWeight: 'medium',
    lineHeight: 'none',
    color: 'regular',
    truncate: 1,
  },
  bindsPropertyTypes: ['title'],
  context: { designTypes: ['database'], layoutTypes: ['list'] },
};
