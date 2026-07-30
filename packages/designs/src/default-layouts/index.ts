import { DefaultCardLayout } from './DefaultCardLayout';
import { DefaultListLayout } from './DefaultListLayout';
import { DefaultPageLayout } from './DefaultPageLayout';

export * from './DefaultCardLayout';
export * from './DefaultListLayout';
export * from './DefaultPageLayout';

export const defaultLayoutIds = [
  DefaultCardLayout.id,
  DefaultListLayout.id,
  DefaultPageLayout.id,
];

export const defaultLayouts = [
  DefaultCardLayout,
  DefaultListLayout,
  DefaultPageLayout,
];
