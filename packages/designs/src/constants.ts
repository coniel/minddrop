import { DesignType, LayoutType } from './types';

/**
 * The workspace directory designs are stored in. Named `designs-next`
 * while the legacy designs package owns `designs`; flipped back once
 * legacy is deleted.
 */
export const DesignsDirName = 'designs-next';
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
