import { DesignRoleConfig } from '../types';

/**
 * Structural role marking the content region of a panelled page
 * root. The content region fills the space left by the page panels
 * and cannot be moved or deleted.
 */
export const PageContentRole: DesignRoleConfig = {
  id: 'page-content',
  elementType: 'container',
  label: 'designs.roles.page-content.label',
  icon: 'box',
  lockedStyle: {},
  context: { layoutTypes: ['page', 'space'] },
};
