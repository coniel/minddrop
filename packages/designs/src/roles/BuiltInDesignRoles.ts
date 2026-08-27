import { DesignRoleConfig } from '../types';
import { HeadingRole } from './heading';
import { PageContentRole } from './page-content';

/**
 * The built-in design roles, registered on initialization.
 */
export const BuiltInDesignRoles: DesignRoleConfig[] = [
  HeadingRole,
  PageContentRole,
];
