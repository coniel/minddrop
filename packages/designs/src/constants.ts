import type { UiIconName } from '@minddrop/ui-icons';
import { DesignType, LayoutType } from './types';

/**
 * The workspace directory designs are stored in.
 */
export const DesignsDirName = 'designs';
export const DesignFileName = 'design.json';
export const MediaDirName = 'media';
export const i18nRoot = 'designs';

/**
 * The icon used to represent designs in the UI.
 */
export const DesignsIcon: UiIconName = 'pencil-ruler';

/**
 * The default icon assigned to newly created designs.
 */
export const DefaultDesignIcon = 'content-icon:pencil-ruler:default';

/**
 * The layout types each design type may contain. Empty for design
 * types whose layout types are not implemented yet.
 */
export const DesignTypeLayoutTypes: Record<DesignType, LayoutType[]> = {
  database: ['card', 'list', 'page'],
  space: ['space'],
  'component-library': [],
};

/**
 * The CSS variable a list layout root reads its background colour
 * from, letting the rendering context swap the colour for the
 * hover and active states of a list row.
 */
export const ListRootSurfaceVariable = '--design-list-row-surface';
