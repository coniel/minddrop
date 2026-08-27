import { DesignType, LayoutType } from './types';

/**
 * The workspace directory designs are stored in.
 */
export const DesignsDirName = 'designs';
export const DesignFileName = 'design.json';
export const MediaDirName = 'media';
export const i18nRoot = 'designs';

/**
 * The layout types each design type may contain. Empty for design
 * types whose layout types are not implemented yet.
 */
export const DesignTypeLayoutTypes: Record<DesignType, LayoutType[]> = {
  database: ['card', 'list', 'page'],
  space: ['space'],
  'component-library': [],
};
