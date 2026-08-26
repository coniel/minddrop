import { DesignRoleConfig } from '../types';
import { ContentRole } from './content';
import { ContentDisplayRole } from './content-display';
import { HeadingRole } from './heading';
import { LabelRole } from './label';
import { PageContentRole } from './page-content';

/**
 * The built-in design roles, registered on initialization. The
 * palette lists roles in registration order, so the order mirrors
 * how a typical layout stacks them top to bottom.
 */
export const BuiltInDesignRoles: DesignRoleConfig[] = [
  HeadingRole,
  LabelRole,
  ContentRole,
  ContentDisplayRole,
  PageContentRole,
];
