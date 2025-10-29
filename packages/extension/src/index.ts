/**
 * This package re-exports types from other packages to make them
 * available to extenion developers.
 */
export type * from '@minddrop/ast';
// TODO: fix type conflicts with Ast
// export type * from '@minddrop/editor';
export type * from '@minddrop/events';
export type * from '@minddrop/file-system';
export type * from '@minddrop/markdown';
export type * from '@minddrop/selection';
export type * from '@minddrop/theme';
export type * from '@minddrop/ui-primitives';

export * from '@minddrop/icons';

export * as Utils from '@minddrop/utils';

export type { MindDropExtension, MindDropApi } from '@minddrop/extensions';

export { useApi, MindDropApiProvider } from '@minddrop/extensions';
