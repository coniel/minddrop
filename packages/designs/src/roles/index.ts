import { DesignRoleConfig } from '../types';
import { CardBodyRole } from './card-body';
import { CardCoverRole } from './card-cover';
import { CardSubtitleRole } from './card-subtitle';
import { CardTitleRole } from './card-title';
import { ListTitleRole } from './list-title';
import { PageBodyRole } from './page-body';
import { PageContentRole } from './page-content';
import { PageTitleRole } from './page-title';

export * from './card-title';
export * from './card-subtitle';
export * from './card-body';
export * from './card-cover';
export * from './list-title';
export * from './page-title';
export * from './page-body';
export * from './page-content';

/**
 * The built-in design roles, registered on initialization.
 */
export const BuiltInDesignRoles: DesignRoleConfig[] = [
  CardTitleRole,
  CardSubtitleRole,
  CardBodyRole,
  CardCoverRole,
  ListTitleRole,
  PageTitleRole,
  PageBodyRole,
  PageContentRole,
];
