import { DesignRoleConfig } from '../types';

/**
 * Reading-length body content on a page.
 */
export const PageBodyRole: DesignRoleConfig = {
  id: 'page-body',
  elementType: 'formatted-text',
  label: 'designs.roles.page-body.label',
  icon: 'file-text',
  lockedStyle: {
    fontSize: 'md',
    lineHeight: 'relaxed',
    color: 'regular',
    maxWidth: 'content',
  },
  bindsPropertyTypes: ['formatted-text'],
  context: { layoutTypes: ['page', 'space'] },
};
